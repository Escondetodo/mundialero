import { getMatches } from "../services/dataService";
import MatchCard from "../components/features/MatchCard";
import { useAppStore } from "../store/AppStore";

export default function NewsPage() {
  const favoriteMatch = useAppStore((state) => state.favoriteMatch);
  const removeFavoriteMatch = useAppStore((state) => state.removeFavoriteMatch);

  const handleToggleFavorite = (id: number) => {
    if (favoriteMatch.includes(id)) {
      removeFavoriteMatch(id);
    }
  };

  const matches = getMatches();

  const favoriteList = matches.filter((match) =>
    favoriteMatch.includes(match.id),
  );

  return (
    <div>
      <h1 className="my-6 text-xl font-bold text-white">
        Mis partidos favoritos
      </h1>
      <div className="mt-4 flex flex-col gap-3">
        {favoriteList.map((favMatch) => (
          <MatchCard
            key={favMatch.id}
            match={favMatch}
            isFavorite={true}
            onFavorite={handleToggleFavorite}
          />
        ))}
      </div>
    </div>
  );
}
