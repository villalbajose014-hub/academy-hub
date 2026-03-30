import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { UserRole } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import logoFull from "@/assets/logo-full.png";
import { motion } from "framer-motion";

export default function LoginPage() {
  const { login } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole>("student");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) login(selectedRole, name.trim());
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="flex justify-center mb-10">
          <img src={logoFull} alt="Vende Mas Tattoo" className="h-16 object-contain" />
        </div>

        <div className="glass-card p-8 glow-primary">
          <h1 className="text-2xl font-bold text-foreground mb-1 text-center">
            Bienvenido
          </h1>
          <p className="text-muted-foreground text-center mb-8 text-sm">
            Ingresa a tu academia
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label>Nombre</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tu nombre completo"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Rol</Label>
              <div className="grid grid-cols-2 gap-3">
                {(["mentor", "student"] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setSelectedRole(r)}
                    className={`py-3 px-4 rounded-lg text-sm font-medium transition-all border ${
                      selectedRole === r
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-secondary text-secondary-foreground border-border hover:border-primary/50"
                    }`}
                  >
                    {r === "mentor" ? "🎓 Mentor" : "🎨 Alumno"}
                  </button>
                ))}
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg">
              Ingresar
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
