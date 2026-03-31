import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Plus, TrendingUp, TrendingDown, ArrowUpCircle, ArrowDownCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";

interface Entry {
  id: string;
  amount: number;
  description: string;
  type: "income" | "expense";
  date: string;
}

export default function IncomePage() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"income" | "expense">("income");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetchEntries();
  }, [user]);

  const fetchEntries = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: false });

      if (error) throw error;
      setEntries(data as Entry[]);
    } catch (err: any) {
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !amount || !description) return;
    setLoading(true);
    
    const numAmount = Number(amount);

    try {
      const { data, error } = await supabase
        .from("transactions")
        .insert({
          user_id: user.id,
          amount: numAmount,
          description,
          type,
          date: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      
      setEntries([data as Entry, ...entries]);
      setAmount("");
      setDescription("");
      toast({ 
        title: type === "income" ? "Ingreso registrado" : "Gasto registrado", 
        description: `$${numAmount} — ${description}` 
      });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const totalIncome = entries.filter((e) => e.type === "income").reduce((s, e) => s + e.amount, 0);
  const totalExpense = entries.filter((e) => e.type === "expense").reduce((s, e) => s + e.amount, 0);

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary/40" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <div className="page-header">
        <h1>Registrar Movimiento</h1>
        <p>Lleva el control real de tus finanzas</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Ingresos</p>
            <TrendingUp className="h-4 w-4 text-primary/60" />
          </div>
          <p className="text-2xl font-bold font-mono text-primary">${totalIncome.toLocaleString()}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="glass-card p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Gastos</p>
            <TrendingDown className="h-4 w-4 text-destructive/60" />
          </div>
          <p className="text-2xl font-bold font-mono text-destructive">${totalExpense.toLocaleString()}</p>
        </motion.div>
      </div>

      <motion.form initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} onSubmit={handleAdd} className="glass-card p-6 space-y-5">
        <div className="grid grid-cols-2 gap-3">
          {(["income", "expense"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={`py-3 rounded-xl text-sm font-semibold transition-all border flex items-center justify-center gap-2 ${
                type === t
                  ? t === "income"
                    ? "bg-primary/10 text-primary border-primary/30"
                    : "bg-destructive/10 text-destructive border-destructive/30"
                  : "bg-secondary/50 text-muted-foreground border-border hover:border-border/80"
              }`}
            >
              {t === "income" ? <ArrowUpCircle className="h-4 w-4" /> : <ArrowDownCircle className="h-4 w-4" />}
              {t === "income" ? "Ingreso" : "Gasto"}
            </button>
          ))}
        </div>
        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Monto ($)</Label>
          <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" required className="h-12 text-lg font-mono bg-secondary/30 border-border/50" />
        </div>
        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Descripción</Label>
          <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Ej: Tatuaje brazo completo" required className="h-12 bg-secondary/30 border-border/50" />
        </div>
        <Button type="submit" className="w-full h-12 text-base font-semibold" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Plus className="h-4 w-4 mr-2" /> Agregar</>}
        </Button>
      </motion.form>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Historial</h2>
        <div className="space-y-1">
          {entries.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground/40 text-sm">No hay movimientos registrados</p>
          ) : (
            entries.map((e) => (
              <div key={e.id} className="flex items-center justify-between py-3 border-b border-border/30 last:border-0 hover:bg-secondary/10 transition-colors rounded-lg px-2 -mx-2">
                <div>
                  <p className="text-sm font-medium text-foreground">{e.description}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{new Date(e.date).toLocaleDateString()}</p>
                </div>
                <span className={`font-mono font-semibold text-sm ${e.type === "income" ? "text-primary" : "text-destructive"}`}>
                  {e.type === "income" ? "+" : "-"}${e.amount.toLocaleString()}
                </span>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}
