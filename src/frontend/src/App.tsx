import Layout from "@/components/Layout";
import { useVyanAuth } from "@/hooks/use-vyan-auth";
import LoginPage from "@/pages/LoginPage";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  useLocation,
} from "@tanstack/react-router";
import { Suspense, lazy } from "react";

const DashboardPage = lazy(() => import("@/pages/DashboardPage"));
const AppsPage = lazy(() => import("@/pages/AppsPage"));
const UsersPage = lazy(() => import("@/pages/UsersPage"));
const MonitoringPage = lazy(() => import("@/pages/MonitoringPage"));
const NotificationsPage = lazy(() => import("@/pages/NotificationsPage"));
const IssuesPage = lazy(() => import("@/pages/IssuesPage"));
const UpdatesPage = lazy(() => import("@/pages/UpdatesPage"));
const EmailPage = lazy(() => import("@/pages/EmailPage"));
const SettingsPage = lazy(() => import("@/pages/SettingsPage"));

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  "/": { title: "Dashboard", subtitle: "VYAN Netra Command Center" },
  "/apps": {
    title: "Apps",
    subtitle: "Register, connect, and control every VYAN app",
  },
  "/users": { title: "Users", subtitle: "User management across apps" },
  "/monitoring": {
    title: "Monitoring",
    subtitle: "Real-time system health & alerts",
  },
  "/notifications": {
    title: "Notifications",
    subtitle: "System alerts & messages",
  },
  "/issues": { title: "Issues", subtitle: "Track and resolve platform issues" },
  "/updates": {
    title: "Updates",
    subtitle: "Deploy & schedule app updates",
  },
  "/email": { title: "Email", subtitle: "Compose and send to any app's users" },
  "/settings": { title: "Settings", subtitle: "Console configuration" },
};

function AppShell() {
  const location = useLocation();
  const meta = PAGE_TITLES[location.pathname] ?? PAGE_TITLES["/"];
  return (
    <Layout title={meta.title} subtitle={meta.subtitle}>
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-full min-h-[300px]">
            <div className="w-8 h-8 rounded-full border-2 border-[rgba(91,157,255,0.3)] border-t-blue-400 animate-spin" />
          </div>
        }
      >
        <Outlet />
      </Suspense>
    </Layout>
  );
}

const rootRoute = createRootRoute({ component: AppShell });

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: DashboardPage,
});
const appsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/apps",
  component: AppsPage,
});
const usersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/users",
  component: UsersPage,
});
const monitoringRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/monitoring",
  component: MonitoringPage,
});
const notificationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/notifications",
  component: NotificationsPage,
});
const issuesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/issues",
  component: IssuesPage,
});
const updatesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/updates",
  component: UpdatesPage,
});
const emailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/email",
  component: EmailPage,
});
const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/settings",
  component: SettingsPage,
});
const routeTree = rootRoute.addChildren([
  dashboardRoute,
  appsRoute,
  usersRoute,
  monitoringRoute,
  notificationsRoute,
  issuesRoute,
  updatesRoute,
  emailRoute,
  settingsRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  const { isAuthenticated, isLoading } = useVyanAuth();
  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#000" }}
      >
        <div className="w-8 h-8 rounded-full border-2 border-[rgba(91,157,255,0.3)] border-t-blue-400 animate-spin" />
      </div>
    );
  }
  if (!isAuthenticated) return <LoginPage />;
  return <RouterProvider router={router} />;
}
