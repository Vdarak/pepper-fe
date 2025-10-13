"use client";

import { useRef, useEffect, useState } from "react";
import { ResumeData } from "@/types/resume";
import { HeaderPreview } from "./preview/header-preview";
import { SkillsPreview } from "./preview/skills-preview";
import { EducationPreview } from "./preview/education-preview";
import { ProjectsPreview } from "./preview/projects-preview";
import { ExperiencePreview } from "./preview/experience-preview";
import { CertificationsPreview } from "./preview/certifications-preview";
import { SummaryPreview } from "./preview/summary-preview";
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
import { GripVertical } from "lucide-react";

interface PreviewPaneProps {
  resumeData: ResumeData;
  onUpdateHeader: (field: string, value: any) => void;
  onUpdateSection: (sectionName: string, newData: any) => void;
  onReorderSections?: (newOrder: string[]) => void;
  onUpdateSectionTitle?: (oldTitle: string, newTitle: string) => void;
  isMobile?: boolean;
}

// Sortable wrapper for each section
function SortableSectionPreview({
  sectionName,
  children,
  onUpdateSectionTitle,
  isOverlay = false,
}: {
  sectionName: string;
  children: React.ReactNode;
  onUpdateSectionTitle?: (oldTitle: string, newTitle: string) => void;
  isOverlay?: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: sectionName });
  const nodeRef = useRef<HTMLDivElement>(null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(sectionName);
  const titleRef = useRef<HTMLSpanElement>(null);

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
    } else {
      setEditedTitle(sectionName);
    }
    setIsEditingTitle(false);
  };

  const handleCancelEdit = () => {
    setEditedTitle(sectionName);
    setIsEditingTitle(false);
  };

  const handleTitleClick = () => {
    setIsEditingTitle(true);
  };

  return (
    <div ref={handleRef} style={style} className="relative group">
      {/* Drag Handle */}
      {!isOverlay && (
        <div
          {...attributes}
          {...listeners}
          className="absolute -left-8 top-2 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <GripVertical className="h-5 w-5 text-muted-foreground hover:text-foreground" />
        </div>
      )}
      <div>
        {/* Editable Section Title */}
        <h2 className="text-xl font-bold uppercase mb-3 border-b border-foreground/20 pb-1">
          {isEditingTitle && !isOverlay ? (
            <span
              ref={titleRef}
              contentEditable
              suppressContentEditableWarning
              onBlur={handleSaveSectionTitle}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSaveSectionTitle();
                }
                if (e.key === "Escape") {
                  e.preventDefault();
                  handleCancelEdit();
                }
              }}
              className="cursor-text outline-none focus:bg-accent/20 rounded px-1"
              autoFocus
            >
              {editedTitle}
            </span>
          ) : (
            <span
              onClick={handleTitleClick}
              className="cursor-text hover:bg-accent/20 rounded px-1 transition-colors"
            >
              {sectionName}
            </span>
          )}
        </h2>
        {children}
      </div>
    </div>
  );
}

export function PreviewPane({
  resumeData,
  onUpdateHeader,
  onUpdateSection,
  onReorderSections,
  onUpdateSectionTitle,
  isMobile,
}: PreviewPaneProps) {
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

    if (over && active.id !== over.id && onReorderSections) {
      const oldIndex = resumeData.section_idx.indexOf(active.id as string);
      const newIndex = resumeData.section_idx.indexOf(over.id as string);
      const newOrder = arrayMove(resumeData.section_idx, oldIndex, newIndex);
      onReorderSections(newOrder);
    }
    
    setActiveSectionId(null);
  };

  const renderSection = (sectionName: string) => {
    const sectionData = resumeData.data.find((s) => s.section === sectionName);
    if (!sectionData) return null;

    switch (sectionData.section) {
      case "skills":
        return (
          <SkillsPreview
            data={sectionData.item}
            onUpdate={(newData: any) => onUpdateSection(sectionName, newData)}
            hideTitle
          />
        );
      case "education":
        return (
          <EducationPreview
            data={sectionData.item}
            onUpdate={(newData: any) => onUpdateSection(sectionName, newData)}
            hideTitle
          />
        );
      case "projects":
        return (
          <ProjectsPreview
            data={sectionData.item}
            onUpdate={(newData: any) => onUpdateSection(sectionName, newData)}
            hideTitle
          />
        );
      case "research experience":
      case "professional experience":
        return (
          <ExperiencePreview
            title={sectionName}
            data={sectionData.item}
            onUpdate={(newData: any) => onUpdateSection(sectionName, newData)}
            hideTitle
          />
        );
      case "certifications and achievements":
        return (
          <CertificationsPreview
            data={sectionData.item}
            onUpdate={(newData: any) => onUpdateSection(sectionName, newData)}
            hideTitle
          />
        );
      case "summary":
        return (
          <SummaryPreview
            data={sectionData.item}
            onUpdate={(newData: any) => onUpdateSection(sectionName, newData)}
            hideTitle
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={`${isMobile ? "w-screen" : "w-[50vw]"} overflow-y-auto bg-muted/20`}>
      <div className="mx-auto max-w-[850px] bg-background p-12 shadow-lg">
        {/* Header Preview */}
        <HeaderPreview header={resumeData.header} onUpdate={onUpdateHeader} />

        {/* Dynamic Sections Preview with Drag and Drop */}
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
            <div className="mt-6 space-y-6">
              {resumeData.section_idx.map((sectionName) => (
                <SortableSectionPreview 
                  key={sectionName} 
                  sectionName={sectionName}
                  onUpdateSectionTitle={onUpdateSectionTitle}
                >
                  {renderSection(sectionName)}
                </SortableSectionPreview>
              ))}
            </div>
          </SortableContext>
          
          <DragOverlay dropAnimation={null}>
            {activeSectionId ? (
              <div className="w-[850px] bg-background p-6 shadow-lg">
                <SortableSectionPreview 
                  sectionName={activeSectionId}
                  onUpdateSectionTitle={onUpdateSectionTitle}
                  isOverlay={true}
                >
                  {renderSection(activeSectionId)}
                </SortableSectionPreview>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}
