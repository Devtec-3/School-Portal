import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { GraduationCap, Lock, User, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import schoolLogo from "@assets/school_1764669401414.jpg";

export default function Login() {
  const [uniqueId, setUniqueId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const { login } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!uniqueId.trim() || !password.trim()) {
      setError("Please enter both User ID and password");
      return;
    }

    setIsLoading(true);
    
    try {
      const success = await login(uniqueId.trim(), password.trim());
      
      if (success) {
        toast({
          title: "Login Successful",
          description: "Welcome back to Al-Furqan Portal!",
        });
        setLocation("/dashboard");
      } else {
        setError("Invalid User ID or password. Remember, your password is your surname.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <img 
                src={schoolLogo} 
                alt="Al-Furqan Logo" 
                className="h-20 w-20 rounded-full object-cover border-4 border-primary/20"
                data-testid="img-login-logo"
              />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold" data-testid="text-login-title">Portal Login</CardTitle>
              <CardDescription className="mt-2">
                Access your Al-Furqan Group of Schools portal
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive" data-testid="alert-login-error">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="uniqueId">User ID</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="uniqueId"
                    type="text"
                    placeholder="Enter your User ID"
                    value={uniqueId}
                    onChange={(e) => setUniqueId(e.target.value)}
                    className="pl-10"
                    disabled={isLoading}
                    data-testid="input-user-id"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Your User ID was provided during registration approval
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    disabled={isLoading}
                    data-testid="input-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    data-testid="button-toggle-password"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Your password is your surname (as registered)
                </p>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
                data-testid="button-login-submit"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <GraduationCap className="h-4 w-4 mr-2" />
                    Sign In
                  </>
                )}
              </Button>
            </form>

            <div className="mt-8 p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium text-foreground mb-2 text-sm">New User?</h4>
              <p className="text-sm text-muted-foreground mb-3">
                To register as a new student or staff member:
              </p>
              <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                <li>Download registration forms from the registration page</li>
                <li>Fill and scan the completed forms</li>
                <li>Upload to the portal for approval</li>
                <li>Receive your User ID upon approval</li>
              </ol>
              <a 
                href="/registration" 
                className="text-primary hover:underline text-sm font-medium mt-3 inline-block"
                data-testid="link-registration"
              >
                Go to Registration Page
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
  );
}
