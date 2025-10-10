"use client";

import { useEffect, useState } from "react";
import { ShieldAlert, Home } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function UnauthorizedPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Countdown timer
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          router.replace("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [router]);

  const handleGoHome = () => {
    router.replace("/");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <ShieldAlert className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="text-2xl font-bold text-destructive">Unauthorized Access</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6 text-center">
          <div className="space-y-2">
            <p className="text-muted-foreground">
              You don't have permission to access this page.
            </p>
            <p className="text-muted-foreground">
              This could be because:
            </p>
            <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
              <li>You're not logged in</li>
              <li>Your session has expired</li>
              <li>You don't have the required permissions</li>
            </ul>
          </div>

          <div className="pt-4 border-t">
            <div className="mb-4 p-4 bg-muted rounded-lg">
              <p className="text-sm font-medium mb-2">
                Redirecting to home page in:
              </p>
              <div className="text-4xl font-bold text-primary">
                {countdown}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                seconds
              </p>
            </div>

            <Button 
              onClick={handleGoHome}
              className="w-full"
            >
              <Home className="h-4 w-4 mr-2" />
              Go to Home Now
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
