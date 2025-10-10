"use client";

import { useState, useEffect, Suspense } from "react";
import { Eye, EyeOff, Lock, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthProtection } from "@/hooks/useAuthProtection";

function SetPasswordContent() {
  const { isAuthorized, isChecking } = useAuthProtection();
  const router = useRouter();
  const searchParams = useSearchParams();
  const authToken = searchParams.get("auth_token") || "";
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<"loading" | "success" | "failed" | null>(null);

  // Check if token is valid when component mounts
  useEffect(() => {
    const verifyToken = async () => {
      setVerificationStatus("loading");
      
      try {
        const savedApiUrl = localStorage.getItem("pepper-api-url") || "http://localhost:8000/api";
        
        const response = await fetch(`${savedApiUrl}/user/auth/verify?auth_token=${authToken}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        const data = await response.json();
        
        if (data.status === "success" || data.status === "verified") {
          setVerificationStatus("success");
        } else if (data.status === "expired") {
          setVerificationStatus("failed");
          // Could show specific message for expired token
        } else {
          setVerificationStatus("failed");
        }
      } catch (error) {
        console.error("Token verification error:", error);
        setVerificationStatus("failed");
      }
    };

    if (authToken) {
      verifyToken();
    } else {
      setVerificationStatus("failed");
    }
  }, [authToken]);

  const validatePassword = () => {
    if (password.length < 8) {
      return "Password must be at least 8 characters long";
    }
    if (password !== confirmPassword) {
      return "Passwords do not match";
    }
    return null;
  };

  const handleSetPassword = async () => {
    const validationError = validatePassword();
    if (validationError) {
      alert(validationError); // Replace with proper toast notification later
      return;
    }

    setIsSubmitting(true);
    
    try {
      const savedApiUrl = localStorage.getItem("pepper-api-url") || "http://localhost:8000/api";
      
      const response = await fetch(`${savedApiUrl}/signup/set-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          auth_token: authToken,
          password: password
        })
      });

      const data = await response.json();
      
      if (data.status === "success") {
        // Redirect to dashboard or login page
        console.log("Password set successfully, redirecting to dashboard");
        router.push("/dashboard"); // We'll create this later
      } else {
        console.error("Failed to set password:", data.message);
        alert("Failed to set password. Please try again.");
      }
    } catch (error) {
      console.error("Error setting password:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (verificationStatus === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
            <p className="text-muted-foreground">Verifying your link...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (verificationStatus === "failed") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <CardTitle className="text-2xl font-bold">Invalid or Expired Link</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              This verification link is invalid or has expired. Please request a new verification email.
            </p>
            <Button 
              onClick={() => router.push("/")}
              className="w-full"
            >
              Back to Sign Up
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const validationError = validatePassword();

  // Don't render until authorization is confirmed
  if (isChecking || !isAuthorized) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Set Your Password</CardTitle>
          <p className="text-muted-foreground">
            Your email has been verified! Now create a secure password for your account.
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium">
              Confirm Password
            </label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {validationError && (
            <p className="text-sm text-destructive">{validationError}</p>
          )}

          <div className="text-xs text-muted-foreground space-y-1">
            <p>Password requirements:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>At least 8 characters long</li>
              <li>Must match confirmation password</li>
            </ul>
          </div>

          <Button
            onClick={handleSetPassword}
            disabled={isSubmitting || !password || !confirmPassword || !!validationError}
            className="w-full"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Setting Password...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Set Password
              </div>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function SetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </CardContent>
        </Card>
      </div>
    }>
      <SetPasswordContent />
    </Suspense>
  );
}