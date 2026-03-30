import { TrendingUp, DollarSign, Flame } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import StatCard from "@/components/StatCard";
import { mockStudentRevenue } from "@/lib/mock-data";

export default function StudentDashboard() {
  const total = mockStudentRevenue.reduce((s, e) => s + e.revenue, 0);
  const lastMonth = mockStudentRevenue[mockStudentRevenue.length - 1].revenue;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Mi Progreso</h1>
        <p className="text-muted-foreground text-sm">Tu evolución financiera</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Ingreso Este Mes" value={`$${lastMonth.toLocaleString()}`} icon={<DollarSign className="h-5 w-5" />} />
        <StatCard title="Total Acumulado" value={`$${total.toLocaleString()}`} icon={<TrendingUp className="h-5 w-5" />} />
        <StatCard title="Racha Actual" value="15 días" subtitle="¡Sigue así!" icon={<Flame className="h-5 w-5" />} />
      </div>

      <div className="glass-card p-5">
        <h2 className="text-lg font-semibold mb-4">Mi Crecimiento</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockStudentRevenue}>
              <defs>
                <linearGradient id="colorStudentRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(54, 100%, 50%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(54, 100%, 50%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 14%)" />
              <XAxis dataKey="month" stroke="hsl(0, 0%, 55%)" fontSize={12} />
              <YAxis stroke="hsl(0, 0%, 55%)" fontSize={12} tickFormatter={(v) => `$${v}`} />
              <Tooltip
                contentStyle={{ backgroundColor: "hsl(0, 0%, 7%)", border: "1px solid hsl(0, 0%, 14%)", borderRadius: 8, color: "hsl(0, 0%, 95%)" }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, "Ingresos"]}
              />
              <Area type="monotone" dataKey="revenue" stroke="hsl(54, 100%, 50%)" fill="url(#colorStudentRev)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
