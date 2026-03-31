import { TrendingUp, DollarSign, Flame } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import StatCard from "@/components/StatCard";
import { mockStudentRevenue } from "@/lib/mock-data";
import { motion } from "framer-motion";

import { TrendingUp, DollarSign, Flame, Loader2 } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import StatCard from "@/components/StatCard";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { format, startOfMonth, subMonths, isWithinInterval } from "date-fns";
import { es } from "date-fns/locale";

export default function StudentDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, currentMonth: 0, streak: 0 });
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    if (user) fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user?.id)
        .order("date", { ascending: true });

      if (error) throw error;

      const transactions = data || [];
      const total = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0) -
                    transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

      const now = new Date();
      const monthStart = startOfMonth(now);
      const currentMonth = transactions
        .filter(t => t.type === 'income' && new Date(t.date) >= monthStart)
        .reduce((s, t) => s + t.amount, 0);

      // Simple pseudo-streak logic based on activity days
      const uniqueDays = new Set(transactions.map(t => new Date(t.date).toDateString())).size;

      // Group by month for chart
      const months = Array.from({ length: 6 }, (_, i) => subMonths(now, 5 - i));
      const monthlyData = months.map(m => {
        const mStart = startOfMonth(m);
        const mEnd = new Date(m.getFullYear(), m.getMonth() + 1, 0);
        const monthRev = transactions
          .filter(t => t.type === 'income' && isWithinInterval(new Date(t.date), { start: mStart, end: mEnd }))
          .reduce((s, t) => s + t.amount, 0);
        
        return {
          month: format(m, "MMM", { locale: es }),
          revenue: monthRev
        };
      });

      setStats({ total, currentMonth, streak: uniqueDays });
      setChartData(monthlyData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary/40" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="page-header">
        <h1>Mi Progreso</h1>
        <p>Tu evolución financiera real en tiempo real</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Ingresos este Mes" value={`$${stats.currentMonth.toLocaleString()}`} icon={<DollarSign className="h-5 w-5" />} />
        <StatCard title="Balance Total" value={`$${stats.total.toLocaleString()}`} icon={<TrendingUp className="h-5 w-5" />} />
        <StatCard title="Días de Actividad" value={`${stats.streak} días`} subtitle="Constancia premiada" icon={<Flame className="h-5 w-5" />} />
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
        <h2 className="text-lg font-bold mb-6">Mi Crecimiento</h2>
        <div className="h-72">
          {chartData.every(d => d.revenue === 0) ? (
            <div className="h-full flex items-center justify-center text-muted-foreground/40 text-sm">
              Registra tus primeros ingresos para ver el gráfico
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
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
          )}
        </div>
      </motion.div>
    </div>
  );
}
