"use client";

import { useState } from "react";
import { ResumeData } from "@/types/resume";
import { HeaderEditor } from "./sections/header-editor";
import { SkillsEditor } from "./sections/skills-editor";
import { EducationEditor } from "./sections/education-editor";
import { ProjectsEditor } from "./sections/projects-editor";
import { ExperienceEditor } from "./sections/experience-editor";
import { CertificationsEditor } from "./sections/certifications-editor";
import { SummaryEditor } from "./sections/summary-editor";
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
import { ChevronDown, ChevronUp, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EditorPaneProps {
  resumeData: ResumeData;
  onUpdateHeader: (field: string, value: any) => void;
  onUpdateSection: (sectionName: string, newData: any) => void;
  onReorderSections: (newOrder: string[]) => void;
  isMobile?: boolean;
}

function SortableSectionWrapper({
  sectionName,
  children,
}: {
  sectionName: string;
  children: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: sectionName });
  const [isCollapsed, setIsCollapsed] = useState(false);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative">
      <div className="absolute -left-6 top-4 flex items-center gap-1">
        <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
          <GripVertical className="h-5 w-5 text-muted-foreground" />
        </div>
      </div>
      <div className="border rounded-lg overflow-hidden">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-between px-4 py-3 bg-muted/30 hover:bg-muted/50 transition-colors"
        >
          <h3 className="text-base font-semibold capitalize">{sectionName}</h3>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            {isCollapsed ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronUp className="h-4 w-4" />
            )}
          </Button>
        </button>
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
  isMobile,
}: EditorPaneProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = resumeData.section_idx.indexOf(active.id as string);
      const newIndex = resumeData.section_idx.indexOf(over.id as string);
      const newOrder = arrayMove(resumeData.section_idx, oldIndex, newIndex);
      onReorderSections(newOrder);
    }
  };

  return (
    <div className={`${isMobile ? "w-full" : "w-1/2"} overflow-y-auto border-r`}>
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

        {/* Draggable Sections */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={resumeData.section_idx}
            strategy={verticalListSortingStrategy}
          >
            {resumeData.section_idx.map((sectionName) => {
              const sectionData = resumeData.data.find((s) => s.section === sectionName);
              if (!sectionData) return null;

              return (
                <SortableSectionWrapper key={sectionName} sectionName={sectionName}>
                  {sectionName === "skills" && sectionData.section === "skills" && (
                    <SkillsEditor
                      data={sectionData.item}
                      onUpdate={(newData: any) => onUpdateSection(sectionName, newData)}
                    />
                  )}
                  {sectionName === "education" && sectionData.section === "education" && (
                    <EducationEditor
                      data={sectionData.item}
                      onUpdate={(newData: any) => onUpdateSection(sectionName, newData)}
                    />
                  )}
                  {sectionName === "projects" && sectionData.section === "projects" && (
                    <ProjectsEditor
                      data={sectionData.item}
                      onUpdate={(newData: any) => onUpdateSection(sectionName, newData)}
                    />
                  )}
                  {(sectionName === "research experience" ||
                    sectionName === "professional experience") && 
                    (sectionData.section === "research experience" ||
                    sectionData.section === "professional experience") && (
                    <ExperienceEditor
                      title={sectionName}
                      data={sectionData.item}
                      onUpdate={(newData: any) => onUpdateSection(sectionName, newData)}
                    />
                  )}
                  {sectionName === "certifications and achievements" && 
                    sectionData.section === "certifications and achievements" && (
                    <CertificationsEditor
                      data={sectionData.item}
                      onUpdate={(newData: any) => onUpdateSection(sectionName, newData)}
                    />
                  )}
                  {sectionName === "summary" && sectionData.section === "summary" && (
                    <SummaryEditor
                      data={sectionData.item}
                      onUpdate={(newData: any) => onUpdateSection(sectionName, newData)}
                    />
                  )}
                </SortableSectionWrapper>
              );
            })}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}
