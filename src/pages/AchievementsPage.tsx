import { useState, useEffect, useCallback } from "react";
import { mockAchievements as staticAchievements, Achievement } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Download, Lock, Crosshair, Banknote, Flame, Zap, Crown, Gem, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import html2canvas from "html2canvas";
import logoFull from "@/assets/logo-full.png";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";

const iconMap: Record<string, React.ReactNode> = {
  crosshair: <Crosshair className="h-8 w-8" />,
  banknote: <Banknote className="h-8 w-8" />,
  flame: <Flame className="h-8 w-8" />,
  zap: <Zap className="h-8 w-8" />,
  crown: <Crown className="h-8 w-8" />,
  gem: <Gem className="h-8 w-8" />,
};

const iconMapLarge: Record<string, React.ReactNode> = {
  crosshair: <Crosshair style={{ width: 80, height: 80, color: "#FFFF00" }} />,
  banknote: <Banknote style={{ width: 80, height: 80, color: "#FFFF00" }} />,
  flame: <Flame style={{ width: 80, height: 80, color: "#FFFF00" }} />,
  zap: <Zap style={{ width: 80, height: 80, color: "#FFFF00" }} />,
  crown: <Crown style={{ width: 80, height: 80, color: "#FFFF00" }} />,
  gem: <Gem style={{ width: 80, height: 80, color: "#FFFF00" }} />,
};

