-- ============================================================
-- ACADEMY HUB — FULL DATABASE INITIALIZATION SCRIPT
-- ============================================================
-- Execute this entire script in your new Supabase SQL Editor.

-- ============================================================
-- 1. ENUMS AND PROFILES
-- ============================================================

-- Create role enum
CREATE TYPE public.app_role AS ENUM ('mentor', 'student');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT '',
  role app_role NOT NULL DEFAULT 'student',
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    COALESCE((NEW.raw_user_meta_data ->> 'role')::app_role, 'student')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


-- ============================================================
-- 2. TRANSACTIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.transactions (
  id          UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount      NUMERIC(12, 2) NOT NULL,
  description TEXT NOT NULL,
  type        TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  date        TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own transactions"
  ON public.transactions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Mentors can view all transactions"
  ON public.transactions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.user_id = auth.uid()
        AND profiles.role = 'mentor'
    )
  );

CREATE POLICY "Users can insert own transactions"
  ON public.transactions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own transactions"
  ON public.transactions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);


-- ============================================================
-- 3. USER ACHIEVEMENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.user_achievements (
  id             UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id        UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id TEXT NOT NULL,
  unlocked_at    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, achievement_id)
);

ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own achievements"
  ON public.user_achievements FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own achievements"
  ON public.user_achievements FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);


-- ============================================================
-- 4. CHALLENGES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.challenges (
  id         UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  mentor_id  UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title      TEXT NOT NULL,
  goal       NUMERIC(12, 2) NOT NULL,
  current    NUMERIC(12, 2) NOT NULL DEFAULT 0,
  deadline   DATE NOT NULL,
  active     BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "All authenticated users can view challenges"
  ON public.challenges FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Mentors can insert challenges"
  ON public.challenges FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = mentor_id AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.user_id = auth.uid()
        AND profiles.role = 'mentor'
    )
  );

CREATE POLICY "Mentors can delete own challenges"
  ON public.challenges FOR DELETE
  TO authenticated
  USING (auth.uid() = mentor_id);


-- ============================================================
-- 5. RESOURCES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.resources (
  id         UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  mentor_id  UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title      TEXT NOT NULL,
  content    TEXT,
  url        TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "All authenticated users can view resources"
  ON public.resources FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Mentors can insert resources"
  ON public.resources FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = mentor_id AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.user_id = auth.uid()
        AND profiles.role = 'mentor'
    )
  );

CREATE POLICY "Mentors can delete own resources"
  ON public.resources FOR DELETE
  TO authenticated
  USING (auth.uid() = mentor_id);


-- ============================================================
-- 6. STUDENT LINKS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.student_links (
  id         UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title      TEXT NOT NULL,
  url        TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.student_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own links"
  ON public.student_links FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Mentors can view all student links"
  ON public.student_links FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.user_id = auth.uid()
        AND profiles.role = 'mentor'
    )
  );

CREATE POLICY "Authenticated users can insert student links"
  ON public.student_links FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can delete own links"
  ON public.student_links FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Mentors can delete any student link"
  ON public.student_links FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.user_id = auth.uid()
        AND profiles.role = 'mentor'
    )
  );
