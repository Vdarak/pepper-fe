"use client";

import { useState } from "react";
import { Education } from "@/types/resume";
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

interface EducationPreviewProps {
  data: Education[];
  onUpdate: (newData: Education[]) => void;
  hideTitle?: boolean;
}

function EducationItem({
  education,
  onUpdate,
  isOverlay = false,
}: {
  education: Education;
  onUpdate: (newEdu: Education) => void;
  isOverlay?: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: education.university + education.major });

  const style = isOverlay
    ? {}
    : {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0 : 1,
      };

  return (
    <div ref={isOverlay ? undefined : setNodeRef} style={style} className="group mb-4 relative">
      {!isOverlay && (
        <div
          {...attributes}
          {...listeners}
          className="absolute -left-6 top-1 cursor-grab opacity-0 group-hover:opacity-100"
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>
      )}
      <div className="flex justify-between">
        <div className="font-semibold">
          <span
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) =>
              onUpdate({ ...education, university: e.currentTarget.textContent || "" })
            }
            className="cursor-text outline-none hover:bg-accent/20 rounded px-1"
          >
            {education.university}
          </span>
        </div>
        <div className="text-sm">
          <span
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) =>
              onUpdate({
                ...education,
                duration: { ...education.duration, start: e.currentTarget.textContent || "" },
              })
            }
            className="cursor-text outline-none hover:bg-accent/20 rounded px-1"
          >
            {education.duration.start}
          </span>
          {" - "}
          <span
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) =>
              onUpdate({
                ...education,
                duration: { ...education.duration, end: e.currentTarget.textContent || "" },
              })
            }
            className="cursor-text outline-none hover:bg-accent/20 rounded px-1"
          >
            {education.duration.end}
          </span>
        </div>
      </div>
      <div className="text-sm">
        <span
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) =>
            onUpdate({ ...education, major: e.currentTarget.textContent || "" })
          }
          className="cursor-text outline-none hover:bg-accent/20 rounded px-1"
        >
          {education.major}
        </span>
        {education.gpa && (
          <>
            {" | GPA: "}
            <span
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) =>
                onUpdate({ ...education, gpa: e.currentTarget.textContent || "" })
              }
              className="cursor-text outline-none hover:bg-accent/20 rounded px-1"
            >
              {education.gpa}
            </span>
          </>
        )}
      </div>
      {education.coursework.length > 0 && (
        <div className="text-sm mt-1">
          <span className="font-medium">Coursework:</span> {education.coursework.join(", ")}
        </div>
      )}
      {education.description.length > 0 && (
        <ul className="mt-1 space-y-0.5 text-sm">
          {education.description.map((desc, index) => (
            <li key={index} className="flex">
              <span className="mr-2">•</span>
              <span
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => {
                  const newDescription = [...education.description];
                  newDescription[index] = e.currentTarget.textContent || "";
                  onUpdate({ ...education, description: newDescription });
                }}
                className="flex-1 cursor-text outline-none hover:bg-accent/20 rounded px-1"
              >
                {desc}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function EducationPreview({ data, onUpdate, hideTitle }: EducationPreviewProps) {
  const [activeEduId, setActiveEduId] = useState<string | null>(null);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveEduId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = data.findIndex((e) => e.university + e.major === active.id);
      const newIndex = data.findIndex((e) => e.university + e.major === over.id);
      const newData = arrayMove(data, oldIndex, newIndex);
      onUpdate(newData);
    }
    
    setActiveEduId(null);
  };

  const updateEducation = (index: number, newEdu: Education) => {
    const newData = [...data];
    newData[index] = newEdu;
    onUpdate(newData);
  };

  return (
    <div>
      {!hideTitle && (
        <h2 className="text-xl font-bold uppercase mb-3 border-b border-foreground/20 pb-1">
          Education
        </h2>
      )}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={data.map((e) => e.university + e.major)}
          strategy={verticalListSortingStrategy}
        >
          <div className="pl-6">
            {data.map((education, index) => (
              <EducationItem
                key={education.university + education.major}
                education={education}
                onUpdate={(newEdu) => updateEducation(index, newEdu)}
              />
            ))}
          </div>
        </SortableContext>
        <DragOverlay dropAnimation={null}>
          {activeEduId ? (
            <EducationItem
              education={data.find((e) => e.university + e.major === activeEduId)!}
              onUpdate={() => {}}
              isOverlay={true}
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
