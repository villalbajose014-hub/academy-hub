import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";

interface Entry {
  id: number;
  amount: number;
  description: string;
  type: "income" | "expense";
  date: string;
}

export default function IncomePage() {
  const [entries, setEntries] = useState<Entry[]>([
    { id: 1, amount: 1500, description: "Tatuaje manga completa", type: "income", date: "2026-03-28" },
    { id: 2, amount: 200, description: "Tintas y agujas", type: "expense", date: "2026-03-27" },
    { id: 3, amount: 800, description: "Tatuaje lettering", type: "income", date: "2026-03-26" },
  ]);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"income" | "expense">("income");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description) return;
    const newEntry: Entry = {
      id: Date.now(),
      amount: Number(amount),
      description,
      type,
      date: new Date().toISOString().split("T")[0],
    };
    setEntries([newEntry, ...entries]);
    setAmount("");
    setDescription("");
    toast({ title: type === "income" ? "Ingreso registrado ✅" : "Gasto registrado", description: `$${amount} — ${description}` });
  };

  const totalIncome = entries.filter((e) => e.type === "income").reduce((s, e) => s + e.amount, 0);
  const totalExpense = entries.filter((e) => e.type === "expense").reduce((s, e) => s + e.amount, 0);

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">Registrar Ingreso</h1>
        <p className="text-muted-foreground text-sm">Lleva el control de tus finanzas</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="glass-card p-4">
          <p className="text-sm text-muted-foreground">Ingresos</p>
          <p className="text-2xl font-bold font-mono text-primary">${totalIncome.toLocaleString()}</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-sm text-muted-foreground">Gastos</p>
          <p className="text-2xl font-bold font-mono text-destructive">${totalExpense.toLocaleString()}</p>
        </div>
      </div>

      <form onSubmit={handleAdd} className="glass-card p-5 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {(["income", "expense"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={`py-2 rounded-lg text-sm font-medium transition-all border ${
                type === t
                  ? t === "income"
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-destructive text-destructive-foreground border-destructive"
                  : "bg-secondary text-secondary-foreground border-border"
              }`}
            >
              {t === "income" ? "💰 Ingreso" : "📉 Gasto"}
            </button>
          ))}
        </div>
        <div className="space-y-2">
          <Label>Monto ($)</Label>
          <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" required />
        </div>
        <div className="space-y-2">
          <Label>Descripción</Label>
          <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Ej: Tatuaje brazo completo" required />
        </div>
        <Button type="submit" className="w-full">
          <Plus className="h-4 w-4 mr-2" /> Agregar
        </Button>
      </form>

      <div className="glass-card p-5">
        <h2 className="text-lg font-semibold mb-3">Historial</h2>
        <div className="space-y-2">
          {entries.map((e) => (
            <div key={e.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
              <div>
                <p className="text-sm font-medium text-foreground">{e.description}</p>
                <p className="text-xs text-muted-foreground">{e.date}</p>
              </div>
              <span className={`font-mono font-semibold ${e.type === "income" ? "text-primary" : "text-destructive"}`}>
                {e.type === "income" ? "+" : "-"}${e.amount.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
