import { mockStudents } from "@/lib/mock-data";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { motion } from "framer-motion";

export default function StudentsPage() {
  const [search, setSearch] = useState("");
  const filtered = mockStudents.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="page-header mb-0">
          <h1>Alumnos</h1>
          <p>{mockStudents.length} alumnos registrados</p>
        </div>
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar alumno..." className="pl-9 h-11 bg-secondary/30 border-border/50" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((s, i) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">{s.avatar}</div>
              <div>
                <h3 className="font-semibold text-foreground">{s.name}</h3>
                {s.needsAttention ? <span className="tag-attention">Atención</span> : <span className="tag-active">Activo</span>}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Último ingreso</p>
                <p className="font-mono font-semibold text-foreground">${s.lastIncome.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Total</p>
                <p className="font-mono font-semibold text-foreground">${s.totalRevenue.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Racha</p>
                <p className="font-mono text-foreground">{s.streak} días</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Última vez</p>
                <p className="font-mono text-foreground">{s.lastUpdate}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
