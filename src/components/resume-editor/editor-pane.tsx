"use client";

import { useState, useRef } from "react";
import { ResumeData } from "@/types/resume";
import { HeaderEditor } from "./sections/header-editor";
import { SkillsEditor } from "./sections/skills-editor";
import { EducationEditor } from "./sections/education-editor";
import { ProjectsEditor } from "./sections/projects-editor";
import { ExperienceEditor } from "./sections/experience-editor";
import { CertificationsEditor } from "./sections/certifications-editor";
import { SummaryEditor } from "./sections/summary-editor";
import { AddSectionButtons, AvailableSectionType } from "./add-section-buttons";
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ChevronDown, ChevronUp, GripVertical, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface EditorPaneProps {
  resumeData: ResumeData;
  onUpdateHeader: (field: string, value: any) => void;
  onUpdateSection: (sectionName: string, newData: any) => void;
  onReorderSections: (newOrder: string[]) => void;
  onUpdateSectionTitle?: (oldTitle: string, newTitle: string) => void;
  onAddSection?: (sectionName: string) => void;
  onDeleteSection?: (sectionName: string) => void;
  isMobile?: boolean;
}

// Available section types that can be added
const AVAILABLE_SECTION_TYPES: AvailableSectionType[] = [
  { name: "summary", displayName: "Summary" },
  { name: "skills", displayName: "Skills" },
  { name: "education", displayName: "Education" },
  { name: "professional experience", displayName: "Professional Experience" },
  { name: "research experience", displayName: "Research Experience" },
  { name: "projects", displayName: "Projects" },
  { name: "certifications and achievements", displayName: "Certifications & Achievements" },
];

function SortableSectionWrapper({
  sectionName,
  children,
  onUpdateSectionTitle,
  onDeleteSection,
  isOverlay = false,
}: {
  sectionName: string;
  children: React.ReactNode;
  onUpdateSectionTitle?: (oldTitle: string, newTitle: string) => void;
  onDeleteSection?: (sectionName: string) => void;
  isOverlay?: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: sectionName });
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(sectionName);
  const [isHoveringTitle, setIsHoveringTitle] = useState(false);
  const nodeRef = useRef<HTMLDivElement>(null);

  const style = isOverlay
    ? {}
    : {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0 : 1,
      };

  const handleRef = (node: HTMLDivElement | null) => {
    nodeRef.current = node;
    if (!isOverlay) {
      setNodeRef(node);
    }
  };

  const handleSaveSectionTitle = () => {
    if (editedTitle.trim() && editedTitle !== sectionName && onUpdateSectionTitle) {
      onUpdateSectionTitle(sectionName, editedTitle.trim());
    }
    setIsEditingTitle(false);
  };

  const handleCancelEdit = () => {
    setEditedTitle(sectionName);
    setIsEditingTitle(false);
  };

  const handleDelete = () => {
    if (onDeleteSection && confirm(`Are you sure you want to delete the "${sectionName}" section?`)) {
      onDeleteSection(sectionName);
    }
  };

  return (
    <div ref={handleRef} style={style} className="relative">
      {!isOverlay && (
        <div className="absolute -left-6 top-4 flex items-center gap-1">
          <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
            <GripVertical className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>
      )}
      <div className="border rounded-lg overflow-hidden">
        <div
          className="w-full flex items-center justify-between px-4 py-3 bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
          onClick={(e) => {
            if (!isOverlay && !isEditingTitle) {
              setIsCollapsed(!isCollapsed);
            }
          }}
        >
          <div 
            className="flex items-center gap-2 group/title"
            onMouseEnter={() => setIsHoveringTitle(true)}
            onMouseLeave={() => setIsHoveringTitle(false)}
          >
            {isEditingTitle ? (
              <Input
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                onBlur={handleSaveSectionTitle}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveSectionTitle();
                  if (e.key === "Escape") handleCancelEdit();
                  e.stopPropagation();
                }}
                onClick={(e) => e.stopPropagation()}
                className="h-7 w-auto min-w-[150px] text-base font-semibold"
                autoFocus
              />
            ) : (
              <>
                <h3 className="text-base font-semibold capitalize">{sectionName}</h3>
                {isHoveringTitle && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsEditingTitle(true);
                    }}
                    className="opacity-0 group-hover/title:opacity-100 transition-opacity p-1 -m-1 rounded hover:bg-accent"
                  >
                    <Pencil className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
                  </button>
                )}
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            {onDeleteSection && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete();
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={(e) => {
                e.stopPropagation();
                if (!isOverlay) {
                  setIsCollapsed(!isCollapsed);
                }
              }}
            >
              {isCollapsed ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronUp className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
        {!isCollapsed && <div className="p-4">{children}</div>}
      </div>
    </div>
  );
}

