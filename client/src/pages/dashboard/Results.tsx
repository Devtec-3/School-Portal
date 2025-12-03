import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import type { Result, Subject, User, SiteSetting } from "@shared/schema";
import { 
  Award, 
  Loader2,
  Lock,
  Plus,
  Save,
  ClipboardList
} from "lucide-react";

export default function Results() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const isStaff = user?.role === "staff";
  const isStudent = user?.role === "student";

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [testScore, setTestScore] = useState("");
  const [examScore, setExamScore] = useState("");
  const [term, setTerm] = useState("");
  const [academicYear, setAcademicYear] = useState("2024/2025");

  const { data: results, isLoading } = useQuery<Result[]>({
    queryKey: ["/api/results", isStudent ? user?.id : "all"],
  });

  const { data: subjects } = useQuery<Subject[]>({
    queryKey: ["/api/subjects", user?.id],
    enabled: isStaff,
  });

  const { data: students } = useQuery<User[]>({
    queryKey: ["/api/users/students"],
    enabled: isStaff,
  });

  const { data: settings } = useQuery<SiteSetting[]>({
    queryKey: ["/api/settings"],
  });

  const resultsReleasedSetting = settings?.find(s => s.key === "results_released");
  const resultsReleased = resultsReleasedSetting?.value === "true";

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/results", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/results"] });
      toast({ title: "Result Saved", description: "The student result has been recorded." });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to save result.", variant: "destructive" });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedStudent || !selectedSubject || !testScore || !examScore || !term) {
      toast({
        title: "Missing Information",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    const test = parseInt(testScore);
    const exam = parseInt(examScore);
    const total = test + exam;
    let grade = "F";

    if (total >= 70) grade = "A";
    else if (total >= 60) grade = "B";
    else if (total >= 50) grade = "C";
    else if (total >= 40) grade = "D";
    else if (total >= 30) grade = "E";

    createMutation.mutate({
      studentId: selectedStudent,
      subjectId: selectedSubject,
      testScore: test,
      examScore: exam,
      totalScore: total,
      grade,
      term,
      academicYear,
      enteredBy: user?.id,
    });
  };

  const resetForm = () => {
    setSelectedStudent("");
    setSelectedSubject("");
    setTestScore("");
    setExamScore("");
    setTerm("");
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "A": return "bg-chart-4/20 text-chart-4";
      case "B": return "bg-chart-1/20 text-chart-1";
      case "C": return "bg-accent/20 text-accent-foreground";
      case "D": return "bg-muted text-muted-foreground";
      default: return "bg-destructive/20 text-destructive";
    }
  };

  if (isStudent && !resultsReleased) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground" data-testid="text-results-title">
            My Results
          </h1>
          <p className="text-muted-foreground mt-1">
            View your academic performance
          </p>
        </div>

        <Card className="max-w-xl">
          <CardContent className="py-16 text-center">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Results Not Yet Released</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Academic results are currently not available. They will be accessible once 
              the management officially releases them. Please check back later.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground" data-testid="text-results-title">
            {isStaff ? "Enter Results" : "My Results"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isStaff ? "Record student academic results" : "View your academic performance"}
          </p>
        </div>
        {isStaff && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button data-testid="button-add-result">
                <Plus className="h-4 w-4 mr-2" />
                Add Result
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Enter Student Result</DialogTitle>
                <DialogDescription>
                  Record test and exam scores for a student.
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Student *</Label>
                  <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                    <SelectTrigger data-testid="select-student">
                      <SelectValue placeholder="Select student" />
                    </SelectTrigger>
                    <SelectContent>
                      {students?.map((student) => (
                        <SelectItem key={student.id} value={student.id}>
                          {student.firstName} {student.surname} ({student.uniqueId})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Subject *</Label>
                  <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                    <SelectTrigger data-testid="select-subject">
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects?.map((subject) => (
                        <SelectItem key={subject.id} value={subject.id}>
                          {subject.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Term *</Label>
                    <Select value={term} onValueChange={setTerm}>
                      <SelectTrigger data-testid="select-term">
                        <SelectValue placeholder="Select term" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="first">First Term</SelectItem>
                        <SelectItem value="second">Second Term</SelectItem>
                        <SelectItem value="third">Third Term</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Academic Year</Label>
                    <Input
                      value={academicYear}
                      onChange={(e) => setAcademicYear(e.target.value)}
                      placeholder="e.g., 2024/2025"
                      data-testid="input-academic-year"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Test Score (40) *</Label>
                    <Input
                      type="number"
                      min="0"
                      max="40"
                      value={testScore}
                      onChange={(e) => setTestScore(e.target.value)}
                      placeholder="0-40"
                      data-testid="input-test-score"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Exam Score (60) *</Label>
                    <Input
                      type="number"
                      min="0"
                      max="60"
                      value={examScore}
                      onChange={(e) => setExamScore(e.target.value)}
                      placeholder="0-60"
                      data-testid="input-exam-score"
                    />
                  </div>
                </div>

                {testScore && examScore && (
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-sm text-muted-foreground">
                      Total: <span className="font-bold text-foreground">{parseInt(testScore || "0") + parseInt(examScore || "0")}</span>/100
                    </p>
                  </div>
                )}

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createMutation.isPending} data-testid="button-save-result">
                    {createMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Result
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
      ) : results && results.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Academic Results</CardTitle>
            <CardDescription>
              {isStudent ? "Your academic performance records" : "All entered results"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  {isStaff && <TableHead>Student</TableHead>}
                  <TableHead>Subject</TableHead>
                  <TableHead>Term</TableHead>
                  <TableHead>Test (40)</TableHead>
                  <TableHead>Exam (60)</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Grade</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((result) => (
                  <TableRow key={result.id} data-testid={`result-row-${result.id}`}>
                    {isStaff && <TableCell>{result.studentId}</TableCell>}
                    <TableCell>{result.subjectId}</TableCell>
                    <TableCell className="capitalize">{result.term} Term</TableCell>
                    <TableCell>{result.testScore}</TableCell>
                    <TableCell>{result.examScore}</TableCell>
                    <TableCell className="font-semibold">{result.totalScore}</TableCell>
                    <TableCell>
                      <Badge className={getGradeColor(result.grade || "F")}>
                        {result.grade}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <ClipboardList className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-1">No Results</h3>
            <p className="text-muted-foreground">
              {isStaff ? "Start entering student results" : "No results available yet"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
