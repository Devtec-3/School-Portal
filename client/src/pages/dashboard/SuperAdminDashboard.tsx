import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { 
  Users, 
  FileText, 
  ClipboardList, 
  Bell, 
  CheckCircle,
  Clock,
  XCircle,
  ArrowRight,
  TrendingUp
} from "lucide-react";
import type { RegistrationApplication, User, Notice } from "@shared/schema";

export default function SuperAdminDashboard() {
  const { data: applications } = useQuery<RegistrationApplication[]>({
    queryKey: ["/api/registration-applications"],
  });

  const { data: users } = useQuery<User[]>({
    queryKey: ["/api/users"],
  });

  const { data: notices } = useQuery<Notice[]>({
    queryKey: ["/api/notices"],
  });

  const pendingApplications = applications?.filter(a => a.status === "pending") || [];
  const approvedApplications = applications?.filter(a => a.status === "approved") || [];
  const rejectedApplications = applications?.filter(a => a.status === "rejected") || [];
  
  const totalStudents = users?.filter(u => u.role === "student").length || 0;
  const totalStaff = users?.filter(u => u.role === "staff").length || 0;
  const activeNotices = notices?.filter(n => n.isPublished).length || 0;

  const stats = [
    { 
      title: "Pending Applications", 
      value: pendingApplications.length, 
      icon: Clock, 
      color: "text-accent-foreground",
      bgColor: "bg-accent/20",
      href: "/dashboard/applications"
    },
    { 
      title: "Total Students", 
      value: totalStudents, 
      icon: Users, 
      color: "text-chart-1",
      bgColor: "bg-chart-1/20",
      href: "/dashboard/users"
    },
    { 
      title: "Total Staff", 
      value: totalStaff, 
      icon: Users, 
      color: "text-primary",
      bgColor: "bg-primary/20",
      href: "/dashboard/users"
    },
    { 
      title: "Active Notices", 
      value: activeNotices, 
      icon: Bell, 
      color: "text-chart-4",
      bgColor: "bg-chart-4/20",
      href: "/dashboard/notices"
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground" data-testid="text-dashboard-title">
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          Welcome back! Here's an overview of your school portal.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Link href={stat.href} key={index}>
            <Card className="hover-elevate cursor-pointer" data-testid={`stat-card-${index}`}>
              <CardContent className="p-4 md:p-6">
                <div className="flex items-start justify-between gap-2">
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <TrendingUp className="h-4 w-4 text-chart-4" />
                </div>
                <p className="text-2xl md:text-3xl font-bold text-foreground mt-3">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.title}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-4">
            <div>
              <CardTitle className="text-lg">Recent Applications</CardTitle>
              <CardDescription>Pending registration applications</CardDescription>
            </div>
            <Link href="/dashboard/applications">
              <Button variant="ghost" size="sm">
                View All
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {pendingApplications.length > 0 ? (
              <div className="space-y-3">
                {pendingApplications.slice(0, 5).map((app) => (
                  <div 
                    key={app.id} 
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover-elevate"
                    data-testid={`application-item-${app.id}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-accent-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{app.applicantName}</p>
                        <p className="text-sm text-muted-foreground">{app.applicationType.replace(/_/g, " ")}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-accent/10">
                      <Clock className="h-3 w-3 mr-1" />
                      Pending
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-chart-4 mx-auto mb-3" />
                <p className="text-muted-foreground">No pending applications</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-4">
            <div>
              <CardTitle className="text-lg">Application Stats</CardTitle>
              <CardDescription>Overview of all applications</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-accent/10">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-accent-foreground" />
                  <span className="text-foreground">Pending</span>
                </div>
                <span className="text-2xl font-bold text-foreground">{pendingApplications.length}</span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-chart-4/10">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-chart-4" />
                  <span className="text-foreground">Approved</span>
                </div>
                <span className="text-2xl font-bold text-foreground">{approvedApplications.length}</span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-destructive/10">
                <div className="flex items-center gap-3">
                  <XCircle className="h-5 w-5 text-destructive" />
                  <span className="text-foreground">Rejected</span>
                </div>
                <span className="text-2xl font-bold text-foreground">{rejectedApplications.length}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Link href="/dashboard/forms">
          <Card className="hover-elevate cursor-pointer h-full">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Registration Forms</h3>
                <p className="text-sm text-muted-foreground">Upload and manage forms</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/users">
          <Card className="hover-elevate cursor-pointer h-full">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-chart-1/10">
                <Users className="h-6 w-6 text-chart-1" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">User Management</h3>
                <p className="text-sm text-muted-foreground">Manage all users</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/notices">
          <Card className="hover-elevate cursor-pointer h-full">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-chart-4/10">
                <Bell className="h-6 w-6 text-chart-4" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Notices</h3>
                <p className="text-sm text-muted-foreground">Manage announcements</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
