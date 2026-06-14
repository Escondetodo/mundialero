# Proposal: API Real Conexión

## Intent

Replace static mockData with live data from the worldcup26.ir API so the app shows real 2026 World Cup matches, standings, and teams instead of hardcoded fixtures. Keep channels data as user-owned enrichment. Add a simple toggle to switch between mock and API without breaking existing pages.

## Scope

### In Scope
- Vercel serverless proxy (`api/proxy.js`) to bypass missing CORS headers on worldcup26.ir
- API data source (`src/services/api.ts`) — fetches via proxy, maps API responses to existing `Match` and `GroupStanding` interfaces
- Numeric team ID → 3-letter FIFA code mapper (built from `/get/teams` endpoint + existing `teamsMap` names)
- Stadium ID → name mapper (derived from API data)
- Channel merge layer: keep existing `channels.ts` mapping (matchId → channelIds), merge after API fetch
- Feature toggle in `dataService.ts` — switch between mock and API via a boolean/flag
- Deploy proxy to Vercel alongside the app
- In-app "live data" indicator on the matches page

### Out of Scope
- Tests (no test framework installed yet)
- Live score polling or real-time updates (WebSocket, SSE, etc.)
- Notifications
- Any UI changes beyond the live indicator
- Auth or API keys (reads are public)
- Changing existing interfaces (`Match`, `GroupStanding`, `Team`)

## Capabilities

### New Capabilities
- `api-proxy`: Vercel serverless function forwarding requests to worldcup26.ir, resolving CORS server-side
- `api-data-source`: Fetch, map, and cache API data into the app's domain model

### Modified Capabilities
None — `openspec/specs/` is empty; no existing capability specs to update.

## Approach

1. **Proxy**: Create `api/proxy.js` — a Vercel serverless function that receives a `?path=` param and forwards GET requests to `https://worldcup26.ir/{path}`, adding CORS headers in the response.
2. **Teams mapper**: On startup, fetch `/get/teams` via proxy, build a `Map<number, string>` (API team ID → FIFA 3-letter code) by matching `team.name_en` against `teamsMap` names.
3. **API service** (`src/services/api.ts`): Fetch `/get/games` and `/get/groups`, map fields to our `Match`/`GroupStanding` interfaces using the teams mapper and a stadium name lookup derived from API data.
4. **Channel merge**: After API fetch, apply `channelIds` from a static map (external source, user-curated) based on match IDs.
5. **Toggle**: Add `useApi: boolean` to `dataService.ts` — when `true`, calls `api.ts`; when `false`, returns mock data as today. Components stay unchanged.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `api/proxy.js` | New | Vercel serverless CORS proxy |
| `src/services/api.ts` | New | API fetch, mapping, caching layer |
| `src/services/dataService.ts` | Modified | Add toggle logic, route to mock or API |
| `src/data/mockData.ts` | None | Unchanged — still source for mock mode |
| `src/data/channels.ts` | None | Unchanged — merge layer reads from here |
| `vercel.json` | Modified | Add `api/` directory to build config if needed |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| worldcup26.ir changes API shape | Low | Add adapter layer — one place to remap fields |
| Proxy cold-start latency on first request | Med | Vercel serverless functions warm up fast; acceptable for non-real-time |
| Mismatch between API team names and `teamsMap` names | Med | Build mapper from `/get/teams` endpoint (source of truth); fall back to mock data on unmapped teams |
| API goes down before/during World Cup | Low | Mock data fallback is always available via toggle |

## Rollback Plan

Set `useApi = false` in `dataService.ts` to restore mock-only behavior immediately. If the proxy has a bug, remove or comment out the `api/proxy.js` file and the Vercel deployment rebuilds without it. No data loss — mock data is untouched.

## Dependencies

- worldcup26.ir API (public, no auth)
- Vercel deployment (for the proxy function to work)

## Success Criteria

- [ ] App builds with `pnpm build` after all changes
- [ ] With `useApi = true`, match list, group standings, and team names render from API data
- [ ] Toggling back to `useApi = false` shows mock data identically
- [ ] No TypeScript errors in new or modified files
- [ ] API proxy returns data when deployed to Vercel preview
