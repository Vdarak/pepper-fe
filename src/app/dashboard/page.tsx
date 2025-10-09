"use client";

import { useEffect, useState } from "react";
import { User, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { logoutRequest, ApiError } from "@/lib/api";

export default function DashboardPage() {
  const [userEmail, setUserEmail] = useState<string>("");
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    // Get user info from session
    const sessionData = localStorage.getItem("pepper-session");
    if (sessionData) {
      try {
        const session = JSON.parse(sessionData);
        setUserEmail(session.email || "");
      } catch (error) {
        console.error("Failed to parse session data:", error);
      }
    }
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    
    try {
      const response = await logoutRequest();
      console.log("Logout response:", response.message);
      
      // Clear session data
      localStorage.removeItem("pepper-session");
      
      // Show success message briefly before redirect
      alert(response.message || "Logged out successfully!");
      
      // Redirect to home
      window.location.href = "/";
    } catch (error) {
      if (error instanceof ApiError) {
        console.error("Logout failed:", error.message);
        alert(`Logout failed: ${error.message}`);
      } else {
        console.error("Logout error:", error);
        alert("An error occurred during logout. Please try again.");
      }
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary">Welcome to Pepper!</h1>
            <p className="text-muted-foreground">Your account has been successfully created and verified!</p>
          </div>
          <div className="flex items-center gap-3">
            {userEmail && (
              <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{userEmail}</span>
              </div>
            )}
            <Button 
              onClick={handleLogout} 
              variant="outline"
              disabled={isLoggingOut}
            >
              {isLoggingOut ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                  Logging out...
                </>
              ) : (
                <>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </>
              )}
            </Button>
          </div>
        </header>

        {/* Success Message */}
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Account Setup Complete
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Congratulations! You have successfully completed the signup process:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>✅ Email verification completed</li>
                <li>✅ Password set successfully</li>
                <li>✅ Account is now active</li>
              </ul>
              
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-4">
                  This is a placeholder dashboard. The actual application features will be implemented next.
                </p>
                <Button className="w-full">
                  <Settings className="h-4 w-4 mr-2" />
                  Explore Dashboard Features (Coming Soon)
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}