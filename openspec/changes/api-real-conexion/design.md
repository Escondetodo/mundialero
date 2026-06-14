# Design: API Real Conexión

## Technical Approach

Add a Vercel serverless proxy to bypass CORS, create an API data source that fetches and maps API responses to the existing domain model, and introduce a synchronous toggle in `dataService.ts` that routes between mock and real data. The `Match` interface gains optional score fields. `MatchCard` shows scores when available. All changes are backward-compatible: the `dataService.ts` sync signature is preserved so components need no structural changes.

## Architecture Decisions

### Decision: Vercel serverless proxy

| Option | Tradeoff | Decision |
|--------|----------|----------|
| `api/proxy.js` — single file, auto-deployed by Vercel | Works in all envs, zero infra, one file | **Chosen** |
| Vite dev proxy | Dev only; breaks in preview/prod | Rejected |
| Browser extension CORS bypass | User-install, not deployable | Rejected |

**Rationale**: Vercel auto-deploys `api/` files as serverless functions. The existing catch-all rewrite does not interfere — Vercel prioritizes serverless routes over rewrites.

### Decision: Synchronous cache + toggle

**Choice**: `dataService.ts` keeps sync fn signatures. When `useApi = true`, the first `getMatches()` call triggers async fetch and populates an internal cache. While loading (or on failure), mock data is returned silently. `isLoading` is exported as a boolean. On fetch completion, a Zustand version counter bumps to trigger re-renders in subscribed components.

**Rationale**: "Components stay unchanged" per the proposal. Making fns async would change every consumer. The Zustand store already powers filter state — bumping a version counter on fetch causes natural re-renders. API failures always fall back to mock data; no errors surface to the UI.

### Decision: Team ID mapping via name matching

**Choice**: Fetch `/get/teams`, build `Map<number, string>` by matching `team.name_en` (English) against `teamsMap` entries' Spanish display names → 3-letter FIFA code.

**Rationale**: The API uses numeric team IDs, the app uses 3-letter codes. `/get/teams` is the source of truth for the ID set. English name matching works for all 48 teams; any unmapped team triggers per-entity fallback to mock data.

### Decision: Optional score fields on Match

**Choice**: Add `homeScore?`, `awayScore?`, `status?` as optional fields on the existing `Match` interface.

**Alternative**: New `LiveMatch` interface or union type → rejected because it doubles the types and breaks consumers.

**Rationale**: Optional = backward compatible. Mock data has no scores. `MatchCard` checks presence of `homeScore` to decide render path.

## Data Flow

```
worldcup26.ir ──HTTPS──→ api/proxy.js (Vercel) ──CORS──→ api.ts
                                     │                       │
                               ?path=get/teams        Map<number,string>
                               ?path=get/games        Match[] + scores
                               ?path=get/groups       GroupStanding[]
                                                            │
                                                    dataService.ts (toggle)
                                                     │          │
                                               useApi=true  useApi=false
                                                     │          │
                                               api cache ──┐  mockData
                                                     │    │    │
                                                     └────┴────┘
                                                          │
                                                   getMatches() sync
                                                          │
                                                    Pages / Components
```

Channel data from `channels.ts` is merged in `api.ts` post-fetch using match `id` as the key — static, user-curated enrichment over live data.

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `api/proxy.js` | Create | Vercel serverless fn: forwards `?path=` to worldcup26.ir, adds CORS headers |
| `src/services/api.ts` | Create | Fetch, map, cache layer. Fetches 3 endpoints, builds team mapper, merges channels |
| `src/services/dataService.ts` | Modify | Add `useApi` toggle, internal cache, `isLoading`, version counter. Route `getMatches`/`getGroupStandings` based on toggle |
| `src/data/mockData.ts` | Modify | Add optional `homeScore?`, `awayScore?`, `status?` to `Match` interface |
| `src/components/features/MatchCard.tsx` | Modify | Show `homeScore - awayScore` when available (else `time`). Show status badge |
| `vercel.json` | Unchanged | `api/` auto-detected, prioritized over catch-all rewrite |

## Interfaces / Contracts

### Extended Match interface

```typescript
interface Match {
  id: number;
  homeTeam: string;
  awayTeam: string;
  date: string;
  time: string;
  channelIds: string[];
  stadium: string;
  group: string;
  homeScore?: number;        // NEW — undefined for future fixtures
  awayScore?: number;        // NEW
  status?: 'scheduled' | 'live' | 'finished';  // NEW
}
```

### api.ts contract (internal)

```typescript
type TeamIdMap = Map<number, string>;  // numeric API ID → FIFA 3-letter code
async function buildTeamMap(proxyBase: string): Promise<TeamIdMap>;
async function fetchMatches(proxyBase: string, teamMap: TeamIdMap): Promise<Match[]>;
async function fetchStandings(proxyBase: string, teamMap: TeamIdMap): Promise<GroupStanding[]>;
```

### Proxy API contract

```
GET /api/proxy.js?path=get/games  → 200 JSON(worldcup26.ir/games)
GET /api/proxy.js?path=get/groups → 200 JSON(worldcup26.ir/groups)
GET /api/proxy.js?path=get/teams  → 200 JSON(worldcup26.ir/teams)
GET /api/proxy.js                 → 400 { "error": "Missing 'path' query parameter" }
Any upstream failure              → { "error": "...", "status": <code> } with same status
OPTIONS /api/proxy.js             → 200 with CORS headers, no body
```

## Open Questions

- None. All decisions are documented and align with the specs and proposal.
