import { buildMatchChannelMap } from "../data/mockData";
import type { Match, GroupStanding } from "../data/mockData";

const proxyBase = "/api/proxy?path=";

export async function fetchAllData() {
  
  const [teamsRes, gamesRes,stadiumsRes, groupsRes] = await Promise.all([
    fetch(proxyBase + "get/teams"),
    fetch(proxyBase + "get/games"),
    fetch(proxyBase + "get/stadiums"),
    fetch(proxyBase + "get/groups"),
  ]);

  if (!teamsRes.ok || !gamesRes.ok || !stadiumsRes.ok || !groupsRes.ok){
    throw new Error("Error fetching data");
  }

  const teamsData = (await teamsRes.json()).teams;
  const gamesData = (await gamesRes.json()).games;
  const stadiumsData = (await stadiumsRes.json()).stadiums;
  const groupsData = (await groupsRes.json()).groups;

  const teamsMap = buildTeamMap(teamsData);
  const stadiumsMap = buildStadiumsMap(stadiumsData);
  const matchChannelMap = buildMatchChannelMap();
  const stadiumOffsetMap = buildStadiumOffsetMap(stadiumsData);
  const matchesMap = mapMatches(gamesData, teamsMap, stadiumsMap, stadiumOffsetMap, matchChannelMap);
  const groupsMap = mapGroupsData(groupsData,teamsMap);

  return { teamsMap, matchesMap, stadiumsMap, groupsMap };
}

export function buildTeamMap(teamsData: any[]) {

  const teamMap = new Map<number, string>();
  for (const team of teamsData) {
    teamMap.set(Number(team.id), team.fifa_code); 
  }
  return teamMap;
}

export function buildStadiumOffsetMap(stadiumsData: any[]): Map<number, number> {
  const map = new Map<number, number>();
  for (const stadium of stadiumsData) {
    const offset = stadiumUtcOffset(stadium);
    map.set(Number(stadium.id), offset);
  }
  return map;
}

export function buildStadiumsMap(stadiumsData:any[]){

  const stadiumsMap = new Map<number, string>();
  for (const stadium of stadiumsData) {
    stadiumsMap.set(Number(stadium.id), stadium.fifa_name); 
  }
  return stadiumsMap;
}

/** Diferencia en horas entre la hora local del estadio y ART (UTC-3).
 *  Mundial 2026: junio-julio, horario de verano en Norteamérica. */
function stadiumUtcOffset(stadium: { country_en: string; region?: string; city_en?: string }): number {
  if (stadium.country_en === "Mexico") return -6;               // sin DST
  if (stadium.country_en === "Canada" && stadium.city_en === "Vancouver") return -7;
  if (stadium.country_en === "Canada") return -4;               // Toronto
  if (stadium.region === "Western") return -7;                  // Seattle, LA, SF
  if (stadium.region === "Mountain") return -6;
  if (stadium.region === "Central") return -5;                  // Houston, Dallas, KC
  return -4; // Eastern (default)
}

/** Convierte local_date (MM/DD/YYYY HH:mm, hora local del estadio) a hora Argentina.
 *  Devuelve { date, time } en el mismo formato que mockData. */
function localToArt(localDate: string, stadiumUtcOffset: number): { date: string; time: string } {
  const [datePart, timePart] = localDate.split(" ");
  const [month, day, year] = datePart.split("/").map(Number);
  const [hours, minutes] = timePart.split(":").map(Number);

  // ART = local + (-3 - utcOffset) horas
  const diffHours = -3 - stadiumUtcOffset; // ej: Seattle -7 → -3-(-7)=+4
  const artDate = new Date(year, month - 1, day, hours + diffHours, minutes);

  const m = String(artDate.getMonth() + 1).padStart(2, "0");
  const d = String(artDate.getDate()).padStart(2, "0");
  const hh = String(artDate.getHours()).padStart(2, "0");
  const mm = String(artDate.getMinutes()).padStart(2, "0");
  return { date: `${d}/${m}/${year}`, time: `${hh}:${mm}` };
}

export function mapMatches(
  gamesData: any[],
  teamsMap: Map<number, string>,
  stadiumsMap: Map<number, string>,
  stadiumOffsetMap: Map<number, number>,
  matchChannelMap: Record<number, string[]>,
) {

  const matches: Match[] = [];
  for (const match of gamesData){
    matches.push({
    id: Number(match.id),
    homeTeam:teamsMap.get(Number(match.home_team_id)) ?? "???",
    awayTeam:teamsMap.get(Number(match.away_team_id)) ?? "???",
    channelIds: matchChannelMap[Number(match.id)] || [],
    stadium: stadiumsMap.get(Number(match.stadium_id)) ?? "???",
    group: match.group,
    ...localToArt(match.local_date, stadiumOffsetMap.get(Number(match.stadium_id)) ?? -4),
    homeScore: match.home_score != null ? Number(match.home_score) : undefined,
    awayScore: match.away_score != null ? Number(match.away_score) : undefined,
    status: match.time_elapsed === "finished" ? "finished" 
              : match.time_elapsed === "live" ? "live" 
              : "scheduled",
    })
  }
   return matches
}

export function mapGroupsData(groupsData:any[],teamsMap:Map<number,string>){
    const groups:GroupStanding[] = [];
    for (const group of groupsData){
        for(const team of group.teams){
            groups.push({
                group: group.name,
                teamId: teamsMap.get(Number(team.team_id)) ?? "???",
                played: Number(team.mp),
                won: Number(team.w),
                drawn: Number(team.d),
                lost: Number(team.l),
                gf: Number(team.gf),
                ga: Number(team.ga),
                pts: Number(team.pts),
                gd: Number(team.gd),
            })
        }
    }
    return groups
  }


