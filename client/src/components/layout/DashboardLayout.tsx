import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { useTheme } from "@/lib/theme";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  ClipboardList, 
  Bell, 
  Calendar,
  BookOpen,
  DollarSign,
  CreditCard,
  Settings,
  LogOut,
  Moon,
  Sun,
  GraduationCap,
  User,
  ChevronDown,
  Award,
  Clock,
  CheckSquare,
  Upload
} from "lucide-react";
import schoolLogo from "@assets/school_1764669401414.jpg";

interface DashboardLayoutProps {
  children: ReactNode;
}

const roleMenuItems = {
  super_admin: [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: FileText, label: "Registration Forms", href: "/dashboard/forms" },
    { icon: ClipboardList, label: "Applications", href: "/dashboard/applications" },
    { icon: Users, label: "User Management", href: "/dashboard/users" },
    { icon: Bell, label: "Notices", href: "/dashboard/notices" },
    { icon: Award, label: "Alumni", href: "/dashboard/alumni" },
    { icon: BookOpen, label: "Teachers", href: "/dashboard/teachers-manage" },
    { icon: Settings, label: "Settings", href: "/dashboard/settings" },
  ],
  management: [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: DollarSign, label: "Payroll", href: "/dashboard/payroll" },
    { icon: Bell, label: "Notices", href: "/dashboard/notices" },
    { icon: CreditCard, label: "Fee Management", href: "/dashboard/fees" },
    { icon: Users, label: "Staff List", href: "/dashboard/staff" },
    { icon: CheckSquare, label: "Results Control", href: "/dashboard/results-control" },
  ],
  staff: [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: Calendar, label: "Timetable", href: "/dashboard/timetable" },
    { icon: BookOpen, label: "My Subjects", href: "/dashboard/subjects" },
    { icon: ClipboardList, label: "Enter Results", href: "/dashboard/results" },
    { icon: CreditCard, label: "Bank Details", href: "/dashboard/bank" },
    { icon: Bell, label: "Notices", href: "/dashboard/notices" },
  ],
  student: [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: Bell, label: "Notices", href: "/dashboard/notices" },
    { icon: Award, label: "My Results", href: "/dashboard/results" },
    { icon: CreditCard, label: "Fee Payment Info", href: "/dashboard/fees" },
  ],
};

const roleLabels = {
  super_admin: "Super Admin",
  management: "Management",
  staff: "Staff",
  student: "Student",
};

const roleBadgeVariants = {
  super_admin: "default" as const,
  management: "secondary" as const,
  staff: "outline" as const,
  student: "outline" as const,
};

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [location] = useLocation();

  if (!user) return null;

  const menuItems = roleMenuItems[user.role] || roleMenuItems.student;
  const roleLabel = roleLabels[user.role] || "User";

  const getInitials = (firstName: string, surname: string) => {
    return `${firstName?.[0] || ""}${surname?.[0] || ""}`.toUpperCase();
  };

  const sidebarStyle = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <SidebarProvider style={sidebarStyle as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <Sidebar>
          <SidebarHeader className="p-4 border-b border-sidebar-border">
            <Link href="/dashboard" className="flex items-center gap-3">
              <img 
                src={schoolLogo} 
                alt="Al-Furqan Logo" 
                className="h-10 w-10 rounded-full object-cover border-2 border-sidebar-primary"
                data-testid="img-sidebar-logo"
              />
              <div className="flex-1 min-w-0">
                <h1 className="font-bold text-sidebar-foreground truncate text-sm">Al-Furqan</h1>
                <p className="text-xs text-sidebar-foreground/70 truncate">Portal</p>
              </div>
            </Link>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Menu</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton 
                        asChild 
                        isActive={location === item.href}
                        data-testid={`link-menu-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        <Link href={item.href}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="p-4 border-t border-sidebar-border">
            <div className="flex items-center gap-3 p-2 rounded-lg bg-sidebar-accent/50">
              <Avatar className="h-9 w-9">
                <AvatarImage src={user.profileImage || undefined} />
                <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-sm">
                  {getInitials(user.firstName, user.surname)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">
                  {user.firstName} {user.surname}
                </p>
                <Badge 
                  variant={roleBadgeVariants[user.role]} 
                  className="text-xs mt-0.5"
                >
                  {roleLabel}
                </Badge>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="h-14 flex items-center justify-between gap-4 px-4 border-b border-border bg-background">
            <div className="flex items-center gap-2">
              <SidebarTrigger data-testid="button-sidebar-toggle" />
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                data-testid="button-dashboard-theme"
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2" data-testid="button-user-menu">
                    <Avatar className="h-7 w-7">
                      <AvatarImage src={user.profileImage || undefined} />
                      <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                        {getInitials(user.firstName, user.surname)}
                      </AvatarFallback>
                    </Avatar>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="font-medium text-sm">{user.firstName} {user.surname}</p>
                    <p className="text-xs text-muted-foreground">{user.uniqueId}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/" className="cursor-pointer">
                      <GraduationCap className="h-4 w-4 mr-2" />
                      Public Website
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-destructive cursor-pointer" data-testid="button-logout">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          <main className="flex-1 overflow-auto p-6 bg-background">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
