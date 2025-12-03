import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  CreditCard, 
  Building2, 
  Loader2,
  CheckCircle,
  AlertCircle,
  Save
} from "lucide-react";

export default function BankDetails() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (user) {
      setBankAccountNumber(user.bankAccountNumber || "");
      setBankName(user.bankName || "");
      setIsSaved(!!(user.bankAccountNumber && user.bankName));
    }
  }, [user]);

  const updateMutation = useMutation({
    mutationFn: async (data: { bankAccountNumber: string; bankName: string }) => {
      return apiRequest("PATCH", `/api/users/${user?.id}/bank-details`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      toast({ title: "Bank Details Updated", description: "Your bank information has been saved." });
      setIsSaved(true);
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update bank details.", variant: "destructive" });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!bankAccountNumber.trim() || !bankName.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in both bank account number and bank name",
        variant: "destructive",
      });
      return;
    }

    if (bankAccountNumber.length < 10) {
      toast({
        title: "Invalid Account Number",
        description: "Account number should be at least 10 digits",
        variant: "destructive",
      });
      return;
    }

    updateMutation.mutate({ bankAccountNumber: bankAccountNumber.trim(), bankName: bankName.trim() });
  };

  const hasChanges = bankAccountNumber !== (user?.bankAccountNumber || "") || 
                     bankName !== (user?.bankName || "");

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground" data-testid="text-bank-title">
          Bank Details
        </h1>
        <p className="text-muted-foreground mt-1">
          Enter your bank account information for salary processing
        </p>
      </div>

      {!isSaved && (
        <Card className="border-accent bg-accent/10">
          <CardContent className="p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-accent-foreground flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-foreground">Bank Details Required</p>
              <p className="text-sm text-muted-foreground">
                Please provide your bank account information so that your salary can be processed correctly.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            Payment Information
          </CardTitle>
          <CardDescription>
            This information will be used for salary payments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="bankName">Bank Name</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="bankName"
                  placeholder="e.g., First Bank, GTBank, Access Bank"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="pl-10"
                  data-testid="input-bank-name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bankAccountNumber">Account Number</Label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="bankAccountNumber"
                  placeholder="Enter your 10-digit account number"
                  value={bankAccountNumber}
                  onChange={(e) => setBankAccountNumber(e.target.value.replace(/\D/g, ""))}
                  className="pl-10"
                  maxLength={10}
                  data-testid="input-account-number"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Enter your 10-digit NUBAN account number
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center gap-2">
                {isSaved && !hasChanges && (
                  <span className="text-sm text-chart-4 flex items-center gap-1">
                    <CheckCircle className="h-4 w-4" />
                    Saved
                  </span>
                )}
                {hasChanges && (
                  <span className="text-sm text-muted-foreground">
                    Unsaved changes
                  </span>
                )}
              </div>
              <Button 
                type="submit" 
                disabled={updateMutation.isPending || !hasChanges}
                data-testid="button-save-bank"
              >
                {updateMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Details
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="bg-muted/50">
        <CardContent className="p-4">
          <h4 className="font-medium text-foreground mb-2">Important Information</h4>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
            <li>Ensure your account number is correct before saving</li>
            <li>Only use bank accounts registered in your name</li>
            <li>Salary payments are processed monthly by the management</li>
            <li>Contact management if you need to make any corrections</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
