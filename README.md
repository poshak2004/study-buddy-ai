# Study Buddy AI

A minimal study-habit tracker that **predicts drop-off before it happens** and asks an LLM for one concrete fix.

Most study apps count streaks. This one watches for the pattern that comes before quitting: shorter sessions, fewer active days, longer gaps.

## What it does

- **Session timer** with an optional intent before you start and a focused / distracted reflection after
- **7-day metrics:** active days, average session length, days since last session, consistency score
- **Drop-off risk flag:** a deterministic rule rather than a model, so it's explainable

  ```ts
  isHighRisk = daysSinceLastSession >= 2 || activeDays <= 3   // over the last 7 days
  ```

- **AI insight:** a Supabase edge function sends only the three aggregate numbers to an LLM. It returns a pattern, a risk level and *one* actionable suggestion, and handles rate limits (429) and exhausted credits (402)
- **Streaks** and session history

## Design choices

- **Deterministic rule first, LLM second.** The risk flag never depends on a model; the LLM only explains it and coaches.
- **Minimal data to the model.** Raw sessions and reflections stay in the browser (localStorage). The edge function receives aggregates only.

## Stack

React · TypeScript · Vite · Tailwind / shadcn-ui · Supabase Edge Functions (Deno) · Lovable AI gateway · Vitest + Playwright config

## Run it

```bash
npm install
npm run dev
```

The AI insight needs the `study-insight` edge function deployed with `LOVABLE_API_KEY` set. Everything else works offline.

---

<sub>Scaffolded with Lovable, then extended by hand.</sub>
