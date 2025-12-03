import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { Link } from "wouter";
import { 
  Calendar, 
  BookOpen, 
  Bell, 
  CreditCard,
  ArrowRight,
  ClipboardList,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import type { Subject, Timetable, Notice } from "@shared/schema";

export default function StaffDashboard() {
  const { user } = useAuth();

  const { data: subjects } = useQuery<Subject[]>({
    queryKey: ["/api/subjects", user?.id],
  });

  const { data: timetable } = useQuery<Timetable[]>({
    queryKey: ["/api/timetable", user?.id],
  });

  const { data: notices } = useQuery<Notice[]>({
    queryKey: ["/api/notices"],
  });

  const mySubjects = subjects || [];
  const myTimetable = timetable || [];
  const recentNotices = notices?.filter(n => n.isPublished).slice(0, 3) || [];
  const hasBankDetails = user?.bankAccountNumber && user?.bankName;

  const todaySchedule = myTimetable.filter(t => {
    const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    const today = days[new Date().getDay()];
    return t.dayOfWeek.toLowerCase() === today;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground" data-testid="text-staff-dashboard">
          Welcome, {user?.firstName}!
        </h1>
        <p className="text-muted-foreground mt-1">
          Here's your teaching schedule and important updates.
        </p>
      </div>

      {!hasBankDetails && (
        <Card className="border-accent bg-accent/10">
          <CardContent className="p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-accent-foreground" />
              <div>
                <p className="font-medium text-foreground">Bank Details Required</p>
                <p className="text-sm text-muted-foreground">Please update your bank account information for salary processing.</p>
              </div>
            </div>
            <Link href="/dashboard/bank">
              <Button size="sm" data-testid="button-update-bank">Update Now</Button>
            </Link>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="hover-elevate">
          <CardContent className="p-4 md:p-6">
            <div className="p-2 rounded-lg bg-primary/20 w-fit">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <p className="text-2xl md:text-3xl font-bold text-foreground mt-3">{mySubjects.length}</p>
            <p className="text-sm text-muted-foreground mt-1">My Subjects</p>
          </CardContent>
        </Card>

        <Card className="hover-elevate">
          <CardContent className="p-4 md:p-6">
            <div className="p-2 rounded-lg bg-chart-1/20 w-fit">
              <Calendar className="h-5 w-5 text-chart-1" />
            </div>
            <p className="text-2xl md:text-3xl font-bold text-foreground mt-3">{todaySchedule.length}</p>
            <p className="text-sm text-muted-foreground mt-1">Classes Today</p>
          </CardContent>
        </Card>

        <Card className="hover-elevate">
          <CardContent className="p-4 md:p-6">
            <div className="p-2 rounded-lg bg-chart-4/20 w-fit">
              <Bell className="h-5 w-5 text-chart-4" />
            </div>
            <p className="text-2xl md:text-3xl font-bold text-foreground mt-3">{recentNotices.length}</p>
            <p className="text-sm text-muted-foreground mt-1">New Notices</p>
          </CardContent>
        </Card>

        <Card className="hover-elevate">
          <CardContent className="p-4 md:p-6">
            <div className={`p-2 rounded-lg ${hasBankDetails ? 'bg-chart-4/20' : 'bg-accent/20'} w-fit`}>
              <CreditCard className={`h-5 w-5 ${hasBankDetails ? 'text-chart-4' : 'text-accent-foreground'}`} />
            </div>
            <p className="text-2xl md:text-3xl font-bold text-foreground mt-3">
              {hasBankDetails ? <CheckCircle className="h-8 w-8 text-chart-4" /> : <Clock className="h-8 w-8 text-accent-foreground" />}
            </p>
            <p className="text-sm text-muted-foreground mt-1">Bank Details</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-4">
            <div>
              <CardTitle className="text-lg">Today's Schedule</CardTitle>
              <CardDescription>Your classes for today</CardDescription>
            </div>
            <Link href="/dashboard/timetable">
              <Button variant="ghost" size="sm">
                Full Timetable
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {todaySchedule.length > 0 ? (
              <div className="space-y-3">
                {todaySchedule.map((schedule, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover-elevate"
                    data-testid={`schedule-item-${index}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Class Session</p>
                        <p className="text-sm text-muted-foreground">{schedule.startTime} - {schedule.endTime}</p>
                      </div>
                    </div>
                    <Badge variant="outline">{schedule.dayOfWeek}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No classes scheduled for today</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-4">
            <div>
              <CardTitle className="text-lg">Recent Notices</CardTitle>
              <CardDescription>Important announcements</CardDescription>
            </div>
            <Link href="/dashboard/notices">
              <Button variant="ghost" size="sm">
                View All
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {recentNotices.length > 0 ? (
              <div className="space-y-3">
                {recentNotices.map((notice) => (
                  <div 
                    key={notice.id} 
                    className="p-3 rounded-lg bg-muted/50 hover-elevate"
                    data-testid={`notice-item-${notice.id}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-medium text-foreground">{notice.title}</h4>
                      {notice.priority === "high" && (
                        <Badge variant="destructive" className="text-xs">Urgent</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{notice.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No recent notices</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Link href="/dashboard/subjects">
          <Card className="hover-elevate cursor-pointer h-full">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">My Subjects</h3>
                <p className="text-sm text-muted-foreground">View assigned subjects</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/results">
          <Card className="hover-elevate cursor-pointer h-full">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-chart-4/10">
                <ClipboardList className="h-6 w-6 text-chart-4" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Enter Results</h3>
                <p className="text-sm text-muted-foreground">Input student grades</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/bank">
          <Card className="hover-elevate cursor-pointer h-full">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-chart-1/10">
                <CreditCard className="h-6 w-6 text-chart-1" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Bank Details</h3>
                <p className="text-sm text-muted-foreground">Update payment info</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
