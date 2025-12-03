import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { User, PayrollRecord } from "@shared/schema";
import { 
  Search, 
  DollarSign, 
  Loader2,
  CheckCircle,
  Clock,
  CreditCard,
  Banknote
} from "lucide-react";

export default function Payroll() {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const { data: staff, isLoading } = useQuery<User[]>({
    queryKey: ["/api/users/staff"],
  });

  const { data: payrollRecords } = useQuery<PayrollRecord[]>({
    queryKey: ["/api/payroll"],
  });

  const processPaymentMutation = useMutation({
    mutationFn: async (staffId: string) => {
      return apiRequest("POST", "/api/payroll/process", { staffId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/payroll"] });
      toast({ title: "Payment Processed", description: "The payment has been recorded." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to process payment.", variant: "destructive" });
    }
  });

  const filteredStaff = staff?.filter(s => 
    s.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.uniqueId.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const staffWithBank = filteredStaff.filter(s => s.bankAccountNumber && s.bankName);
  const staffWithoutBank = filteredStaff.filter(s => !s.bankAccountNumber || !s.bankName);

  const getInitials = (firstName: string, surname: string) => {
    return `${firstName?.[0] || ""}${surname?.[0] || ""}`.toUpperCase();
  };

  const getLatestPayment = (staffId: string) => {
    const records = payrollRecords?.filter(r => r.staffId === staffId) || [];
    return records[0];
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground" data-testid="text-payroll-title">
          Payroll Management
        </h1>
        <p className="text-muted-foreground mt-1">
          View staff bank details and process salary payments
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="p-2 rounded-lg bg-primary/20 w-fit">
              <DollarSign className="h-5 w-5 text-primary" />
            </div>
            <p className="text-2xl font-bold text-foreground mt-3">{staff?.length || 0}</p>
            <p className="text-sm text-muted-foreground">Total Staff</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="p-2 rounded-lg bg-chart-4/20 w-fit">
              <CreditCard className="h-5 w-5 text-chart-4" />
            </div>
            <p className="text-2xl font-bold text-foreground mt-3">{staffWithBank.length}</p>
            <p className="text-sm text-muted-foreground">With Bank Details</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="p-2 rounded-lg bg-accent/20 w-fit">
              <Clock className="h-5 w-5 text-accent-foreground" />
            </div>
            <p className="text-2xl font-bold text-foreground mt-3">{staffWithoutBank.length}</p>
            <p className="text-sm text-muted-foreground">Pending Bank Info</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="p-2 rounded-lg bg-chart-1/20 w-fit">
              <CheckCircle className="h-5 w-5 text-chart-1" />
            </div>
            <p className="text-2xl font-bold text-foreground mt-3">
              {payrollRecords?.filter(r => r.status === "completed").length || 0}
            </p>
            <p className="text-sm text-muted-foreground">Payments Made</p>
          </CardContent>
        </Card>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search staff..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
          data-testid="input-search-staff"
        />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="space-y-8">
          {staffWithBank.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Banknote className="h-5 w-5 text-chart-4" />
                  Staff with Bank Details
                </CardTitle>
                <CardDescription>
                  Ready for salary processing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Staff Member</TableHead>
                      <TableHead>Staff ID</TableHead>
                      <TableHead>Bank Name</TableHead>
                      <TableHead>Account Number</TableHead>
                      <TableHead>Last Payment</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {staffWithBank.map((member) => {
                      const latestPayment = getLatestPayment(member.id);
                      return (
                        <TableRow key={member.id} data-testid={`staff-row-${member.id}`}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={member.profileImage || undefined} />
                                <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                                  {getInitials(member.firstName, member.surname)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="font-medium">{member.firstName} {member.surname}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{member.uniqueId}</TableCell>
                          <TableCell>{member.bankName}</TableCell>
                          <TableCell className="font-mono">{member.bankAccountNumber}</TableCell>
                          <TableCell>
                            {latestPayment ? (
                              <Badge variant="outline" className="bg-chart-4/10">
                                {latestPayment.month} {latestPayment.year}
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground text-sm">None</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              size="sm"
                              onClick={() => processPaymentMutation.mutate(member.id)}
                              disabled={processPaymentMutation.isPending}
                              data-testid={`button-process-${member.id}`}
                            >
                              {processPaymentMutation.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                "Process"
                              )}
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {staffWithoutBank.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5 text-accent-foreground" />
                  Pending Bank Information
                </CardTitle>
                <CardDescription>
                  Staff members who haven't submitted bank details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {staffWithoutBank.map((member) => (
                    <div 
                      key={member.id} 
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                      data-testid={`staff-pending-${member.id}`}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={member.profileImage || undefined} />
                          <AvatarFallback className="bg-muted-foreground text-background">
                            {getInitials(member.firstName, member.surname)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-foreground">{member.firstName} {member.surname}</p>
                          <p className="text-sm text-muted-foreground">{member.uniqueId}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-accent/10">
                        <Clock className="h-3 w-3 mr-1" />
                        Awaiting Details
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {filteredStaff.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-1">No Staff Found</h3>
                <p className="text-muted-foreground">
                  {searchTerm ? "Try a different search term" : "No staff members registered yet"}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
