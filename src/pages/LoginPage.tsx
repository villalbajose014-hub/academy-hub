import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import logoFull from "@/assets/logo-full.png";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, ArrowRight, UserPlus, LogIn, GraduationCap, Palette, KeyRound } from "lucide-react";

type Mode = "login" | "register" | "reset" | "update_password";
type RoleOption = "mentor" | "student";

const floatingOrbs = [
  { size: 700, top: "-10%", left: "50%", translateX: "-50%", delay: 0, duration: 8 },
  { size: 400, top: "60%", left: "80%", translateX: "0", delay: 2, duration: 10 },
  { size: 300, top: "20%", left: "-5%", translateX: "0", delay: 4, duration: 7 },
];

export default function LoginPage() {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [selectedRole, setSelectedRole] = useState<RoleOption>("student");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Listen for password recovery event
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setMode("update_password");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

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
        toast({ title: "Cuenta creada", description: "Ya puedes iniciar sesión" });
        setMode("login");
      } else if (mode === "reset") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin,
        });
        if (error) throw error;
        toast({ title: "Enlace enviado", description: "Revisa tu correo para restablecer tu contraseña" });
        setMode("login");
      } else if (mode === "update_password") {
        const { error } = await supabase.auth.updateUser({
          password: password,
        });
        if (error) throw error;
        toast({ title: "Contraseña actualizada", description: "Ya puedes ingresar con tu nueva clave" });
        setMode("login");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error";
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const fieldVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.08, duration: 0.35, ease: "easeOut" },
    }),
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Animated floating orbs */}
      {floatingOrbs.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: orb.size,
            height: orb.size,
            top: orb.top,
            left: orb.left,
            translateX: orb.translateX,
            background: "radial-gradient(circle, hsl(54, 100%, 50%) 0%, transparent 70%)",
            opacity: 0.04,
          }}
          animate={{
            y: [0, -24, 0],
            scale: [1, 1.04, 1],
          }}
          transition={{
            duration: orb.duration,
            delay: orb.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Subtle grid texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(54,100%,50%) 1px, transparent 1px), linear-gradient(90deg, hsl(54,100%,50%) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="w-full max-w-lg relative z-10"
      >
        {/* Logo — significantly bigger */}
        <div className="flex justify-center mb-12">
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.34, 1.56, 0.64, 1] }}
            className="relative"
          >
            {/* Glow halo behind logo */}
            <motion.div
              className="absolute inset-0 rounded-full blur-3xl"
              style={{ background: "radial-gradient(circle, hsl(54,100%,50%) 0%, transparent 70%)", opacity: 0.15 }}
              animate={{ scale: [1, 1.15, 1], opacity: [0.12, 0.22, 0.12] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.img
              src={logoFull}
              alt="Academy Hub"
              className="h-44 md:h-56 object-contain relative z-10 drop-shadow-2xl"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </div>

        <div className="glass-card p-8 md:p-10 glow-primary">
          {/* Title for Reset/Update mode */}
          {(mode === "reset" || mode === "update_password") && (
            <div className="mb-8 text-center">
              <h2 className="text-xl font-bold text-foreground">
                {mode === "reset" ? "Recuperar Acceso" : "Nueva Contraseña"}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {mode === "reset" 
                  ? "Te enviaremos un enlace de recuperación" 
                  : "Ingresa tu nueva clave para el sistema"}
              </p>
            </div>
          )}

          {/* Toggle tabs (hidden in special modes) */}
          {mode !== "reset" && mode !== "update_password" && (
            <div className="flex mb-8 bg-secondary/50 rounded-xl p-1">
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
          )}

          <AnimatePresence mode="wait">
            <motion.form
              key={mode}
              initial={{ opacity: 0, x: mode === "login" ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: mode === "login" ? 20 : -20 }}
              transition={{ duration: 0.22 }}
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {mode === "register" && (
                <motion.div className="space-y-2" custom={0} variants={fieldVariants} initial="hidden" animate="visible">
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">Nombre completo</Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Tu nombre"
                    required
                    className="h-12 bg-secondary/30 border-border/50 focus:border-primary px-4"
                  />
                </motion.div>
              )}

              {mode !== "update_password" && (
                <motion.div className="space-y-2" custom={mode === "register" ? 1 : 0} variants={fieldVariants} initial="hidden" animate="visible">
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">Email</Label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    required
                    className="h-12 bg-secondary/30 border-border/50 focus:border-primary px-4"
                  />
                </motion.div>
              )}

              {(mode === "login" || mode === "register" || mode === "update_password") && (
                <motion.div className="space-y-2" custom={mode === "register" ? 2 : 1} variants={fieldVariants} initial="hidden" animate="visible">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                      {mode === "update_password" ? "Nueva Contraseña" : "Contraseña"}
                    </Label>
                    {mode === "login" && (
                      <button
                        type="button"
                        onClick={() => setMode("reset")}
                        className="text-xs text-primary hover:underline font-medium"
                      >
                        ¿Olvidaste tu contraseña?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      minLength={6}
                      className="h-12 bg-secondary/30 border-border/50 focus:border-primary px-4"
                    />
                    {mode === "update_password" && (
                      <KeyRound className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/30" />
                    )}
                  </div>
                </motion.div>
              )}

              {mode === "register" && (
                <motion.div className="space-y-3" custom={3} variants={fieldVariants} initial="hidden" animate="visible">
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">Tu rol</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {([
                      { value: "student" as RoleOption, label: "Alumno", desc: "Registra y crece", icon: Palette },
                      { value: "mentor" as RoleOption, label: "Mentor", desc: "Guía y analiza", icon: GraduationCap },
                    ]).map((r) => (
                      <button
                        key={r.value}
                        type="button"
                        onClick={() => setSelectedRole(r.value)}
                        className={`py-4 px-4 rounded-xl text-left transition-all border ${
                          selectedRole === r.value
                            ? "bg-primary/10 border-primary/30"
                            : "bg-secondary/20 border-border/30 hover:border-border/60"
                        }`}
                      >
                        <r.icon className={`h-5 w-5 mb-2 ${selectedRole === r.value ? "text-primary" : "text-muted-foreground"}`} />
                        <span className="text-sm font-semibold block">{r.label}</span>
                        <p className="text-xs text-muted-foreground mt-0.5">{r.desc}</p>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              <motion.div custom={mode === "register" ? 4 : 2} variants={fieldVariants} initial="hidden" animate="visible">
                <Button type="submit" className="w-full h-12 text-base font-semibold" size="lg" disabled={loading}>
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      {mode === "login" ? "Ingresar" : mode === "register" ? "Crear Cuenta" : mode === "update_password" ? "Guardar Nueva Clave" : "Enviar Enlace"}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
                {(mode === "reset" || mode === "update_password") && (
                  <button
                    type="button"
                    onClick={() => setMode("login")}
                    className="w-full mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Volver al inicio de sesión
                  </button>
                )}
              </motion.div>
            </motion.form>
          </AnimatePresence>
        </div>

        <p className="text-center text-xs text-muted-foreground/60 mt-8">
          Academy Hub &copy; {new Date().getFullYear()}
        </p>
      </motion.div>
    </div>
  );
}

