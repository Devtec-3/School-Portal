import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { SiteSetting } from "@shared/schema";
import { 
  Settings as SettingsIcon, 
  Loader2,
  Save,
  School,
  Lock,
  Unlock,
  Phone,
  MapPin
} from "lucide-react";

export default function Settings() {
  const { toast } = useToast();
  
  const [schoolName, setSchoolName] = useState("");
  const [schoolAddress, setSchoolAddress] = useState("");
  const [schoolPhone, setSchoolPhone] = useState("");
  const [schoolEmail, setSchoolEmail] = useState("");
  const [schoolMotto, setSchoolMotto] = useState("");
  const [resultsReleased, setResultsReleased] = useState(false);

  const { data: settings, isLoading } = useQuery<SiteSetting[]>({
    queryKey: ["/api/settings"],
  });

  useEffect(() => {
    if (settings) {
      setSchoolName(settings.find(s => s.key === "school_name")?.value || "Al-Furqan Group of Schools");
      setSchoolAddress(settings.find(s => s.key === "school_address")?.value || "");
      setSchoolPhone(settings.find(s => s.key === "school_phone")?.value || "");
      setSchoolEmail(settings.find(s => s.key === "school_email")?.value || "");
      setSchoolMotto(settings.find(s => s.key === "school_motto")?.value || "");
      setResultsReleased(settings.find(s => s.key === "results_released")?.value === "true");
    }
  }, [settings]);

  const updateMutation = useMutation({
    mutationFn: async (settingsData: { key: string; value: string }[]) => {
      return apiRequest("POST", "/api/settings", { settings: settingsData });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
      toast({ title: "Settings Saved", description: "School settings have been updated." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to save settings.", variant: "destructive" });
    }
  });

  const handleSave = () => {
    updateMutation.mutate([
      { key: "school_name", value: schoolName },
      { key: "school_address", value: schoolAddress },
      { key: "school_phone", value: schoolPhone },
      { key: "school_email", value: schoolEmail },
      { key: "school_motto", value: schoolMotto },
      { key: "results_released", value: resultsReleased.toString() },
    ]);
  };

  const toggleResultsMutation = useMutation({
    mutationFn: async (released: boolean) => {
      return apiRequest("POST", "/api/settings", { 
        settings: [{ key: "results_released", value: released.toString() }] 
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
      toast({ 
        title: resultsReleased ? "Results Hidden" : "Results Released", 
        description: resultsReleased 
          ? "Student results are now hidden" 
          : "Students can now view their results"
      });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update results visibility.", variant: "destructive" });
    }
  });

  const handleResultsToggle = (checked: boolean) => {
    setResultsReleased(checked);
    toggleResultsMutation.mutate(checked);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground" data-testid="text-settings-title">
          System Settings
        </h1>
        <p className="text-muted-foreground mt-1">
          Configure school information and system preferences
        </p>
      </div>

      <Card className={resultsReleased ? "border-chart-4" : "border-accent"}>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center justify-between">
            <span className="flex items-center gap-2">
              {resultsReleased ? (
                <Unlock className="h-5 w-5 text-chart-4" />
              ) : (
                <Lock className="h-5 w-5 text-accent-foreground" />
              )}
              Results Visibility
            </span>
            <Switch
              checked={resultsReleased}
              onCheckedChange={handleResultsToggle}
              disabled={toggleResultsMutation.isPending}
              data-testid="switch-results-released"
            />
          </CardTitle>
          <CardDescription>
            {resultsReleased 
              ? "Students can currently view their academic results" 
              : "Academic results are hidden from students"}
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <School className="h-5 w-5 text-primary" />
            School Information
          </CardTitle>
          <CardDescription>
            Basic information about the school
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="schoolName">School Name</Label>
            <Input
              id="schoolName"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              placeholder="Enter school name"
              data-testid="input-school-name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="schoolMotto">School Motto</Label>
            <Input
              id="schoolMotto"
              value={schoolMotto}
              onChange={(e) => setSchoolMotto(e.target.value)}
              placeholder="Enter school motto"
              data-testid="input-school-motto"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="schoolAddress" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              School Address
            </Label>
            <Textarea
              id="schoolAddress"
              value={schoolAddress}
              onChange={(e) => setSchoolAddress(e.target.value)}
              placeholder="Enter school address"
              rows={2}
              data-testid="textarea-school-address"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="schoolPhone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Phone Number
              </Label>
              <Input
                id="schoolPhone"
                value={schoolPhone}
                onChange={(e) => setSchoolPhone(e.target.value)}
                placeholder="+234..."
                data-testid="input-school-phone"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="schoolEmail">Email Address</Label>
              <Input
                id="schoolEmail"
                type="email"
                value={schoolEmail}
                onChange={(e) => setSchoolEmail(e.target.value)}
                placeholder="school@email.com"
                data-testid="input-school-email"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button 
          onClick={handleSave} 
          disabled={updateMutation.isPending}
          data-testid="button-save-settings"
        >
          {updateMutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Settings
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
