import { mockStudents } from "@/lib/mock-data";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function StudentsPage() {
  const [search, setSearch] = useState("");
  const filtered = mockStudents.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Alumnos</h1>
          <p className="text-muted-foreground text-sm">{mockStudents.length} alumnos registrados</p>
        </div>
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar alumno..." className="pl-9" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((s) => (
          <div key={s.id} className="glass-card p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-bold">{s.avatar}</div>
              <div>
                <h3 className="font-semibold text-foreground">{s.name}</h3>
                {s.needsAttention ? <span className="tag-attention">Atención</span> : <span className="tag-active">Activo</span>}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-muted-foreground">Último ingreso</p>
                <p className="font-mono font-semibold text-foreground">${s.lastIncome.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Total</p>
                <p className="font-mono font-semibold text-foreground">${s.totalRevenue.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Racha</p>
                <p className="font-mono text-foreground">{s.streak} días</p>
              </div>
              <div>
                <p className="text-muted-foreground">Última vez</p>
                <p className="font-mono text-foreground">{s.lastUpdate}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
