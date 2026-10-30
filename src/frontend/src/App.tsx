import Layout from "@/components/Layout";
import { useVyanAuth } from "@/hooks/use-vyan-auth";
import LoginPage from "@/pages/LoginPage";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
  useLocation,
} from "@tanstack/react-router";
import { Suspense, lazy } from "react";

const DashboardPage = lazy(() => import("@/pages/DashboardPage"));
const AppConsolePage = lazy(() => import("@/pages/AppConsolePage"));
const ClientPage = lazy(() => import("@/pages/ClientPage"));
const UsersPage = lazy(() => import("@/pages/UsersPage"));
const MonitoringPage = lazy(() => import("@/pages/MonitoringPage"));
const NotificationsPage = lazy(() => import("@/pages/NotificationsPage"));
const IssuesPage = lazy(() => import("@/pages/IssuesPage"));
const UpdatesPage = lazy(() => import("@/pages/UpdatesPage"));
const EmailPage = lazy(() => import("@/pages/EmailPage"));
const SettingsPage = lazy(() => import("@/pages/SettingsPage"));

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  "/": { title: "Dashboard", subtitle: "VYAN Netra Command Center" },
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
  const meta = location.pathname.startsWith("/apps/")
    ? { title: "App console", subtitle: "Controls, live figures and activity" }
    : location.pathname.startsWith("/clients/")
      ? { title: "Client", subtitle: "Apps and websites built for this client" }
      : (PAGE_TITLES[location.pathname] ?? PAGE_TITLES["/"]);
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
const appConsoleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/apps/$appId",
  component: AppConsolePage,
});
const clientRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/clients/$clientId",
  component: ClientPage,
});
// The old Apps registry page is gone: apps live on the dashboard and each has
// its own console. Anything still linking to /apps lands on the dashboard.
const appsRedirectRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/apps",
  beforeLoad: () => {
    throw redirect({ to: "/" });
  },
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
  appConsoleRoute,
  clientRoute,
  appsRedirectRoute,
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
