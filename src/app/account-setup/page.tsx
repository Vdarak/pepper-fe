"use client";

import { useState, useEffect, Suspense } from "react";
import { User, MapPin, Phone, Lock, ArrowRight, Eye, EyeOff, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";
import { completeAccountSetup, ApiError, type AccountSetupData } from "@/lib/api";
import { US_STATES } from "@/lib/data";
import { useAuthProtection } from "@/hooks/useAuthProtection";

interface FormData {
  first_name: string;
  last_name: string;
  address_line1: string;
  city: string;
  state: string;
  country: string;
  pin: string;
  country_code: string;
  contact_number: string;
  password: string;
}

function AccountSetupContent() {
  const { isAuthorized, isChecking } = useAuthProtection();
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    first_name: "",
    last_name: "",
    address_line1: "",
    city: "",
    state: "",
    country: "US", // Fixed to US only ( Backend not receiiving this field currently )
    pin: "",
    country_code: "+1", // Fixed to US numbers only
    contact_number: "",
    password: ""
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});

  const steps = [
    { 
      number: 1, 
      title: "Personal Information", 
      icon: <User className="h-5 w-5" />,
      fields: ["first_name", "last_name"]
    },
    { 
      number: 2, 
      title: "Address Details", 
      icon: <MapPin className="h-5 w-5" />,
      fields: ["address_line1", "city", "state", "country", "pin"]
    },
    { 
      number: 3, 
      title: "Contact & Security", 
      icon: <Lock className="h-5 w-5" />,
      fields: ["country_code", "contact_number", "password"]
    }
  ];

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateStep = (step: number): boolean => {
    const stepFields = steps[step - 1].fields;
    const newErrors: Partial<FormData> = {};
    let isValid = true;

    stepFields.forEach(field => {
      const value = formData[field as keyof FormData];
      if (!value || value.trim() === "") {
        newErrors[field as keyof FormData] = "This field is required";
        isValid = false;
      }
    });

    // Additional validation for specific fields
    if (step === 3) {
      if (formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters long";
        isValid = false;
      }
      // US phone number validation (10 digits)
      const phoneDigits = formData.contact_number.replace(/\D/g, '');
      if (formData.contact_number && phoneDigits.length !== 10) {
        newErrors.contact_number = "Please enter a valid 10-digit US phone number";
        isValid = false;
      }
    }

    if (step === 2) {
      // State is always required since we're US-only
      if (!formData.state) {
        newErrors.state = "State is required";
        isValid = false;
      }
      if (formData.pin && !/^\d{5}(\d{4})?$/.test(formData.pin)) {
        newErrors.pin = "Please enter a valid US ZIP code (e.g., 12345 or 12345-6789)";
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
      // Clean and format the data for backend
      const submitData: AccountSetupData = {
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        address_line1: formData.address_line1.trim(),
        city: formData.city.trim(),
        state: formData.state, // Already abbreviated (e.g., "IL", "NY")
        country: "US", // Always US
        pin: formData.pin.replace(/\D/g, ''), // Remove non-digits from ZIP
        country_code: "+1", // Always US
        contact_number: formData.contact_number.replace(/\D/g, ''), // Remove non-digits
        password: formData.password
      };

      console.log('✓ Submitting account setup data:', submitData);
      await completeAccountSetup(submitData);
      
      // Redirect to preferences page on success
      router.push("/preferences");
      
    } catch (error) {
      if (error instanceof ApiError) {
        console.error('❌ Account setup failed:', error);
        alert(`Account setup failed: ${error.message}`);
      } else {
        console.error('❌ Unexpected error:', error);
        alert("An error occurred while setting up your account. Please try again.");
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

  const renderPersonalInfo = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold mb-2">Hey there! I'm Pepper</h3>
        <p className="text-muted-foreground text-sm">
          I'm your AI job hunt assistant, and I'm here to help you land your dream job! 
          Your email is already verified, so let's start by getting to know you better. What should I call you?
        </p>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-2 block">First Name</label>
          <Input
            placeholder="Pepper"
            value={formData.first_name}
            onChange={(e) => updateFormData("first_name", e.target.value)}
            className={errors.first_name ? "border-red-500" : ""}
          />
          {errors.first_name && (
            <p className="text-red-500 text-xs mt-1">{errors.first_name}</p>
          )}
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">Last Name</label>
          <Input
            placeholder="Potts"
            value={formData.last_name}
            onChange={(e) => updateFormData("last_name", e.target.value)}
            className={errors.last_name ? "border-red-500" : ""}
          />
          {errors.last_name && (
            <p className="text-red-500 text-xs mt-1">{errors.last_name}</p>
          )}
        </div>
      </div>
      
      <div className="bg-primary/5 p-3 rounded-lg">
        <p className="text-xs text-muted-foreground">
          💡 <strong>Pepper's Tip:</strong> I'll use your name to personalize job recommendations and help you craft the perfect applications! Think of me as the perfect fusion of Pepper Potts' efficiency and Donna Paulsen's sass.
        </p>
      </div>
    </div>
  );

  const renderAddressInfo = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold mb-2">Great! Now, where are you based? 🗺️</h3>
        <p className="text-muted-foreground text-sm">
          I need to know your location so I can find the perfect job opportunities in your area. 
          Don't worry - I currently focus on the US job market, so we've got you covered!
        </p>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Street Address</label>
        <Input
          placeholder="10880 Malibu Point"
          value={formData.address_line1}
          onChange={(e) => updateFormData("address_line1", e.target.value)}
          className={errors.address_line1 ? "border-red-500" : ""}
        />
        {errors.address_line1 && (
          <p className="text-red-500 text-xs mt-1">{errors.address_line1}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-2 block">City</label>
          <Input
            placeholder="Malibu"
            value={formData.city}
            onChange={(e) => updateFormData("city", e.target.value)}
            className={errors.city ? "border-red-500" : ""}
          />
          {errors.city && (
            <p className="text-red-500 text-xs mt-1">{errors.city}</p>
          )}
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">State</label>
          <Select
            value={formData.state}
            onValueChange={(value) => updateFormData("state", value)}
          >
            <SelectTrigger className={errors.state ? "border-red-500" : ""}>
              <SelectValue placeholder="Select state" />
            </SelectTrigger>
            <SelectContent>
              {US_STATES.map((state) => (
                <SelectItem key={state.value} value={state.value}>
                  {state.value} - {state.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.state && (
            <p className="text-red-500 text-xs mt-1">{errors.state}</p>
          )}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">ZIP Code</label>
        <Input
          placeholder="90265"
          value={formData.pin}
          onChange={(e) => updateFormData("pin", e.target.value)}
          className={errors.pin ? "border-red-500" : ""}
          maxLength={10}
        />
        {errors.pin && (
          <p className="text-red-500 text-xs mt-1">{errors.pin}</p>
        )}
      </div>

      <div className="bg-primary/5 p-3 rounded-lg">
        <p className="text-xs text-muted-foreground">
          🎯 <strong>Pepper's Insight:</strong> I'll use your location to filter jobs by commute time, remote options, and local market trends. The more specific, the better! Just like how Donna knows every firm in NYC, I'll know every opportunity in your area.
        </p>
      </div>
    </div>
  );

  const renderContactInfo = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold mb-2">Perfect! Last step - let's secure your account 🔒</h3>
        <p className="text-muted-foreground text-sm">
          Almost done! I need your phone number so employers can reach you about amazing opportunities, 
          and a secure password to keep your account safe while I work my magic!
        </p>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Phone Number</label>
        <div className="flex gap-2">
          <div className="w-20 flex items-center justify-center bg-muted rounded-md text-sm font-medium">
            +1
          </div>
          <Input
            placeholder="(212) 555-0199"
            value={formData.contact_number}
            onChange={(e) => updateFormData("contact_number", e.target.value)}
            className={`flex-1 ${errors.contact_number ? "border-red-500" : ""}`}
            maxLength={12}
          />
        </div>
        {errors.contact_number && (
          <p className="text-red-500 text-xs mt-1">{errors.contact_number}</p>
        )}
        <p className="text-xs text-muted-foreground mt-1">
          Format: 10 digits (e.g., 5551234567) - Your direct line to opportunity!
        </p>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Password</label>
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Create a strong password"
            value={formData.password}
            onChange={(e) => updateFormData("password", e.target.value)}
            className={`pr-10 ${errors.password ? "border-red-500" : ""}`}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>
        {errors.password && (
          <p className="text-red-500 text-xs mt-1">{errors.password}</p>
        )}
        <p className="text-xs text-muted-foreground mt-1">
          Password must be at least 8 characters long
        </p>
      </div>

      <div className="bg-primary/5 p-3 rounded-lg">
        <p className="text-xs text-muted-foreground">
          🚀 <strong>Pepper's Promise:</strong> Once you complete this, I'll immediately start analyzing the job market for opportunities that match your profile. Let's get you hired!
        </p>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderPersonalInfo();
      case 2:
        return renderAddressInfo();
      case 3:
        return renderContactInfo();
      default:
        return null;
    }
  };

  // Don't render until authorization is confirmed
  if (isChecking || !isAuthorized) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Let's Set Up Your Job Hunt Profile!</CardTitle>
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
                {isSubmitting ? "Getting Pepper ready..." : "Start My Job Hunt!"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AccountSetupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
            <p className="text-muted-foreground">Loading account setup...</p>
          </CardContent>
        </Card>
      </div>
    }>
      <AccountSetupContent />
    </Suspense>
  );
}