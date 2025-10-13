"use client";

import { Experience } from "@/types/resume";
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
import { useState } from "react";

interface ExperiencePreviewProps {
  title: string;
  data: Experience[];
  onUpdate: (newData: Experience[]) => void;
  hideTitle?: boolean;
}

function SortableBullet({
  bullet,
  index,
  onUpdate,
  expId,
  isOverlay = false,
}: {
  bullet: string;
  index: number;
  onUpdate: (value: string) => void;
  expId: string;
  isOverlay?: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: `${expId}-exp-bullet-${index}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0 : 1,
  };

  return (
    <li ref={setNodeRef} style={style} className="group flex">
      {!isOverlay && (
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab opacity-0 group-hover:opacity-100 -ml-4 mr-1"
        >
          <GripVertical className="h-3 w-3 text-muted-foreground" />
        </div>
      )}
      <span className="mr-2">•</span>
      <span
        contentEditable={!isOverlay}
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
  isOverlay = false,
}: {
  experience: Experience;
  onUpdate: (newExp: Experience) => void;
  isOverlay?: boolean;
}) {
  const [activeBulletId, setActiveBulletId] = useState<string | null>(null);
  const expId = (experience.role + experience.company).replace(/\s+/g, "-");
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: experience.role + experience.company });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0 : 1,
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
    setActiveBulletId(null);

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
    <div ref={!isOverlay ? setNodeRef : undefined} style={style} className="group mb-4 relative">
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
            contentEditable={!isOverlay}
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
            contentEditable={!isOverlay}
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
            contentEditable={!isOverlay}
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
          contentEditable={!isOverlay}
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
          onDragStart={handleBulletDragStart}
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
          <DragOverlay dropAnimation={null}>
            {activeBulletId ? (
              <SortableBullet
                bullet={experience.description[parseInt(activeBulletId.split("-").pop() || "0")]}
                index={parseInt(activeBulletId.split("-").pop() || "0")}
                onUpdate={() => {}}
                expId={expId}
                isOverlay={true}
              />
            ) : null}
          </DragOverlay>
        </DndContext>
      )}
    </div>
  );
}

export function ExperiencePreview({ title, data, onUpdate, hideTitle }: ExperiencePreviewProps) {
  const [activeExpId, setActiveExpId] = useState<string | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveExpId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveExpId(null);

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
      {!hideTitle && (
        <h2 className="text-xl font-bold uppercase mb-3 border-b border-foreground/20 pb-1">
          {title}
        </h2>
      )}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
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
        <DragOverlay dropAnimation={null}>
          {activeExpId ? (
            <ExperienceItem
              experience={data.find((e) => e.role + e.company === activeExpId)!}
              onUpdate={() => {}}
              isOverlay={true}
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
