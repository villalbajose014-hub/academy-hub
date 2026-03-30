import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import logoFull from "@/assets/logo-full.png";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, ArrowRight, UserPlus, LogIn } from "lucide-react";

type Mode = "login" | "register";
type RoleOption = "mentor" | "student";

export default function LoginPage() {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [selectedRole, setSelectedRole] = useState<RoleOption>("student");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "register") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name, role: selectedRole },
          },
        });
        if (error) throw error;
        toast({ title: "¡Cuenta creada! 🎉", description: "Ya puedes iniciar sesión" });
        setMode("login");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full opacity-[0.03]" style={{ background: "radial-gradient(circle, hsl(54, 100%, 50%) 0%, transparent 70%)" }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-lg relative z-10"
      >
        {/* Logo */}
        <div className="flex justify-center mb-12">
          <motion.img
            src={logoFull}
            alt="Vende Mas Tattoo"
            className="h-24 md:h-28 object-contain"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          />
        </div>

        <div className="glass-card p-8 md:p-10 glow-primary">
          {/* Toggle tabs */}
          <div className="flex mb-8 bg-secondary rounded-xl p-1">
            {(["login", "register"] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                  mode === m
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {m === "login" ? <LogIn className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
                {m === "login" ? "Iniciar Sesión" : "Registrarse"}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.form
              key={mode}
              initial={{ opacity: 0, x: mode === "login" ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: mode === "login" ? 20 : -20 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {mode === "register" && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Nombre completo</Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Tu nombre"
                    required
                    className="h-12 bg-secondary/50 border-border/50 focus:border-primary"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label className="text-sm font-medium">Email</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                  className="h-12 bg-secondary/50 border-border/50 focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Contraseña</Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="h-12 bg-secondary/50 border-border/50 focus:border-primary"
                />
              </div>

              {mode === "register" && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">¿Cuál es tu rol?</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {([
                      { value: "student" as RoleOption, label: "🎨 Alumno", desc: "Registra y crece" },
                      { value: "mentor" as RoleOption, label: "🎓 Mentor", desc: "Guía y analiza" },
                    ]).map((r) => (
                      <button
                        key={r.value}
                        type="button"
                        onClick={() => setSelectedRole(r.value)}
                        className={`py-4 px-4 rounded-xl text-left transition-all border-2 ${
                          selectedRole === r.value
                            ? "bg-primary/10 border-primary"
                            : "bg-secondary/30 border-border/30 hover:border-primary/30"
                        }`}
                      >
                        <span className="text-lg">{r.label}</span>
                        <p className="text-xs text-muted-foreground mt-0.5">{r.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <Button type="submit" className="w-full h-12 text-base font-semibold" size="lg" disabled={loading}>
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    {mode === "login" ? "Ingresar" : "Crear Cuenta"}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </motion.form>
          </AnimatePresence>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Vende Mas Tattoo © {new Date().getFullYear()} — Academia para Tatuadores
        </p>
      </motion.div>
    </div>
  );
}
