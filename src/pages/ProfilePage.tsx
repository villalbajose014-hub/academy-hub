import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { User, Mail, Shield, Save, Loader2, LogOut } from "lucide-react";

export default function ProfilePage() {
  const { user, role, userName: initialName, logout } = useAuth();
  const [name, setName] = useState(initialName || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialName) setName(initialName);
  }, [initialName]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({ full_name: name, updated_at: new Date().toISOString() })
        .eq("user_id", user.id);

      if (error) throw error;
      toast({ title: "Perfil actualizado", description: "Tus cambios se han guardado correctamente" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="page-header">
        <h1>Mi Perfil</h1>
        <p>Gestiona tu información personal y cuenta</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8 glow-primary relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <User className="h-32 w-32" />
        </div>

        <form onSubmit={handleUpdate} className="space-y-6 relative z-10">
          <div className="flex items-center gap-6 mb-8">
            <div className="h-20 w-20 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-2xl font-bold border border-primary/20">
              {name.slice(0, 2).toUpperCase() || "U"}
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">{name || "Usuario"}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="tag-active capitalize">{role}</span>
                <span className="text-xs text-muted-foreground font-mono">ID: {user?.id.slice(0, 8)}...</span>
              </div>
            </div>
          </div>

          <div className="grid gap-6">
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <User className="h-3.5 w-3.5" /> Nombre Completo
              </Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tu nombre"
                className="h-12 bg-secondary/30 border-border/50 focus:border-primary"
              />
            </div>

            <div className="space-y-2 opacity-60">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Mail className="h-3.5 w-3.5" /> Correo Electrónico
              </Label>
              <Input
                value={user?.email || ""}
                disabled
                className="h-12 bg-secondary/10 border-border/20 cursor-not-allowed"
              />
              <p className="text-[10px] text-muted-foreground italic">El correo no se puede cambiar por ahora</p>
            </div>

            <div className="space-y-2 opacity-60">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Shield className="h-3.5 w-3.5" /> Rol de Acceso
              </Label>
              <Input
                value={role === "mentor" ? "Mentor / Administrador" : "Alumno / Estudiante"}
                disabled
                className="h-12 bg-secondary/10 border-border/20 cursor-not-allowed capitalize"
              />
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-3">
            <Button type="submit" className="flex-1 h-12 font-semibold" disabled={loading}>
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Cambios
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={logout}
              className="h-12 border-destructive/20 text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </form>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="glass-card p-6 border-l-4 border-l-primary/40">
          <h3 className="font-semibold text-sm mb-1 text-foreground">Soporte Técnico</h3>
          <p className="text-xs text-muted-foreground">Si tienes problemas con tu cuenta, contacta a soporte.</p>
        </div>
        <div className="glass-card p-6 border-l-4 border-l-yellow-500/40">
          <h3 className="font-semibold text-sm mb-1 text-foreground">Seguridad</h3>
          <p className="text-xs text-muted-foreground">Te recomendamos cambiar tu contraseña periódicamente.</p>
        </div>
      </div>
    </div>
  );
}
