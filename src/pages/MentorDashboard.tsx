import { BarChart3, Users, AlertTriangle, TrendingUp } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import StatCard from "@/components/StatCard";
import { mockStudents, mockMonthlyRevenue } from "@/lib/mock-data";
import { motion } from "framer-motion";

export default function MentorDashboard() {
  const totalRevenue = mockStudents.reduce((s, st) => s + st.totalRevenue, 0);
  const needsAttention = mockStudents.filter((s) => s.needsAttention).length;
  const avgIncome = Math.round(mockStudents.reduce((s, st) => s + st.lastIncome, 0) / mockStudents.length);

  return (
    <div className="space-y-8">
      <div className="page-header">
        <h1>Command Center</h1>
        <p>Resumen general de la academia</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Ingresos Totales" value={`$${totalRevenue.toLocaleString()}`} subtitle="Acumulado global" icon={<TrendingUp className="h-5 w-5" />} />
        <StatCard title="Alumnos Activos" value={String(mockStudents.length)} subtitle="En la academia" icon={<Users className="h-5 w-5" />} />
        <StatCard title="Promedio Mensual" value={`$${avgIncome.toLocaleString()}`} subtitle="Por alumno" icon={<BarChart3 className="h-5 w-5" />} />
        <StatCard title="Necesitan Atención" value={String(needsAttention)} subtitle="Sin actividad reciente" icon={<AlertTriangle className="h-5 w-5" />} />
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-6">Ingresos Mensuales de la Academia</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockMonthlyRevenue}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(54, 100%, 50%)" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="hsl(54, 100%, 50%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 10%)" />
              <XAxis dataKey="month" stroke="hsl(0, 0%, 35%)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(0, 0%, 35%)" fontSize={11} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: "hsl(0, 0%, 6%)", border: "1px solid hsl(0, 0%, 12%)", borderRadius: 12, color: "hsl(0, 0%, 96%)", fontSize: 13 }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, "Ingresos"]}
              />
              <Area type="monotone" dataKey="revenue" stroke="hsl(54, 100%, 50%)" fill="url(#colorRevenue)" strokeWidth={2} dot={{ r: 3, fill: "hsl(54, 100%, 50%)" }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-6">Monitoreo de Alumnos</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-muted-foreground/60 border-b border-border/30">
                <th className="text-left py-3 font-medium text-[10px] uppercase tracking-[0.15em]">Alumno</th>
                <th className="text-right py-3 font-medium text-[10px] uppercase tracking-[0.15em]">Último Ingreso</th>
                <th className="text-right py-3 font-medium text-[10px] uppercase tracking-[0.15em] hidden sm:table-cell">Total</th>
                <th className="text-right py-3 font-medium text-[10px] uppercase tracking-[0.15em] hidden md:table-cell">Racha</th>
                <th className="text-right py-3 font-medium text-[10px] uppercase tracking-[0.15em]">Estado</th>
              </tr>
            </thead>
            <tbody>
              {mockStudents.map((s) => (
                <tr key={s.id} className="border-b border-border/15 hover:bg-secondary/10 transition-colors">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">{s.avatar}</div>
                      <div>
                        <span className="font-semibold text-foreground">{s.name}</span>
                        <p className="text-xs text-muted-foreground md:hidden">${s.totalRevenue.toLocaleString()}</p>
                      </div>
                    </div>
                  </td>
                  <td className="text-right font-mono font-semibold text-foreground">${s.lastIncome.toLocaleString()}</td>
                  <td className="text-right font-mono text-muted-foreground hidden sm:table-cell">${s.totalRevenue.toLocaleString()}</td>
                  <td className="text-right font-mono text-muted-foreground hidden md:table-cell">{s.streak} días</td>
                  <td className="text-right">
                    {s.needsAttention ? <span className="tag-attention">Atención</span> : <span className="tag-active">Activo</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
