"use client";

import { useState, useEffect, Suspense } from "react";
import { Mail, Clock, ArrowLeft, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter, useSearchParams } from "next/navigation";
import { resendVerificationEmail, ApiError } from "@/lib/api";

function EmailVerificationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get("email") || "";
  
  const [email, setEmail] = useState(initialEmail);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isResending, setIsResending] = useState(false);

  // Start cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleResendEmail = async (newEmail?: string) => {
    if (resendCooldown > 0 || isResending) return;

    const emailToUse = newEmail || email;
    
    if (!emailToUse.trim()) {
      alert("Please enter a valid email address");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailToUse)) {
      alert("Please enter a valid email address");
      return;
    }

    setIsResending(true);
    
    try {
      await resendVerificationEmail(emailToUse);
      
      // Start 60-second cooldown
      setResendCooldown(60);
      setEmail(emailToUse);
      setIsEditingEmail(false);
      console.log("Verification email sent successfully");
    } catch (error) {
      if (error instanceof ApiError) {
        console.error("Failed to send email:", error.message);
        alert(error.message);
      } else {
        console.error("Error sending email:", error);
        alert("An error occurred while sending the email. Please try again.");
      }
    } finally {
      setIsResending(false);
    }
  };

  const handleChangeEmail = () => {
    setIsEditingEmail(true);
  };

  const handleCancelEditEmail = () => {
    setEmail(initialEmail);
    setIsEditingEmail(false);
  };

  const handleSaveNewEmail = () => {
    handleResendEmail(email);
  };

  const handleBackToSignup = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Check Your Email</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              We&apos;ve sent a verification link to:
            </p>
            
            {isEditingEmail ? (
              <div className="space-y-3">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="text-center"
                />
                <div className="flex gap-2">
                  <Button
                    onClick={handleSaveNewEmail}
                    disabled={isResending}
                    className="flex-1"
                  >
                    {isResending ? "Sending..." : "Send to New Email"}
                  </Button>
                  <Button
                    onClick={handleCancelEditEmail}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="font-medium text-foreground bg-muted px-3 py-2 rounded-md break-all">
                  {email}
                </p>
                <Button
                  onClick={handleChangeEmail}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  <Edit2 className="h-3 w-3 mr-1" />
                  Change Email
                </Button>
              </div>
            )}
          </div>

          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Click the link in your email to verify your account and continue with setup.
            </p>
            
            <div className="bg-muted/50 p-4 rounded-lg text-xs text-muted-foreground">
              <p className="font-medium mb-2">📧 Quick Instructions:</p>
              <ol className="text-left space-y-1 list-decimal list-inside">
                <li>Check your email inbox for our verification email</li>
                <li>Click the verification link in the email</li>
                <li>Follow the instructions to complete your account setup</li>
              </ol>
              <p className="mt-2 italic text-xs">Pro tip: I'm as efficient as Pepper Potts - your email should arrive faster than a Stark Industries delivery!</p>
            </div>
            
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground">
                Didn&apos;t receive the email? Check your spam folder or request a new one.
              </p>
              
              {!isEditingEmail && (
                <Button
                  onClick={() => handleResendEmail()}
                  disabled={resendCooldown > 0 || isResending}
                  variant="outline"
                  className="w-full"
                >
                  {isResending ? (
                    "Sending..."
                  ) : resendCooldown > 0 ? (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>Resend in {resendCooldown}s</span>
                    </div>
                  ) : (
                    "Resend Verification Email"
                  )}
                </Button>
              )}
            </div>
          </div>

          <div className="pt-4 border-t">
            <Button
              onClick={handleBackToSignup}
              variant="ghost"
              className="w-full"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Sign Up
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function EmailVerificationPage() {
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
      <EmailVerificationContent />
    </Suspense>
  );
}