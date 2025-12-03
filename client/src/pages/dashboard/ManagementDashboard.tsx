import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { 
  Users, 
  DollarSign, 
  Bell, 
  CreditCard,
  ArrowRight,
  TrendingUp,
  CheckCircle,
  Clock,
  Banknote
} from "lucide-react";
import type { User, Notice, PayrollRecord } from "@shared/schema";

export default function ManagementDashboard() {
  const { data: users } = useQuery<User[]>({
    queryKey: ["/api/users"],
  });

  const { data: notices } = useQuery<Notice[]>({
    queryKey: ["/api/notices"],
  });

  const { data: payrollRecords } = useQuery<PayrollRecord[]>({
    queryKey: ["/api/payroll"],
  });

  const staffMembers = users?.filter(u => u.role === "staff") || [];
  const staffWithBank = staffMembers.filter(s => s.bankAccountNumber);
  const pendingPayments = payrollRecords?.filter(p => p.status === "pending") || [];
  const completedPayments = payrollRecords?.filter(p => p.status === "completed") || [];
  const activeNotices = notices?.filter(n => n.isPublished).length || 0;

  const stats = [
    { 
      title: "Total Staff", 
      value: staffMembers.length, 
      icon: Users, 
      color: "text-primary",
      bgColor: "bg-primary/20",
      href: "/dashboard/staff"
    },
    { 
      title: "Staff with Bank Details", 
      value: staffWithBank.length, 
      icon: CreditCard, 
      color: "text-chart-1",
      bgColor: "bg-chart-1/20",
      href: "/dashboard/payroll"
    },
    { 
      title: "Pending Payments", 
      value: pendingPayments.length, 
      icon: Clock, 
      color: "text-accent-foreground",
      bgColor: "bg-accent/20",
      href: "/dashboard/payroll"
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
        <h1 className="text-2xl md:text-3xl font-bold text-foreground" data-testid="text-management-dashboard">
          Management Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage payroll, notices, and financial operations.
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
              <CardTitle className="text-lg">Staff Bank Details</CardTitle>
              <CardDescription>Staff members who have submitted bank information</CardDescription>
            </div>
            <Link href="/dashboard/payroll">
              <Button variant="ghost" size="sm">
                View All
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {staffWithBank.length > 0 ? (
              <div className="space-y-3">
                {staffWithBank.slice(0, 5).map((staff) => (
                  <div 
                    key={staff.id} 
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover-elevate"
                    data-testid={`staff-bank-${staff.id}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-chart-1/20 flex items-center justify-center">
                        <Banknote className="h-5 w-5 text-chart-1" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{staff.firstName} {staff.surname}</p>
                        <p className="text-sm text-muted-foreground">{staff.bankName}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-chart-4/10">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No bank details submitted yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-4">
            <div>
              <CardTitle className="text-lg">Payment Status</CardTitle>
              <CardDescription>Overview of payroll processing</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-accent/10">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-accent-foreground" />
                  <span className="text-foreground">Pending</span>
                </div>
                <span className="text-2xl font-bold text-foreground">{pendingPayments.length}</span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-chart-4/10">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-chart-4" />
                  <span className="text-foreground">Completed</span>
                </div>
                <span className="text-2xl font-bold text-foreground">{completedPayments.length}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Link href="/dashboard/payroll">
          <Card className="hover-elevate cursor-pointer h-full">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Payroll</h3>
                <p className="text-sm text-muted-foreground">Process staff payments</p>
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
                <p className="text-sm text-muted-foreground">Create announcements</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/fees">
          <Card className="hover-elevate cursor-pointer h-full">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-chart-1/10">
                <CreditCard className="h-6 w-6 text-chart-1" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Fee Management</h3>
                <p className="text-sm text-muted-foreground">Manage fee structures</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
