"use client";

import { Experience } from "@/types/resume";
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
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface ExperienceEditorProps {
  title: string;
  data: Experience[];
  onUpdate: (newData: Experience[]) => void;
}

function SortableBullet({
  bullet,
  index,
  onUpdate,
  onRemove,
  isOverlay = false,
}: {
  bullet: string;
  index: number;
  onUpdate: (value: string) => void;
  onRemove: () => void;
  isOverlay?: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: `exp-bullet-${index}` });

  const style = isOverlay
    ? {}
    : {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0 : 1,
      };

  return (
    <div ref={isOverlay ? undefined : setNodeRef} style={style} className="flex gap-2">
      <div {...(isOverlay ? {} : attributes)} {...(isOverlay ? {} : listeners)} className="cursor-grab pt-3">
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>
      <Input
        value={bullet}
        onChange={(e) => onUpdate(e.target.value)}
        placeholder="Bullet point..."
        className="flex-1"
        disabled={isOverlay}
      />
      {!isOverlay && (
        <Button onClick={onRemove} size="icon" variant="ghost" className="mt-1">
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}

function ExperienceItem({
  experience,
  experienceId,
  onUpdate,
  onRemove,
}: {
  experience: Experience;
  experienceId: string;
  onUpdate: (newExp: Experience) => void;
  onRemove: () => void;
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [activeBulletId, setActiveBulletId] = useState<string | null>(null);
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: experienceId });

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

  const handleBulletDragStart = (event: DragStartEvent) => {
    setActiveBulletId(event.active.id as string);
  };

  const handleBulletDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const activeIndex = parseInt((active.id as string).split("-")[2]);
      const overIndex = parseInt((over.id as string).split("-")[2]);
      const newDescription = arrayMove(experience.description, activeIndex, overIndex);
      onUpdate({ ...experience, description: newDescription });
    }
    
    setActiveBulletId(null);
  };

  const addBullet = () => {
    onUpdate({
      ...experience,
      description: [...experience.description, ""],
    });
  };

  const updateBullet = (index: number, value: string) => {
    const newDescription = [...experience.description];
    newDescription[index] = value;
    onUpdate({ ...experience, description: newDescription });
  };

  const removeBullet = (index: number) => {
    onUpdate({
      ...experience,
      description: experience.description.filter((_, i) => i !== index),
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
              value={experience.role}
              onChange={(e) => onUpdate({ ...experience, role: e.target.value })}
              className="font-semibold"
              placeholder="Role/Position"
            />
            <Input
              value={experience.company}
              onChange={(e) => onUpdate({ ...experience, company: e.target.value })}
              placeholder="Company"
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

      <div className="grid grid-cols-3 gap-3">
        <div>
          <Label className="text-xs">Start Date</Label>
          <Input
            value={experience.duration.start}
            onChange={(e) =>
              onUpdate({
                ...experience,
                duration: { ...experience.duration, start: e.target.value },
              })
            }
            placeholder="MMM YYYY"
          />
        </div>
        <div className="flex items-end justify-center">
          <ArrowRight className="mb-2 h-5 w-5 text-muted-foreground" />
        </div>
        <div>
          <Label className="text-xs">End Date</Label>
          <Input
            value={experience.duration.end}
            onChange={(e) =>
              onUpdate({
                ...experience,
                duration: { ...experience.duration, end: e.target.value },
              })
            }
            placeholder="MMM YYYY / Present"
          />
        </div>
      </div>

      <div>
        <Label className="text-sm">Description</Label>
        {experience.description.length === 0 ? (
          <Button onClick={addBullet} size="sm" variant="outline" className="mt-2">
            <Plus className="mr-1 h-4 w-4" />
            Add Bullet Point
          </Button>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleBulletDragStart}
            onDragEnd={handleBulletDragEnd}
          >
            <SortableContext
              items={experience.description.map((_, i) => `exp-bullet-${i}`)}
              strategy={verticalListSortingStrategy}
            >
              <div className="mt-2 space-y-2">
                {experience.description.map((bullet, index) => (
                  <SortableBullet
                    key={`exp-bullet-${index}`}
                    bullet={bullet}
                    index={index}
                    onUpdate={(value) => updateBullet(index, value)}
                    onRemove={() => removeBullet(index)}
                  />
                ))}
                <Button onClick={addBullet} size="sm" variant="outline">
                  <Plus className="mr-1 h-4 w-4" />
                  Add Bullet Point
                </Button>
              </div>
            </SortableContext>
            
            <DragOverlay dropAnimation={null}>
              {activeBulletId ? (
                <SortableBullet
                  bullet={experience.description[parseInt(activeBulletId.split("-")[2])]}
                  index={parseInt(activeBulletId.split("-")[2])}
                  onUpdate={() => {}}
                  onRemove={() => {}}
                  isOverlay={true}
                />
              ) : null}
            </DragOverlay>
          </DndContext>
        )}
      </div>
    </div>
  );
}

export function ExperienceEditor({ data, onUpdate }: ExperienceEditorProps) {
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
      const oldIndex = parseInt((active.id as string).replace('experience-', ''));
      const newIndex = parseInt((over.id as string).replace('experience-', ''));
      const newData = arrayMove(data, oldIndex, newIndex);
      onUpdate(newData);
    }
  };

  const updateExperience = (index: number, newExp: Experience) => {
    const newData = [...data];
    newData[index] = newExp;
    onUpdate(newData);
  };

  const removeExperience = (index: number) => {
    const newData = data.filter((_, i) => i !== index);
    onUpdate(newData);
  };

  const addExperience = () => {
    onUpdate([
      ...data,
      {
        role: "",
        company: "",
        duration: { start: "", end: "", IsCurrent: false },
        description: [],
      },
    ]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <Button onClick={addExperience} size="sm" variant="outline">
          <Plus className="mr-1 h-4 w-4" />
          Add Experience
        </Button>
      </div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={data.map((_, index) => `experience-${index}`)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {data.map((experience, index) => (
              <ExperienceItem
                key={`experience-${index}`}
                experienceId={`experience-${index}`}
                experience={experience}
                onUpdate={(newExp) => updateExperience(index, newExp)}
                onRemove={() => removeExperience(index)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
