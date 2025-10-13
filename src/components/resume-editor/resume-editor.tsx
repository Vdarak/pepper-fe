"use client";

import { useState, useCallback, useEffect } from "react";
import { DndContext, DragEndEvent, closestCenter } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { ResumeData, SectionItem } from "@/types/resume";
import { EditorPane } from "./editor-pane";
import { PreviewPane } from "./preview-pane";
import { FloatingMinimap } from "./floating-minimap";
import { Button } from "@/components/ui/button";
import { Save, X, Download, Monitor } from "lucide-react";
import { convertResumeDataToApi } from "@/lib/resume-converter";
import { generateUUID } from "@/lib/utils";
import { createDefaultSectionData, getSectionDisplayName } from "@/lib/section-defaults";

interface ResumeEditorProps {
  initialData: ResumeData;
  onClose?: () => void;
  onSave?: (data: ResumeData) => void;
}

/**
 * Resume Editor with Preview
 * Two-pane layout: Editor on left, Live Preview on right
 * Mobile: Tabs for Edit/Preview
 * Features:
 * - Drag and drop reordering for sections and items
 * - Inline editing in both panes
 * - Floating section minimap for quick reordering
 * - Real-time sync between editor and preview
 * 
 * TODO: Add ability to create new sections (planned for next iteration)
 */
