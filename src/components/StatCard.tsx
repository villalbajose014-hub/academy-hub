import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon?: ReactNode;
}

export default function StatCard({ title, value, subtitle, icon }: StatCardProps) {
  return (
    <div className="glass-card p-5">
      <div className="flex items-start justify-between mb-3">
        <span className="text-sm text-muted-foreground">{title}</span>
        {icon && <span className="text-primary">{icon}</span>}
      </div>
      <p className="stat-value">{value}</p>
      {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
    </div>
  );
}
