import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Play, Square, Focus, Zap } from "lucide-react";
import { useState } from "react";

interface SessionTimerProps {
  isActive: boolean;
  elapsed: number;
  onStart: (intent?: string) => void;
  onEnd: (reflection?: "focused" | "distracted") => void;
  showReflection: boolean;
  onReflectionSubmit: (reflection: "focused" | "distracted") => void;
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function SessionTimer({ isActive, elapsed, onStart, onEnd, showReflection, onReflectionSubmit }: SessionTimerProps) {
  const [intent, setIntent] = useState("");

  const handleStart = () => {
    onStart(intent.trim() || undefined);
    setIntent("");
  };

  if (showReflection) {
    return (
      <div className="flex flex-col items-center gap-5 rounded-lg border border-border bg-card p-8">
        <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
          How was your focus?
        </p>
        <div className="flex gap-3">
          <Button
            onClick={() => onReflectionSubmit("focused")}
            variant="outline"
            className="gap-2 font-mono border-primary/30 hover:bg-primary/10 hover:text-primary"
          >
            <Focus className="h-4 w-4" />
            Focused
          </Button>
          <Button
            onClick={() => onReflectionSubmit("distracted")}
            variant="outline"
            className="gap-2 font-mono border-muted-foreground/30 hover:bg-muted"
          >
            <Zap className="h-4 w-4" />
            Distracted
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 rounded-lg border border-border bg-card p-8">
      <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
        {isActive ? "Session in progress" : "Ready to study"}
      </p>
      <p className={`text-5xl font-mono font-bold tabular-nums ${isActive ? "text-primary animate-pulse-glow" : "text-muted-foreground"}`}>
        {formatTime(elapsed)}
      </p>

      {!isActive && (
        <Input
          value={intent}
          onChange={(e) => setIntent(e.target.value)}
          placeholder="What will you focus on?"
          className="max-w-xs text-center font-mono text-sm bg-muted/50 border-border placeholder:text-muted-foreground/50"
          maxLength={60}
        />
      )}

      <div className="flex gap-3">
        {!isActive ? (
          <Button onClick={handleStart} className="gap-2 font-mono">
            <Play className="h-4 w-4" />
            Start Session
          </Button>
        ) : (
          <Button onClick={() => onEnd()} variant="destructive" className="gap-2 font-mono">
            <Square className="h-4 w-4" />
            End Session
          </Button>
        )}
      </div>
    </div>
  );
}
