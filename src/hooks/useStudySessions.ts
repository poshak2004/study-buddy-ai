import { useState, useEffect, useCallback, useRef } from "react";

export interface StudySession {
  date: string;
  duration: number; // minutes
}

const STORAGE_KEY = "study-sessions";

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

export function useStudySessions() {
  const [sessions, setSessions] = useState<StudySession[]>(loadSessions);
  const [isActive, setIsActive] = useState(false);
  const [elapsed, setElapsed] = useState(0); // seconds
  const startTimeRef = useRef<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    saveSessions(sessions);
  }, [sessions]);

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
    const session: StudySession = {
      date: new Date().toISOString().split("T")[0],
      duration: durationMin,
    };
    setSessions((prev) => [...prev, session]);
    setIsActive(false);
    setElapsed(0);
    startTimeRef.current = null;
    if (intervalRef.current) clearInterval(intervalRef.current);
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
    metrics: {
      activeDays,
      avgDuration,
      daysSinceLastSession,
      consistencyScore,
      isHighRisk,
    },
  };
}
