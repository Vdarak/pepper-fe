"use client";

import { useState, useRef } from "react";
import { Upload, RefreshCw, Edit2, Download, Trash2, Check, X, UploadCloud, FileEdit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  listResumes,
  deleteResume,
  renameResume,
  downloadResume,
  uploadResume,
  reUploadResume,
  fetchResumeInfo,
  ApiError,
  type Resume,
} from "@/lib/api";
import ResumeEditor from "@/components/resume-editor/resume-editor";
import { ResumeData } from "@/types/resume";
import { convertApiToResumeData, convertResumeDataToApi } from "@/lib/resume-converter";

export default function ResumeCenter() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadName, setUploadName] = useState("");
  const [reUploadingId, setReUploadingId] = useState<string | null>(null);
  const reUploadFileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const [showEditor, setShowEditor] = useState(false);
  const [editorData, setEditorData] = useState<ResumeData | null>(null);
  const [currentResumeId, setCurrentResumeId] = useState<string | null>(null);
  const [isLoadingEditor, setIsLoadingEditor] = useState(false);
  // Store section IDs for saving (map of section title -> IDResumeSection)
  const [currentSectionIds, setCurrentSectionIds] = useState<{ [key: string]: string }>({});

  // Fetch resumes from API
  const fetchResumes = async () => {
    setIsLoading(true);
    try {
      const response = await listResumes(15);
      setResumes(response.resumes);
      console.log("Fetched resumes:", response.resumes);
    } catch (error) {
      if (error instanceof ApiError) {
        alert(`Failed to fetch resumes: ${error.message}`);
      } else {
        alert("An error occurred while fetching resumes");
      }
      console.error("Fetch resumes error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!uploadFile || !uploadName.trim()) {
      alert("Please select a file and provide a name");
      return;
    }

    setIsUploading(true);
    try {
      const fileExtension = uploadFile.name.split(".").pop()?.toLowerCase() || "";
      const response = await uploadResume({
        file: uploadFile,
        name: uploadName.trim(),
        file_format: fileExtension,
      });
      
      alert(response.message || "Resume uploaded successfully!");
      
      // Reset upload state
      setUploadFile(null);
      setUploadName("");
      
      // Refresh the list
      await fetchResumes();
    } catch (error) {
      if (error instanceof ApiError) {
        alert(`Upload failed: ${error.message}`);
      } else {
        alert("An error occurred during upload");
      }
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadFile(file);
      // Auto-fill name from filename (without extension)
      const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
      if (!uploadName) {
        setUploadName(nameWithoutExt);
      }
    }
  };

  // Start editing a resume name
  const startEdit = (resume: Resume) => {
    setEditingId(resume.IDResume);
    setEditingName(resume.Name);
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null);
    setEditingName("");
  };

  // Save edited name
  const saveEdit = async (resumeId: string) => {
    if (!editingName.trim()) {
      alert("Name cannot be empty");
      return;
    }

    try {
      const response = await renameResume(resumeId, editingName.trim());
      alert(response.message || "Resume renamed successfully!");
      
      // Update local state
      setResumes((prev) =>
        prev.map((r) =>
          r.IDResume === resumeId ? { ...r, Name: editingName.trim() } : r
        )
      );
      
      cancelEdit();
    } catch (error) {
      if (error instanceof ApiError) {
        alert(`Rename failed: ${error.message}`);
      } else {
        alert("An error occurred while renaming");
      }
      console.error("Rename error:", error);
    }
  };

  // Download resume
  const handleDownload = async (resume: Resume) => {
    try {
      const blob = await downloadResume(resume.IDResume);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${resume.Name}.pdf`; // You can adjust the extension based on file format
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      console.log("Resume downloaded:", resume.Name);
    } catch (error) {
      if (error instanceof ApiError) {
        alert(`Download failed: ${error.message}`);
      } else {
        alert("An error occurred during download");
      }
      console.error("Download error:", error);
    }
  };

  // Delete resume
  const handleDelete = async (resumeId: string, resumeName: string) => {
    if (!confirm(`Are you sure you want to delete "${resumeName}"?`)) {
      return;
    }

    try {
      const response = await deleteResume(resumeId);
      alert(response.message || "Resume deleted successfully!");
      
      // Remove from local state
      setResumes((prev) => prev.filter((r) => r.IDResume !== resumeId));
    } catch (error) {
      if (error instanceof ApiError) {
        alert(`Delete failed: ${error.message}`);
      } else {
        alert("An error occurred while deleting");
      }
      console.error("Delete error:", error);
    }
  };

  // Re-upload resume
  const handleReUpload = async (resume: Resume) => {
    const fileInput = reUploadFileInputRefs.current[resume.IDResume];
    if (!fileInput) return;

    const file = fileInput.files?.[0];
    if (!file) {
      alert("Please select a file to re-upload");
      return;
    }

    setReUploadingId(resume.IDResume);
    try {
      const response = await reUploadResume({
        file: file,
        name: resume.Name,
        id_resume: resume.IDResume,
      });
      
      alert(response.message || "Resume re-uploaded successfully!");
      
      // Refresh the list to show updated resume
      await fetchResumes();
      
      // Clear the file input
      fileInput.value = "";
    } catch (error) {
      if (error instanceof ApiError) {
        alert(`Re-upload failed: ${error.message}`);
      } else {
        alert("An error occurred during re-upload");
      }
      console.error("Re-upload error:", error);
    } finally {
      setReUploadingId(null);
    }
  };

  // Trigger file input click
  const triggerReUploadInput = (resumeId: string) => {
    reUploadFileInputRefs.current[resumeId]?.click();
  };

  // Format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  // Function to open editor with specific resume data
  const openEditorWithResume = async (resume: Resume) => {
    setIsLoadingEditor(true);
    try {
      // Fetch resume data from API
      const apiData = await fetchResumeInfo(resume.IDResume);
      
      // Store section IDs for later use when saving
      const sectionIdsMap: { [key: string]: string } = {};
      apiData.resume_data.forEach(section => {
        sectionIdsMap[section.SectionTitle.toLowerCase()] = section.IDResumeSection;
      });
      setCurrentSectionIds(sectionIdsMap);
      
      // Convert API data to editor format
      const editorData = convertApiToResumeData(apiData);
      
      // Set the editor data and open editor
      setEditorData(editorData);
      setCurrentResumeId(resume.IDResume);
      setShowEditor(true);
    } catch (error) {
      console.error('Failed to load resume:', error);
      alert('Failed to load resume data. Please try again.');
    } finally {
      setIsLoadingEditor(false);
    }
  };

  // Handle editor save
  const handleEditorSave = (data: ResumeData) => {
    console.log("Resume data saved:", data);
    console.log("Resume ID:", currentResumeId);
    console.log("Section IDs:", currentSectionIds);
    
    if (currentResumeId) {
      // TODO: Implement API call to save resume data
      // const apiPayload = convertResumeDataToApi(data, currentSectionIds);
      alert(`Resume saved for ID: ${currentResumeId}! (API integration pending)`);
    }
    
    setShowEditor(false);
  };

  // Close editor
  const closeEditor = () => {
    setShowEditor(false);
    setCurrentResumeId(null);
    setCurrentSectionIds({});
  };

  // Show editor if open
  if (showEditor && editorData) {
    return (
      <ResumeEditor
        initialData={editorData}
        onClose={closeEditor}
        onSave={handleEditorSave}
      />
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Resume Center</span>
          <div className="flex gap-2">
            <Button
              onClick={fetchResumes}
              disabled={isLoading}
              variant="outline"
              size="sm"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                  Loading...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Fetch Resumes
                </>
              )}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Upload Section */}
        <div className="p-4 bg-muted/50 rounded-lg space-y-3">
          <h3 className="font-semibold text-sm">Upload New Resume</h3>
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="flex-1"
            />
            <Input
              type="text"
              placeholder="Resume name"
              value={uploadName}
              onChange={(e) => setUploadName(e.target.value)}
              className="flex-1"
            />
            <Button
              onClick={handleUpload}
              disabled={isUploading || !uploadFile || !uploadName.trim()}
              className="shrink-0"
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Resumes List */}
        <div className="space-y-3">
          {resumes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No resumes found. Upload a resume or click "Fetch Resumes" to load existing ones.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
              {resumes.map((resume) => (
                <Card key={resume.IDResume} className="border-2">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      {/* Resume Info */}
                      <div className="flex-1 min-w-0">
                        {editingId === resume.IDResume ? (
                          <div className="flex items-center gap-2 mb-2">
                            <Input
                              type="text"
                              value={editingName}
                              onChange={(e) => setEditingName(e.target.value)}
                              className="h-8"
                              autoFocus
                            />
                            <Button
                              onClick={() => saveEdit(resume.IDResume)}
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0"
                            >
                              <Check className="h-4 w-4 text-green-600" />
                            </Button>
                            <Button
                              onClick={cancelEdit}
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0"
                            >
                              <X className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        ) : (
                          <h4 className="font-semibold text-base truncate mb-1">
                            {resume.Name}
                          </h4>
                        )}
                        <div className="space-y-1 text-xs text-muted-foreground">
                          <p>
                            <span className="font-medium">Created:</span>{" "}
                            {formatDate(resume.CreatedOn)}
                          </p>
                          <p>
                            <span className="font-medium">Updated:</span>{" "}
                            {formatDate(resume.UpdatedOn)}
                          </p>
                          <div className="flex gap-3 mt-2">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                resume.IsOriginal
                                  ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
                                  : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
                              }`}
                            >
                              {resume.IsOriginal ? "✓ Original" : "Modified"}
                            </span>
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                resume.Analyzed
                                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                                  : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                              }`}
                            >
                              {resume.Analyzed ? "✓ Analyzed" : "Not Analyzed"}
                            </span>
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                resume.IsParsed
                                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                  : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                              }`}
                            >
                              {resume.IsParsed ? "✓ Parsed" : "Not Parsed"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      {editingId !== resume.IDResume && (
                        <div className="flex gap-1">
                          <Button
                            onClick={() => openEditorWithResume(resume)}
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0"
                            title={resume.IsParsed ? "Edit Resume" : "Resume not parsed yet - editing disabled"}
                            disabled={isLoadingEditor || !resume.IsParsed}
                          >
                            {isLoadingEditor ? (
                              <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-current"></div>
                            ) : (
                              <FileEdit className={`h-3.5 w-3.5 ${!resume.IsParsed ? 'opacity-40' : ''}`} />
                            )}
                          </Button>
                          <Button
                            onClick={() => startEdit(resume)}
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0"
                            title="Rename"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            onClick={() => triggerReUploadInput(resume.IDResume)}
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0"
                            title="Re-upload"
                            disabled={reUploadingId === resume.IDResume}
                          >
                            {reUploadingId === resume.IDResume ? (
                              <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-current"></div>
                            ) : (
                              <UploadCloud className="h-3.5 w-3.5" />
                            )}
                          </Button>
                          <Button
                            onClick={() => handleDownload(resume)}
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0"
                            title="Download"
                          >
                            <Download className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            onClick={() => handleDelete(resume.IDResume, resume.Name)}
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                            title="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                          {/* Hidden file input for re-upload */}
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            ref={(el) => {
                              reUploadFileInputRefs.current[resume.IDResume] = el;
                            }}
                            onChange={() => handleReUpload(resume)}
                            className="hidden"
                          />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
