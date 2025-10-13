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
import { Certification } from "@/types/resume";

interface CertificationsPreviewProps {
  data: Certification[];
  onUpdate: (newData: Certification[]) => void;
  hideTitle?: boolean;
}

function SortableCertification({
  certification,
  index,
  onUpdate,
}: {
  certification: Certification;
  index: number;
  onUpdate: (value: Certification) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: `cert-prev-${index}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="group mb-3">
      <div className="flex items-start gap-1">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab opacity-0 group-hover:opacity-100 -ml-4 mr-1 pt-0.5"
        >
          <GripVertical className="h-3 w-3 text-muted-foreground" />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-baseline mb-0.5">
            <span
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => onUpdate({ ...certification, title: e.currentTarget.textContent || "" })}
              className="font-semibold cursor-text outline-none hover:bg-accent/20 rounded px-1"
            >
              {certification.title}
            </span>
            {certification.duration.end && (
              <span
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) =>
                  onUpdate({
                    ...certification,
                    duration: { ...certification.duration, end: e.currentTarget.textContent || "" },
                  })
                }
                className="text-xs cursor-text outline-none hover:bg-accent/20 rounded px-1"
              >
                {certification.duration.end}
              </span>
            )}
          </div>
          {certification.entity && (
            <span
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => onUpdate({ ...certification, entity: e.currentTarget.textContent || "" })}
              className="text-sm italic cursor-text outline-none hover:bg-accent/20 rounded px-1"
            >
              {certification.entity}
            </span>
          )}
          {certification.description && certification.description.length > 0 && (
            <ul className="list-disc list-inside text-sm mt-1 space-y-0.5">
              {certification.description.map((desc, descIndex) => (
                <li
                  key={descIndex}
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => {
                    const newDesc = [...certification.description];
                    newDesc[descIndex] = e.currentTarget.textContent || "";
                    onUpdate({ ...certification, description: newDesc });
                  }}
                  className="cursor-text outline-none hover:bg-accent/20 rounded px-1"
                >
                  {desc}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export function CertificationsPreview({ data, onUpdate, hideTitle }: CertificationsPreviewProps) {
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

  const updateCertification = (index: number, value: Certification) => {
    const newData = [...data];
    newData[index] = value;
    onUpdate(newData);
  };

  return (
    <div>
      {!hideTitle && (
        <h2 className="text-xl font-bold uppercase mb-3 border-b border-foreground/20 pb-1">
          Certifications and Achievements
        </h2>
      )}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={data.map((_, i) => `cert-prev-${i}`)}
          strategy={verticalListSortingStrategy}
        >
          <div>
            {data.map((certification, index) => (
              <SortableCertification
                key={`cert-prev-${index}`}
                certification={certification}
                index={index}
                onUpdate={(value) => updateCertification(index, value)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}