export function EditorPane({
  resumeData,
  onUpdateHeader,
  onUpdateSection,
  onReorderSections,
  onUpdateSectionTitle,
  onAddSection,
  onDeleteSection,
  isMobile,
}: EditorPaneProps) {
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveSectionId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = resumeData.section_idx.indexOf(active.id as string);
      const newIndex = resumeData.section_idx.indexOf(over.id as string);
      const newOrder = arrayMove(resumeData.section_idx, oldIndex, newIndex);
      onReorderSections(newOrder);
    }
    
    setActiveSectionId(null);
  };

  const renderSectionContent = (sectionName: string) => {
    const sectionData = resumeData.data.find((s) => s.section === sectionName);
    if (!sectionData) return null;

    if (sectionName === "skills" && sectionData.section === "skills") {
      return (
        <SkillsEditor
          data={sectionData.item}
          onUpdate={(newData: any) => onUpdateSection(sectionName, newData)}
        />
      );
    }
    if (sectionName === "education" && sectionData.section === "education") {
      return (
        <EducationEditor
          data={sectionData.item}
          onUpdate={(newData: any) => onUpdateSection(sectionName, newData)}
        />
      );
    }
    if (sectionName === "projects" && sectionData.section === "projects") {
      return (
        <ProjectsEditor
          data={sectionData.item}
          onUpdate={(newData: any) => onUpdateSection(sectionName, newData)}
        />
      );
    }
    if (
      (sectionName === "research experience" || sectionName === "professional experience" || sectionName === "experience") &&
      (sectionData.section === "research experience" || sectionData.section === "professional experience" || sectionData.section === "experience")
    ) {
      return (
        <ExperienceEditor
          title={sectionName}
          data={sectionData.item}
          onUpdate={(newData: any) => onUpdateSection(sectionName, newData)}
        />
      );
    }
    if (sectionName === "certifications and achievements" && sectionData.section === "certifications and achievements") {
      return (
        <CertificationsEditor
          data={sectionData.item}
          onUpdate={(newData: any) => onUpdateSection(sectionName, newData)}
        />
      );
    }
    if (sectionName === "summary" && sectionData.section === "summary") {
      return (
        <SummaryEditor
          data={sectionData.item}
          onUpdate={(newData: any) => onUpdateSection(sectionName, newData)}
        />
      );
    }
    
    // For custom sections or unknown section types, use the generic experience editor
    // This provides a basic structure that works for most custom sections
    return (
      <ExperienceEditor
        title={sectionName}
        data={Array.isArray((sectionData as any).item) ? (sectionData as any).item : [(sectionData as any).item]}
        onUpdate={(newData: any) => onUpdateSection(sectionName, newData)}
      />
    );
  };

  return (
    <div className={`${isMobile ? "w-screen" : "w-[50vw]"} overflow-y-auto border-r`}>
      <div className="space-y-6 p-6 pl-12">
        {/* Header Section - Not draggable, always at top */}
        <div className="border rounded-lg">
          <div className="px-4 py-3 bg-muted/30">
            <h3 className="text-base font-semibold">Header</h3>
          </div>
          <div className="p-4">
            <HeaderEditor header={resumeData.header} onUpdate={onUpdateHeader} />
          </div>
        </div>

        {/* Add Section Buttons */}
        {onAddSection && (
          <AddSectionButtons
            onAddSection={onAddSection}
            existingSections={resumeData.section_idx}
            availableSectionTypes={AVAILABLE_SECTION_TYPES}
          />
        )}

        {/* Draggable Sections */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={resumeData.section_idx}
            strategy={verticalListSortingStrategy}
          >
            {resumeData.section_idx.map((sectionName) => (
              <SortableSectionWrapper 
                key={sectionName} 
                sectionName={sectionName}
                onUpdateSectionTitle={onUpdateSectionTitle}
                onDeleteSection={onDeleteSection}
              >
                {renderSectionContent(sectionName)}
              </SortableSectionWrapper>
            ))}
          </SortableContext>
          
          <DragOverlay dropAnimation={null}>
            {activeSectionId ? (
              <div className="w-[calc(50vw-3rem)]">
                <SortableSectionWrapper 
                  sectionName={activeSectionId}
                  onUpdateSectionTitle={onUpdateSectionTitle}
                  onDeleteSection={onDeleteSection}
                  isOverlay={true}
                >
                  {renderSectionContent(activeSectionId)}
                </SortableSectionWrapper>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}
