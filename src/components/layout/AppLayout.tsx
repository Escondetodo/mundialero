import { Outlet } from "react-router";
import Header from "./Header";
import BottomNav from "./BottomNav";

export default function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col brand-gradient">
      <Header />
      <main className="mx-auto w-full max-w-[768px] lg:max-w-none flex-1 px-4 pb-24">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
