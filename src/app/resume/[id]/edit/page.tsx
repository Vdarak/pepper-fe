"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ResumeEditor from "@/components/resume-editor/resume-editor";
import { fetchResumeInfo, saveResumeData } from "@/lib/api";
import { convertApiToResumeData, convertResumeDataToApi } from "@/lib/resume-converter";
import type { ResumeData } from "@/types/resume";

export default function ResumeEditPage() {
  const params = useParams();
  const router = useRouter();
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch resume data on mount
  useEffect(() => {
    const loadResume = async () => {
      if (!params.id) {
        setError("Resume ID not found");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const apiData = await fetchResumeInfo(params.id as string);
        const convertedData = convertApiToResumeData(apiData);
        setResumeData(convertedData);
        setError(null);
      } catch (err) {
        console.error("Failed to load resume:", err);
        setError("Failed to load resume. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    loadResume();
  }, [params.id]);

  const handleClose = () => {
    router.push("/resume");
  };

  const handleSave = async (data: ResumeData) => {
    if (!params.id) return;

    try {
      setIsSaving(true);
      
      // Convert to API format
      const apiPayload = convertResumeDataToApi(data, data.sectionIds || {});
      
      console.log("Saving resume with payload:", apiPayload);
      
      // Save to API
      await saveResumeData({
        IDResume: params.id as string,
        resume_data: apiPayload.resume_data
      });
      
      // Update local state to reflect saved data
      setResumeData(data);
      setLastSaved(new Date());
      setError(null);
      
      console.log("Resume saved successfully at", new Date().toLocaleTimeString());
    } catch (err) {
      console.error("Failed to save resume:", err);
      setError("Failed to save resume. Please try again.");
      // Optionally show a toast notification here
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading resume...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 z-50 bg-background flex items-center justify-center">
        <div className="text-center max-w-md">
          <p className="text-destructive mb-4">{error}</p>
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Back to Resume List
          </button>
        </div>
      </div>
    );
  }

  if (!resumeData) {
    return (
      <div className="fixed inset-0 z-50 bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Resume not found</p>
          <button
            onClick={handleClose}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Back to Resume List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Save status indicator */}
      {(isSaving || lastSaved) && (
        <div className="fixed top-20 right-6 z-[60] bg-background border rounded-lg px-3 py-2 shadow-lg">
          {isSaving ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              <span className="text-sm text-muted-foreground">Saving...</span>
            </div>
          ) : lastSaved ? (
            <span className="text-sm text-green-600 dark:text-green-400">
              ✓ Saved at {lastSaved.toLocaleTimeString()}
            </span>
          ) : null}
        </div>
      )}

      {/* Error notification */}
      {error && (
        <div className="fixed top-20 right-6 z-[60] bg-destructive/10 border border-destructive rounded-lg px-4 py-3 shadow-lg max-w-md">
          <p className="text-sm text-destructive">{error}</p>
          <button
            onClick={() => setError(null)}
            className="mt-2 text-xs text-destructive underline"
          >
            Dismiss
          </button>
        </div>
      )}

      <ResumeEditor
        initialData={resumeData}
        onClose={handleClose}
        onSave={handleSave}
      />
    </div>
  );
}
