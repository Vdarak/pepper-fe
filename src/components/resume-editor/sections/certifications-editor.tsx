"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X, GripVertical } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Certification } from "@/types/resume";
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

interface CertificationsEditorProps {
  data: Certification[];
  onUpdate: (newData: Certification[]) => void;
}

function SortableCertification({
  certification,
  index,
  onUpdate,
  onRemove,
  isOverlay = false,
}: {
  certification: Certification;
  index: number;
  onUpdate: (value: Certification) => void;
  onRemove: () => void;
  isOverlay?: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: `cert-${index}` });

  const style = isOverlay
    ? {}
    : {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0 : 1,
      };

  const updateDescription = (descIndex: number, value: string) => {
    const newDesc = [...certification.description];
    newDesc[descIndex] = value;
    onUpdate({ ...certification, description: newDesc });
  };

  const removeDescription = (descIndex: number) => {
    const newDesc = certification.description.filter((_, i) => i !== descIndex);
    onUpdate({ ...certification, description: newDesc });
  };

  const addDescription = () => {
    onUpdate({
      ...certification,
      description: [...certification.description, ""],
    });
  };

  return (
    <div ref={isOverlay ? undefined : setNodeRef} style={style} className="border rounded-lg p-4 space-y-3">
      <div className="flex gap-2">
        <div {...(isOverlay ? {} : attributes)} {...(isOverlay ? {} : listeners)} className="cursor-grab pt-3">
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="flex-1 space-y-3">
          <Input
            value={certification.title}
            onChange={(e) => onUpdate({ ...certification, title: e.target.value })}
            placeholder="Certification or achievement title..."
            className="font-medium"
            disabled={isOverlay}
          />
          <div className="grid grid-cols-2 gap-2">
            <Input
              value={certification.entity}
              onChange={(e) => onUpdate({ ...certification, entity: e.target.value })}
              placeholder="Organization..."
              disabled={isOverlay}
            />
            <Input
              value={certification.duration.end}
              onChange={(e) =>
                onUpdate({
                  ...certification,
                  duration: { ...certification.duration, end: e.target.value },
                })
              }
              placeholder="Year (e.g., 2024)"
            />
          </div>
        </div>
        <Button onClick={onRemove} size="icon" variant="ghost" className="mt-1">
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Description bullets */}
      {!isOverlay && (
        <div className="ml-6 space-y-2">
          {certification.description.map((desc, descIndex) => (
            <div key={descIndex} className="flex gap-2">
              <Textarea
                value={desc}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateDescription(descIndex, e.target.value)}
                placeholder="Description point..."
                className="min-h-[60px]"
              />
              <Button
                onClick={() => removeDescription(descIndex)}
                size="icon"
                variant="ghost"
                className="mt-1"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button onClick={addDescription} size="sm" variant="outline">
            <Plus className="mr-1 h-3 w-3" />
            Add Description
          </Button>
        </div>
      )}
    </div>
  );
}

export function CertificationsEditor({ data, onUpdate }: CertificationsEditorProps) {
  const [activeCertId, setActiveCertId] = useState<string | null>(null);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveCertId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const activeIndex = parseInt((active.id as string).split("-")[1]);
      const overIndex = parseInt((over.id as string).split("-")[1]);
      const newData = arrayMove(data, activeIndex, overIndex);
      onUpdate(newData);
    }
    
    setActiveCertId(null);
  };

  const updateCertification = (index: number, value: Certification) => {
    const newData = [...data];
    newData[index] = value;
    onUpdate(newData);
  };

  const removeCertification = (index: number) => {
    const newData = data.filter((_, i) => i !== index);
    onUpdate(newData);
  };

  const addCertification = () => {
    onUpdate([
      {
        title: "",
        entity: "",
        duration: { start: "", end: "", IsCurrent: false },
        description: [],
      },
      ...data,
    ]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <Button onClick={addCertification} size="sm" variant="outline">
          <Plus className="mr-1 h-4 w-4" />
          Add Item
        </Button>
      </div>
      {data.length === 0 ? (
        <div className="text-center text-muted-foreground py-8">
          <p>No certifications or achievements added yet.</p>
          <Button onClick={addCertification} size="sm" variant="outline" className="mt-4">
            <Plus className="mr-1 h-4 w-4" />
            Add Your First Item
          </Button>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={data.map((_, i) => `cert-${i}`)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3">
              {data.map((certification, index) => (
                <SortableCertification
                  key={`cert-${index}`}
                  certification={certification}
                  index={index}
                  onUpdate={(value) => updateCertification(index, value)}
                  onRemove={() => removeCertification(index)}
                />
              ))}
            </div>
          </SortableContext>
          
          <DragOverlay dropAnimation={null}>
            {activeCertId ? (
              <SortableCertification
                certification={data[parseInt(activeCertId.split("-")[1])]}
                index={parseInt(activeCertId.split("-")[1])}
                onUpdate={() => {}}
                onRemove={() => {}}
                isOverlay={true}
              />
            ) : null}
          </DragOverlay>
        </DndContext>
      )}
    </div>
  );
}

