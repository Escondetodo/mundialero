import { useAppStore } from "../../store/AppStore";
import MatchCard from "./MatchCard";
import type { Match } from "../../services/dataService";

export default function MatchList({ matches }: { matches: Match[] }) {
  const addFavoriteMatch = useAppStore((state) => state.addFavoriteMatch);
  const removeFavoriteMatch = useAppStore((state) => state.removeFavoriteMatch);
  const favoriteMatch = useAppStore((state) => state.favoriteMatch);

  const handleToggleFavorite = (id: number) => {
    if (favoriteMatch.includes(id)) {
      removeFavoriteMatch(id);
    } else {
      addFavoriteMatch(id);
    }
  };

  if (matches.length === 0) {
    return (
      <p className="py-12 text-center text-zinc-400">
        No se encontraron partidos con los filtros seleccionados.
      </p>
    );
  }

  return (
    <div className="mt-4 flex flex-col gap-3">
      {matches.map((match) => (
        <MatchCard
          key={match.id}
          match={match}
          isFavorite={favoriteMatch.includes(match.id)}
          onFavorite={handleToggleFavorite}
        />
      ))}
    </div>
  );
}
