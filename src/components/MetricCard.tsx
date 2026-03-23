interface MetricCardProps {
  label: string;
  value: string | number;
  sub?: string;
  variant?: "default" | "highlight" | "danger";
}

export function MetricCard({ label, value, sub, variant = "default" }: MetricCardProps) {
  const borderClass =
    variant === "highlight"
      ? "border-primary/40"
      : variant === "danger"
        ? "border-danger/40"
        : "border-border";

  return (
    <div className={`rounded-lg border ${borderClass} bg-card p-4`}>
      <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-mono font-bold text-card-foreground">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}
