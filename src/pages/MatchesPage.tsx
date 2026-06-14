import FilterBar from "../components/features/FilterBar";
import MatchList from "../components/features/MatchList";
import { useMemo } from "react";
import {
  getMatches,
  getTeamsMap,
  getChannels,
  useApi,
} from "../services/dataService";
import { useAppStore } from "../store/AppStore";

export default function MatchesPage() {
  const selectedCountry = useAppStore((state) => state.selectedCountry);
  const selectedChannel = useAppStore((state) => state.selectedChannel);
  const selectedDay = useAppStore((state) => state.selectedDay);
  const apiVersion = useAppStore((state) => state.apiVersion);
  const toggleChannel = useAppStore((state) => state.toggleChannel);
  const setSelectedDay = useAppStore((state) => state.setSelectedDay);
  const setSelectedCountry = useAppStore((state) => state.setSelectedCountry);

  /** Unique match dates sorted chronologically */
  const matchDays = useMemo(() => {
    return [...new Set(getMatches().map((m) => m.date))].sort((a, b) => {
      const [dayA, monthA, yearA] = a.split("/").map(Number);
      const [dayB, monthB, yearB] = b.split("/").map(Number);
      return (
        new Date(yearA, monthA - 1, dayA).getTime() -
        new Date(yearB, monthB - 1, dayB).getTime()
      );
    });
  }, [apiVersion]);

  /** Unique countries derived from team data */
  const countries = useMemo(() => {
    return Object.values(getTeamsMap())
      .filter((t, i, arr) => arr.findIndex((t2) => t2.id === t.id) === i)
      .map((t) => ({ id: t.id, name: t.name, flag: t.flag }));
  }, [apiVersion]);

  const filteredMatches = getMatches().filter((match) => {
    if (selectedDay && match.date !== selectedDay) return false;
    if (
      selectedChannel.length > 0 &&
      !selectedChannel.some((ch) => match.channelIds.includes(ch))
    )
      return false;
    if (
      selectedCountry &&
      match.homeTeam !== selectedCountry &&
      match.awayTeam !== selectedCountry
    )
      return false;
    return true;
  });

  return (
    <div>
      <h1 className="mb-4 mt-6 text-3xl font-bold text-white">
        Partidos
        <span className="ml-3 inline-flex items-center gap-1.5 text-sm font-normal">
          <span
            className={`h-2.5 w-2.5 rounded-full ${useApi ? "bg-green-500 animate-pulse" : "bg-gray-400"}`}
          />
          {useApi ? "Live" : "Mock data"}
        </span>
      </h1>
      <FilterBar
        channels={getChannels()}
        selectedChannelIds={selectedChannel}
        onToggleChannel={toggleChannel}
        days={matchDays}
        selectedDay={selectedDay}
        onSelectDay={(day) => setSelectedDay(day ?? "")}
        countries={countries}
        selectedCountryId={selectedCountry}
        onSelectCountry={(id) => setSelectedCountry(id ?? "")}
      />
      <MatchList matches={filteredMatches} />
    </div>
  );
}
