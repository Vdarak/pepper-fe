"use client";

import { useState, useRef, Suspense } from "react";
import { Upload, FileText, CheckCircle2, AlertCircle, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { uploadResume, ApiError } from "@/lib/api";
import { useAuthProtection } from "@/hooks/useAuthProtection";

interface FormData {
  file: File | null;
  name: string;
}

interface UploadStatus {
  success: boolean;
  message: string;
  resumeId?: string;
}

function ResumeUploadContent() {
  const { isAuthorized, isChecking } = useAuthProtection();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<FormData>({
    file: null,
    name: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [errors, setErrors] = useState<{ file?: string; name?: string }>({});
  const [uploadStatus, setUploadStatus] = useState<UploadStatus | null>(null);

  const ACCEPTED_FILE_TYPES = {
    'application/pdf': ['.pdf'],
    'application/msword': ['.doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    'text/plain': ['.txt']
  };

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  const validateFile = (file: File): string | null => {
    // Check file type
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    const acceptedExtensions = Object.values(ACCEPTED_FILE_TYPES).flat();
    
    if (!acceptedExtensions.includes(fileExtension)) {
      return 'Please upload a PDF, DOC, DOCX, or TXT file';
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return 'File size must be less than 10MB';
    }

    return null;
  };

  const handleFileChange = (file: File) => {
    const error = validateFile(file);
    
    if (error) {
      setErrors({ ...errors, file: error });
      return;
    }

    setFormData({
      file,
      name: file.name.replace(/\.[^/.]+$/, "") // Remove extension for default name
    });
    setErrors({ ...errors, file: undefined });
    setUploadStatus(null); // Clear upload status when new file is selected
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFileChange(files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const validateForm = (): boolean => {
    const newErrors: { file?: string; name?: string } = {};
    let isValid = true;

    if (!formData.file) {
      newErrors.file = "Please select a file to upload";
      isValid = false;
    }

    if (!formData.name.trim()) {
      newErrors.name = "Please provide a name for your resume";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    setUploadStatus(null);

    try {
      const fileExtension = formData.file!.name.split('.').pop()?.toLowerCase() || '';
      
      const response = await uploadResume({
        file: formData.file!,
        name: formData.name.trim(),
        file_format: fileExtension
      });

      console.log('✓ Resume uploaded successfully:', response);
      
      // Set success status with message from backend
      setUploadStatus({
        success: true,
        message: response.message || "Resume uploaded successfully!",
        resumeId: response.resume_id
      });

    } catch (error) {
      if (error instanceof ApiError) {
        console.error('❌ Resume upload failed:', error);
        setUploadStatus({
          success: false,
          message: error.message || "Failed to upload resume. Please try again."
        });
      } else {
        console.error('❌ Unexpected error:', error);
        setUploadStatus({
          success: false,
          message: "An error occurred while uploading your resume. Please try again."
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBrowseJobs = () => {
    router.push("/dashboard");
  };

  const getFileIcon = () => {
    if (!formData.file) return null;
    
    return (
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
        <FileText className="h-8 w-8 text-primary" />
      </div>
    );
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
          <CardTitle className="text-2xl font-bold">Almost There! Upload Your Resume</CardTitle>
          <p className="text-muted-foreground">
            Let's get your resume uploaded so I can start finding the perfect opportunities for you! I'll analyze it with the precision of Pepper Potts reviewing a Stark Industries contract.
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* File Upload Area */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Resume File</Label>
            
            {!formData.file ? (
              <div
                className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                  dragActive 
                    ? "border-primary bg-primary/5" 
                    : errors.file 
                    ? "border-red-500 bg-red-50" 
                    : "border-muted-foreground/25 hover:border-primary hover:bg-primary/5"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={handleUploadClick}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleInputChange}
                />
                
                <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-sm font-medium mb-1">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-muted-foreground">
                  PDF, DOC, DOCX, or TXT (max 10MB)
                </p>
              </div>
            ) : (
              <div className="border-2 border-primary rounded-lg p-6 bg-primary/5">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <FileText className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{formData.file.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {(formData.file.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setFormData({ file: null, name: "" })}
                    className="flex-shrink-0"
                  >
                    Remove
                  </Button>
                </div>
                <div className="flex items-center mt-4 text-sm text-green-600">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  File ready to upload
                </div>
              </div>
            )}

            {errors.file && (
              <div className="flex items-center mt-2 text-red-500 text-xs">
                <AlertCircle className="h-3 w-3 mr-1" />
                {errors.file}
              </div>
            )}
          </div>

          {/* Resume Name and Upload Button */}
          <div>
            <Label htmlFor="resume-name" className="text-sm font-medium mb-2 block">
              Resume Name
            </Label>
            <div className="flex gap-3">
              <div className="flex-1">
                <Input
                  id="resume-name"
                  placeholder="e.g., Virginia Potts - Executive Assistant Resume"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (errors.name) {
                      setErrors({ ...errors, name: undefined });
                    }
                  }}
                  className={errors.name ? "border-red-500" : ""}
                />
              </div>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || !formData.file || !formData.name.trim()}
                size="lg"
                className="flex-shrink-0"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload
                  </>
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Give your resume a memorable name for easy reference
            </p>
            {errors.name && (
              <div className="flex items-center mt-2 text-red-500 text-xs">
                <AlertCircle className="h-3 w-3 mr-1" />
                {errors.name}
              </div>
            )}
          </div>

          {/* Upload Status Feedback */}
          {uploadStatus && (
            <div className={`rounded-lg p-4 ${
              uploadStatus.success 
                ? "bg-green-50 border border-green-200" 
                : "bg-red-50 border border-red-200"
            }`}>
              <div className="flex items-start space-x-3">
                {uploadStatus.success ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <p className={`text-sm font-medium mb-1 ${
                    uploadStatus.success ? "text-green-900" : "text-red-900"
                  }`}>
                    {uploadStatus.success ? "Success! 🎉" : "Upload Failed"}
                  </p>
                  <p className={`text-xs ${
                    uploadStatus.success ? "text-green-700" : "text-red-700"
                  }`}>
                    {uploadStatus.message}
                  </p>
                  {uploadStatus.resumeId && (
                    <p className="text-xs text-green-600 mt-1">
                      Resume ID: {uploadStatus.resumeId}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Sparkles className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-900 mb-1">
                  Why do I need to upload my resume?
                </p>
                <p className="text-xs text-blue-700">
                  Your resume helps me understand your experience, skills, and achievements better. 
                  This way, I can match you with jobs that truly fit your profile and increase your chances of landing interviews!
                </p>
              </div>
            </div>
          </div>

          {/* Browse Jobs Button - Only show after successful upload */}
          {uploadStatus?.success && (
            <div className="flex justify-end pt-4 border-t">
              <Button
                onClick={handleBrowseJobs}
                size="lg"
                className="w-full sm:w-auto"
              >
                Browse Jobs
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function ResumeUploadPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </CardContent>
        </Card>
      </div>
    }>
      <ResumeUploadContent />
    </Suspense>
  );
}
