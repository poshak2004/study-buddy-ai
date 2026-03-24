import { useState, useEffect, useCallback, useRef } from "react";

export interface StudySession {
  date: string;
  duration: number; // minutes
  intent?: string;
  reflection?: "focused" | "distracted";
}

const STORAGE_KEY = "study-sessions";
const STREAK_KEY = "study-streak";
const STREAK_DATE_KEY = "study-streak-date";

export type StreakResult = { streak: number; increased: boolean } | null;

function loadSessions(): StudySession[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveSessions(sessions: StudySession[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

function loadStreak(): number {
  try {
    return parseInt(localStorage.getItem(STREAK_KEY) || "0", 10);
  } catch {
    return 0;
  }
}

function loadStreakDate(): string | null {
  try {
    return localStorage.getItem(STREAK_DATE_KEY);
  } catch {
    return null;
  }
}

function getDateStr(d: Date = new Date()): string {
  return d.toISOString().split("T")[0];
}

function getYesterdayStr(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return getDateStr(d);
}

export function useStudySessions() {
  const [sessions, setSessions] = useState<StudySession[]>(loadSessions);
  const [isActive, setIsActive] = useState(false);
  const [elapsed, setElapsed] = useState(0); // seconds
  const [streak, setStreak] = useState(loadStreak);
  const [streakDate, setStreakDate] = useState<string | null>(loadStreakDate);
  const [lastStreakResult, setLastStreakResult] = useState<StreakResult>(null);
  const [pendingReflection, setPendingReflection] = useState(false);
  const startTimeRef = useRef<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pendingIntentRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    saveSessions(sessions);
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem(STREAK_KEY, String(streak));
  }, [streak]);

  useEffect(() => {
    if (streakDate) localStorage.setItem(STREAK_DATE_KEY, streakDate);
  }, [streakDate]);

  const startSession = useCallback(() => {
    startTimeRef.current = Date.now();
    setIsActive(true);
    setElapsed(0);
    intervalRef.current = setInterval(() => {
      if (startTimeRef.current) {
        setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }
    }, 1000);
  }, []);

  const endSession = useCallback(() => {
    if (!startTimeRef.current) return;
    const durationMin = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 60000));
    const today = getDateStr();
    const session: StudySession = { date: today, duration: durationMin };
    setSessions((prev) => [...prev, session]);
    setIsActive(false);
    setElapsed(0);
    startTimeRef.current = null;
    if (intervalRef.current) clearInterval(intervalRef.current);

    // Streak logic
    setStreakDate((prevDate) => {
      if (prevDate === today) {
        // Already studied today, no streak change
        setLastStreakResult((prev) => {
          const current = loadStreak();
          return { streak: current, increased: false };
        });
        return prevDate;
      }

      const yesterday = getYesterdayStr();
      if (prevDate === yesterday) {
        // Consecutive day
        setStreak((prev) => {
          const next = prev + 1;
          setLastStreakResult({ streak: next, increased: true });
          return next;
        });
      } else {
        // Gap — reset
        setStreak(1);
        setLastStreakResult({ streak: 1, increased: prevDate === null ? true : false });
      }
      return today;
    });
  }, []);

  // Metrics
  const now = new Date();
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const sevenDayStr = sevenDaysAgo.toISOString().split("T")[0];

  const recentSessions = sessions.filter((s) => s.date >= sevenDayStr);
  const activeDays = new Set(recentSessions.map((s) => s.date)).size;
  const avgDuration = recentSessions.length
    ? Math.round(recentSessions.reduce((sum, s) => sum + s.duration, 0) / recentSessions.length)
    : 0;

  const lastSessionDate = sessions.length
    ? sessions[sessions.length - 1].date
    : null;
  const daysSinceLastSession = lastSessionDate
    ? Math.floor((now.getTime() - new Date(lastSessionDate).getTime()) / 86400000)
    : null;

  const consistencyScore = Math.round((activeDays / 7) * 100);
  const isHighRisk =
    daysSinceLastSession !== null &&
    (daysSinceLastSession >= 2 || activeDays <= 3);

  return {
    sessions,
    isActive,
    elapsed,
    startSession,
    endSession,
    streak,
    lastStreakResult,
    metrics: {
      activeDays,
      avgDuration,
      daysSinceLastSession,
      consistencyScore,
      isHighRisk,
    },
  };
}
