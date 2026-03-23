import { Button } from "@/components/ui/button";
import { Play, Square } from "lucide-react";

interface SessionTimerProps {
  isActive: boolean;
  elapsed: number;
  onStart: () => void;
  onEnd: () => void;
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function SessionTimer({ isActive, elapsed, onStart, onEnd }: SessionTimerProps) {
  return (
    <div className="flex flex-col items-center gap-6 rounded-lg border border-border bg-card p-8">
      <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
        {isActive ? "Session in progress" : "Ready to study"}
      </p>
      <p className={`text-5xl font-mono font-bold tabular-nums ${isActive ? "text-primary animate-pulse-glow" : "text-muted-foreground"}`}>
        {formatTime(elapsed)}
      </p>
      <div className="flex gap-3">
        {!isActive ? (
          <Button onClick={onStart} className="gap-2 font-mono">
            <Play className="h-4 w-4" />
            Start Session
          </Button>
        ) : (
          <Button onClick={onEnd} variant="destructive" className="gap-2 font-mono">
            <Square className="h-4 w-4" />
            End Session
          </Button>
        )}
      </div>
    </div>
  );
}
