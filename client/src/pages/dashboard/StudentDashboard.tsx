import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { Link } from "wouter";
import { 
  Bell, 
  CreditCard,
  ArrowRight,
  Award,
  Lock,
  Unlock,
  GraduationCap,
  Clock
} from "lucide-react";
import type { Notice, Result, FeeStructure, SiteSetting } from "@shared/schema";

export default function StudentDashboard() {
  const { user } = useAuth();

  const { data: notices } = useQuery<Notice[]>({
    queryKey: ["/api/notices"],
  });

  const { data: results } = useQuery<Result[]>({
    queryKey: ["/api/results", user?.id],
  });

  const { data: feeStructures } = useQuery<FeeStructure[]>({
    queryKey: ["/api/fee-structures", user?.classLevel],
  });

  const { data: settings } = useQuery<SiteSetting[]>({
    queryKey: ["/api/settings"],
  });

  const recentNotices = notices?.filter(n => n.isPublished && (n.targetAudience === "students" || n.targetAudience === "all")).slice(0, 3) || [];
  const myResults = results || [];
  const myFees = feeStructures?.[0];
  
  const resultsReleasedSetting = settings?.find(s => s.key === "results_released");
  const resultsReleased = resultsReleasedSetting?.value === "true";

  const latestResult = myResults.length > 0 ? myResults[0] : null;
  const averageScore = myResults.length > 0 
    ? Math.round(myResults.reduce((acc, r) => acc + (r.totalScore || 0), 0) / myResults.length)
    : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground" data-testid="text-student-dashboard">
          Welcome, {user?.firstName}!
        </h1>
        <p className="text-muted-foreground mt-1">
          Access your academic information and stay updated with school notices.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="hover-elevate">
          <CardContent className="p-4 md:p-6">
            <div className="p-2 rounded-lg bg-primary/20 w-fit">
              <GraduationCap className="h-5 w-5 text-primary" />
            </div>
            <p className="text-lg font-bold text-foreground mt-3">{user?.classLevel || "N/A"}</p>
            <p className="text-sm text-muted-foreground mt-1">Class Level</p>
          </CardContent>
        </Card>

        <Card className="hover-elevate">
          <CardContent className="p-4 md:p-6">
            <div className={`p-2 rounded-lg ${resultsReleased ? 'bg-chart-4/20' : 'bg-muted'} w-fit`}>
              {resultsReleased ? (
                <Unlock className="h-5 w-5 text-chart-4" />
              ) : (
                <Lock className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
            <p className="text-lg font-bold text-foreground mt-3">
              {resultsReleased ? "Available" : "Locked"}
            </p>
            <p className="text-sm text-muted-foreground mt-1">Results Status</p>
          </CardContent>
        </Card>

        <Card className="hover-elevate">
          <CardContent className="p-4 md:p-6">
            <div className="p-2 rounded-lg bg-chart-1/20 w-fit">
              <Award className="h-5 w-5 text-chart-1" />
            </div>
            <p className="text-2xl md:text-3xl font-bold text-foreground mt-3">
              {averageScore !== null ? `${averageScore}%` : "---"}
            </p>
            <p className="text-sm text-muted-foreground mt-1">Average Score</p>
          </CardContent>
        </Card>

        <Card className="hover-elevate">
          <CardContent className="p-4 md:p-6">
            <div className="p-2 rounded-lg bg-accent/20 w-fit">
              <Bell className="h-5 w-5 text-accent-foreground" />
            </div>
            <p className="text-2xl md:text-3xl font-bold text-foreground mt-3">{recentNotices.length}</p>
            <p className="text-sm text-muted-foreground mt-1">New Notices</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-4">
            <div>
              <CardTitle className="text-lg">Recent Notices</CardTitle>
              <CardDescription>Important announcements for students</CardDescription>
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
                    <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {notice.createdAt ? new Date(notice.createdAt).toLocaleDateString() : ""}
                    </p>
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

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-4">
            <div>
              <CardTitle className="text-lg">Academic Results</CardTitle>
              <CardDescription>Your performance summary</CardDescription>
            </div>
            <Link href="/dashboard/results">
              <Button variant="ghost" size="sm">
                View All
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {!resultsReleased ? (
              <div className="text-center py-8">
                <Lock className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <h4 className="font-medium text-foreground mb-1">Results Not Yet Released</h4>
                <p className="text-sm text-muted-foreground">
                  Academic results will be available once they are officially released by the management.
                </p>
              </div>
            ) : myResults.length > 0 ? (
              <div className="space-y-3">
                {myResults.slice(0, 4).map((result) => (
                  <div 
                    key={result.id} 
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover-elevate"
                    data-testid={`result-item-${result.id}`}
                  >
                    <div>
                      <p className="font-medium text-foreground">Subject ID: {result.subjectId}</p>
                      <p className="text-sm text-muted-foreground">{result.term} Term, {result.academicYear}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-foreground">{result.totalScore}%</p>
                      <Badge variant="outline">{result.grade}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Award className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No results available yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Fee Payment Information</CardTitle>
          <CardDescription>Bank details for fee payment</CardDescription>
        </CardHeader>
        <CardContent>
          {myFees ? (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">Class Level</p>
                  <p className="text-lg font-medium text-foreground">{myFees.classLevel}</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">Amount</p>
                  <p className="text-2xl font-bold text-primary">₦{myFees.amount.toLocaleString()}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                  <p className="text-sm text-muted-foreground">Bank Name</p>
                  <p className="text-lg font-medium text-foreground">{myFees.bankName}</p>
                </div>
                <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                  <p className="text-sm text-muted-foreground">Account Number</p>
                  <p className="text-xl font-bold text-foreground">{myFees.bankAccountNumber}</p>
                </div>
              </div>
              {myFees.description && (
                <div className="md:col-span-2 p-4 rounded-lg bg-accent/10">
                  <p className="text-sm text-muted-foreground">Payment Instructions</p>
                  <p className="text-foreground mt-1">{myFees.description}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">Fee information not available for your class level</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
