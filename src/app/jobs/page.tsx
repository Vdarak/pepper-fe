"use client";

import { useEffect, useState } from "react";
import { Sparkles, LogOut, Loader2 } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { fetchJobs, logoutRequest, JobListing, ApiError } from "@/lib/api";
import { useAuthProtection } from "@/hooks/useAuthProtection";
import JobCard from "@/components/job-card";
import JobDetailView from "@/components/job-detail-view";
import JobFilter from "@/components/job-filter";
import BottomNav from "@/components/bottom-nav";
import ThemeToggle from "@/components/theme-toggle";

export default function JobsPage() {
  const { isAuthorized, isChecking } = useAuthProtection();
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<JobListing | null>(null);
  const [isFilterCollapsed, setIsFilterCollapsed] = useState(false);
  const [isMobileDetailView, setIsMobileDetailView] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Fetch jobs on mount
  useEffect(() => {
    const loadJobs = async () => {
      try {
        setIsLoading(true);
        const jobsData = await fetchJobs(30);
        setJobs(jobsData);
        
        // Auto-select first job on desktop
        if (jobsData.length > 0 && window.innerWidth >= 768) {
          setSelectedJob(jobsData[0]);
        }
      } catch (error) {
        if (error instanceof ApiError) {
          console.error("Failed to fetch jobs:", error.message);
          alert(`Failed to load jobs: ${error.message}`);
        } else {
          console.error("Error fetching jobs:", error);
          alert("An error occurred while loading jobs");
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthorized) {
      loadJobs();
    }
  }, [isAuthorized]);

  // Auto-collapse filter on scroll
  useEffect(() => {
    const leftPane = document.getElementById("jobs-left-pane");
    
    if (!leftPane) return;

    let lastScrollY = 0;

    const handleScroll = (e: Event) => {
      const target = e.target as HTMLElement;
      const currentScrollY = target.scrollTop;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsFilterCollapsed(true);
      }

      lastScrollY = currentScrollY;
    };

    leftPane.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      leftPane.removeEventListener("scroll", handleScroll);
    };
  }, []);

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

  const handleJobSelect = (job: JobListing) => {
    setSelectedJob(job);
    // On mobile, show detail view
    if (window.innerWidth < 768) {
      setIsMobileDetailView(true);
    }
  };

  const handleBackToList = () => {
    setIsMobileDetailView(false);
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
            <div className="flex items-center gap-2">
              <Image 
                src="/pepper-logo.svg" 
                alt="Pepper Logo" 
                width={32} 
                height={32}
                className="w-8 h-8"
              />
              <h1 className="text-2xl font-bold">Pepper</h1>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <div className="h-6 w-px bg-border" />
              <h2 className="text-lg font-medium text-muted-foreground">Jobs</h2>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="hidden md:flex">
              Saved
            </Button>
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

      {/* Main Content - Two Pane Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Pane - Job Cards (Hidden on mobile when detail view is open) */}
        <div
          className={`w-full md:w-[30vw] border-r border-border flex flex-col overflow-hidden ${
            isMobileDetailView ? "hidden md:flex" : "flex"
          }`}
        >
          {/* Filter */}
          <div className="shrink-0">
            <JobFilter
              isCollapsed={isFilterCollapsed}
              onToggle={() => setIsFilterCollapsed(!isFilterCollapsed)}
            />
          </div>

          {/* Job Cards List */}
          <div
            id="jobs-left-pane"
            className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin"
          >
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p>No jobs found</p>
              </div>
            ) : (
              jobs.map((job, index) => (
                <JobCard
                  key={`${job.Job.ApplyURL}-${index}`}
                  job={job}
                  isActive={selectedJob?.Job.ApplyURL === job.Job.ApplyURL}
                  onClick={() => handleJobSelect(job)}
                />
              ))
            )}
          </div>
        </div>

        {/* Right Pane - Job Detail */}
        <div
          className={`flex-1 bg-muted/30 flex flex-col overflow-hidden ${
            isMobileDetailView ? "flex w-full" : "hidden md:flex"
          }`}
        >
          <JobDetailView
            job={selectedJob}
            onBack={handleBackToList}
          />
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
