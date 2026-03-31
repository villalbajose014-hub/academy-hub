import { useState } from "react";
import { mockChallenges } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Plus, Target, Calendar } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState(mockChallenges);
  const [title, setTitle] = useState("");
  const [goal, setGoal] = useState("");
  const [deadline, setDeadline] = useState("");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !goal) return;
    setChallenges([
      ...challenges,
      { id: String(Date.now()), title, goal: Number(goal), current: 0, deadline, active: true },
    ]);
    setTitle("");
    setGoal("");
    setDeadline("");
    toast({ title: "Desafío creado" });
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <div className="page-header">
        <h1>Desafíos</h1>
        <p>Motiva a tus alumnos con metas mensuales</p>
      </div>

      <motion.form initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleCreate} className="glass-card p-6 space-y-5">
        <h2 className="font-semibold flex items-center gap-2 text-foreground">
          <div className="p-2 rounded-lg bg-primary/10"><Target className="h-4 w-4 text-primary" /></div>
          Nuevo Desafío
        </h2>
        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Título</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ej: Meta Abril $3,000" required className="h-11 bg-secondary/30 border-border/50" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Meta ($)</Label>
            <Input type="number" value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="5000" required className="h-11 bg-secondary/30 border-border/50 font-mono" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Fecha límite</Label>
            <Input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} className="h-11 bg-secondary/30 border-border/50" />
          </div>
        </div>
        <Button type="submit" className="h-11"><Plus className="h-4 w-4 mr-2" /> Crear Desafío</Button>
      </motion.form>

      <div className="space-y-4">
        {challenges.map((c, i) => {
          const pct = Math.min(100, Math.round((c.current / c.goal) * 100));
          return (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="glass-card p-6"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-foreground">{c.title}</h3>
                <span className="text-sm font-mono text-primary font-bold">{pct}%</span>
              </div>
              <Progress value={pct} className="h-1.5 mb-3" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span className="font-mono">${c.current.toLocaleString()} / ${c.goal.toLocaleString()}</span>
                {c.deadline && (
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> {c.deadline}
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