export default function ResumeEditor({ initialData, onClose, onSave }: ResumeEditorProps) {
  const [resumeData, setResumeData] = useState<ResumeData>(initialData);
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Update header data
  const updateHeader = useCallback((field: string, value: string | any[]) => {
    setResumeData((prev) => ({
      ...prev,
      header: {
        ...prev.header,
        [field]: value,
      },
    }));
  }, []);

  // Update section data
  const updateSection = useCallback((sectionName: string, newData: any) => {
    setResumeData((prev) => ({
      ...prev,
      data: prev.data.map((section) =>
        section.section === sectionName
          ? { ...section, item: newData }
          : section
      ),
    }));
  }, []);

  // Reorder sections
  const reorderSections = useCallback((newOrder: string[]) => {
    setResumeData((prev) => {
      const newData = newOrder
        .map((sectionName) =>
          prev.data.find((s) => s.section === sectionName)
        )
        .filter((s) => s !== undefined);

      return {
        ...prev,
        data: newData,
        section_idx: newOrder,
      };
    });
  }, []);

  // Update section title
  const updateSectionTitle = useCallback((oldTitle: string, newTitle: string) => {
    setResumeData((prev) => {
      // Update section_idx
      const newSectionIdx = prev.section_idx.map((name) =>
        name === oldTitle ? newTitle : name
      );

      // Update data array
      const newData = prev.data.map((section) =>
        section.section === oldTitle
          ? { ...section, section: newTitle as any }
          : section
      );

      return {
        ...prev,
        data: newData as any,
        section_idx: newSectionIdx,
      };
    });
  }, []);

  // Add new section
  const addSection = useCallback((sectionName: string) => {
    const normalizedName = sectionName.toLowerCase();
    
    // Generate a new UUID for this section
    const newSectionId = generateUUID();
    
    // Create default data for the section
    const defaultData = createDefaultSectionData(normalizedName);
    
    // Create the new section item
    const newSectionItem: SectionItem = {
      section: normalizedName as any,
      item: defaultData,
    };
    
    setResumeData((prev) => {
      // Add section ID to the map
      const newSectionIds = {
        ...(prev.sectionIds || {}),
        [normalizedName]: newSectionId,
      };
      
      return {
        ...prev,
        data: [...prev.data, newSectionItem],
        section_idx: [...prev.section_idx, normalizedName],
        sectionIds: newSectionIds,
      };
    });
  }, []);

  // Delete section (mark as DELETED)
  const deleteSection = useCallback((sectionName: string) => {
    const normalizedName = sectionName.toLowerCase();
    
    // Get the section ID before deletion
    const sectionId = resumeData.sectionIds?.[normalizedName];
    
    if (!sectionId) {
      // If no section ID, just remove from data (it was never saved)
      setResumeData((prev) => ({
        ...prev,
        data: prev.data.filter((section) => section.section !== normalizedName),
        section_idx: prev.section_idx.filter((name) => name !== normalizedName),
      }));
      return;
    }
    
    // Mark section as deleted by changing its title and storing the ID
    setResumeData((prev) => {
      const newData = prev.data.map((section) =>
        section.section === normalizedName
          ? { 
              ...section, 
              section: "<--DELETED-->" as any,
              // Store the ID directly in the section item so we can retrieve it later
              _deletedId: sectionId
            }
          : section
      );
      
      // Remove from section_idx so it doesn't show in UI
      const newSectionIdx = prev.section_idx.filter((name) => name !== normalizedName);
      
      // Keep the section ID mapping for reference
      const newSectionIds = {
        ...(prev.sectionIds || {}),
        [`<--DELETED-->-${sectionId}`]: sectionId,
      };
      delete newSectionIds[normalizedName];
      
      return {
        ...prev,
        data: newData as any,
        section_idx: newSectionIdx,
        sectionIds: newSectionIds,
      };
    });
  }, [resumeData.sectionIds]);

  // Handle drag end for sections
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setResumeData((prev) => {
        const oldIndex = prev.section_idx.indexOf(active.id as string);
        const newIndex = prev.section_idx.indexOf(over.id as string);
        const newOrder = arrayMove(prev.section_idx, oldIndex, newIndex);

        const newData = newOrder
          .map((sectionName) =>
            prev.data.find((s) => s.section === sectionName)
          )
          .filter((s) => s !== undefined);

        return {
          ...prev,
          data: newData,
          section_idx: newOrder,
        };
      });
    }
  }, []);

  const handleSave = () => {
    if (onSave) {
      onSave(resumeData);
    }
  };

  const handleDownloadJSON = () => {
    // Convert to API format (with 'entity' instead of 'company/university')
    const apiFormat = convertResumeDataToApi(resumeData, resumeData.sectionIds || {});
    
    // Create a clean export format
    const exportData = {
      data: apiFormat.resume_data.map(section => ({
        section: section.SectionTitle.toLowerCase(),
        items: JSON.parse(section.Items)
      }))
    };
    
    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `resume-${resumeData.header.Name.replace(/\s+/g, "-")}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-background">
      {/* Desktop Warning Banner for Mobile */}
      {isMobile && (
        <div className="flex items-center gap-2 bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 text-sm">
          <Monitor className="h-4 w-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
          <p className="text-amber-900 dark:text-amber-100">
            For the best editing experience, please use this editor on a desktop or laptop computer.
          </p>
        </div>
      )}

      {/* Header bar */}
      <div className="flex items-center justify-between border-b px-4 lg:px-6 py-3 lg:py-4">
        <div className="flex items-center gap-2 lg:gap-4">
          <h1 className="text-lg lg:text-2xl font-semibold">Resume Editor</h1>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleDownloadJSON} size="sm" variant="outline">
            <Download className="h-4 w-4 lg:mr-2" />
            <span className="hidden lg:inline">JSON</span>
          </Button>
          <Button onClick={handleSave} size="sm">
            <Save className="h-4 w-4 lg:mr-2" />
            <span className="hidden lg:inline">Save</span>
          </Button>
          {onClose && (
            <Button onClick={onClose} variant="outline" size="sm">
              <X className="h-4 w-4 lg:mr-2" />
              <span className="hidden lg:inline">Close</span>
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Tabs */}
      {isMobile && (
        <div className="flex border-b bg-muted/30">
          <button
            onClick={() => setActiveTab("edit")}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === "edit"
                ? "bg-background border-b-2 border-primary text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Edit
          </button>
          <button
            onClick={() => setActiveTab("preview")}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === "preview"
                ? "bg-background border-b-2 border-primary text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Preview
          </button>
        </div>
      )}

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className={`flex ${isMobile ? "h-[calc(100vh-137px)]" : "h-[calc(100vh-73px)]"}`}>
          {/* Editor Pane */}
          {(!isMobile || activeTab === "edit") && (
            <EditorPane
              resumeData={resumeData}
              onUpdateHeader={updateHeader}
              onUpdateSection={updateSection}
              onReorderSections={reorderSections}
              onUpdateSectionTitle={updateSectionTitle}
              onAddSection={addSection}
              onDeleteSection={deleteSection}
              isMobile={isMobile}
            />
          )}

          {/* Preview Pane */}
          {(!isMobile || activeTab === "preview") && (
            <PreviewPane
              resumeData={resumeData}
              onUpdateHeader={updateHeader}
              onUpdateSection={updateSection}
              onReorderSections={reorderSections}
              onUpdateSectionTitle={updateSectionTitle}
              isMobile={isMobile}
            />
          )}

          {/* Floating Minimap - only show in preview on mobile or always on desktop */}
          {(!isMobile || activeTab === "preview") && (
            <FloatingMinimap
              sections={resumeData.section_idx}
              onReorder={reorderSections}
            />
          )}
        </div>
      </DndContext>
    </div>
  );
}
