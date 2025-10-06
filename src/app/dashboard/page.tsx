"use client";

import { useEffect } from "react";
import { User, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  useEffect(() => {
    // In a real app, you'd get user info from session/token
    // For now, just show a welcome message
    console.log("Dashboard loaded - user successfully signed up and set password!");
  }, []);

  const handleLogout = () => {
    // Clear any stored tokens/session data
    localStorage.removeItem("pepper-session");
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary">Welcome to Pepper! 🌶️</h1>
            <p className="text-muted-foreground">Your account has been successfully created and verified!</p>
          </div>
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
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