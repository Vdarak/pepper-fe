"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface JobFilterProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export default function JobFilter({ isCollapsed, onToggle }: JobFilterProps) {
  const [filters, setFilters] = useState({
    location: "",
    jobType: [] as string[],
    seniorityLevel: [] as string[],
    salaryMin: "",
    salaryMax: "",
    visaSponsorship: false,
    remoteOnly: false,
  });

  const jobTypes = ["Full-time", "Part-time", "Contract", "Internship"];
  const seniorityLevels = ["Entry Level", "Mid Level", "Senior Level", "Lead", "Director"];

  const handleJobTypeChange = (type: string, checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      jobType: checked
        ? [...prev.jobType, type]
        : prev.jobType.filter((t) => t !== type),
    }));
  };

  const handleSeniorityChange = (level: string, checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      seniorityLevel: checked
        ? [...prev.seniorityLevel, level]
        : prev.seniorityLevel.filter((l) => l !== level),
    }));
  };

  const clearFilters = () => {
    setFilters({
      location: "",
      jobType: [],
      seniorityLevel: [],
      salaryMin: "",
      salaryMax: "",
      visaSponsorship: false,
      remoteOnly: false,
    });
  };

  const applyFilters = () => {
    // TODO: Implement filter application logic
    console.log("Applying filters:", filters);
    onToggle(); // Collapse after applying
  };

  // Get active filter tags
  const getActiveFilters = () => {
    const active = [];
    if (filters.location) active.push(filters.location);
    if (filters.salaryMin || filters.salaryMax) {
      active.push(`$${filters.salaryMin || "0"} - $${filters.salaryMax || "∞"}`);
    }
    active.push(...filters.jobType);
    active.push(...filters.seniorityLevel);
    if (filters.visaSponsorship) active.push("Visa Sponsorship");
    if (filters.remoteOnly) active.push("Remote");
    return active;
  };

  const activeFilters = getActiveFilters();
  const hasActiveFilters = activeFilters.length > 0;

  return (
    <div className="bg-card border-b border-border overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-border">
        <button
          onClick={onToggle}
          className="flex items-center gap-2 hover:text-primary transition-colors"
        >
          <Filter className="w-4 h-4" />
          <span className="font-medium text-sm">
            {isCollapsed ? "Show Filters" : "Hide Filters"}
          </span>
          <div className="transition-transform duration-300">
            {isCollapsed ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronUp className="w-4 h-4" />
            )}
          </div>
        </button>

        <div className="flex items-center gap-2">
          <div className={`
            flex items-center gap-2 overflow-hidden transition-all duration-300
            ${!isCollapsed ? "opacity-100 max-h-10" : "opacity-0 max-h-0"}
          `}>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="h-7 text-xs">
                <X className="w-3 h-3 mr-1" />
                Clear All
              </Button>
            )}
            <Button variant="default" size="sm" onClick={applyFilters} className="h-7 text-xs">
              Apply Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Collapsed - Show Active Filters as Tags */}
      <div className={`
        px-4 flex flex-wrap gap-1.5 overflow-hidden transition-all duration-300 ease-in-out
        ${isCollapsed && hasActiveFilters ? "py-2 max-h-20 opacity-100" : "py-0 max-h-0 opacity-0"}
      `}>
        {activeFilters.map((filter, index) => (
          <span
            key={index}
            className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs font-medium"
          >
            {filter}
          </span>
        ))}
      </div>

      {/* Expanded Filter Content */}
      <div className={`
        overflow-hidden transition-all duration-300 ease-in-out
        ${!isCollapsed ? "max-h-[40vh] opacity-100" : "max-h-0 opacity-0"}
      `}>
        <div className="px-4 pb-4 pt-3 overflow-y-auto" style={{ maxHeight: "40vh" }}>
          <div className="grid grid-cols-2 gap-x-4 gap-y-3">
            {/* Location - Full Width */}
            <div className="col-span-2 space-y-1.5">
              <Label htmlFor="location" className="text-xs font-medium">
                Location
              </Label>
              <Input
                id="location"
                placeholder="e.g., San Francisco, CA"
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                className="h-8 text-sm"
              />
            </div>

            {/* Salary Range */}
            <div className="col-span-2 space-y-1.5">
              <Label className="text-xs font-medium">Salary Range (Annual)</Label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="Min"
                  type="number"
                  value={filters.salaryMin}
                  onChange={(e) => setFilters({ ...filters, salaryMin: e.target.value })}
                  className="h-8 text-sm"
                />
                <Input
                  placeholder="Max"
                  type="number"
                  value={filters.salaryMax}
                  onChange={(e) => setFilters({ ...filters, salaryMax: e.target.value })}
                  className="h-8 text-sm"
                />
              </div>
            </div>

            {/* Job Type - Left Column */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Job Type</Label>
              <div className="space-y-1.5">
                {jobTypes.map((type) => (
                  <div key={type} className="flex items-center gap-2">
                    <Checkbox
                      id={`jobtype-${type}`}
                      checked={filters.jobType.includes(type)}
                      onCheckedChange={(checked) =>
                        handleJobTypeChange(type, checked as boolean)
                      }
                    />
                    <label
                      htmlFor={`jobtype-${type}`}
                      className="text-xs cursor-pointer"
                    >
                      {type}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Seniority Level - Right Column */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Seniority Level</Label>
              <div className="space-y-1.5">
                {seniorityLevels.map((level) => (
                  <div key={level} className="flex items-center gap-2">
                    <Checkbox
                      id={`seniority-${level}`}
                      checked={filters.seniorityLevel.includes(level)}
                      onCheckedChange={(checked) =>
                        handleSeniorityChange(level, checked as boolean)
                      }
                    />
                    <label
                      htmlFor={`seniority-${level}`}
                      className="text-xs cursor-pointer"
                    >
                      {level}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Filters - Full Width */}
            <div className="col-span-2 space-y-1.5 pt-2 border-t border-border">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="visa-sponsorship"
                  checked={filters.visaSponsorship}
                  onCheckedChange={(checked) =>
                    setFilters({ ...filters, visaSponsorship: checked as boolean })
                  }
                />
                <label htmlFor="visa-sponsorship" className="text-xs cursor-pointer">
                  Visa Sponsorship Available
                </label>
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="remote-only"
                  checked={filters.remoteOnly}
                  onCheckedChange={(checked) =>
                    setFilters({ ...filters, remoteOnly: checked as boolean })
                  }
                />
                <label htmlFor="remote-only" className="text-xs cursor-pointer">
                  Remote Only
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
