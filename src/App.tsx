import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import LoginPage from "./pages/LoginPage";
import DashboardLayout from "./components/DashboardLayout";
import MentorDashboard from "./pages/MentorDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import StudentsPage from "./pages/StudentsPage";
import ChallengesPage from "./pages/ChallengesPage";
import ResourcesPage from "./pages/ResourcesPage";
import IncomePage from "./pages/IncomePage";
import AchievementsPage from "./pages/AchievementsPage";
import ConverterPage from "./pages/ConverterPage";
import NotFound from "./pages/NotFound";
import { Loader2 } from "lucide-react";

const queryClient = new QueryClient();

function AppRoutes() {
  const { isAuthenticated, isLoading, role } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) return <LoginPage />;

  return (
    <DashboardLayout>
      <Routes>
        {role === "mentor" ? (
          <>
            <Route path="/" element={<MentorDashboard />} />
            <Route path="/students" element={<StudentsPage />} />
            <Route path="/challenges" element={<ChallengesPage />} />
            <Route path="/resources" element={<ResourcesPage />} />
          </>
        ) : (
          <>
            <Route path="/" element={<StudentDashboard />} />
            <Route path="/income" element={<IncomePage />} />
            <Route path="/achievements" element={<AchievementsPage />} />
            <Route path="/converter" element={<ConverterPage />} />
          </>
        )}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </DashboardLayout>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
