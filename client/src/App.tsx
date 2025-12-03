import { Switch, Route, Redirect, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/lib/auth";
import { ThemeProvider } from "@/lib/theme";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import NotFound from "@/pages/not-found";
import { useEffect } from "react";

import Home from "@/pages/Home";
import About from "@/pages/About";
import Login from "@/pages/Login";
import Registration from "@/pages/Registration";
import Alumni from "@/pages/Alumni";
import Teachers from "@/pages/Teachers";

import SuperAdminDashboard from "@/pages/dashboard/SuperAdminDashboard";
import ManagementDashboard from "@/pages/dashboard/ManagementDashboard";
import StaffDashboard from "@/pages/dashboard/StaffDashboard";
import StudentDashboard from "@/pages/dashboard/StudentDashboard";
import Applications from "@/pages/dashboard/Applications";
import RegistrationForms from "@/pages/dashboard/RegistrationForms";
import Users from "@/pages/dashboard/Users";
import Notices from "@/pages/dashboard/Notices";
import BankDetails from "@/pages/dashboard/BankDetails";
import Results from "@/pages/dashboard/Results";
import Payroll from "@/pages/dashboard/Payroll";
import Settings from "@/pages/dashboard/Settings";
import Timetable from "@/pages/dashboard/Timetable";
import FeeStructures from "@/pages/dashboard/FeeStructures";
import { Loader2 } from "lucide-react";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setLocation("/login");
    }
  }, [isLoading, isAuthenticated, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

function DashboardRouter() {
  const { user } = useAuth();

  if (!user) return null;

  const getDashboardComponent = () => {
    switch (user.role) {
      case "super_admin":
        return <SuperAdminDashboard />;
      case "management":
        return <ManagementDashboard />;
      case "staff":
        return <StaffDashboard />;
      case "student":
        return <StudentDashboard />;
      default:
        return <StudentDashboard />;
    }
  };

  return (
    <DashboardLayout>
      <Switch>
        <Route path="/dashboard" component={() => getDashboardComponent()} />
        <Route path="/dashboard/forms" component={RegistrationForms} />
        <Route path="/dashboard/applications" component={Applications} />
        <Route path="/dashboard/users" component={Users} />
        <Route path="/dashboard/staff" component={Users} />
        <Route path="/dashboard/notices" component={Notices} />
        <Route path="/dashboard/bank" component={BankDetails} />
        <Route path="/dashboard/results" component={Results} />
        <Route path="/dashboard/results-control" component={Settings} />
        <Route path="/dashboard/payroll" component={Payroll} />
        <Route path="/dashboard/settings" component={Settings} />
        <Route path="/dashboard/timetable" component={Timetable} />
        <Route path="/dashboard/fees" component={FeeStructures} />
        <Route path="/dashboard/subjects" component={Timetable} />
        <Route path="/dashboard/alumni" component={Alumni} />
        <Route path="/dashboard/teachers-manage" component={Teachers} />
        <Route component={() => <Redirect to="/dashboard" />} />
      </Switch>
    </DashboardLayout>
  );
}

function PublicRouter() {
  return (
    <PublicLayout>
      <Switch>
        <Route path="/">{() => <Home />}</Route>
        <Route path="/about" component={About} />
        <Route path="/login" component={Login} />
        <Route path="/alumni" component={Alumni} />
        <Route path="/teachers" component={Teachers} />
        <Route path="/registration" component={Registration} />
        <Route component={NotFound} />
      </Switch>
    </PublicLayout>
  );
}

function Router() {
  const [location] = useLocation();

  if (location.startsWith("/dashboard")) {
    return (
      <Route>
        <DashboardRouter />
      </Route>
    );
  }

  return <PublicRouter />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
