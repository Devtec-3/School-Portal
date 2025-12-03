import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { RegistrationForm } from "@shared/schema";
import { 
  Plus, 
  FileText, 
  Download, 
  Trash2, 
  Loader2,
  Upload,
  Eye,
  EyeOff
} from "lucide-react";

export default function RegistrationForms() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [formType, setFormType] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const { toast } = useToast();

  const { data: forms, isLoading } = useQuery<RegistrationForm[]>({
    queryKey: ["/api/registration-forms"],
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      return apiRequest("PATCH", `/api/registration-forms/${id}`, { isActive });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/registration-forms"] });
      toast({ title: "Form Updated", description: "Form visibility has been updated." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update form.", variant: "destructive" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/registration-forms/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/registration-forms"] });
      toast({ title: "Form Deleted", description: "The form has been removed." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete form.", variant: "destructive" });
    }
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please upload a file smaller than 10MB",
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !formType || !selectedFile) {
      toast({
        title: "Missing Information",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("formType", formType);
      formData.append("file", selectedFile);

      const response = await fetch("/api/registration-forms", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        queryClient.invalidateQueries({ queryKey: ["/api/registration-forms"] });
        toast({ title: "Form Uploaded", description: "The registration form has been added." });
        setIsDialogOpen(false);
        resetForm();
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "There was an error uploading the form.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setFormType("");
    setSelectedFile(null);
  };

  const activeForms = forms?.filter(f => f.isActive) || [];
  const inactiveForms = forms?.filter(f => !f.isActive) || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground" data-testid="text-forms-title">
            Registration Forms
          </h1>
          <p className="text-muted-foreground mt-1">
            Upload and manage registration form documents
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-form">
              <Plus className="h-4 w-4 mr-2" />
              Add New Form
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Upload Registration Form</DialogTitle>
              <DialogDescription>
                Upload a new registration form document for applicants to download.
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Form Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Student Registration Form"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  data-testid="input-form-title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of this form..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  data-testid="textarea-form-description"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="formType">Form Type *</Label>
                <Select value={formType} onValueChange={setFormType}>
                  <SelectTrigger data-testid="select-form-type">
                    <SelectValue placeholder="Select form type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student Registration</SelectItem>
                    <SelectItem value="staff">Staff Application</SelectItem>
                    <SelectItem value="transfer">Transfer Application</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Upload File *</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary/50 transition-colors">
                  <input
                    type="file"
                    id="formFile"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label htmlFor="formFile" className="cursor-pointer">
                    {selectedFile ? (
                      <div className="flex items-center justify-center gap-2">
                        <FileText className="h-6 w-6 text-primary" />
                        <span className="font-medium text-foreground">{selectedFile.name}</span>
                      </div>
                    ) : (
                      <div>
                        <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">Click to upload PDF or DOC</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isUploading} data-testid="button-submit-form">
                  {isUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Form
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Eye className="h-5 w-5 text-chart-4" />
              Active Forms ({activeForms.length})
            </h2>
            {activeForms.length > 0 ? (
              <div className="grid gap-4">
                {activeForms.map((form) => (
                  <Card key={form.id} data-testid={`form-card-${form.id}`}>
                    <CardContent className="p-4 md:p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <FileText className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground">{form.title}</h3>
                            {form.description && (
                              <p className="text-sm text-muted-foreground">{form.description}</p>
                            )}
                            <Badge variant="outline" className="mt-2">{form.formType}</Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 ml-16 md:ml-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Active</span>
                            <Switch
                              checked={form.isActive}
                              onCheckedChange={(checked) => toggleMutation.mutate({ id: form.id, isActive: checked })}
                              data-testid={`switch-active-${form.id}`}
                            />
                          </div>
                          <a href={form.fileUrl} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </a>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => deleteMutation.mutate(form.id)}
                            className="text-destructive"
                            data-testid={`button-delete-${form.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-8 text-center">
                  <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No active forms</p>
                </CardContent>
              </Card>
            )}
          </div>

          {inactiveForms.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <EyeOff className="h-5 w-5 text-muted-foreground" />
                Inactive Forms ({inactiveForms.length})
              </h2>
              <div className="grid gap-4">
                {inactiveForms.map((form) => (
                  <Card key={form.id} className="opacity-60" data-testid={`form-card-inactive-${form.id}`}>
                    <CardContent className="p-4 md:p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                            <FileText className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground">{form.title}</h3>
                            <Badge variant="secondary" className="mt-2">{form.formType}</Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 ml-16 md:ml-0">
                          <Switch
                            checked={form.isActive}
                            onCheckedChange={(checked) => toggleMutation.mutate({ id: form.id, isActive: checked })}
                          />
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => deleteMutation.mutate(form.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
