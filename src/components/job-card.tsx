"use client";

import { JobListing } from "@/lib/api";
import { MapPin, DollarSign, Building, Bookmark, ThumbsUp, ThumbsDown, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface JobCardProps {
  job: JobListing;
  isActive?: boolean;
  onClick?: () => void;
}

export default function JobCard({ job, isActive = false, onClick }: JobCardProps) {
  const { Job: jobData, Company: company } = job;

  // Format salary range
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
      const formatNum = (num: string) => {
        const n = parseFloat(num);
        if (n >= 1000) return `${(n / 1000).toFixed(0)}k`;
        return n.toFixed(0);
      };
      return `$${formatNum(min)} - $${formatNum(max)}`;
    }

    return null;
  };

  // Get seniority level badge color
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

  // Get visa sponsorship badge
  const getVisaBadge = () => {
    const visa = jobData.VisaSponsorship?.toLowerCase() || "";
    if (visa.includes("yes") || visa.includes("available") || visa.includes("h1b")) {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
          H1B ✓
        </span>
      );
    }
    return null;
  };

  const salary = formatSalary();
  const visaBadge = getVisaBadge();

  return (
    <Card
      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
        isActive ? "ring-2 ring-primary shadow-md" : ""
      }`}
      onClick={onClick}
    >
      <CardContent className="p-4 space-y-3">
        {/* Tags Row */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          {visaBadge}
          {jobData.SeniorityLevel && (
            <span className={`px-2 py-1 rounded-full font-medium ${getSeniorityColor()}`}>
              {jobData.SeniorityLevel}
            </span>
          )}
        </div>

        {/* Company Logo and Job Info */}
        <div className="flex gap-3">
          {/* Company Logo */}
          <div className="w-12 h-12 shrink-0 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
            {company.ImageUrl ? (
              <img src={company.ImageUrl} alt={company.Name} className="w-full h-full object-contain p-1" />
            ) : (
              <Building className="w-6 h-6 text-muted-foreground" />
            )}
          </div>

          {/* Job Details */}
          <div className="flex-1 min-w-0 space-y-1">
            <h3 className="font-semibold text-base line-clamp-2 leading-tight">
              {jobData.Title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-1">
              {company.Name}
              {company.Tagline && ` • ${company.Tagline}`}
            </p>
          </div>
        </div>

        {/* Separator */}
        <div className="h-px bg-border" />

        {/* Bottom Info */}
        <div className="flex items-center justify-between text-xs text-muted-foreground gap-2">
          <div className="flex items-center gap-1 min-w-0">
            {salary && (
              <div className="flex items-center gap-1">
                <DollarSign className="w-3 h-3 shrink-0" />
                <span className="truncate">{salary}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-1 min-w-0">
            <MapPin className="w-3 h-3 shrink-0" />
            <span className="truncate">{jobData.Location}</span>
          </div>
        </div>

        {/* Apply Button Row */}
        <div className="flex items-center justify-between gap-2 pt-2">
          <div className="flex gap-2">
            <Button variant="secondary" size="icon" className="w-7 h-7">
              <Bookmark className="w-3.5 h-3.5" />
            </Button>
            <Button variant="secondary" size="icon" className="w-7 h-7">
              <ThumbsUp className="w-3.5 h-3.5" />
            </Button>
            <Button variant="secondary" size="icon" className="w-7 h-7">
              <ThumbsDown className="w-3.5 h-3.5" />
            </Button>
          </div>
          <Button
            variant="default"
            size="sm"
            className="h-7 px-3 gap-1.5"
            asChild
            onClick={(e) => e.stopPropagation()}
          >
            <a href={jobData.ApplyURL} target="_blank" rel="noopener noreferrer">
              Apply
              <ExternalLink className="w-3 h-3" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