export default function AchievementsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);

  const fetchAndSyncAchievements = useCallback(async () => {
    if (!user) return;
    try {
      // 1. Get total revenue
      const { data: transData, error: tError } = await supabase
        .from("transactions")
        .select("amount")
        .eq("user_id", user.id)
        .eq("type", "income");
      
      if (tError) throw tError;
      
      const total = transData?.reduce((s, t) => s + t.amount, 0) || 0;
      setTotalRevenue(total);

      // 2. Get already unlocked from DB
      const { data: unlockedData, error: uError } = await supabase
        .from("user_achievements")
        .select("*")
        .eq("user_id", user.id);
      
      if (uError) throw uError;
      
      const unlockedIds = new Set(unlockedData?.map(u => u.achievement_id) || []);

      // 3. Prepare list and auto-unlock logic
      const syncList = await Promise.all(staticAchievements.map(async (a) => {
        const isActuallyUnlocked = unlockedIds.has(a.id);
        const shouldUnlockNow = !isActuallyUnlocked && total >= a.threshold;

        if (shouldUnlockNow) {
          // Persist the new unlock
          const unlockedAt = new Date().toISOString();
          const { error: iError } = await supabase.from("user_achievements").insert({
            user_id: user.id,
            achievement_id: a.id,
            unlocked_at: unlockedAt
          });
          
          if (iError) throw iError;
          
          toast({ 
            title: "🏆 ¡Nuevo Logro!", 
            description: `Has desbloqueado: ${a.title}`,
            className: "bg-primary text-primary-foreground border-none"
          });

          return { ...a, unlocked: true, unlockedAt: unlockedAt.split('T')[0] };
        }

        const dbEntry = unlockedData?.find(u => u.achievement_id === a.id);
        return { 
          ...a, 
          unlocked: isActuallyUnlocked, 
          unlockedAt: dbEntry ? new Date(dbEntry.unlocked_at).toISOString().split('T')[0] : a.unlockedAt 
        };
      }));

      setAchievements(syncList);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error al sincronizar logros";
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) fetchAndSyncAchievements();
  }, [user, fetchAndSyncAchievements]);

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  const handleExport = async (achievement: Achievement) => {
    const el = document.getElementById(`achievement-export-${achievement.id}`);
    if (!el) return;
    el.style.display = "flex";
    try {
      const canvas = await html2canvas(el, { backgroundColor: "#000000", scale: 2, useCORS: true });
      const link = document.createElement("a");
      link.download = `logro-${achievement.title.replace(/\s/g, "-")}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      toast({ title: "Imagen exportada", description: "Lista para compartir en Instagram Stories" });
    } finally {
      el.style.display = "none";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary/40" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="page-header">
        <h1>MIS LOGROS</h1>
        <p>{unlockedCount} de {achievements.length} desbloqueados — Total: ${totalRevenue.toLocaleString()}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {achievements.map((a, i) => (
          <motion.div
            key={a.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
            className={`glass-card p-6 ${a.unlocked ? "glow-primary shimmer" : "opacity-40 grayscale"}`}
          >
            <div className={`mb-4 p-3 rounded-xl w-fit ${a.unlocked ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
              {iconMap[a.icon] || <Crosshair className="h-8 w-8" />}
            </div>
            <h3 className="font-bold text-foreground text-lg">{a.title}</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-4">{a.description}</p>
            {a.unlocked ? (
              <div className="space-y-3">
                <p className="text-xs text-primary font-medium">Desbloqueado: {a.unlockedAt}</p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleExport(a)}
                  className="border-primary/30 text-primary hover:bg-primary/10 hover:text-primary"
                >
                  <Download className="h-3.5 w-3.5 mr-1.5" /> Exportar para Stories
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Lock className="h-3.5 w-3.5" />
                  <span>Meta: ${a.threshold.toLocaleString()}</span>
                </div>
                <div className="w-full bg-secondary/50 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-primary h-full transition-all duration-1000" 
                    style={{ width: `${Math.min((totalRevenue / a.threshold) * 100, 100)}%` }}
                  />
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Hidden export templates — 1080×1920 Instagram Story format */}
      {achievements.filter((a) => a.unlocked).map((a) => (
        <div
          key={a.id}
          id={`achievement-export-${a.id}`}
          style={{
            display: "none",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: 1080,
            height: 1920,
            background: "linear-gradient(180deg, #000 0%, #0a0a0a 40%, #111 100%)",
            padding: 80,
            position: "fixed",
            left: -9999,
            top: 0,
          }}
        >
          {/* Top decorative line */}
          <div style={{
            width: 120,
            height: 2,
            background: "linear-gradient(90deg, transparent, #FFFF00, transparent)",
            marginBottom: 60,
          }} />

          <img src={logoFull} alt="VMT" style={{ width: 360, marginBottom: 80 }} crossOrigin="anonymous" />

          {/* Icon container */}
          <div style={{
            width: 160,
            height: 160,
            borderRadius: 32,
            background: "linear-gradient(135deg, rgba(255,255,0,0.15), rgba(255,255,0,0.05))",
            border: "1px solid rgba(255,255,0,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 48,
          }}>
            {iconMapLarge[a.icon]}
          </div>

          <h2 style={{
            fontSize: 56,
            color: "#FFFF00",
            fontWeight: 700,
            textAlign: "center",
            marginBottom: 16,
            fontFamily: "Space Grotesk, sans-serif",
            letterSpacing: "-1px",
          }}>
            {a.title}
          </h2>

          <p style={{
            fontSize: 32,
            color: "#666",
            textAlign: "center",
            fontFamily: "Space Grotesk, sans-serif",
            maxWidth: 700,
            lineHeight: 1.4,
          }}>
            {a.description}
          </p>

          {/* Separator */}
          <div style={{
            width: 60,
            height: 2,
            background: "#333",
            margin: "60px 0",
          }} />

          {/* Date */}
          <p style={{
            fontSize: 24,
            color: "#444",
            fontFamily: "JetBrains Mono, monospace",
            letterSpacing: "2px",
            textTransform: "uppercase",
          }}>
            Logro desbloqueado
          </p>

          {/* Bottom brand bar */}
          <div style={{
            position: "absolute",
            bottom: 80,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
          }}>
            <div style={{
              padding: "14px 48px",
              border: "1px solid rgba(255,255,0,0.25)",
              borderRadius: 12,
            }}>
              <p style={{
                fontSize: 22,
                color: "#FFFF00",
                fontFamily: "Space Grotesk, sans-serif",
                fontWeight: 600,
                letterSpacing: "3px",
                textTransform: "uppercase",
              }}>
                Vende Mas Tattoo Academy
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
