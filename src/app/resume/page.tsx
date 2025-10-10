"use client";

import { Sparkles, LogOut, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logoutRequest, ApiError } from "@/lib/api";
import { useAuthProtection } from "@/hooks/useAuthProtection";
import ResumeCenter from "@/components/resume-center";
import BottomNav from "@/components/bottom-nav";
import ThemeToggle from "@/components/theme-toggle";
import { useState } from "react";

export default function ResumePage() {
  const { isAuthorized, isChecking } = useAuthProtection();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const response = await logoutRequest();
      console.log("Logout response:", response.message);
      localStorage.removeItem("pepper-session");
      alert(response.message || "Logged out successfully!");
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

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Top Header */}
      <header className="shrink-0 bg-background border-b border-border">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">Pepper</h1>
            <div className="hidden md:flex items-center gap-3">
              <div className="h-6 w-px bg-border" />
              <h2 className="text-lg font-medium text-muted-foreground">Resume</h2>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button size="sm" className="gap-2">
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">Get Premium</span>
            </Button>
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <LogOut className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="container max-w-6xl mx-auto px-4 py-8">
          <ResumeCenter />
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
