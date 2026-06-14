import { groupStandings, teamsMap, matches } from "../data/mockData";
import { channels } from "../data/channels";
import { fetchAllData } from "./api";
import type { Match, GroupStanding } from "../data/mockData";
import {useAppStore} from "../store/AppStore";

export let useApi = true;

let apiData: { matches: Match[], standings: GroupStanding[] } | null = null;

async function loadApiData() {
  if (apiData) return;
  try {
    const result = await fetchAllData();
    apiData = {
      matches: result.matchesMap,
      standings: result.groupsMap,
    };
    useAppStore.getState().bumpApiVersion();
  } catch {
    apiData = null;
  }
}

export function setUseApi(value: boolean) {
  useApi = value;
}

export type { Match, GroupStanding } from "../data/mockData";
export type { Channel } from "../data/channels";
export { getChannelById } from "../data/channels";
 
export function getMatches() {
  if (useApi) {
    loadApiData();
    return apiData?.matches ?? matches;
  }
  return matches;
}

export function getGroupStandings() {
  if (useApi) {
    loadApiData();
    return apiData?.standings ?? groupStandings;
  }
  return groupStandings;
}

export function getTeamsMap(){
    return teamsMap;
}

export function getChannels(){
    return channels;
}
