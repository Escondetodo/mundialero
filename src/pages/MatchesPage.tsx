import FilterBar from "../components/features/FilterBar";
import MatchList from "../components/features/MatchList";
import { getMatches, getTeamsMap, getChannels } from "../services/dataService";
import { useAppStore } from "../store/AppStore";

/** Unique match dates sorted chronologically */
const matchDays = [...new Set(getMatches().map((m) => m.date))].sort();

/** Unique countries derived from team data */
const countries = Object.values(getTeamsMap())
  .filter((t, i, arr) => arr.findIndex((t2) => t2.id === t.id) === i)
  .map((t) => ({ id: t.id, name: t.name, flag: t.flag }));

export default function MatchesPage() {
  const selectedCountry = useAppStore((state) => state.selectedCountry);
  const selectedChannel = useAppStore((state) => state.selectedChannel);
  const selectedDay = useAppStore((state) => state.selectedDay);
  const toggleChannel = useAppStore((state) => state.toggleChannel);
  const setSelectedDay = useAppStore((state) => state.setSelectedDay);
  const setSelectedCountry = useAppStore((state) => state.setSelectedCountry);

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
      <h1 className="mb-4 mt-6 text-3xl font-bold text-white">Partidos</h1>
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
