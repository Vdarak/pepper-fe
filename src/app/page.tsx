"use client";

import { useState, useEffect } from "react";
import { Phone, Mail, ArrowRight, Zap, Shield, Users, Smartphone, Save, Settings } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { signupRequest, loginRequest, ApiError } from "@/lib/api";

const features = [
  {
    icon: <Zap className="h-8 w-8 text-primary" />,
    title: "Lightning Fast",
    description: "Experience blazing fast performance with our optimized platform built for speed and efficiency."
  },
  {
    icon: <Shield className="h-8 w-8 text-primary" />,
    title: "Secure & Private",
    description: "Your data is protected with enterprise-grade security and privacy-first design principles."
  },
  {
    icon: <Users className="h-8 w-8 text-primary" />,
    title: "Team Collaboration",
    description: "Work seamlessly with your team using powerful collaboration tools and real-time sync."
  },
  {
    icon: <Smartphone className="h-8 w-8 text-primary" />,
    title: "Mobile Ready",
    description: "Access your work anywhere with our responsive design and native mobile experience."
  }
];

export default function LandingPage() {
  const [contactMethod, setContactMethod] = useState<"email" | "phone">("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [apiUrl, setApiUrl] = useState("");
  const showApiConfig = true; // Show in development

  // Load saved API URL from localStorage on component mount
  useEffect(() => {
    const savedApiUrl = localStorage.getItem("pepper-api-url");
    if (savedApiUrl) {
      setApiUrl(savedApiUrl);
    } else {
      // Default development API URL
      setApiUrl("http://localhost:8000/api");
    }
  }, []);

  const handleSaveApiUrl = () => {
    if (apiUrl.trim()) {
      localStorage.setItem("pepper-api-url", apiUrl.trim());
      // You could also show a toast notification here
      console.log("API URL saved:", apiUrl.trim());
      alert("API URL saved successfully!");
    }
  };

  const handleSignUp = async () => {
    const contactValue = contactMethod === "email" ? email : phone;
    
    if (!contactValue.trim()) {
      setResponseMessage(`Please enter your ${contactMethod}`);
      return;
    }

    // For now, we only support email signup based on the API
    if (contactMethod !== "email") {
      setResponseMessage("Currently, only email signup is supported. Please use email to sign up.");
      return;
    }

    setIsLoading(true);
    setResponseMessage("");

    try {
      await signupRequest(contactValue);
      
      // Redirect to email verification page
      const params = new URLSearchParams({
        email: contactValue
      });
      window.location.href = `/verify-email?${params.toString()}`;
    } catch (error) {
      if (error instanceof ApiError) {
        console.error("Signup failed:", error.message);
        setResponseMessage(error.message);
      } else {
        console.error("Signup error:", error);
        setResponseMessage("An error occurred during signup. Please check your API configuration and try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginClick = async () => {
    const contactValue = contactMethod === "email" ? email : phone;
    
    if (!contactValue.trim()) {
      setResponseMessage(`Please enter your ${contactMethod}`);
      return;
    }

    // For now, we only support email login
    if (contactMethod !== "email") {
      setResponseMessage("Currently, only email login is supported. Please use email to log in.");
      return;
    }

    // If password field is not shown, show it
    if (!showPasswordField) {
      setShowPasswordField(true);
      setResponseMessage("");
      return;
    }

    // If password field is shown, validate and attempt login
    if (!password.trim()) {
      setResponseMessage("Please enter your password");
      return;
    }

    setIsLoading(true);
    setResponseMessage("");

    try {
      const response = await loginRequest(contactValue, password);
      
      // Display success message
      setResponseMessage(response.message || "Login successful!");
      
      // Store a simple session flag
      localStorage.setItem("pepper-session", JSON.stringify({ email: contactValue }));
      
      // Redirect to dashboard after short delay
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1500);
      
    } catch (error) {
      if (error instanceof ApiError) {
        console.error("Login failed:", error.message);
        setResponseMessage(error.message);
      } else {
        console.error("Login error:", error);
        setResponseMessage("An error occurred during login. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Main Container */}
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Image 
              src="/pepper-logo.svg" 
              alt="Pepper Logo" 
              width={120} 
              height={120}
              className="w-24 h-24 md:w-32 md:h-32"
            />
            <h1 className="text-8xl md:text-9xl font-bold text-primary tracking-tight">
              PEPPER
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Your AI job hunt assistant - combining the efficiency of Pepper Potts with the career savvy of Donna Paulsen
          </p>

          {/* Development API Configuration */}
          {showApiConfig && (
            <div className="max-w-md mx-auto mb-8 p-4 bg-muted/50 rounded-lg border border-dashed">
              <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
                <Settings className="h-4 w-4" />
                <span>Development Mode - API Configuration</span>
              </div>
              <div className="flex gap-2">
                <Input
                  type="url"
                  placeholder="API Base URL (e.g., http://localhost:8000/api)"
                  value={apiUrl}
                  onChange={(e) => setApiUrl(e.target.value)}
                  className="text-sm"
                />
                <Button 
                  onClick={handleSaveApiUrl}
                  size="sm"
                  className="shrink-0"
                >
                  <Save className="h-4 w-4 mr-1" />
                  Save
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Current API: {apiUrl || "Not configured"}
              </p>
            </div>
          )}
        </header>

        {/* Features Carousel */}
        <div className="mb-16 max-w-4xl mx-auto">
          <Carousel className="w-full">
            <CarouselContent>
              {features.map((feature, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <Card className="h-full">
                    <CardContent className="flex flex-col items-center text-center p-6">
                      <div className="mb-4 p-3 rounded-full bg-primary/10">
                        {feature.icon}
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>

        {/* Contact Method Toggle */}
        <div className="max-w-md mx-auto mb-8">
          <div className="flex rounded-lg border bg-card p-1">
            <button
              onClick={() => setContactMethod("email")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md transition-colors ${
                contactMethod === "email"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Mail className="h-4 w-4" />
              Email
            </button>
            <button
              onClick={() => setContactMethod("phone")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md transition-colors ${
                contactMethod === "phone"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Phone className="h-4 w-4" />
              Phone
            </button>
          </div>
        </div>

        {/* Input Section */}
        <div className="max-w-md mx-auto mb-8">
          {contactMethod === "email" ? (
            <div className="space-y-4">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setResponseMessage("");
                }}
                className="h-12 text-center text-lg"
              />
              
              {/* Password field - only shown when login is clicked */}
              {showPasswordField && (
                <Input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setResponseMessage("");
                  }}
                  className="h-12 text-center text-lg"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleLoginClick();
                    }
                  }}
                />
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <Input
                type="tel"
                placeholder="Enter your phone number"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setResponseMessage("");
                }}
                className="h-12 text-center text-lg"
              />
            </div>
          )}
          
          {/* Response Message */}
          {responseMessage && (
            <div className={`mt-4 p-3 rounded-lg text-center text-sm ${
              responseMessage.toLowerCase().includes('success') || responseMessage.toLowerCase().includes('login')
                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
            }`}>
              {responseMessage}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="max-w-md mx-auto space-y-4">
          <div className="flex gap-3">
            <Button 
              onClick={handleLoginClick}
              variant="secondary"
              className="flex-1 h-12 text-lg font-medium"
              size="lg"
              disabled={isLoading}
            >
              {isLoading && showPasswordField ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                  Logging in...
                </>
              ) : (
                <>
                  {showPasswordField ? 'Login' : 'Login'}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
            
            <Button 
              onClick={handleSignUp}
              className="flex-1 h-12 text-lg font-medium"
              size="lg"
              disabled={isLoading}
            >
              {isLoading && !showPasswordField ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                  Signing up...
                </>
              ) : (
                <>
                  Sign Up
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center mt-16 text-sm text-muted-foreground">
          <p>By signing up, you agree to our Terms of Service and Privacy Policy</p>
        </footer>
      </div>
    </div>
  );
}
