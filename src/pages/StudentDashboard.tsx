import { TrendingUp, DollarSign, Flame } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import StatCard from "@/components/StatCard";
import { mockStudentRevenue } from "@/lib/mock-data";
import { motion } from "framer-motion";

export default function StudentDashboard() {
  const total = mockStudentRevenue.reduce((s, e) => s + e.revenue, 0);
  const lastMonth = mockStudentRevenue[mockStudentRevenue.length - 1].revenue;

  return (
    <div className="space-y-8">
      <div className="page-header">
        <h1>Mi Progreso</h1>
        <p>Tu evolución financiera personal</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Este Mes" value={`$${lastMonth.toLocaleString()}`} icon={<DollarSign className="h-5 w-5" />} />
        <StatCard title="Total Acumulado" value={`$${total.toLocaleString()}`} icon={<TrendingUp className="h-5 w-5" />} />
        <StatCard title="Racha Actual" value="15 días" subtitle="¡Sigue así! 🔥" icon={<Flame className="h-5 w-5" />} />
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
        <h2 className="text-lg font-bold mb-6">Mi Crecimiento</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockStudentRevenue}>
              <defs>
                <linearGradient id="colorStudentRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(54, 100%, 50%)" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="hsl(54, 100%, 50%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 12%)" />
              <XAxis dataKey="month" stroke="hsl(0, 0%, 40%)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(0, 0%, 40%)" fontSize={12} tickFormatter={(v) => `$${v}`} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: "hsl(0, 0%, 6%)", border: "1px solid hsl(0, 0%, 12%)", borderRadius: 12, color: "hsl(0, 0%, 96%)", fontSize: 13 }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, "Ingresos"]}
              />
              <Area type="monotone" dataKey="revenue" stroke="hsl(54, 100%, 50%)" fill="url(#colorStudentRev)" strokeWidth={2.5} dot={{ r: 4, fill: "hsl(54, 100%, 50%)" }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}
