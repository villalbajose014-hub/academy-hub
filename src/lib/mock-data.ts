export type UserRole = "mentor" | "student";

export interface Student {
  id: string;
  name: string;
  avatar: string;
  lastIncome: number;
  totalRevenue: number;
  lastUpdate: string;
  needsAttention: boolean;
  streak: number;
}

export interface RevenueEntry {
  month: string;
  revenue: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  threshold: number;
}

export interface Challenge {
  id: string;
  title: string;
  goal: number;
  current: number;
  deadline: string;
  active: boolean;
}

export const mockStudents: Student[] = [
  { id: "1", name: "Carlos Méndez", avatar: "CM", lastIncome: 2400, totalRevenue: 18500, lastUpdate: "2026-03-28", needsAttention: false, streak: 12 },
  { id: "2", name: "Lucía Torres", avatar: "LT", lastIncome: 3100, totalRevenue: 24200, lastUpdate: "2026-03-29", needsAttention: false, streak: 8 },
  { id: "3", name: "Andrés Ríos", avatar: "AR", lastIncome: 800, totalRevenue: 6300, lastUpdate: "2026-03-15", needsAttention: true, streak: 0 },
  { id: "4", name: "Valentina Cruz", avatar: "VC", lastIncome: 4500, totalRevenue: 32100, lastUpdate: "2026-03-30", needsAttention: false, streak: 15 },
  { id: "5", name: "Diego Paredes", avatar: "DP", lastIncome: 600, totalRevenue: 4100, lastUpdate: "2026-03-10", needsAttention: true, streak: 0 },
  { id: "6", name: "Mariana Solís", avatar: "MS", lastIncome: 1900, totalRevenue: 14800, lastUpdate: "2026-03-27", needsAttention: false, streak: 5 },
];

export const mockMonthlyRevenue: RevenueEntry[] = [
  { month: "Oct", revenue: 42000 },
  { month: "Nov", revenue: 48500 },
  { month: "Dic", revenue: 55200 },
  { month: "Ene", revenue: 51000 },
  { month: "Feb", revenue: 62400 },
  { month: "Mar", revenue: 71300 },
];

export const mockStudentRevenue: RevenueEntry[] = [
  { month: "Oct", revenue: 1200 },
  { month: "Nov", revenue: 1800 },
  { month: "Dic", revenue: 2400 },
  { month: "Ene", revenue: 2100 },
  { month: "Feb", revenue: 3200 },
  { month: "Mar", revenue: 4500 },
];

export const mockAchievements: Achievement[] = [
  { id: "1", title: "Primer Ingreso", description: "Registra tu primer ingreso", icon: "🎯", unlocked: true, unlockedAt: "2025-11-15", threshold: 1 },
  { id: "2", title: "$1,000 Club", description: "Alcanza $1,000 en un mes", icon: "💰", unlocked: true, unlockedAt: "2025-12-20", threshold: 1000 },
  { id: "3", title: "$5,000 Club", description: "Alcanza $5,000 en un mes", icon: "🔥", unlocked: false, threshold: 5000 },
  { id: "4", title: "Racha de 7 días", description: "Registra ingresos 7 días seguidos", icon: "⚡", unlocked: true, unlockedAt: "2026-01-10", threshold: 7 },
  { id: "5", title: "$10,000 Elite", description: "Alcanza $10,000 en un mes", icon: "👑", unlocked: false, threshold: 10000 },
  { id: "6", title: "Constancia 30", description: "30 días consecutivos registrando", icon: "💎", unlocked: false, threshold: 30 },
];

export const mockChallenges: Challenge[] = [
  { id: "1", title: "Meta Marzo: $5,000 por alumno", goal: 5000, current: 4500, deadline: "2026-03-31", active: true },
  { id: "2", title: "Racha de 14 días", goal: 14, current: 8, deadline: "2026-04-15", active: true },
];

export const currencyRates: Record<string, number> = {
  USD: 1,
  MXN: 17.15,
  ARS: 870.50,
  COP: 3950,
  BRL: 4.97,
  EUR: 0.92,
  CLP: 935,
};
