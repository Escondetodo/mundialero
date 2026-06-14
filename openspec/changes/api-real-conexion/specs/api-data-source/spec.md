# api-data-source Specification

## Purpose

Fetch live data from the worldcup26.ir API (via the proxy), map it to the app's domain model (`Match`, `GroupStanding`), merge channel data, and provide a toggle between mock and API data in `dataService.ts`.

## Requirements

### Requirement: Fetch and map matches

The system MUST fetch `/get/games` via the proxy and map each game to the `Match` interface. The mapped object SHOULD include `homeScore?`, `awayScore?`, and `status?` as optional fields when scores are available.

#### Scenario: Matches with scores

- GIVEN the API returns games with `home_score` and `away_score` set
- WHEN the data source maps the response
- THEN each `Match` MUST include `homeScore`, `awayScore`, and `status`
- AND the `homeTeam`/`awayTeam` values MUST be 3-letter FIFA codes resolved from numeric team IDs using `/get/teams`

#### Scenario: Match without scores (future fixture)

- GIVEN the API returns a game where `home_score` is `null`
- WHEN the data source maps the response
- THEN `homeScore` and `awayScore` MUST be `undefined`
- AND `status` MUST be `"scheduled"`

### Requirement: Fetch and map group standings

The system MUST fetch `/get/groups` via the proxy and map each entry to the `GroupStanding` interface.

#### Scenario: Group standings populated

- GIVEN the API returns standings with `played`, `wins`, `draws`, `losses`, `goals_for`, `goals_against`, `points`
- WHEN the data source maps the response
- THEN it MUST compute `gd` as `goals_for - goals_against`
- AND resolve numeric team IDs to 3-letter FIFA codes

### Requirement: Resolve numeric team IDs to FIFA codes

The system MUST fetch `/get/teams` on startup and build a `Map<number, string>` by matching `team.name_en` against names in `teamsMap`. If a team cannot be mapped, the system SHOULD fall back to mock data for that entity.

#### Scenario: Team ID resolved

- GIVEN `/get/teams` returns `{ id: 7, name_en: "Brazil" }`
- WHEN the mapper searches `teamsMap` by name
- THEN it MUST return `"BRA"`

### Requirement: Merge channel data

After fetching and mapping matches, the system MUST overlay `channelIds` from the static `channels.ts` map using the match `id` as key.

#### Scenario: Channels applied to API matches

- GIVEN `channels.ts` has `{ 1: ["dsports", "telefe"] }`
- WHEN the merge runs on match with `id: 1`
- THEN `match.channelIds` MUST equal `["dsports", "telefe"]`

### Requirement: Toggle between mock and API

`dataService.ts` MUST expose a `useApi` boolean. When `true`, `getMatches()` and `getGroupStandings()` MUST return API data. When `false`, they MUST return mock data unchanged.

#### Scenario: Toggle to API mode

- GIVEN `useApi` is `true`
- WHEN any page calls `getMatches()`
- THEN the system MUST fetch from the proxy and return mapped `Match[]`

#### Scenario: Toggle back to mock

- GIVEN `useApi` is `false`
- WHEN any page calls `getMatches()`
- THEN it MUST return the original mock `matches` array identically

### Requirement: Handle API errors gracefully

If any API call fails, the system MUST silently return mock data. No error should bubble to the UI.

#### Scenario: API unreachable

- GIVEN the proxy returns a 502
- WHEN `getMatches()` is called with `useApi: true`
- THEN it MUST return mock `matches` without logging to the console

### Requirement: Indicate loading state

When `useApi` is `true` and data is being fetched, the system MAY expose an `isLoading` boolean so the UI can show a loading indicator.

#### Scenario: Loading during fetch

- GIVEN the API fetch has started but not completed
- WHEN a component checks `isLoading`
- THEN it MUST be `true`
- AND the app MAY render a spinner or skeleton
