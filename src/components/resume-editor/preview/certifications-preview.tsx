"use client";

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

interface CertificationsPreviewProps {
  data: string[];
  onUpdate: (newData: string[]) => void;
}

function SortableCertification({
  certification,
  index,
  onUpdate,
}: {
  certification: string;
  index: number;
  onUpdate: (value: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: `cert-prev-${index}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <li ref={setNodeRef} style={style} className="group flex">
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab opacity-0 group-hover:opacity-100 -ml-4 mr-1"
      >
        <GripVertical className="h-3 w-3 text-muted-foreground" />
      </div>
      <span className="mr-2">•</span>
      <span
        contentEditable
        suppressContentEditableWarning
        onBlur={(e) => onUpdate(e.currentTarget.textContent || "")}
        className="flex-1 cursor-text outline-none hover:bg-accent/20 rounded px-1"
      >
        {certification}
      </span>
    </li>
  );
}

export function CertificationsPreview({ data, onUpdate }: CertificationsPreviewProps) {
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
      const activeIndex = parseInt((active.id as string).split("-")[2]);
      const overIndex = parseInt((over.id as string).split("-")[2]);
      const newData = arrayMove(data, activeIndex, overIndex);
      onUpdate(newData);
    }
  };

  const updateCertification = (index: number, value: string) => {
    const newData = [...data];
    newData[index] = value;
    onUpdate(newData);
  };

  return (
    <div>
      <h2 className="text-xl font-bold uppercase mb-3 border-b border-foreground/20 pb-1">
        Certifications and Achievements
      </h2>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={data.map((_, i) => `cert-prev-${i}`)}
          strategy={verticalListSortingStrategy}
        >
          <ul className="text-sm space-y-0.5 pl-4">
            {data.map((certification, index) => (
              <SortableCertification
                key={`cert-prev-${index}`}
                certification={certification}
                index={index}
                onUpdate={(value) => updateCertification(index, value)}
              />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
    </div>
  );
}
