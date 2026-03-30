import { BarChart3, Users, AlertTriangle, TrendingUp } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import StatCard from "@/components/StatCard";
import { mockStudents, mockMonthlyRevenue } from "@/lib/mock-data";

export default function MentorDashboard() {
  const totalRevenue = mockStudents.reduce((s, st) => s + st.totalRevenue, 0);
  const needsAttention = mockStudents.filter((s) => s.needsAttention).length;
  const avgIncome = Math.round(mockStudents.reduce((s, st) => s + st.lastIncome, 0) / mockStudents.length);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Command Center</h1>
        <p className="text-muted-foreground text-sm">Resumen de la academia</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Ingresos Totales" value={`$${totalRevenue.toLocaleString()}`} subtitle="Acumulado" icon={<TrendingUp className="h-5 w-5" />} />
        <StatCard title="Alumnos Activos" value={String(mockStudents.length)} icon={<Users className="h-5 w-5" />} />
        <StatCard title="Promedio Mensual" value={`$${avgIncome.toLocaleString()}`} subtitle="Por alumno" icon={<BarChart3 className="h-5 w-5" />} />
        <StatCard title="Necesitan Atención" value={String(needsAttention)} subtitle="Sin actividad reciente" icon={<AlertTriangle className="h-5 w-5" />} />
      </div>

      <div className="glass-card p-5">
        <h2 className="text-lg font-semibold mb-4">Ingresos Mensuales de la Academia</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockMonthlyRevenue}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(54, 100%, 50%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(54, 100%, 50%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 14%)" />
              <XAxis dataKey="month" stroke="hsl(0, 0%, 55%)" fontSize={12} />
              <YAxis stroke="hsl(0, 0%, 55%)" fontSize={12} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ backgroundColor: "hsl(0, 0%, 7%)", border: "1px solid hsl(0, 0%, 14%)", borderRadius: 8, color: "hsl(0, 0%, 95%)" }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, "Ingresos"]}
              />
              <Area type="monotone" dataKey="revenue" stroke="hsl(54, 100%, 50%)" fill="url(#colorRevenue)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-card p-5">
        <h2 className="text-lg font-semibold mb-4">Alumnos</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-muted-foreground border-b border-border">
                <th className="text-left py-3 font-medium">Alumno</th>
                <th className="text-right py-3 font-medium">Último Ingreso</th>
                <th className="text-right py-3 font-medium">Total</th>
                <th className="text-right py-3 font-medium">Racha</th>
                <th className="text-right py-3 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody>
              {mockStudents.map((s) => (
                <tr key={s.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">{s.avatar}</div>
                      <span className="font-medium text-foreground">{s.name}</span>
                    </div>
                  </td>
                  <td className="text-right font-mono text-foreground">${s.lastIncome.toLocaleString()}</td>
                  <td className="text-right font-mono text-muted-foreground">${s.totalRevenue.toLocaleString()}</td>
                  <td className="text-right font-mono text-muted-foreground">{s.streak} días</td>
                  <td className="text-right">
                    {s.needsAttention ? (
                      <span className="tag-attention">Atención</span>
                    ) : (
                      <span className="tag-active">Activo</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
