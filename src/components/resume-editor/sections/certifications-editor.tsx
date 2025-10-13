"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X, GripVertical } from "lucide-react";
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

interface CertificationsEditorProps {
  data: string[];
  onUpdate: (newData: string[]) => void;
}

function SortableCertification({
  certification,
  index,
  onUpdate,
  onRemove,
}: {
  certification: string;
  index: number;
  onUpdate: (value: string) => void;
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: `cert-${index}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex gap-2">
      <div {...attributes} {...listeners} className="cursor-grab pt-3">
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>
      <Input
        value={certification}
        onChange={(e) => onUpdate(e.target.value)}
        placeholder="Certification or achievement..."
        className="flex-1"
      />
      <Button onClick={onRemove} size="icon" variant="ghost" className="mt-1">
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}

export function CertificationsEditor({ data, onUpdate }: CertificationsEditorProps) {
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
      const activeIndex = parseInt((active.id as string).split("-")[1]);
      const overIndex = parseInt((over.id as string).split("-")[1]);
      const newData = arrayMove(data, activeIndex, overIndex);
      onUpdate(newData);
    }
  };

  const updateCertification = (index: number, value: string) => {
    const newData = [...data];
    newData[index] = value;
    onUpdate(newData);
  };

  const removeCertification = (index: number) => {
    const newData = data.filter((_, i) => i !== index);
    onUpdate(newData);
  };

  const addCertification = () => {
    onUpdate([...data, ""]);
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
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={data.map((_, i) => `cert-${i}`)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
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
        </DndContext>
      )}
    </div>
  );
}
