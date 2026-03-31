import { useState } from "react";
import { currencyRates } from "@/lib/mock-data";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeftRight, Globe } from "lucide-react";
import { motion } from "framer-motion";

export default function ConverterPage() {
  const [amount, setAmount] = useState("100");
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("MXN");
  const currencies = Object.keys(currencyRates);

  const convert = () => {
    const val = Number(amount) || 0;
    const inUsd = val / currencyRates[from];
    return inUsd * currencyRates[to];
  };

  return (
    <div className="space-y-8 max-w-md">
      <div className="page-header">
        <h1>Conversor de Divisas</h1>
        <p>Calcula tus ingresos en cualquier moneda</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 space-y-6">
        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Cantidad</Label>
          <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="text-xl font-mono h-14 bg-secondary/30 border-border/50" />
        </div>

        <div className="grid grid-cols-5 gap-3 items-end">
          <div className="col-span-2 space-y-2">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">De</Label>
            <select value={from} onChange={(e) => setFrom(e.target.value)} className="w-full bg-secondary/50 text-foreground border border-border/50 rounded-xl p-3 text-sm font-mono focus:outline-none focus:border-primary/50 transition-colors">
              {currencies.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex justify-center pb-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <ArrowLeftRight className="h-4 w-4 text-primary" />
            </div>
          </div>
          <div className="col-span-2 space-y-2">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">A</Label>
            <select value={to} onChange={(e) => setTo(e.target.value)} className="w-full bg-secondary/50 text-foreground border border-border/50 rounded-xl p-3 text-sm font-mono focus:outline-none focus:border-primary/50 transition-colors">
              {currencies.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div className="section-divider" />

        <div className="text-center py-2">
          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Resultado</p>
          <p className="stat-value text-4xl">{convert().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          <p className="text-sm text-muted-foreground mt-1 font-mono">{to}</p>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-5">
        <h3 className="font-semibold mb-4 text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <Globe className="h-3.5 w-3.5" /> Tasas de Referencia (vs USD)
        </h3>
        <div className="space-y-0">
          {currencies.filter((c) => c !== "USD").map((c) => (
            <div key={c} className="flex justify-between text-sm py-2.5 border-b border-border/20 last:border-0 hover:bg-secondary/10 transition-colors rounded px-2 -mx-2">
              <span className="text-muted-foreground font-medium">{c}</span>
              <span className="font-mono text-foreground">{currencyRates[c]}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
