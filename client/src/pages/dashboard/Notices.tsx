import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import type { Notice } from "@shared/schema";
import { 
  Plus, 
  Bell, 
  Trash2, 
  Loader2,
  Clock,
  AlertCircle,
  Users,
  Megaphone
} from "lucide-react";

export default function Notices() {
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [priority, setPriority] = useState("normal");
  
  const { toast } = useToast();

  const canCreate = user?.role === "super_admin" || user?.role === "management";

  const { data: notices, isLoading } = useQuery<Notice[]>({
    queryKey: ["/api/notices"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: { title: string; content: string; targetAudience: string; priority: string }) => {
      return apiRequest("POST", "/api/notices", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notices"] });
      toast({ title: "Notice Created", description: "The notice has been published." });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create notice.", variant: "destructive" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/notices/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notices"] });
      toast({ title: "Notice Deleted", description: "The notice has been removed." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete notice.", variant: "destructive" });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !content || !targetAudience) {
      toast({
        title: "Missing Information",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    createMutation.mutate({ title, content, targetAudience, priority });
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setTargetAudience("");
    setPriority("normal");
  };

  const filteredNotices = notices?.filter(n => {
    if (user?.role === "super_admin" || user?.role === "management") {
      return true;
    }
    if (user?.role === "staff") {
      return n.targetAudience === "staff" || n.targetAudience === "all";
    }
    if (user?.role === "student") {
      return n.targetAudience === "students" || n.targetAudience === "all";
    }
    return false;
  }) || [];

  const getAudienceBadge = (audience: string) => {
    switch (audience) {
      case "staff":
        return <Badge variant="outline" className="bg-chart-1/10"><Users className="h-3 w-3 mr-1" />Staff</Badge>;
      case "students":
        return <Badge variant="outline" className="bg-primary/10"><Users className="h-3 w-3 mr-1" />Students</Badge>;
      default:
        return <Badge variant="outline" className="bg-chart-4/10"><Users className="h-3 w-3 mr-1" />All</Badge>;
    }
  };

  const getPriorityBadge = (prio: string) => {
    if (prio === "high") {
      return <Badge variant="destructive"><AlertCircle className="h-3 w-3 mr-1" />Urgent</Badge>;
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground" data-testid="text-notices-title">
            Notice Board
          </h1>
          <p className="text-muted-foreground mt-1">
            {canCreate ? "Create and manage school announcements" : "View school announcements"}
          </p>
        </div>
        {canCreate && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button data-testid="button-create-notice">
                <Plus className="h-4 w-4 mr-2" />
                Create Notice
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Create New Notice</DialogTitle>
                <DialogDescription>
                  Publish an announcement to staff and/or students.
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="Notice title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    data-testid="input-notice-title"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Content *</Label>
                  <Textarea
                    id="content"
                    placeholder="Write your announcement..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={5}
                    data-testid="textarea-notice-content"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="audience">Target Audience *</Label>
                    <Select value={targetAudience} onValueChange={setTargetAudience}>
                      <SelectTrigger data-testid="select-audience">
                        <SelectValue placeholder="Select audience" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All (Staff & Students)</SelectItem>
                        <SelectItem value="staff">Staff Only</SelectItem>
                        <SelectItem value="students">Students Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={priority} onValueChange={setPriority}>
                      <SelectTrigger data-testid="select-priority">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="high">High (Urgent)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createMutation.isPending} data-testid="button-publish-notice">
                    {createMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Publishing...
                      </>
                    ) : (
                      <>
                        <Megaphone className="h-4 w-4 mr-2" />
                        Publish Notice
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : filteredNotices.length > 0 ? (
        <div className="space-y-4">
          {filteredNotices.map((notice) => (
            <Card key={notice.id} className="hover-elevate" data-testid={`notice-card-${notice.id}`}>
              <CardContent className="p-4 md:p-6">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        notice.priority === "high" ? "bg-destructive/10" : "bg-primary/10"
                      }`}>
                        {notice.priority === "high" ? (
                          <AlertCircle className="h-5 w-5 text-destructive" />
                        ) : (
                          <Bell className="h-5 w-5 text-primary" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h3 className="font-semibold text-foreground text-lg">{notice.title}</h3>
                          {getPriorityBadge(notice.priority || "normal")}
                        </div>
                        <p className="text-muted-foreground whitespace-pre-wrap">{notice.content}</p>
                        <div className="flex flex-wrap items-center gap-3 mt-4">
                          {getAudienceBadge(notice.targetAudience)}
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {notice.createdAt ? new Date(notice.createdAt).toLocaleDateString() : ""}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {canCreate && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => deleteMutation.mutate(notice.id)}
                      className="text-destructive flex-shrink-0"
                      data-testid={`button-delete-notice-${notice.id}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-1">No Notices</h3>
            <p className="text-muted-foreground">
              {canCreate ? "Create your first notice to get started" : "No announcements at this time"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
