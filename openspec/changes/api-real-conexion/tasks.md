# Tasks: API Real Conexión

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~150-170 |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | ask-on-risk |
| Chain strategy | pending |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: pending
400-line budget risk: Low

## Phase 1: Infrastructure

- [x] 1.1 **Create `api/proxy.js`** — Vercel serverless fn forwarding `?path=` to worldcup26.ir with CORS headers, OPTIONS preflight, 400 on missing path, 502 on upstream failure _(merged via PR#1)_
- [x] 1.2 **Add optional score fields to `Match`** in `src/data/mockData.ts` — `homeScore?`, `awayScore?`, `status?` on the interface _(merged from match-score-fields)_

## Phase 2: Core

- [x] 2.1 **Create `src/services/api.ts`** — fetch `/get/teams`, build team ID→FIFA-code mapper via name matching; fetch `/get/games` and `/get/groups`, map to `Match[]`/`GroupStanding[]`; merge channelIds from `channels.ts`; expose `fetchAllData(proxyBase)`
- [x] 2.2 **Wire `dataService.ts`** — add `useApi` toggle, internal sync cache (loaded on first call), `isLoading` export, route `getMatches`/`getGroupStandings` based on toggle, fall back to mock on API failure
- [x] 2.3 **Add version counter to `AppStore.ts`** — `apiVersion: number` field + `bumpApiVersion()` action; `dataService.ts` calls it after successful API fetch to trigger re-renders

## Phase 3: UI

- [x] 3.1 **Update `MatchCard.tsx`** — show `homeScore - awayScore` when `homeScore` is defined; show status badge (`● Live`, `✓ Final`, or time fallback); keep time display for scheduled matches

## Phase 4: Polish

- [x] 4.1 **Add live data indicator** on matches page — green pulsing dot + "Live" text when `isLoading` is false and `useApi` is true; grey dot + "Mock data" otherwise

## Phase 5: Fixes

- [x] 5.1 **Fix CORS en proxy** — manejar OPTIONS preflight (200 + CORS headers, sin body) y agregar `Access-Control-Allow-Origin: *` en todas las respuestas de error (400, 500, 502)
- [x] 5.2 **Merge canales en api.ts** — extraer matchChannelMap de mockData.ts, mergear channelIds post-fetch en `mapMatches()`
- [x] 5.3 **Convertir horario a Argentina** — transformar `local_date` (hora local del estadio) a ART (UTC-3) usando mapping stadium_id → timezone offset
- [x] 5.4 **Skeleton loading** — crear `SkeletonMatchCard.tsx` como componente visual. Pendiente: conectar lógica en MatchesPage (usar `isLoading` de dataService).
