"use client";

import { useState, Suspense } from "react";
import { Briefcase, Target, ArrowRight, MapPin, DollarSign, Globe, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { submitUserPreferences, ApiError, type UserPreferencesData } from "@/lib/api";

interface FormData {
  job_title: string;
  commitment: string;
  part_time: boolean;
  full_time: boolean;
  internship: boolean;
  contract: boolean;
  visa_sponsorship: boolean;
  location: string;
  pay_type: "yearly" | "hourly" | "";
  pay_yearly_max: string;
  pay_yearly_min: string;
  pay_hourly_max: string;
  pay_hourly_min: string;
  goal_choice: string;
}

const COMMITMENT_OPTIONS = [
  { value: "remote", label: "Remote" },
  { value: "in-person", label: "In-Person" },
  { value: "hybrid", label: "Hybrid" }
];

const CAREER_GOALS = [
  { 
    value: "advance", 
    label: "Advance my career",
    description: "Level up to a senior role or leadership position"
  },
  { 
    value: "shift", 
    label: "Shift my career path",
    description: "Transition to a new industry or role type"
  },
  { 
    value: "enjoy", 
    label: "Enjoy better work style",
    description: "Find better work-life balance and company culture"
  }
];

function PreferencesContent() {
  const router = useRouter();
  const [currentSection, setCurrentSection] = useState<"role" | "goal">("role");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    job_title: "",
    commitment: "",
    part_time: false,
    full_time: false,
    internship: false,
    contract: false,
    visa_sponsorship: false,
    location: "",
    pay_type: "",
    pay_yearly_max: "",
    pay_yearly_min: "",
    pay_hourly_max: "",
    pay_hourly_min: "",
    goal_choice: ""
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const updateFormData = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateRoleSection = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    let isValid = true;

    if (!formData.job_title.trim()) {
      newErrors.job_title = "Job title is required";
      isValid = false;
    }

    if (!formData.commitment) {
      newErrors.commitment = "Work arrangement is required";
      isValid = false;
    }

    if (!formData.part_time && !formData.full_time && !formData.internship && !formData.contract) {
      newErrors.part_time = "Please select at least one job type";
      isValid = false;
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
      isValid = false;
    }

    // Validate salary if pay_type is selected
    if (formData.pay_type === "yearly") {
      if (!formData.pay_yearly_min || !formData.pay_yearly_max) {
        newErrors.pay_yearly_min = "Please enter both min and max yearly salary";
        isValid = false;
      }
    } else if (formData.pay_type === "hourly") {
      if (!formData.pay_hourly_min || !formData.pay_hourly_max) {
        newErrors.pay_hourly_min = "Please enter both min and max hourly rate";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const validateGoalSection = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    let isValid = true;

    if (!formData.goal_choice) {
      newErrors.goal_choice = "Please select your career goal";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleNextToGoal = () => {
    if (validateRoleSection()) {
      setCurrentSection("goal");
    }
  };

  const handleBackToRole = () => {
    setCurrentSection("role");
  };

  const handleSubmit = async () => {
    if (!validateGoalSection()) return;

    setIsSubmitting(true);
    
    try {
      // Prepare data for backend
      const submitData: UserPreferencesData = {
        job_title: formData.job_title.trim(),
        commitment: formData.commitment,
        part_time: formData.part_time,
        full_time: formData.full_time,
        internship: formData.internship,
        contract: formData.contract,
        visa_sponsorship: formData.visa_sponsorship,
        location: formData.location.trim(),
        pay_yearly_max: formData.pay_type === "yearly" ? formData.pay_yearly_max : "",
        pay_yearly_min: formData.pay_type === "yearly" ? formData.pay_yearly_min : "",
        pay_hourly_max: formData.pay_type === "hourly" ? formData.pay_hourly_max : "",
        pay_hourly_min: formData.pay_type === "hourly" ? formData.pay_hourly_min : "",
        goal_choice: formData.goal_choice
      };

      console.log('🌶️ Submitting user preferences:', submitData);
      await submitUserPreferences(submitData);
      
      // Redirect to dashboard on success
      router.push("/dashboard");
      
    } catch (error) {
      if (error instanceof ApiError) {
        console.error('🌶️ Preferences submission failed:', error);
        alert(`Failed to save preferences: ${error.message}`);
      } else {
        console.error('🌶️ Unexpected error:', error);
        alert("An error occurred while saving your preferences. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderRoleSection = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold mb-2">Alright! Let's find your perfect role 🎯</h3>
        <p className="text-muted-foreground text-sm">
          Tell me what kind of position you're looking for, and I'll start hunting down the best matches for you!
        </p>
      </div>

      {/* Job Title */}
      <div>
        <label className="text-sm font-medium mb-2 block">Which role are you looking for?</label>
        <Input
          placeholder="e.g., Software Engineer, Product Manager, Data Scientist"
          value={formData.job_title}
          onChange={(e) => updateFormData("job_title", e.target.value)}
          className={errors.job_title ? "border-red-500" : ""}
        />
        {errors.job_title && (
          <p className="text-red-500 text-xs mt-1">{errors.job_title}</p>
        )}
      </div>

      {/* Commitment */}
      <div>
        <label className="text-sm font-medium mb-2 block">Work Arrangement</label>
        <Select
          value={formData.commitment}
          onValueChange={(value) => updateFormData("commitment", value)}
        >
          <SelectTrigger className={errors.commitment ? "border-red-500" : ""}>
            <SelectValue placeholder="Select work arrangement" />
          </SelectTrigger>
          <SelectContent>
            {COMMITMENT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.commitment && (
          <p className="text-red-500 text-xs mt-1">{errors.commitment}</p>
        )}
      </div>

      {/* Job Type */}
      <div>
        <label className="text-sm font-medium mb-2 block">Job Type</label>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="full_time"
              checked={formData.full_time}
              onCheckedChange={(checked) => updateFormData("full_time", checked as boolean)}
            />
            <Label htmlFor="full_time" className="cursor-pointer">Full-time</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="part_time"
              checked={formData.part_time}
              onCheckedChange={(checked) => updateFormData("part_time", checked as boolean)}
            />
            <Label htmlFor="part_time" className="cursor-pointer">Part-time</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="internship"
              checked={formData.internship}
              onCheckedChange={(checked) => updateFormData("internship", checked as boolean)}
            />
            <Label htmlFor="internship" className="cursor-pointer">Internship</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="contract"
              checked={formData.contract}
              onCheckedChange={(checked) => updateFormData("contract", checked as boolean)}
            />
            <Label htmlFor="contract" className="cursor-pointer">Contract</Label>
          </div>
        </div>
        {errors.part_time && (
          <p className="text-red-500 text-xs mt-1">{errors.part_time}</p>
        )}
      </div>

      {/* Work Authorization */}
      <div>
        <label className="text-sm font-medium mb-2 block">Work Authorization</label>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="visa_sponsorship"
            checked={formData.visa_sponsorship}
            onCheckedChange={(checked) => updateFormData("visa_sponsorship", checked as boolean)}
          />
          <Label htmlFor="visa_sponsorship" className="cursor-pointer">
            I need visa sponsorship
          </Label>
        </div>
      </div>

      {/* Job Location */}
      <div>
        <label className="text-sm font-medium mb-2 block">Job Location</label>
        <Input
          placeholder="e.g., San Francisco, CA or New York, NY"
          value={formData.location}
          onChange={(e) => updateFormData("location", e.target.value)}
          className={errors.location ? "border-red-500" : ""}
        />
        {errors.location && (
          <p className="text-red-500 text-xs mt-1">{errors.location}</p>
        )}
        <p className="text-xs text-muted-foreground mt-1">
          Enter your preferred city and state
        </p>
      </div>

      {/* Desired Salary */}
      <div>
        <label className="text-sm font-medium mb-2 block">Desired Salary (Optional)</label>
        
        {/* Pay Type Selection */}
        <RadioGroup
          value={formData.pay_type}
          onValueChange={(value) => {
            updateFormData("pay_type", value);
            // Clear the other pay type values when switching
            if (value === "yearly") {
              updateFormData("pay_hourly_min", "");
              updateFormData("pay_hourly_max", "");
            } else if (value === "hourly") {
              updateFormData("pay_yearly_min", "");
              updateFormData("pay_yearly_max", "");
            }
          }}
          className="flex gap-4 mb-3"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yearly" id="yearly" />
            <Label htmlFor="yearly" className="cursor-pointer">Yearly</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="hourly" id="hourly" />
            <Label htmlFor="hourly" className="cursor-pointer">Hourly</Label>
          </div>
        </RadioGroup>

        {/* Yearly Salary Inputs */}
        {formData.pay_type === "yearly" && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Input
                placeholder="Min (e.g., 80000)"
                value={formData.pay_yearly_min}
                onChange={(e) => updateFormData("pay_yearly_min", e.target.value)}
                className={errors.pay_yearly_min ? "border-red-500" : ""}
                type="number"
              />
            </div>
            <div>
              <Input
                placeholder="Max (e.g., 120000)"
                value={formData.pay_yearly_max}
                onChange={(e) => updateFormData("pay_yearly_max", e.target.value)}
                className={errors.pay_yearly_min ? "border-red-500" : ""}
                type="number"
              />
            </div>
          </div>
        )}

        {/* Hourly Rate Inputs */}
        {formData.pay_type === "hourly" && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Input
                placeholder="Min (e.g., 40)"
                value={formData.pay_hourly_min}
                onChange={(e) => updateFormData("pay_hourly_min", e.target.value)}
                className={errors.pay_hourly_min ? "border-red-500" : ""}
                type="number"
              />
            </div>
            <div>
              <Input
                placeholder="Max (e.g., 60)"
                value={formData.pay_hourly_max}
                onChange={(e) => updateFormData("pay_hourly_max", e.target.value)}
                className={errors.pay_hourly_min ? "border-red-500" : ""}
                type="number"
              />
            </div>
          </div>
        )}

        {(errors.pay_yearly_min || errors.pay_hourly_min) && (
          <p className="text-red-500 text-xs mt-1">
            {errors.pay_yearly_min || errors.pay_hourly_min}
          </p>
        )}
      </div>

      <div className="bg-primary/5 p-3 rounded-lg">
        <p className="text-xs text-muted-foreground">
          💼 <strong>Pepper's Insight:</strong> The more details you share, the better I can match you with opportunities that truly fit your needs!
        </p>
      </div>
    </div>
  );

  const renderGoalSection = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold mb-2">Perfect! Now, what's your career goal? 🚀</h3>
        <p className="text-muted-foreground text-sm">
          Understanding your aspirations helps me prioritize the right opportunities and give you personalized advice!
        </p>
      </div>

      <RadioGroup
        value={formData.goal_choice}
        onValueChange={(value) => updateFormData("goal_choice", value)}
        className="space-y-3"
      >
        {CAREER_GOALS.map((goal) => (
          <div
            key={goal.value}
            className={`relative flex items-start space-x-3 rounded-lg border-2 p-4 transition-colors ${
              formData.goal_choice === goal.value
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            }`}
          >
            <RadioGroupItem value={goal.value} id={goal.value} className="mt-1" />
            <Label htmlFor={goal.value} className="flex-1 cursor-pointer">
              <div className="font-medium">{goal.label}</div>
              <div className="text-sm text-muted-foreground mt-1">{goal.description}</div>
            </Label>
          </div>
        ))}
      </RadioGroup>

      {errors.goal_choice && (
        <p className="text-red-500 text-xs">{errors.goal_choice}</p>
      )}

      <div className="bg-primary/5 p-3 rounded-lg">
        <p className="text-xs text-muted-foreground">
          🎯 <strong>Pepper's Promise:</strong> Once I know your goal, I'll tailor every job recommendation and application strategy to help you achieve it!
        </p>
      </div>
    </div>
  );

  const renderSectionIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      <div className="flex items-center">
        <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
          currentSection === "role" 
            ? "bg-primary border-primary text-primary-foreground" 
            : "bg-primary border-primary text-primary-foreground"
        }`}>
          <Briefcase className="h-4 w-4" />
        </div>
        <div className={`w-12 h-0.5 mx-2 ${
          currentSection === "goal" ? "bg-primary" : "bg-muted"
        }`} />
        <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
          currentSection === "goal"
            ? "bg-primary border-primary text-primary-foreground" 
            : "border-muted-foreground text-muted-foreground"
        }`}>
          <Target className="h-4 w-4" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Let's Customize Your Job Hunt!</CardTitle>
          <p className="text-muted-foreground">
            {currentSection === "role" ? "Part 1: Role Selection" : "Part 2: Career Goal"}
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {renderSectionIndicator()}
          
          <div className="space-y-6">
            {currentSection === "role" ? renderRoleSection() : renderGoalSection()}
          </div>

          <div className="flex justify-between pt-6">
            {currentSection === "goal" ? (
              <Button
                variant="outline"
                onClick={handleBackToRole}
              >
                Back to Role
              </Button>
            ) : (
              <div></div>
            )}
            
            {currentSection === "role" ? (
              <Button onClick={handleNextToGoal}>
                Next: Career Goal
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Firing up Pepper..." : "Let's Find Jobs!"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function PreferencesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
            <p className="text-muted-foreground">Loading preferences...</p>
          </CardContent>
        </Card>
      </div>
    }>
      <PreferencesContent />
    </Suspense>
  );
}
