import { useStudySessions } from "@/hooks/useStudySessions";
import { SessionTimer } from "@/components/SessionTimer";
import { MetricCard } from "@/components/MetricCard";
import { DropoffBadge } from "@/components/DropoffBadge";
import { AiInsight } from "@/components/AiInsight";
import { SessionHistory } from "@/components/SessionHistory";
import { WeeklyLine } from "@/components/WeeklyLine";
import { BookOpen, Flame } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useRef } from "react";

export default function Index() {
  const {
    sessions, isActive, elapsed, startSession, endSession,
    metrics, streak, lastStreakResult, pendingReflection, submitReflection,
  } = useStudySessions();
  const { activeDays, avgDuration, daysSinceLastSession, consistencyScore, isHighRisk } = metrics;
  const { toast } = useToast();
  const prevStreakResult = useRef(lastStreakResult);

  useEffect(() => {
    if (lastStreakResult && lastStreakResult !== prevStreakResult.current) {
      toast({
        description: lastStreakResult.increased
          ? `Day ${lastStreakResult.streak} streak — don't break it`
          : "New start — let's build consistency",
      });
    }
    prevStreakResult.current = lastStreakResult;
  }, [lastStreakResult, toast]);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-lg px-4 py-12">
        {/* Header */}
        <div className="mb-8 flex items-center gap-3">
          <BookOpen className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-mono font-bold text-foreground tracking-tight">StudyPulse</h1>
        </div>

        {/* Timer */}
        <div className="mb-6">
          <SessionTimer
            isActive={isActive}
            elapsed={elapsed}
            onStart={startSession}
            onEnd={endSession}
            showReflection={pendingReflection}
            onReflectionSubmit={submitReflection}
          />
        </div>

        {/* Streak */}
        <div className="mb-6 flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-4 py-3">
          <Flame className="h-4 w-4 text-primary" />
          <span className="text-sm font-mono font-medium text-primary">
            Current Streak: {streak} {streak === 1 ? "day" : "days"}
          </span>
        </div>

        {/* Weekly consistency line */}
        <div className="mb-6">
          <WeeklyLine activeDays={activeDays} />
        </div>

        {/* Drop-off status */}
        <div className="mb-6">
          <DropoffBadge isHighRisk={isHighRisk} />
        </div>

        {/* Metrics Grid */}
        <div className="mb-6 grid grid-cols-2 gap-3">
          <MetricCard
            label="Consistency"
            value={`${consistencyScore}%`}
            sub="Last 7 days"
            variant={consistencyScore >= 50 ? "highlight" : "danger"}
          />
          <MetricCard
            label="Active Days"
            value={activeDays}
            sub="of 7"
          />
          <MetricCard
            label="Avg Duration"
            value={`${avgDuration}m`}
            sub="per session"
          />
          <MetricCard
            label="Last Session"
            value={daysSinceLastSession !== null ? `${daysSinceLastSession}d ago` : "—"}
            variant={daysSinceLastSession !== null && daysSinceLastSession >= 2 ? "danger" : "default"}
          />
        </div>

        {/* Session History */}
        <div className="mb-6">
          <SessionHistory sessions={sessions} />
        </div>

        {/* AI Insight */}
        <AiInsight
          activeDays={activeDays}
          avgDuration={avgDuration}
          daysSinceLastSession={daysSinceLastSession}
        />
      </div>
    </div>
  );
}
