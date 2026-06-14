import { getChannelById, getTeamsMap } from "../../services/dataService";
import type { Match } from "../../services/dataService";

export default function MatchCard({
  match,
  isFavorite,
  onFavorite,
}: {
  match: Match;
  isFavorite: boolean;
  onFavorite: (id: number) => void;
}) {
  const homeTeam = getTeamsMap()[match.homeTeam];
  const awayTeam = getTeamsMap()[match.awayTeam];
  const channels = match.channelIds
    .map((id) => getChannelById(id))
    .filter((ch): ch is NonNullable<typeof ch> => ch != null);

  return (
    <div className="rounded-lg bg-white p-4 shadow-sm transition-colors">
      {/* Top row: group + channels */}
      <div className="mb-1 flex items-start justify-between">
        <span className="text-sm font-semibold uppercase tracking-wide text-zinc-600">
          Grupo {match.group}
        </span>
        <div className="flex flex-wrap gap-1">
          {channels.map((ch) => (
            <span
              key={ch.id}
              className="rounded-full px-2 py-0.5 text-[10px] font-medium leading-tight"
              style={{
                border: `1.5px solid ${ch.color}`,
                color: ch.color,
              }}
            >
              {ch.name}
            </span>
          ))}
        </div>
      </div>

      {/* Hora + status */}
      <div className="mb-3 mt-2 flex items-center justify-between text-xs font-semibold">
        <span className="text-zinc-600">{match.time}</span>
        {match.status === "finished" && (
          <span className="text-zinc-900">Final</span>
        )}
        {match.status === "live" && (
          <span className="rounded-full bg-emerald-400 px-2 py-0.5 text-zinc-800">
            En vivo
          </span>
        )}
      </div>

      {/* Teams */}
      <div className="flex items-center justify-between gap-2">
        {/* Home */}
        <div className="flex flex-1 items-center gap-2">
          <img
            src={homeTeam?.flag}
            alt={homeTeam?.name}
            className="h-7 w-7 rounded-full object-cover"
          />
          <span className="truncate text-base font-bold text-zinc-800">
            {homeTeam?.name ?? match.homeTeam}
          </span>
        </div>

        {/* Score o VS */}
        <span className="rounded-md bg-[#08A845] px-3 py-1 text-lg font-bold text-white">
          {match.homeScore != undefined
            ? `${match.homeScore} - ${match.awayScore}`
            : "VS"}
        </span>
        {/* Away */}
        <div className="flex flex-1 items-center justify-end gap-2">
          <span className="truncate text-base font-bold text-zinc-800">
            {awayTeam?.name ?? match.awayTeam}
          </span>
          <img
            src={awayTeam?.flag}
            alt={awayTeam?.name}
            className="h-7 w-7 rounded-full object-cover"
          />
        </div>
      </div>

      {/* Bottom row: stadium + favorite */}
      <div className="mt-3 flex items-center justify-between">
        <span className="text-sm font-semibold text-zinc-600">
          Estadio {match.stadium}
        </span>
        <button
          onClick={() => onFavorite(match.id)}
          className="text-base transition-colors hover:text-yellow-500"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          {isFavorite ? "⭐" : "☆"}
        </button>
      </div>
    </div>
  );
}
