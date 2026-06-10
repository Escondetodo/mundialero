import { NavLink } from "react-router";

const tabs = [
  { to: "/matches", label: "Partidos" },
  { to: "/groups", label: "Grupos" },
  { to: "/news", label: "Noticias" },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t border-zinc-700 bg-mine-shaft">
      <div className="mx-auto flex max-w-lg justify-around">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              `flex-1 py-3 text-center text-sm font-medium transition-colors ${
                isActive
                  ? "text-sushi"
                  : "text-zinc-400 hover:text-zinc-200"
              }`
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
