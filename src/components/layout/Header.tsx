export default function Header() {
  return (
    <header className="flex items-center justify-center gap-3 border-b border-zinc-700 bg-mine-shaft py-4">
      <img
        src="/logo-mundial-2026.png"
        alt="Mundial 2026"
        className="h-7 w-7 object-contain"
      />
      <h1 className="text-xl font-bold text-white">Mundial 2026</h1>
    </header>
  );
}
