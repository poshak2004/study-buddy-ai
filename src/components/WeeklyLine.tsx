import { CalendarDays } from "lucide-react";

interface WeeklyLineProps {
  activeDays: number;
}

export function WeeklyLine({ activeDays }: WeeklyLineProps) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-3">
      <CalendarDays className="h-4 w-4 text-muted-foreground" />
      <span className="text-sm font-mono text-muted-foreground">
        You showed up <span className="text-foreground font-medium">{activeDays}/7</span> days this week
      </span>
    </div>
  );
}
