import { groupStandings, teamsMap, matches } from "../data/mockData";
import { channels } from "../data/channels";

export type { Match, GroupStanding } from "../data/mockData";
export type { Channel } from "../data/channels";
export { getChannelById } from "../data/channels";
 
export function getMatches(){
    return matches;
}

export function getGroupStandings(){
    return groupStandings;
}

export function getTeamsMap(){
    return teamsMap;
}

export function getChannels(){
    return channels;
}
