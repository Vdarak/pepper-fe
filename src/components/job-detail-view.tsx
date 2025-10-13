"use client";

import { JobListing } from "@/lib/api";
import {
  MapPin,
  DollarSign,
  Briefcase,
  Building,
  Calendar,
  Globe,
  Users,
  ArrowLeft,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import Image from "next/image";

interface JobDetailViewProps {
  job: JobListing | null;
  onBack?: () => void;
}

export default function JobDetailView({ job, onBack }: JobDetailViewProps) {
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false);

  useEffect(() => {
    const container = document.getElementById("job-detail-scroll-container");
    if (!container) return;

    let lastScrollY = 0;

    const handleScroll = () => {
      const currentScrollY = container.scrollTop;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsHeaderCollapsed(true);
      } else if (currentScrollY < lastScrollY) {
        setIsHeaderCollapsed(false);
      }

      lastScrollY = currentScrollY;
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  if (!job) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <div className="text-center space-y-2">
          <Briefcase className="w-16 h-16 mx-auto opacity-20" />
          <p>Select a job to view details</p>
        </div>
      </div>
    );
  }

  const { Job: jobData, Company: company } = job;

  // Format salary
  const formatSalary = () => {
    const min = jobData.PayYearlyMin;
    const max = jobData.PayYearlyMax;
    const freq = jobData.CompensationFrequency;

    if (freq === "PH") {
      const hourlyMin = jobData.PayHourlyMin || min;
      const hourlyMax = jobData.PayHourlyMax || max;
      return `$${hourlyMin} - $${hourlyMax}/hr`;
    }

    if (min && max) {
      return `$${parseFloat(min).toLocaleString()} - $${parseFloat(max).toLocaleString()}/year`;
    }

    return "Not specified";
  };

  const getSeniorityColor = () => {
    const level = jobData.SeniorityLevel?.toLowerCase() || "";
    if (level.includes("entry") || level.includes("junior")) {
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
    }
    if (level.includes("senior") || level.includes("lead")) {
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
    }
    if (level.includes("mid") || level.includes("intermediate")) {
      return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
    }
    return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
  };

  return (
    <div className="h-full flex flex-col">
      {/* Sticky Header */}
      <div
        className={`sticky top-0 z-10 bg-background border-b border-border transition-all duration-300 ${
          isHeaderCollapsed ? "py-2" : "py-4"
        }`}
      >
        <div className="px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0 flex-1">
            {/* Mobile back button */}
            {onBack && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onBack}
                className="md:hidden shrink-0"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
            )}

            <div
              className={`flex items-center gap-3 min-w-0 transition-all duration-300 ${
                isHeaderCollapsed ? "scale-90" : "scale-100"
              }`}
            >
              {/* Company Logo */}
              <div
                className={`shrink-0 rounded-lg bg-muted flex items-center justify-center overflow-hidden transition-all duration-300 ${
                  isHeaderCollapsed ? "w-10 h-10" : "w-12 h-12"
                }`}
              >
                {company.ImageUrl ? (
                  <Image
                    src={company.ImageUrl}
                    alt={company.Name}
                    width={isHeaderCollapsed ? 40 : 48}
                    height={isHeaderCollapsed ? 40 : 48}
                    className="w-full h-full object-contain p-1"
                  />
                ) : (
                  <Building className="w-6 h-6 text-muted-foreground" />
                )}
              </div>

              {/* Job Title */}
              <div className="min-w-0 flex-1">
                <h2
                  className={`font-bold truncate transition-all duration-300 ${
                    isHeaderCollapsed ? "text-base" : "text-xl"
                  }`}
                >
                  {jobData.Title}
                </h2>
                <p className="text-sm text-muted-foreground truncate">
                  {company.Name}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <Button variant="outline" size={isHeaderCollapsed ? "sm" : "default"}>
              Save
            </Button>
            <Button size={isHeaderCollapsed ? "sm" : "default"} asChild>
              <a href={jobData.ApplyURL} target="_blank" rel="noopener noreferrer">
                Apply
                <ExternalLink className="w-4 h-4 ml-2" />
              </a>
            </Button>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div
        id="job-detail-scroll-container"
        className="flex-1 overflow-y-auto px-6 py-6 space-y-6 scrollbar-thin"
      >
        {/* Key Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <DollarSign className="w-4 h-4" />
                <span className="text-sm font-medium">Salary Range</span>
              </div>
              <p className="text-lg font-semibold">{formatSalary()}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span className="text-sm font-medium">Location</span>
              </div>
              <p className="text-lg font-semibold">{jobData.Location}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Briefcase className="w-4 h-4" />
                <span className="text-sm font-medium">Employment Type</span>
              </div>
              <p className="text-lg font-semibold">
                {jobData.Commitment || "Not specified"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Building className="w-4 h-4" />
                <span className="text-sm font-medium">Workplace Type</span>
              </div>
              <p className="text-lg font-semibold">
                {jobData.WorkPlaceType || "Not specified"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {jobData.SeniorityLevel && (
            <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${getSeniorityColor()}`}>
              {jobData.SeniorityLevel}
            </span>
          )}
          {jobData.VisaSponsorship && (
            <span className="px-3 py-1.5 rounded-full text-sm font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
              Visa Sponsorship
            </span>
          )}
          {jobData.JobSector && (
            <span className="px-3 py-1.5 rounded-full text-sm font-medium bg-accent text-accent-foreground">
              {jobData.JobSector}
            </span>
          )}
        </div>

        {/* Job Description */}
        {jobData.Description && (
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-semibold">Job Description</h3>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <p className="whitespace-pre-wrap text-sm leading-relaxed">
                  {jobData.Description}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Requirements */}
        {jobData.RequirementSummary && (
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-semibold">Requirements</h3>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <p className="whitespace-pre-wrap text-sm leading-relaxed">
                  {jobData.RequirementSummary}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tech Tools */}
        {jobData.TechTools && (
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-semibold">Technologies & Tools</h3>
              <p className="text-sm">{jobData.TechTools}</p>
            </CardContent>
          </Card>
        )}

        {/* Major Duties (from res1) */}
        {jobData.res1 && Array.isArray(jobData.res1) && jobData.res1.length > 0 && (
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-semibold">Major Duties</h3>
              {jobData.res1.map((duty, index) => (
                <div key={index} className="prose prose-sm dark:prose-invert max-w-none">
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">{duty}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Company Information */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <h3 className="text-lg font-semibold">About {company.Name}</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              {company.Website && (
                <div className="space-y-1">
                  <p className="text-muted-foreground">Website</p>
                  <a
                    href={company.Website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline flex items-center gap-1"
                  >
                    <Globe className="w-4 h-4" />
                    Visit Website
                  </a>
                </div>
              )}

              {company.LinkedIn && (
                <div className="space-y-1">
                  <p className="text-muted-foreground">LinkedIn</p>
                  <a
                    href={company.LinkedIn}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline flex items-center gap-1"
                  >
                    View Profile
                  </a>
                </div>
              )}

              {company.YearFounded && (
                <div className="space-y-1">
                  <p className="text-muted-foreground">Founded</p>
                  <p className="font-medium">{company.YearFounded}</p>
                </div>
              )}

              {company.HQCountry && (
                <div className="space-y-1">
                  <p className="text-muted-foreground">Headquarters</p>
                  <p className="font-medium">{company.HQCountry}</p>
                </div>
              )}

              {company.NumEmployees !== null && (
                <div className="space-y-1">
                  <p className="text-muted-foreground">Company Size</p>
                  <p className="font-medium flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {company.NumEmployees.toLocaleString()} employees
                  </p>
                </div>
              )}

              {company.Industries && (
                <div className="space-y-1">
                  <p className="text-muted-foreground">Industry</p>
                  <p className="font-medium">{company.Industries}</p>
                </div>
              )}

              <div className="space-y-1">
                <p className="text-muted-foreground">Type</p>
                <p className="font-medium">
                  {company.IsPublic ? "Public" : "Private"}
                  {company.IsNonProfit && " • Non-Profit"}
                </p>
              </div>
            </div>

            {company.Tagline && (
              <div className="pt-4 border-t border-border">
                <p className="text-sm italic text-muted-foreground">{company.Tagline}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Posted Date */}
        {jobData.PublishedOn && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>
              Posted on {new Date(jobData.PublishedOn).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
