import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { RegistrationForm } from "@shared/schema";
import {
  Download,
  Upload,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  Loader2,
  ArrowRight,
  Phone,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const steps = [
  {
    number: 1,
    title: "Download Forms",
    description:
      "Download the appropriate registration form for your application type",
  },
  {
    number: 2,
    title: "Print & Fill",
    description:
      "Print the form and fill it out completely with accurate information",
  },
  {
    number: 3,
    title: "Scan Documents",
    description:
      "Scan your completed form along with required supporting documents",
  },
  {
    number: 4,
    title: "Upload",
    description: "Upload the scanned documents through this portal",
  },
  {
    number: 5,
    title: "Approval",
    description: "Wait for admin review and receive your unique User ID",
  },
];

export default function Registration() {
  const [applicantName, setApplicantName] = useState("");
  const [applicantPhone, setApplicantPhone] = useState("");
  const [applicantEmail, setApplicantEmail] = useState("");
  const [applicationType, setApplicationType] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const { toast } = useToast();

  const { data: registrationForms, isLoading: formsLoading } = useQuery<
    RegistrationForm[]
  >({
    queryKey: ["/api/registration-forms"],
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

    if (
      !applicantName ||
      !applicantPhone ||
      !applicationType ||
      !selectedFile
    ) {
      toast({
        title: "Missing Information",
        description:
          "Please fill all required fields and select a file to upload",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("applicantName", applicantName);
      formData.append("applicantPhone", applicantPhone);
      formData.append("applicantEmail", applicantEmail);
      formData.append("applicationType", applicationType);
      formData.append("document", selectedFile);

      const response = await fetch("/api/registration-applications", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setUploadSuccess(true);
        setApplicantName("");
        setApplicantPhone("");
        setApplicantEmail("");
        setApplicationType("");
        setSelectedFile(null);
        toast({
          title: "Application Submitted",
          description:
            "Your registration application has been submitted for review.",
        });
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      toast({
        title: "Upload Failed",
        description:
          "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const activeForms = registrationForms?.filter((form) => form.isActive) || [];

  return (
    <>
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 text-center">
          <Badge className="mb-4">Registration</Badge>
          <h1
            className="text-4xl md:text-5xl font-bold text-foreground mb-6"
            data-testid="text-registration-title"
          >
            Join Al-Furqan Schools
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Follow our document-based registration process to apply for
            admission as a student or staff member.
          </p>
        </div>
      </section>

      <section className="py-12 bg-card border-y border-card-border">
        <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
            Registration Process
          </h2>
          <div className="grid md:grid-cols-5 gap-4">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className="relative"
                data-testid={`step-${step.number}`}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg mb-3">
                    {step.number}
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-6 left-[60%] w-[80%] h-0.5 bg-border" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                <Download className="h-6 w-6 text-primary" />
                Step 1: Download Forms
              </h2>

              {formsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : activeForms.length > 0 ? (
                <div className="space-y-4">
                  {activeForms.map((form) => (
                    <Card
                      key={form.id}
                      className="hover-elevate"
                      data-testid={`form-card-${form.id}`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                              <FileText className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-foreground">
                                {form.title}
                              </h3>
                              {form.description && (
                                <p className="text-sm text-muted-foreground">
                                  {form.description}
                                </p>
                              )}
                              <Badge variant="outline" className="mt-2">
                                {form.formType}
                              </Badge>
                            </div>
                          </div>
                          <a
                            href={form.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button
                              size="sm"
                              data-testid={`button-download-${form.id}`}
                            >
                              <Download className="h-4 w-4 mr-1" />
                              Download
                            </Button>
                          </a>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Registration forms are currently being updated. Please check
                    back later or contact the school directly.
                  </AlertDescription>
                </Alert>
              )}

              <div className="mt-8 p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold text-foreground mb-2">
                  Required Documents
                </h4>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-chart-4" />
                    Completed registration form
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-chart-4" />
                    Birth certificate or declaration of age
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-chart-4" />
                    Passport photographs (2 copies)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-chart-4" />
                    Previous school testimonial (if applicable)
                  </li>
                </ul>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                <Upload className="h-6 w-6 text-primary" />
                Step 4: Upload Documents
              </h2>

              {uploadSuccess ? (
                <Card className="border-chart-4">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-chart-4/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="h-8 w-8 text-chart-4" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      Application Submitted!
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Your registration application has been submitted
                      successfully. Our admin team will review your documents
                      and contact you with your User ID.
                    </p>
                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                      <Clock className="h-5 w-5" />
                      <span>Expected processing time: 2-5 business days</span>
                    </div>
                    <Button
                      variant="outline"
                      className="mt-6"
                      onClick={() => setUploadSuccess(false)}
                      data-testid="button-submit-another"
                    >
                      Submit Another Application
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Upload Registration Documents</CardTitle>
                    <CardDescription>
                      Submit your completed and scanned registration documents
                      for review
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="applicantName">Full Name *</Label>
                        <Input
                          id="applicantName"
                          placeholder="Enter your full name"
                          value={applicantName}
                          onChange={(e) => setApplicantName(e.target.value)}
                          required
                          data-testid="input-applicant-name"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="applicantPhone">Phone Number *</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="applicantPhone"
                            type="tel"
                            placeholder="+234 XXX XXX XXXX"
                            value={applicantPhone}
                            onChange={(e) => setApplicantPhone(e.target.value)}
                            className="pl-10"
                            required
                            data-testid="input-applicant-phone"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="applicantEmail">Email (Optional)</Label>
                        <Input
                          id="applicantEmail"
                          type="email"
                          placeholder="email@example.com"
                          value={applicantEmail}
                          onChange={(e) => setApplicantEmail(e.target.value)}
                          data-testid="input-applicant-email"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="applicationType">
                          Application Type *
                        </Label>
                        <Select
                          value={applicationType}
                          onValueChange={setApplicationType}
                        >
                          <SelectTrigger data-testid="select-application-type">
                            <SelectValue placeholder="Select application type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="student_nursery">
                              Student - Nursery
                            </SelectItem>
                            <SelectItem value="student_primary">
                              Student - Primary
                            </SelectItem>
                            <SelectItem value="student_jss">
                              Student - Junior Secondary
                            </SelectItem>
                            <SelectItem value="student_sss">
                              Student - Senior Secondary
                            </SelectItem>
                            <SelectItem value="staff_teaching">
                              Staff - Teaching
                            </SelectItem>
                            <SelectItem value="staff_non_teaching">
                              Staff - Non-Teaching
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="document">
                          Upload Scanned Document *
                        </Label>
                        <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                          <input
                            type="file"
                            id="document"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={handleFileChange}
                            className="hidden"
                            data-testid="input-document-upload"
                          />
                          <label htmlFor="document" className="cursor-pointer">
                            {selectedFile ? (
                              <div className="flex items-center justify-center gap-2">
                                <FileText className="h-8 w-8 text-primary" />
                                <div className="text-left">
                                  <p className="font-medium text-foreground">
                                    {selectedFile.name}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {(selectedFile.size / 1024 / 1024).toFixed(
                                      2
                                    )}{" "}
                                    MB
                                  </p>
                                </div>
                              </div>
                            ) : (
                              <div>
                                <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                                <p className="text-muted-foreground">
                                  Click to upload or drag and drop
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  PDF, JPG, or PNG (max 10MB)
                                </p>
                              </div>
                            )}
                          </label>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        className="w-full"
                        disabled={isUploading}
                        data-testid="button-submit-application"
                      >
                        {isUploading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            Submit Application
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-muted/50">
        <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Need Help?
          </h2>
          <p className="text-muted-foreground mb-6">
            If you have questions about the registration process, please contact
            our admissions office.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="flex items-center justify-center gap-2 text-foreground">
              <Phone className="h-5 w-5 text-primary" />
              <span>+234 XXX XXX XXXX</span>
            </div>
            <span className="hidden sm:inline text-muted-foreground">|</span>
            <p className="text-foreground">
              Visit: Airforce Road GbaGba, Ilorin, Kwara State
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
