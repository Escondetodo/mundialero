import { createBrowserRouter, RouterProvider, Navigate } from "react-router";
import AppLayout from "./components/layout/AppLayout";
import MatchesPage from "./pages/MatchesPage";
import GroupsPage from "./pages/GroupsPage";
import NewsPage from "./pages/NewsPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to="/matches" replace /> },
      { path: "matches", element: <MatchesPage /> },
      { path: "groups", element: <GroupsPage /> },
      { path: "news", element: <NewsPage /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
