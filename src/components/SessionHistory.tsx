import type { StudySession } from "@/hooks/useStudySessions";
import { Clock, Calendar } from "lucide-react";

interface SessionHistoryProps {
  sessions: StudySession[];
}

export function SessionHistory({ sessions }: SessionHistoryProps) {
  const reversed = [...sessions].reverse();

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-3">
        Session History
      </p>
      {reversed.length === 0 ? (
        <p className="text-sm text-muted-foreground">No sessions recorded yet.</p>
      ) : (
        <ul className="space-y-2 max-h-60 overflow-y-auto">
          {reversed.map((session, i) => (
            <li
              key={`${session.date}-${i}`}
              className="flex items-center justify-between rounded-md border border-border/50 bg-background/50 px-3 py-2"
            >
              <span className="flex items-center gap-1.5 text-sm font-mono text-card-foreground">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                {session.date}
              </span>
              <span className="flex items-center gap-1.5 text-sm font-mono text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                {session.duration}m
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
