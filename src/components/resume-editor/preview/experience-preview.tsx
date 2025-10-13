"use client";

import { Experience } from "@/types/resume";
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

interface ExperiencePreviewProps {
  title: string;
  data: Experience[];
  onUpdate: (newData: Experience[]) => void;
}

function SortableBullet({
  bullet,
  index,
  onUpdate,
  expId,
}: {
  bullet: string;
  index: number;
  onUpdate: (value: string) => void;
  expId: string;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: `${expId}-exp-bullet-${index}` });

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
        {bullet}
      </span>
    </li>
  );
}

function ExperienceItem({
  experience,
  onUpdate,
}: {
  experience: Experience;
  onUpdate: (newExp: Experience) => void;
}) {
  const expId = (experience.role + experience.company).replace(/\s+/g, "-");
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: experience.role + experience.company });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleBulletDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const activeIndex = parseInt((active.id as string).split("-").pop() || "0");
      const overIndex = parseInt((over.id as string).split("-").pop() || "0");
      const newDescription = arrayMove(experience.description, activeIndex, overIndex);
      onUpdate({ ...experience, description: newDescription });
    }
  };

  const updateBullet = (index: number, value: string) => {
    const newDescription = [...experience.description];
    newDescription[index] = value;
    onUpdate({ ...experience, description: newDescription });
  };

  return (
    <div ref={setNodeRef} style={style} className="group mb-4 relative">
      <div
        {...attributes}
        {...listeners}
        className="absolute -left-6 top-1 cursor-grab opacity-0 group-hover:opacity-100"
      >
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="flex justify-between">
        <div className="font-semibold">
          <span
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) =>
              onUpdate({ ...experience, role: e.currentTarget.textContent || "" })
            }
            className="cursor-text outline-none hover:bg-accent/20 rounded px-1"
          >
            {experience.role}
          </span>
        </div>
        <div className="text-sm">
          <span
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) =>
              onUpdate({
                ...experience,
                duration: { ...experience.duration, start: e.currentTarget.textContent || "" },
              })
            }
            className="cursor-text outline-none hover:bg-accent/20 rounded px-1"
          >
            {experience.duration.start}
          </span>
          {" - "}
          <span
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) =>
              onUpdate({
                ...experience,
                duration: { ...experience.duration, end: e.currentTarget.textContent || "" },
              })
            }
            className="cursor-text outline-none hover:bg-accent/20 rounded px-1"
          >
            {experience.duration.end}
          </span>
        </div>
      </div>
      <div className="text-sm italic">
        <span
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) =>
            onUpdate({ ...experience, company: e.currentTarget.textContent || "" })
          }
          className="cursor-text outline-none hover:bg-accent/20 rounded px-1"
        >
          {experience.company}
        </span>
      </div>
      {experience.description.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleBulletDragEnd}
        >
          <SortableContext
            items={experience.description.map((_, i) => `${expId}-exp-bullet-${i}`)}
            strategy={verticalListSortingStrategy}
          >
            <ul className="mt-1 space-y-0.5 text-sm pl-4">
              {experience.description.map((bullet, index) => (
                <SortableBullet
                  key={`${expId}-exp-bullet-${index}`}
                  bullet={bullet}
                  index={index}
                  onUpdate={(value) => updateBullet(index, value)}
                  expId={expId}
                />
              ))}
            </ul>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}

export function ExperiencePreview({ title, data, onUpdate }: ExperiencePreviewProps) {
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
      const oldIndex = data.findIndex((e) => e.role + e.company === active.id);
      const newIndex = data.findIndex((e) => e.role + e.company === over.id);
      const newData = arrayMove(data, oldIndex, newIndex);
      onUpdate(newData);
    }
  };

  const updateExperience = (index: number, newExp: Experience) => {
    const newData = [...data];
    newData[index] = newExp;
    onUpdate(newData);
  };

  return (
    <div>
      <h2 className="text-xl font-bold uppercase mb-3 border-b border-foreground/20 pb-1">
        {title}
      </h2>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={data.map((e) => e.role + e.company)}
          strategy={verticalListSortingStrategy}
        >
          <div className="pl-6">
            {data.map((experience, index) => (
              <ExperienceItem
                key={experience.role + experience.company}
                experience={experience}
                onUpdate={(newExp) => updateExperience(index, newExp)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
