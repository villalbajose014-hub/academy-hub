import { useState } from "react";
import { mockChallenges } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Plus, Target } from "lucide-react";
import { toast } from "@/hooks/use-toast";

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
    toast({ title: "Desafío creado 🎯" });
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">Desafíos</h1>
        <p className="text-muted-foreground text-sm">Motiva a tus alumnos con metas mensuales</p>
      </div>

      <form onSubmit={handleCreate} className="glass-card p-5 space-y-4">
        <h2 className="font-semibold flex items-center gap-2"><Target className="h-4 w-4 text-primary" /> Nuevo Desafío</h2>
        <div className="space-y-2">
          <Label>Título</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ej: Meta Abril $3,000" required />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label>Meta ($)</Label>
            <Input type="number" value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="5000" required />
          </div>
          <div className="space-y-2">
            <Label>Fecha límite</Label>
            <Input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
          </div>
        </div>
        <Button type="submit"><Plus className="h-4 w-4 mr-2" /> Crear Desafío</Button>
      </form>

      <div className="space-y-4">
        {challenges.map((c) => {
          const pct = Math.min(100, Math.round((c.current / c.goal) * 100));
          return (
            <div key={c.id} className="glass-card p-5">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-foreground">{c.title}</h3>
                <span className="text-sm font-mono text-primary">{pct}%</span>
              </div>
              <Progress value={pct} className="h-2 mb-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>${c.current.toLocaleString()} / ${c.goal.toLocaleString()}</span>
                {c.deadline && <span>Límite: {c.deadline}</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
