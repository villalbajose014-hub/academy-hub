import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Plus, Target, Calendar, Loader2, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { format, isWithinInterval, parseISO } from "date-fns";
import { es } from "date-fns/locale";

interface Challenge {
  id: string;
  title: string;
  goal: number;
  current: number;
  deadline: string;
  active: boolean;
  created_at: string;
}

export default function ChallengesPage() {
  const { user, role } = useAuth();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [title, setTitle] = useState("");
  const [goal, setGoal] = useState("");
  const [deadline, setDeadline] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
      const { data: challengesData, error } = await supabase
        .from("challenges")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Calculate real progress for each challenge
      const { data: transData } = await supabase
        .from("transactions")
        .select("amount, date, type");
      
      const incomes = transData?.filter(t => t.type === 'income') || [];

      const syncedChallenges = (challengesData || []).map(c => {
        const start = parseISO(c.created_at);
        const end = parseISO(c.deadline);
        
        const current = incomes
          .filter(t => {
            const tDate = parseISO(t.date);
            return isWithinInterval(tDate, { start, end });
          })
          .reduce((sum, t) => sum + t.amount, 0);

        return { ...c, current };
      });

      setChallenges(syncedChallenges as Challenge[]);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setFetching(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !title || !goal || !deadline) return;
    setLoading(true);

    try {
      const { error } = await supabase
        .from("challenges")
        .insert({
          mentor_id: user.id,
          title,
          goal: Number(goal),
          deadline,
          active: true,
        });

      if (error) throw error;

      setTitle("");
      setGoal("");
      setDeadline("");
      fetchChallenges();
      toast({ title: "Desafío creado", description: "Tus alumnos ya pueden ver la nueva meta." });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error";
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("challenges").delete().eq("id", id);
      if (error) throw error;
      setChallenges(challenges.filter(c => c.id !== id));
      toast({ title: "Desafío eliminado" });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error";
      toast({ title: "Error", description: msg, variant: "destructive" });
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary/40" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <div className="page-header">
        <h1>Desafíos de la Academia</h1>
        <p>Motiva a tu equipo con metas reales de facturación</p>
      </div>

      {role === "mentor" && (
        <motion.form initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleCreate} className="glass-card p-6 space-y-5">
          <h2 className="font-semibold flex items-center gap-2 text-foreground">
            <div className="p-2 rounded-lg bg-primary/10"><Target className="h-4 w-4 text-primary" /></div>
            Nueva Meta Global
          </h2>
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Título del Desafío</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ej: Facturación Abril $10,000" required className="h-11 bg-secondary/30 border-border/50 focus:border-primary" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Meta de Ingresos ($)</Label>
              <Input type="number" value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="0" required className="h-11 bg-secondary/30 border-border/50 font-mono" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Fecha Límite</Label>
              <Input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} required className="h-11 bg-secondary/30 border-border/50" />
            </div>
          </div>
          <Button type="submit" className="w-full h-11 font-bold" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Plus className="h-4 w-4 mr-2" /> Lanzar Desafío</>}
          </Button>
        </motion.form>
      )}

      <div className="space-y-4">
        {challenges.length === 0 ? (
          <div className="glass-card p-12 text-center text-muted-foreground/40">
            <Target className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p>No hay desafíos activos en este momento.</p>
          </div>
        ) : (
          challenges.map((c, i) => {
            const pct = Math.min(100, Math.round((c.current / c.goal) * 100));
            return (
              <motion.div key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="glass-card p-6 relative group overflow-hidden">
                {role === "mentor" && (
                  <button onClick={() => handleDelete(c.id)} className="absolute top-4 right-4 p-2 text-muted-foreground/30 hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
                <div className="flex items-center justify-between mb-3 pr-8">
                  <h3 className="font-semibold text-foreground">{c.title}</h3>
                  <span className={`text-sm font-mono font-bold ${pct >= 100 ? "text-primary" : "text-primary/60"}`}>
                    {pct}%
                  </span>
                </div>
                <Progress value={pct} className={`h-2 mb-3 bg-secondary/50 ${pct >= 100 ? "shimmer glow-primary" : ""}`} />
                <div className="flex justify-between text-[11px] font-medium text-muted-foreground">
                  <span className="font-mono text-foreground font-bold">${c.current.toLocaleString()} <span className="text-muted-foreground/50 font-normal">/ ${c.goal.toLocaleString()}</span></span>
                  <span className="flex items-center gap-1 uppercase tracking-tighter">
                    <Calendar className="h-3 w-3" /> Límite: {format(parseISO(c.deadline), "dd MMM yyyy", { locale: es })}
                  </span>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
