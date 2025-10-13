"use client";

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
  isMobile?: boolean;
}

// Sortable wrapper for each section
function SortableSectionPreview({
  sectionName,
  children,
}: {
  sectionName: string;
  children: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: sectionName });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group">
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute -left-8 top-2 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <GripVertical className="h-5 w-5 text-muted-foreground hover:text-foreground" />
      </div>
      {children}
    </div>
  );
}

export function PreviewPane({
  resumeData,
  onUpdateHeader,
  onUpdateSection,
  onReorderSections,
  isMobile,
}: PreviewPaneProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id && onReorderSections) {
      const oldIndex = resumeData.section_idx.indexOf(active.id as string);
      const newIndex = resumeData.section_idx.indexOf(over.id as string);
      const newOrder = arrayMove(resumeData.section_idx, oldIndex, newIndex);
      onReorderSections(newOrder);
    }
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
          />
        );
      case "education":
        return (
          <EducationPreview
            data={sectionData.item}
            onUpdate={(newData: any) => onUpdateSection(sectionName, newData)}
          />
        );
      case "projects":
        return (
          <ProjectsPreview
            data={sectionData.item}
            onUpdate={(newData: any) => onUpdateSection(sectionName, newData)}
          />
        );
      case "research experience":
      case "professional experience":
        return (
          <ExperiencePreview
            title={sectionName}
            data={sectionData.item}
            onUpdate={(newData: any) => onUpdateSection(sectionName, newData)}
          />
        );
      case "certifications and achievements":
        return (
          <CertificationsPreview
            data={sectionData.item}
            onUpdate={(newData: any) => onUpdateSection(sectionName, newData)}
          />
        );
      case "summary":
        return (
          <SummaryPreview
            data={sectionData.item}
            onUpdate={(newData: any) => onUpdateSection(sectionName, newData)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={`${isMobile ? "w-full" : "w-1/2"} overflow-y-auto bg-muted/20`}>
      <div className="mx-auto max-w-[850px] bg-background p-12 shadow-lg">
        {/* Header Preview */}
        <HeaderPreview header={resumeData.header} onUpdate={onUpdateHeader} />

        {/* Dynamic Sections Preview with Drag and Drop */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={resumeData.section_idx}
            strategy={verticalListSortingStrategy}
          >
            <div className="mt-6 space-y-6">
              {resumeData.section_idx.map((sectionName) => (
                <SortableSectionPreview key={sectionName} sectionName={sectionName}>
                  {renderSection(sectionName)}
                </SortableSectionPreview>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}
