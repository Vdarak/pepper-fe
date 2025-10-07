"use client";

import { useState, useEffect, Suspense } from "react";
import { Briefcase, Target, MapPin, DollarSign, Clock, Building, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";
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
  pay_yearly_max: string;
  pay_yearly_min: string;
  pay_hourly_max: string;
  pay_hourly_min: string;
  goal_choice: string;
}

interface FormErrors {
  job_title?: string;
  commitment?: string;
  job_types?: string; // Group error for job type checkboxes
  location?: string;
  pay_yearly_min?: string;
  pay_hourly_min?: string;
  goal_choice?: string;
}

// Common locations for dropdown
const COMMON_LOCATIONS = [
  "New York, NY",
  "San Francisco, CA",
  "Los Angeles, CA",
  "Chicago, IL",
  "Boston, MA",
  "Seattle, WA",
  "Austin, TX",
  "Denver, CO",
  "Atlanta, GA",
  "Miami, FL",
  "Remote",
  "Hybrid"
];

function PreferencesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [payType, setPayType] = useState<'yearly' | 'hourly'>('yearly');
  const [formData, setFormData] = useState<FormData>({
    job_title: "",
    commitment: "",
    part_time: false,
    full_time: false,
    internship: false,
    contract: false,
    visa_sponsorship: false,
    location: "",
    pay_yearly_max: "",
    pay_yearly_min: "",
    pay_hourly_max: "",
    pay_hourly_min: "",
    goal_choice: ""
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const steps = [
    { 
      number: 1, 
      title: "Role Selection", 
      icon: <Briefcase className="h-5 w-5" />,
      fields: ["job_title", "commitment", "location"]
    },
    { 
      number: 2, 
      title: "Career Goals", 
      icon: <Target className="h-5 w-5" />,
      fields: ["goal_choice"]
    }
  ];

  const updateFormData = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing/selecting
    if (field === 'job_title' && errors.job_title) {
      setErrors(prev => ({ ...prev, job_title: undefined }));
    } else if (field === 'commitment' && errors.commitment) {
      setErrors(prev => ({ ...prev, commitment: undefined }));
    } else if (field === 'location' && errors.location) {
      setErrors(prev => ({ ...prev, location: undefined }));
    } else if (field === 'goal_choice' && errors.goal_choice) {
      setErrors(prev => ({ ...prev, goal_choice: undefined }));
    } else if (['part_time', 'full_time', 'internship', 'contract'].includes(field) && errors.job_types) {
      setErrors(prev => ({ ...prev, job_types: undefined }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    if (step === 1) {
      // Job title is required
      if (!formData.job_title.trim()) {
        newErrors.job_title = "Job title is required";
        isValid = false;
      }
      
      // Commitment is required
      if (!formData.commitment) {
        newErrors.commitment = "Work commitment is required";
        isValid = false;
      }

      // Location is required
      if (!formData.location.trim()) {
        newErrors.location = "Location is required";
        isValid = false;
      }

      // At least one job type must be selected
      if (!formData.part_time && !formData.full_time && !formData.internship && !formData.contract) {
        newErrors.job_types = "Please select at least one job type";
        isValid = false;
      }

      // Salary validation if provided
      if (payType === 'yearly') {
        if (formData.pay_yearly_min && formData.pay_yearly_max) {
          const min = parseInt(formData.pay_yearly_min);
          const max = parseInt(formData.pay_yearly_max);
          if (min > max) {
            newErrors.pay_yearly_min = "Minimum salary cannot be greater than maximum";
            isValid = false;
          }
        }
      } else {
        if (formData.pay_hourly_min && formData.pay_hourly_max) {
          const min = parseInt(formData.pay_hourly_min);
          const max = parseInt(formData.pay_hourly_max);
          if (min > max) {
            newErrors.pay_hourly_min = "Minimum hourly rate cannot be greater than maximum";
            isValid = false;
          }
        }
      }
    }

    if (step === 2) {
      if (!formData.goal_choice) {
        newErrors.goal_choice = "Please select a career goal";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);
    
    try {
      // Prepare data for submission
      const submitData: UserPreferencesData = {
        job_title: formData.job_title.trim(),
        commitment: formData.commitment,
        part_time: formData.part_time,
        full_time: formData.full_time,
        internship: formData.internship,
        contract: formData.contract,
        visa_sponsorship: formData.visa_sponsorship,
        location: formData.location.trim(),
        pay_yearly_max: formData.pay_yearly_max || "",
        pay_yearly_min: formData.pay_yearly_min || "",
        pay_hourly_max: formData.pay_hourly_max || "",
        pay_hourly_min: formData.pay_hourly_min || "",
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

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center">
          <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
            currentStep >= step.number 
              ? "bg-primary border-primary text-primary-foreground" 
              : "border-muted-foreground text-muted-foreground"
          }`}>
            {currentStep > step.number ? (
              <ArrowRight className="h-4 w-4" />
            ) : (
              step.icon
            )}
          </div>
          {index < steps.length - 1 && (
            <div className={`w-12 h-0.5 mx-2 ${
              currentStep > step.number ? "bg-primary" : "bg-muted"
            }`} />
          )}
        </div>
      ))}
    </div>
  );

  const Checkbox = ({ id, checked, onChange, label, error }: {
    id: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    label: string;
    error?: string;
  }) => (
    <div className="flex items-center space-x-2">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className={`w-4 h-4 text-primary bg-background border-2 rounded focus:ring-primary focus:ring-2 ${
          error ? 'border-red-500' : 'border-muted-foreground'
        }`}
      />
      <label htmlFor={id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {label}
      </label>
    </div>
  );

  const RadioButton = ({ id, name, value, checked, onChange, label }: {
    id: string;
    name: string;
    value: string;
    checked: boolean;
    onChange: (value: string) => void;
    label: string;
  }) => (
    <div className="flex items-center space-x-2">
      <input
        type="radio"
        id={id}
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        className="w-4 h-4 text-primary bg-background border-2 border-muted-foreground focus:ring-primary focus:ring-2"
      />
      <label htmlFor={id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {label}
      </label>
    </div>
  );

  const renderRoleSelection = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold mb-2">Let's find your perfect role! 🎯</h3>
        <p className="text-muted-foreground text-sm">
          Tell me what kind of job you're looking for, and I'll start hunting for opportunities that match your preferences perfectly!
        </p>
      </div>

      {/* Job Title */}
      <div>
        <label className="text-sm font-medium mb-2 block">Which role are you looking for?</label>
        <Input
          placeholder="e.g., Software Engineer, Marketing Manager, Data Scientist"
          value={formData.job_title}
          onChange={(e) => updateFormData("job_title", e.target.value)}
          className={errors.job_title ? "border-red-500" : ""}
        />
        {errors.job_title && (
          <p className="text-red-500 text-xs mt-1">{errors.job_title}</p>
        )}
      </div>

      {/* Work Commitment */}
      <div>
        <label className="text-sm font-medium mb-2 block">Work Style Preference</label>
        <Select
          value={formData.commitment}
          onValueChange={(value) => updateFormData("commitment", value)}
        >
          <SelectTrigger className={errors.commitment ? "border-red-500" : ""}>
            <SelectValue placeholder="Choose your preferred work style" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="remote">Remote</SelectItem>
            <SelectItem value="in-person">In-Person</SelectItem>
            <SelectItem value="hybrid">Hybrid</SelectItem>
          </SelectContent>
        </Select>
        {errors.commitment && (
          <p className="text-red-500 text-xs mt-1">{errors.commitment}</p>
        )}
      </div>

      {/* Job Type */}
      <div>
        <label className="text-sm font-medium mb-3 block">Job Type (Select all that apply)</label>
        <div className="grid grid-cols-2 gap-3">
          <Checkbox
            id="full_time"
            checked={formData.full_time}
            onChange={(checked) => updateFormData("full_time", checked)}
            label="Full-time"
            error={errors.job_types}
          />
          <Checkbox
            id="part_time"
            checked={formData.part_time}
            onChange={(checked) => updateFormData("part_time", checked)}
            label="Part-time"
          />
          <Checkbox
            id="internship"
            checked={formData.internship}
            onChange={(checked) => updateFormData("internship", checked)}
            label="Internship"
          />
          <Checkbox
            id="contract"
            checked={formData.contract}
            onChange={(checked) => updateFormData("contract", checked)}
            label="Contract"
          />
        </div>
        {errors.job_types && (
          <p className="text-red-500 text-xs mt-1">{errors.job_types}</p>
        )}
      </div>

      {/* Work Authorization */}
      <div>
        <label className="text-sm font-medium mb-3 block">Work Authorization</label>
        <Checkbox
          id="visa_sponsorship"
          checked={formData.visa_sponsorship}
          onChange={(checked) => updateFormData("visa_sponsorship", checked)}
          label="I need visa sponsorship"
        />
      </div>

      {/* Location */}
      <div>
        <label className="text-sm font-medium mb-2 block">Job Location</label>
        <Select
          value={formData.location}
          onValueChange={(value) => updateFormData("location", value)}
        >
          <SelectTrigger className={errors.location ? "border-red-500" : ""}>
            <SelectValue placeholder="Select preferred location" />
          </SelectTrigger>
          <SelectContent>
            {COMMON_LOCATIONS.map((location) => (
              <SelectItem key={location} value={location}>
                {location}
              </SelectItem>
            ))}
            <SelectItem value="other">Other (specify in job title)</SelectItem>
          </SelectContent>
        </Select>
        {errors.location && (
          <p className="text-red-500 text-xs mt-1">{errors.location}</p>
        )}
      </div>

      {/* Desired Salary */}
      <div>
        <label className="text-sm font-medium mb-3 block">Desired Salary (Optional)</label>
        
        {/* Salary Type Selection */}
        <div className="flex gap-4 mb-4">
          <RadioButton
            id="yearly_pay"
            name="pay_type"
            value="yearly"
            checked={payType === 'yearly'}
            onChange={(value) => setPayType(value as 'yearly' | 'hourly')}
            label="Yearly"
          />
          <RadioButton
            id="hourly_pay"
            name="pay_type"
            value="hourly"
            checked={payType === 'hourly'}
            onChange={(value) => setPayType(value as 'yearly' | 'hourly')}
            label="Hourly"
          />
        </div>

        {/* Salary Input Fields */}
        {payType === 'yearly' ? (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Minimum ($/year)</label>
              <Input
                type="number"
                placeholder="50000"
                value={formData.pay_yearly_min}
                onChange={(e) => updateFormData("pay_yearly_min", e.target.value)}
                className={errors.pay_yearly_min ? "border-red-500" : ""}
              />
              {errors.pay_yearly_min && (
                <p className="text-red-500 text-xs mt-1">{errors.pay_yearly_min}</p>
              )}
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Maximum ($/year)</label>
              <Input
                type="number"
                placeholder="80000"
                value={formData.pay_yearly_max}
                onChange={(e) => updateFormData("pay_yearly_max", e.target.value)}
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Minimum ($/hour)</label>
              <Input
                type="number"
                placeholder="25"
                value={formData.pay_hourly_min}
                onChange={(e) => updateFormData("pay_hourly_min", e.target.value)}
                className={errors.pay_hourly_min ? "border-red-500" : ""}
              />
              {errors.pay_hourly_min && (
                <p className="text-red-500 text-xs mt-1">{errors.pay_hourly_min}</p>
              )}
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Maximum ($/hour)</label>
              <Input
                type="number"
                placeholder="40"
                value={formData.pay_hourly_max}
                onChange={(e) => updateFormData("pay_hourly_max", e.target.value)}
              />
            </div>
          </div>
        )}
      </div>

      <div className="bg-primary/5 p-3 rounded-lg">
        <p className="text-xs text-muted-foreground">
          🎯 <strong>Pepper's Strategy:</strong> The more specific you are about your preferences, the better I can tailor job recommendations just for you!
        </p>
      </div>
    </div>
  );

  const renderCareerGoals = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold mb-2">What's your career goal? 🚀</h3>
        <p className="text-muted-foreground text-sm">
          Understanding your career aspirations helps me find opportunities that align with your long-term vision and growth plans.
        </p>
      </div>

      <div>
        <label className="text-sm font-medium mb-4 block">Choose your primary career goal:</label>
        <div className="space-y-4">
          <div className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
            formData.goal_choice === "Advance my career" 
              ? "border-primary bg-primary/5" 
              : "border-muted hover:border-primary/50"
          }`}
          onClick={() => updateFormData("goal_choice", "Advance my career")}
          >
            <RadioButton
              id="advance_career"
              name="career_goal"
              value="Advance my career"
              checked={formData.goal_choice === "Advance my career"}
              onChange={(value) => updateFormData("goal_choice", value)}
              label="Advance my career"
            />
            <p className="text-xs text-muted-foreground mt-1 ml-6">
              Looking for promotions, leadership roles, or senior positions in my current field
            </p>
          </div>

          <div className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
            formData.goal_choice === "Shift my career path" 
              ? "border-primary bg-primary/5" 
              : "border-muted hover:border-primary/50"
          }`}
          onClick={() => updateFormData("goal_choice", "Shift my career path")}
          >
            <RadioButton
              id="shift_career"
              name="career_goal"
              value="Shift my career path"
              checked={formData.goal_choice === "Shift my career path"}
              onChange={(value) => updateFormData("goal_choice", value)}
              label="Shift my career path"
            />
            <p className="text-xs text-muted-foreground mt-1 ml-6">
              Transitioning to a new industry, role, or completely different career direction
            </p>
          </div>

          <div className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
            formData.goal_choice === "Enjoy better work style" 
              ? "border-primary bg-primary/5" 
              : "border-muted hover:border-primary/50"
          }`}
          onClick={() => updateFormData("goal_choice", "Enjoy better work style")}
          >
            <RadioButton
              id="better_workstyle"
              name="career_goal"
              value="Enjoy better work style"
              checked={formData.goal_choice === "Enjoy better work style"}
              onChange={(value) => updateFormData("goal_choice", value)}
              label="Enjoy better work style"
            />
            <p className="text-xs text-muted-foreground mt-1 ml-6">
              Seeking better work-life balance, remote opportunities, or improved company culture
            </p>
          </div>
        </div>
        {errors.goal_choice && (
          <p className="text-red-500 text-xs mt-2">{errors.goal_choice}</p>
        )}
      </div>

      <div className="bg-primary/5 p-3 rounded-lg">
        <p className="text-xs text-muted-foreground">
          🌟 <strong>Pepper's Promise:</strong> Based on your goal, I'll prioritize opportunities that align with your career aspirations and help you achieve your professional dreams!
        </p>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderRoleSelection();
      case 2:
        return renderCareerGoals();
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Let's Customize Your Job Hunt! 🌶️</CardTitle>
          <p className="text-muted-foreground">
            Step {currentStep} of {steps.length}: {steps[currentStep - 1].title}
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {renderStepIndicator()}
          
          <div className="space-y-6">
            {renderCurrentStep()}
          </div>

          <div className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
            >
              Previous
            </Button>
            
            {currentStep < steps.length ? (
              <Button onClick={handleNext}>
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Pepper is getting ready..." : "Start Hunting Jobs!"}
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