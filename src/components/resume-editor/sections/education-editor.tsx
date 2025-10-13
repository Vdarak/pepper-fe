"use client";

import { Education } from "@/types/resume";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X, GripVertical, ArrowRight, Trash2 } from "lucide-react";
import { useState } from "react";
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
  horizontalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface EducationEditorProps {
  data: Education[];
  onUpdate: (newData: Education[]) => void;
}

function SortableCoursework({
  course,
  onRemove,
  isOverlay = false,
}: {
  course: string;
  onRemove: () => void;
  isOverlay?: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: course });

  const style = isOverlay
    ? {}
    : {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0 : 1,
      };

  return (
    <div
      ref={isOverlay ? undefined : setNodeRef}
      style={style}
      className="group inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm"
      {...(isOverlay ? {} : attributes)}
      {...(isOverlay ? {} : listeners)}
    >
      <GripVertical className="h-3 w-3 cursor-grab text-muted-foreground" />
      <span>{course}</span>
      {!isOverlay && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-1 rounded-full hover:bg-destructive/20"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}

function EducationItem({
  education,
  educationId,
  onUpdate,
  onRemove,
}: {
  education: Education;
  educationId: string;
  onUpdate: (newEdu: Education) => void;
  onRemove: () => void;
}) {
  const [isAddingCoursework, setIsAddingCoursework] = useState(false);
  const [newCoursework, setNewCoursework] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: educationId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleCourseworkDragStart = (event: DragStartEvent) => {
    setActiveCourseId(event.active.id as string);
  };

  const handleCourseworkDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = education.coursework.indexOf(active.id as string);
      const newIndex = education.coursework.indexOf(over.id as string);
      const newCoursework = arrayMove(education.coursework, oldIndex, newIndex);
      onUpdate({ ...education, coursework: newCoursework });
    }
    
    setActiveCourseId(null);
  };

  const addCoursework = () => {
    if (newCoursework.trim()) {
      onUpdate({
        ...education,
        coursework: [...education.coursework, newCoursework.trim()],
      });
      setNewCoursework("");
      setIsAddingCoursework(false);
    }
  };

  const removeCoursework = (course: string) => {
    onUpdate({
      ...education,
      coursework: education.coursework.filter((c) => c !== course),
    });
  };

  const addDescription = () => {
    onUpdate({
      ...education,
      description: [...education.description, ""],
    });
  };

  const updateDescription = (index: number, value: string) => {
    const newDescription = [...education.description];
    newDescription[index] = value;
    onUpdate({ ...education, description: newDescription });
  };

  const removeDescription = (index: number) => {
    onUpdate({
      ...education,
      description: education.description.filter((_, i) => i !== index),
    });
  };

  return (
    <div ref={setNodeRef} style={style} className="space-y-4 rounded-lg border p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-2 flex-1">
          <div {...attributes} {...listeners} className="cursor-grab pt-2">
            <GripVertical className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="flex-1 space-y-3 max-w-md">
            <Input
              value={education.university}
              onChange={(e) =>
                onUpdate({ ...education, university: e.target.value })
              }
              className="font-semibold"
              placeholder="University Name"
            />
            <Input
              value={education.major}
              onChange={(e) => onUpdate({ ...education, major: e.target.value })}
              placeholder="Degree & Major"
            />
          </div>
        </div>
        <div>
          {confirmDelete ? (
            <div className="flex flex-col gap-2">
              <Button
                onClick={() => {
                  onRemove();
                  setConfirmDelete(false);
                }}
                size="sm"
                variant="destructive"
              >
                Confirm
              </Button>
              <Button
                onClick={() => setConfirmDelete(false)}
                size="sm"
                variant="outline"
              >
                Cancel
              </Button>
            </div>
          ) : (
            <Button onClick={() => setConfirmDelete(true)} size="icon" variant="ghost">
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-7 gap-3 items-end">
        <div className="md:col-span-2">
          <Label className="text-xs mb-1.5 block">Start Date</Label>
          <Input
            value={education.duration.start}
            onChange={(e) =>
              onUpdate({
                ...education,
                duration: { ...education.duration, start: e.target.value },
              })
            }
            placeholder="MMM YYYY"
            className="h-9"
          />
        </div>
        <div className="hidden md:flex items-center justify-center pb-1">
          <ArrowRight className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="md:col-span-2">
          <Label className="text-xs mb-1.5 block">End Date</Label>
          <Input
            value={education.duration.end}
            onChange={(e) =>
              onUpdate({
                ...education,
                duration: { ...education.duration, end: e.target.value },
              })
            }
            placeholder="MMM YYYY"
            className="h-9"
          />
        </div>
        <div className="md:col-span-2">
          <Label className="text-xs mb-1.5 block">GPA</Label>
          <Input
            value={education.gpa}
            onChange={(e) => onUpdate({ ...education, gpa: e.target.value })}
            placeholder="3.5/4.0"
            className="h-9"
          />
        </div>
      </div>

      <div className="mt-4">
        <Label className="text-sm mb-2 block">Coursework</Label>
        {education.coursework.length === 0 && !isAddingCoursework ? (
          <Button
            onClick={() => setIsAddingCoursework(true)}
            size="sm"
            variant="outline"
            className="mt-2"
          >
            <Plus className="mr-1 h-4 w-4" />
            Add Coursework
          </Button>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleCourseworkDragStart}
            onDragEnd={handleCourseworkDragEnd}
          >
            <SortableContext
              items={education.coursework}
              strategy={horizontalListSortingStrategy}
            >
              <div className="mt-2 flex flex-wrap gap-2">
                {education.coursework.map((course) => (
                  <SortableCoursework
                    key={course}
                    course={course}
                    onRemove={() => removeCoursework(course)}
                  />
                ))}
                {isAddingCoursework ? (
                  <div className="flex items-center gap-2">
                    <Input
                      value={newCoursework}
                      onChange={(e) => setNewCoursework(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") addCoursework();
                        if (e.key === "Escape") {
                          setIsAddingCoursework(false);
                          setNewCoursework("");
                        }
                      }}
                      onBlur={() => {
                        if (newCoursework.trim()) {
                          addCoursework();
                        } else {
                          setIsAddingCoursework(false);
                        }
                      }}
                      placeholder="Course name"
                      className="h-8 w-40"
                      autoFocus
                    />
                    <Button onClick={addCoursework} size="sm" variant="ghost">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsAddingCoursework(true)}
                    className="inline-flex items-center gap-1 rounded-full border border-dashed px-3 py-1 text-sm hover:bg-accent"
                  >
                    <Plus className="h-3 w-3" />
                    Add Course
                  </button>
                )}
              </div>
            </SortableContext>
            
            <DragOverlay dropAnimation={null}>
              {activeCourseId ? (
                <SortableCoursework
                  course={activeCourseId}
                  onRemove={() => {}}
                  isOverlay={true}
                />
              ) : null}
            </DragOverlay>
          </DndContext>
        )}
      </div>

      <div className="mt-4">
        <Label className="text-sm mb-2 block">Description</Label>
        {education.description.length === 0 ? (
          <Button
            onClick={addDescription}
            size="sm"
            variant="outline"
          >
            <Plus className="mr-1 h-4 w-4" />
            Add Description
          </Button>
        ) : (
          <div className="space-y-2">
            {education.description.map((desc, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={desc}
                  onChange={(e) => updateDescription(index, e.target.value)}
                  placeholder="Description..."
                  className="h-9"
                />
                <Button
                  onClick={() => removeDescription(index)}
                  size="icon"
                  variant="ghost"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button onClick={addDescription} size="sm" variant="outline">
              <Plus className="mr-1 h-4 w-4" />
              Add More
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export function EducationEditor({ data, onUpdate }: EducationEditorProps) {
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
      const oldIndex = parseInt((active.id as string).replace('education-', ''));
      const newIndex = parseInt((over.id as string).replace('education-', ''));
      const newData = arrayMove(data, oldIndex, newIndex);
      onUpdate(newData);
    }
  };

  const updateEducation = (index: number, newEdu: Education) => {
    const newData = [...data];
    newData[index] = newEdu;
    onUpdate(newData);
  };

  const removeEducation = (index: number) => {
    const newData = data.filter((_, i) => i !== index);
    onUpdate(newData);
  };

  const addEducation = () => {
    onUpdate([
      ...data,
      {
        university: "",
        major: "",
        duration: { start: "", end: "", IsCurrent: false },
        gpa: "",
        coursework: [],
        description: [],
      },
    ]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <Button onClick={addEducation} size="sm" variant="outline">
          <Plus className="mr-1 h-4 w-4" />
          Add Education
        </Button>
      </div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={data.map((_, index) => `education-${index}`)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {data.map((education, index) => (
              <EducationItem
                key={`education-${index}`}
                educationId={`education-${index}`}
                education={education}
                onUpdate={(newEdu) => updateEducation(index, newEdu)}
                onRemove={() => removeEducation(index)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
