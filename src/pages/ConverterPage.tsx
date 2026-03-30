import { useState } from "react";
import { currencyRates } from "@/lib/mock-data";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeftRight } from "lucide-react";

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
    <div className="space-y-6 max-w-md">
      <div>
        <h1 className="text-2xl font-bold">Conversor de Divisas</h1>
        <p className="text-muted-foreground text-sm">Calcula tus ingresos en cualquier moneda</p>
      </div>

      <div className="glass-card p-6 space-y-5">
        <div className="space-y-2">
          <Label>Cantidad</Label>
          <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="text-xl font-mono" />
        </div>

        <div className="grid grid-cols-5 gap-3 items-end">
          <div className="col-span-2 space-y-2">
            <Label>De</Label>
            <select value={from} onChange={(e) => setFrom(e.target.value)} className="w-full bg-secondary text-foreground border border-border rounded-lg p-2.5 text-sm">
              {currencies.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex justify-center pb-2">
            <ArrowLeftRight className="h-5 w-5 text-primary" />
          </div>
          <div className="col-span-2 space-y-2">
            <Label>A</Label>
            <select value={to} onChange={(e) => setTo(e.target.value)} className="w-full bg-secondary text-foreground border border-border rounded-lg p-2.5 text-sm">
              {currencies.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div className="pt-4 border-t border-border text-center">
          <p className="text-sm text-muted-foreground mb-1">Resultado</p>
          <p className="stat-value">{convert().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {to}</p>
        </div>
      </div>

      <div className="glass-card p-5">
        <h3 className="font-semibold mb-3 text-sm">Tasas de Referencia (vs USD)</h3>
        <div className="space-y-1">
          {currencies.filter((c) => c !== "USD").map((c) => (
            <div key={c} className="flex justify-between text-sm py-1 border-b border-border/50 last:border-0">
              <span className="text-muted-foreground">{c}</span>
              <span className="font-mono text-foreground">{currencyRates[c]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
