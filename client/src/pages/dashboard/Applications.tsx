import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { RegistrationApplication } from "@shared/schema";
import { 
  Search, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye,
  Download,
  Loader2,
  User
} from "lucide-react";

export default function Applications() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedApp, setSelectedApp] = useState<RegistrationApplication | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  
  const { toast } = useToast();

  const { data: applications, isLoading } = useQuery<RegistrationApplication[]>({
    queryKey: ["/api/registration-applications"],
  });

  const approveMutation = useMutation({
    mutationFn: async ({ id, notes }: { id: string; notes: string }) => {
      return apiRequest("POST", `/api/registration-applications/${id}/approve`, { reviewNotes: notes });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/registration-applications"] });
      toast({ title: "Application Approved", description: "The user has been registered and notified." });
      setIsReviewDialogOpen(false);
      setSelectedApp(null);
      setReviewNotes("");
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to approve application.", variant: "destructive" });
    }
  });

  const rejectMutation = useMutation({
    mutationFn: async ({ id, notes }: { id: string; notes: string }) => {
      return apiRequest("POST", `/api/registration-applications/${id}/reject`, { reviewNotes: notes });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/registration-applications"] });
      toast({ title: "Application Rejected", description: "The applicant has been notified." });
      setIsReviewDialogOpen(false);
      setSelectedApp(null);
      setReviewNotes("");
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to reject application.", variant: "destructive" });
    }
  });

  const filteredApps = applications?.filter(app => 
    app.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.applicationType.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const pendingApps = filteredApps.filter(a => a.status === "pending");
  const reviewedApps = filteredApps.filter(a => a.status !== "pending");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-chart-4/20 text-chart-4 border-chart-4/30"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>;
      case "rejected":
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="outline" className="bg-accent/10"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
    }
  };

  const openReviewDialog = (app: RegistrationApplication) => {
    setSelectedApp(app);
    setReviewNotes("");
    setIsReviewDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground" data-testid="text-applications-title">
            Registration Applications
          </h1>
          <p className="text-muted-foreground mt-1">
            Review and process registration applications
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search applications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            data-testid="input-search-applications"
          />
        </div>
        <Badge variant="outline" className="px-3 py-1.5">
          {pendingApps.length} Pending
        </Badge>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="space-y-8">
          {pendingApps.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5 text-accent-foreground" />
                Pending Review ({pendingApps.length})
              </h2>
              <div className="grid gap-4">
                {pendingApps.map((app) => (
                  <Card key={app.id} className="hover-elevate" data-testid={`app-card-${app.id}`}>
                    <CardContent className="p-4 md:p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <User className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground">{app.applicantName}</h3>
                            <p className="text-sm text-muted-foreground">{app.applicantPhone}</p>
                            <Badge variant="outline" className="mt-2">
                              {app.applicationType.replace(/_/g, " ")}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-16 md:ml-0">
                          {app.uploadedDocumentUrl && (
                            <a href={app.uploadedDocumentUrl} target="_blank" rel="noopener noreferrer">
                              <Button variant="outline" size="sm" data-testid={`button-view-doc-${app.id}`}>
                                <Eye className="h-4 w-4 mr-1" />
                                View Document
                              </Button>
                            </a>
                          )}
                          <Button size="sm" onClick={() => openReviewDialog(app)} data-testid={`button-review-${app.id}`}>
                            Review
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {reviewedApps.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5 text-muted-foreground" />
                Reviewed Applications ({reviewedApps.length})
              </h2>
              <div className="grid gap-4">
                {reviewedApps.map((app) => (
                  <Card key={app.id} className="opacity-80" data-testid={`app-card-reviewed-${app.id}`}>
                    <CardContent className="p-4 md:p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                            <User className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground">{app.applicantName}</h3>
                            <p className="text-sm text-muted-foreground">{app.applicationType.replace(/_/g, " ")}</p>
                            {app.reviewNotes && (
                              <p className="text-sm text-muted-foreground mt-1 italic">"{app.reviewNotes}"</p>
                            )}
                          </div>
                        </div>
                        <div className="ml-16 md:ml-0">
                          {getStatusBadge(app.status)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {filteredApps.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-1">No Applications Found</h3>
                <p className="text-muted-foreground">
                  {searchTerm ? "Try a different search term" : "No registration applications yet"}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Review Application</DialogTitle>
            <DialogDescription>
              Review and approve or reject this registration application.
            </DialogDescription>
          </DialogHeader>
          
          {selectedApp && (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="font-medium text-foreground">{selectedApp.applicantName}</p>
                <p className="text-sm text-muted-foreground">{selectedApp.applicantPhone}</p>
                <Badge variant="outline" className="mt-2">
                  {selectedApp.applicationType.replace(/_/g, " ")}
                </Badge>
              </div>

              {selectedApp.uploadedDocumentUrl && (
                <a href={selectedApp.uploadedDocumentUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Download Submitted Document
                  </Button>
                </a>
              )}

              <div>
                <label className="text-sm font-medium text-foreground">Review Notes (Optional)</label>
                <Textarea
                  placeholder="Add any notes about this application..."
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  className="mt-1.5"
                  data-testid="textarea-review-notes"
                />
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => selectedApp && rejectMutation.mutate({ id: selectedApp.id, notes: reviewNotes })}
              disabled={rejectMutation.isPending || approveMutation.isPending}
              className="text-destructive"
              data-testid="button-reject"
            >
              {rejectMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4 mr-1" />}
              Reject
            </Button>
            <Button
              onClick={() => selectedApp && approveMutation.mutate({ id: selectedApp.id, notes: reviewNotes })}
              disabled={approveMutation.isPending || rejectMutation.isPending}
              data-testid="button-approve"
            >
              {approveMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4 mr-1" />}
              Approve & Generate ID
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
