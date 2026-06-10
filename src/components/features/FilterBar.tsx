import * as Popover from "@radix-ui/react-popover";
import * as Select from "@radix-ui/react-select";
import type { Channel } from "../../services/dataService";

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className={className}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export default function FilterBar({
  channels,
  selectedChannelIds,
  onToggleChannel,
  days,
  selectedDay,
  onSelectDay,
  countries,
  selectedCountryId,
  onSelectCountry,
}: {
  channels: Channel[];
  selectedChannelIds: string[];
  onToggleChannel: (id: string) => void;
  days: string[];
  selectedDay: string;
  onSelectDay: (day: string | null) => void;
  countries: { id: string; name: string; flag: string }[];
  selectedCountryId: string;
  onSelectCountry: (id: string | null) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      {/* Channel chips */}
      <div>
        <h2 className="mb-4 text-base font-bold uppercase tracking-wide text-zinc-400">
          Canales
        </h2>
        <div className="flex flex-wrap gap-2 mb-2">
          {channels.map((ch) => (
            <button
              key={ch.id}
              onClick={() => onToggleChannel(ch.id)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                selectedChannelIds.includes(ch.id)
                  ? "bg-sushi text-mine-shaft"
                  : "bg-white text-zinc-500 border border-zinc-300 hover:bg-zinc-100"
              }`}
            >
              {ch.name}
            </button>
          ))}
        </div>
      </div>

      {/* Date + Country filters */}
      <div className="flex flex-wrap items-center gap-2 mb-2">
        {/* Day filter */}
        <Popover.Root>
          <Popover.Trigger className="flex items-center gap-1 rounded-md bg-white px-3 py-1.5 text-sm font-medium text-zinc-700 shadow-sm transition-colors hover:bg-zinc-100 min-w-[130px]">
            <span className="flex-1 truncate">{selectedDay || "Día"}</span>
            <ChevronDown className="h-4 w-4 shrink-0" />
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content
              align="start"
              sideOffset={4}
              className="z-50 max-h-28 overflow-y-auto rounded-lg bg-white p-1 shadow-lg w-[var(--radix-popover-trigger-width)]"
            >
            <button
              onClick={() => onSelectDay(null)}
              className="w-full rounded-md px-2 py-0.5 text-left text-xs text-zinc-500 hover:bg-sushi-10"
            >
              Todos los dias
            </button>
            {days.map((day) => (
              <button
                key={day}
                onClick={() => onSelectDay(day)}
                className={`w-full rounded-md px-2 py-0.5 text-left text-xs ${
                  selectedDay === day
                    ? "bg-sushi text-mine-shaft font-medium"
                    : "text-zinc-700 hover:bg-sushi-10"
                }`}
              >
                {day}
              </button>
            ))}
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>

        {/* Country filter */}
        <Select.Root
          value={selectedCountryId || undefined}
          onValueChange={(val) => onSelectCountry(val === "all" ? null : val)}
        >
          <Select.Trigger className="flex items-center gap-1 rounded-md bg-white px-3 py-1.5 text-sm font-medium text-zinc-700 shadow-sm transition-colors hover:bg-zinc-100">
            <Select.Value placeholder="Selecciones" />
            <Select.Icon>
              <ChevronDown className="h-4 w-4" />
            </Select.Icon>
          </Select.Trigger>
          <Select.Portal>
            <Select.Content className="z-50 max-h-60 overflow-y-auto rounded-lg bg-white shadow-lg">
              <Select.Viewport className="p-1">
                <Select.Item
                  value="all"
                  className="rounded-md px-3 py-1.5 text-sm text-zinc-500 hover:bg-sushi-10"
                >
                  <Select.ItemText>Todas las selecciones</Select.ItemText>
                </Select.Item>
                {countries.map((c) => (
                  <Select.Item
                    key={c.id}
                    value={c.id}
                    className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm text-zinc-700 hover:bg-sushi-10"
                  >
                    <img src={c.flag} alt="" className="h-4 w-4 rounded-full" />
                    <Select.ItemText>{c.name}</Select.ItemText>
                  </Select.Item>
                ))}
              </Select.Viewport>
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      </div>
    </div>
  );
}
