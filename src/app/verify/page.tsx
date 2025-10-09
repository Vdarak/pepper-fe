"use client";

import { useState, useEffect, Suspense } from "react";
import { CheckCircle, XCircle, Loader2, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter, useSearchParams } from "next/navigation";
import { verifySignupToken, ApiError } from "@/lib/api";

type VerificationState = 'loading' | 'success' | 'error';

function VerificationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  
  const [verificationState, setVerificationState] = useState<VerificationState>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    if (!token) {
      setVerificationState('error');
      setErrorMessage('Invalid verification link. No token provided.');
      return;
    }

    verifyToken();
  }, [token]);

  const verifyToken = async () => {
    if (!token) return;

    try {
      setVerificationState('loading');
      const response = await verifySignupToken(token);
      
      // API returns a success message string
      console.log('✓ Verification response:', response);
      setVerificationState('success');
      
      // Redirect to account setup after a brief delay
      setTimeout(() => {
        router.push('/account-setup');
      }, 2000);
      
    } catch (error) {
      setVerificationState('error');
      if (error instanceof ApiError) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('Failed to verify your account. Please try again.');
      }
    }
  };

  const handleStartAgain = () => {
    router.push('/');
  };

  const handleRetry = () => {
    if (token) {
      verifyToken();
    }
  };

  if (verificationState === 'loading') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
            <h2 className="text-xl font-semibold mb-2">Verifying Your Account</h2>
            <p className="text-muted-foreground text-center">
              Please wait while we verify your email address...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (verificationState === 'success') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-green-600">Email Verified!</CardTitle>
          </CardHeader>
          
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              Your email address has been successfully verified.
            </p>
            <p className="text-sm text-muted-foreground">
              Redirecting you to complete your account setup...
            </p>
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="h-3 w-3 animate-spin" />
              <span>Please wait</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-red-600">Verification Failed</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              We couldn&apos;t verify your email address.
            </p>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-700">
                {errorMessage}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleRetry}
              className="w-full"
              variant="outline"
            >
              Try Again
            </Button>
            
            <Button
              onClick={handleStartAgain}
              className="w-full"
            >
              <Home className="h-4 w-4 mr-2" />
              Start Over
            </Button>
          </div>

          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              If you continue to have issues, please contact support or try signing up again.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
            <p className="text-muted-foreground">Loading verification...</p>
          </CardContent>
        </Card>
      </div>
    }>
      <VerificationContent />
    </Suspense>
  );
}