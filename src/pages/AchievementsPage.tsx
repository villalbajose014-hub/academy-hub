import { useRef } from "react";
import { mockAchievements } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import html2canvas from "html2canvas";
import logoFull from "@/assets/logo-full.png";

export default function AchievementsPage() {
  const exportRef = useRef<HTMLDivElement>(null);
  const unlockedCount = mockAchievements.filter((a) => a.unlocked).length;

  const handleExport = async (achievement: typeof mockAchievements[0]) => {
    const el = document.getElementById(`achievement-export-${achievement.id}`);
    if (!el) return;
    el.style.display = "flex";
    try {
      const canvas = await html2canvas(el, { backgroundColor: "#000000", scale: 2 });
      const link = document.createElement("a");
      link.download = `logro-${achievement.title.replace(/\s/g, "-")}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      toast({ title: "¡Imagen exportada!", description: "Lista para compartir en Instagram Stories" });
    } finally {
      el.style.display = "none";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Logros</h1>
        <p className="text-muted-foreground text-sm">{unlockedCount}/{mockAchievements.length} desbloqueados</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockAchievements.map((a) => (
          <div key={a.id} className={`glass-card p-5 transition-all ${a.unlocked ? "glow-primary" : "opacity-40"}`}>
            <div className="text-4xl mb-3">{a.icon}</div>
            <h3 className="font-bold text-foreground">{a.title}</h3>
            <p className="text-sm text-muted-foreground mb-3">{a.description}</p>
            {a.unlocked && (
              <>
                <p className="text-xs text-primary mb-3">Desbloqueado: {a.unlockedAt}</p>
                <Button size="sm" variant="outline" onClick={() => handleExport(a)}>
                  <Share2 className="h-3 w-3 mr-1" /> Compartir
                </Button>
              </>
            )}
            {!a.unlocked && <p className="text-xs text-muted-foreground">Meta: ${a.threshold.toLocaleString()}</p>}
          </div>
        ))}
      </div>

      {/* Hidden export templates */}
      {mockAchievements.filter((a) => a.unlocked).map((a) => (
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
            background: "linear-gradient(180deg, #000 0%, #111 100%)",
            padding: 80,
            position: "fixed",
            left: -9999,
            top: 0,
          }}
        >
          <img src={logoFull} alt="VMT" style={{ width: 400, marginBottom: 80 }} />
          <div style={{ fontSize: 120, marginBottom: 40 }}>{a.icon}</div>
          <h2 style={{ fontSize: 64, color: "#FFFF00", fontWeight: 700, textAlign: "center", marginBottom: 20, fontFamily: "Space Grotesk, sans-serif" }}>
            {a.title}
          </h2>
          <p style={{ fontSize: 36, color: "#999", textAlign: "center", fontFamily: "Space Grotesk, sans-serif" }}>
            {a.description}
          </p>
          <div style={{ marginTop: 80, padding: "16px 48px", border: "2px solid #FFFF00", borderRadius: 12 }}>
            <p style={{ fontSize: 28, color: "#FFFF00", fontFamily: "Space Grotesk, sans-serif" }}>
              VENDE MAS TATTOO ACADEMY
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
