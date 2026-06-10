import { getTeamsMap, type GroupStanding } from "../../services/dataService";

export default function GroupTable({
  groupName,
  standings,
}: {
  groupName: string;
  standings: GroupStanding[];
}) {
  const sorted = [...standings].sort((a, b) => {
    if (b.pts !== a.pts) return b.pts - a.pts;
    if (b.gd !== a.gd) return b.gd - a.gd;
    if (b.gf !== a.gf) return b.gf - a.gf;
    return 0;
  });

  if (sorted.length === 0) {
    return (
      <p className="py-8 text-center text-oslo-gray">No teams in this group</p>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-sm">
      <table className="w-full text-sm text-zinc-800">
        <thead>
            <tr className="border-b border-zinc-200 text-xs uppercase text-oslo-gray">
            <th className="px-2 py-2 text-left">{"GRUPO" + groupName}</th>
            <th className="w-10 px-2 py-2 text-center">Pts</th>
            <th className="w-10 px-2 py-2 text-center">J</th>
            <th className="w-8 px-2 py-2 text-center">+/-</th>
            <th className="w-8 px-2 py-2 text-center">G</th>
            <th className="w-8 px-2 py-2 text-center">E</th>
            <th className="w-8 px-2 py-2 text-center">P</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((row, idx) => {
            const team = getTeamsMap()[row.teamId];
            const isTopTwo = idx < 2;
            const gd = row.gf - row.ga;
            return (
              <tr
                key={row.teamId}
                className={`border-b border-zinc-100 transition-colors ${
                  isTopTwo ? "border-l-2 border-l-sushi bg-sushi-10" : ""
                }`}
              >
                {/* 1 - Team */}
                  <td className="flex items-center gap-2 px-2 py-2">
                    <img
                      src={team?.flag}
                      alt={team?.name}
                      className="h-6 w-6 rounded-full object-cover"
                    />
                  <span className="truncate font-medium">
                    {team?.name ?? "Unknown"}
                  </span>
                </td>
                {/* 2 - Pts */}
                <td className="px-2 py-2 text-center font-bold">{row.pts}</td>
                {/* 3 - J */}
                <td className="px-2 py-2 text-center">{row.played}</td>
                {/* 4 - +/- */}
                <td
                  className={`px-2 py-2 text-center font-medium ${gd > 0 ? "text-sushi" : gd < 0 ? "text-red-400" : ""}`}
                >
                  {gd > 0 ? `+${gd}` : gd}
                </td>
                {/* 5 - G */}
                <td className="px-2 py-2 text-center">{row.won}</td>
                {/* 6 - E */}
                <td className="px-2 py-2 text-center">{row.drawn}</td>
                {/* 7 - P */}
                <td className="px-2 py-2 text-center">{row.lost}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
