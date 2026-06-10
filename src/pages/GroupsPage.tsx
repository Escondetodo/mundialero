import { useState } from "react";
import GroupTable from "../components/features/GroupTable";
import { getGroupStandings } from "../services/dataService";

export default function GroupsPage() {
  const [section, setSection] = useState(0);

  const sections = [
    { label: "A-D", groups: ["A", "B", "C", "D"] },
    { label: "E-H", groups: ["E", "F", "G", "H"] },
    { label: "I-L", groups: ["I", "J", "K", "L"] },
  ];

  return (
    <div>
      <h1 className="mb-4 mt-6 text-xl font-bold text-white">Grupos</h1>
      {/* Group selector */}
      <div className="mb-8 flex flex-wrap gap-2 justify-center">
        {sections.map((s, i) => (
          <button
            key={i}
            onClick={() => setSection(i)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              section === i
                ? "bg-sushi text-mine-shaft"
                : "bg-white text-zinc-700 border border-zinc-200 hover:bg-zinc-100"
            }`}
          >
            Grupo {s.label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 justify-center mb-20">
        {sections[section].groups.map((g) => (
          <GroupTable
            key={g}
            groupName={g}
            standings={getGroupStandings().filter((s) => s.group === g)}
          />
        ))}
      </div>
    </div>
  );
}
