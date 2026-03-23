import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface AiInsightProps {
  activeDays: number;
  avgDuration: number;
  daysSinceLastSession: number | null;
}

export function AiInsight({ activeDays, avgDuration, daysSinceLastSession }: AiInsightProps) {
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInsight = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fnError } = await supabase.functions.invoke("study-insight", {
        body: {
          activeDays,
          avgDuration,
          daysSinceLastSession: daysSinceLastSession ?? 0,
        },
      });
      if (fnError) throw fnError;
      setInsight(data.insight);
    } catch (e: any) {
      console.error(e);
      setError("Could not fetch AI insight. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">AI Insight</p>
        <Button
          variant="ghost"
          size="sm"
          onClick={fetchInsight}
          disabled={loading}
          className="gap-1.5 font-mono text-xs text-primary hover:text-primary"
        >
          {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
          {insight ? "Refresh" : "Get Insight"}
        </Button>
      </div>
      {error && <p className="mt-2 text-xs text-danger">{error}</p>}
      {insight && (
        <p className="mt-3 text-sm leading-relaxed text-card-foreground whitespace-pre-line">{insight}</p>
      )}
      {!insight && !loading && !error && (
        <p className="mt-3 text-sm text-muted-foreground">Click to get an AI-powered analysis of your study patterns.</p>
      )}
    </div>
  );
}
