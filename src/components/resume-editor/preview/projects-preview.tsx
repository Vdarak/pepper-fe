"use client";

import { Project } from "@/types/resume";
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

interface ProjectsPreviewProps {
  data: Project[];
  onUpdate: (newData: Project[]) => void;
  hideTitle?: boolean;
}

function SortableBullet({
  bullet,
  index,
  onUpdate,
  projectId,
  isOverlay = false,
}: {
  bullet: string;
  index: number;
  onUpdate: (value: string) => void;
  projectId: string;
  isOverlay?: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: `${projectId}-bullet-${index}` });

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

function ProjectItem({
  project,
  onUpdate,
  isOverlay = false,
  itemId,
}: {
  project: Project;
  onUpdate: (newProject: Project) => void;
  isOverlay?: boolean;
  itemId?: string;
}) {
  const [activeBulletId, setActiveBulletId] = useState<string | null>(null);
  const projectId = itemId || project.title.replace(/\s+/g, "-");
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: itemId || project.title });

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
      const newDescription = arrayMove(project.description, activeIndex, overIndex);
      onUpdate({ ...project, description: newDescription });
    }
  };

  const updateBullet = (index: number, value: string) => {
    const newDescription = [...project.description];
    newDescription[index] = value;
    onUpdate({ ...project, description: newDescription });
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
              onUpdate({ ...project, title: e.currentTarget.textContent || "" })
            }
            className="cursor-text outline-none hover:bg-accent/20 rounded px-1"
          >
            {project.title}
          </span>
        </div>
        <div className="text-sm">
          <span
            contentEditable={!isOverlay}
            suppressContentEditableWarning
            onBlur={(e) =>
              onUpdate({
                ...project,
                duration: { ...project.duration, start: e.currentTarget.textContent || "" },
              })
            }
            className="cursor-text outline-none hover:bg-accent/20 rounded px-1"
          >
            {project.duration.start}
          </span>
          {" - "}
          <span
            contentEditable={!isOverlay}
            suppressContentEditableWarning
            onBlur={(e) =>
              onUpdate({
                ...project,
                duration: { ...project.duration, end: e.currentTarget.textContent || "" },
              })
            }
            className="cursor-text outline-none hover:bg-accent/20 rounded px-1"
          >
            {project.duration.end}
          </span>
        </div>
      </div>
      <div className="text-sm italic">
        <span
          contentEditable={!isOverlay}
          suppressContentEditableWarning
          onBlur={(e) =>
            onUpdate({ ...project, entity: e.currentTarget.textContent || "" })
          }
          className="cursor-text outline-none hover:bg-accent/20 rounded px-1"
        >
          {project.entity}
        </span>
      </div>
      {project.description.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleBulletDragStart}
          onDragEnd={handleBulletDragEnd}
        >
          <SortableContext
            items={project.description.map((_, i) => `${projectId}-bullet-${i}`)}
            strategy={verticalListSortingStrategy}
          >
            <ul className="mt-1 space-y-0.5 text-sm pl-4">
              {project.description.map((bullet, index) => (
                <SortableBullet
                  key={`${projectId}-bullet-${index}`}
                  bullet={bullet}
                  index={index}
                  onUpdate={(value) => updateBullet(index, value)}
                  projectId={projectId}
                />
              ))}
            </ul>
          </SortableContext>
          <DragOverlay dropAnimation={null}>
            {activeBulletId ? (
              <SortableBullet
                bullet={project.description[parseInt(activeBulletId.split("-").pop() || "0")]}
                index={parseInt(activeBulletId.split("-").pop() || "0")}
                onUpdate={() => {}}
                projectId={projectId}
                isOverlay={true}
              />
            ) : null}
          </DragOverlay>
        </DndContext>
      )}
    </div>
  );
}

export function ProjectsPreview({ data, onUpdate, hideTitle }: ProjectsPreviewProps) {
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveProjectId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveProjectId(null);

    if (over && active.id !== over.id) {
      const oldIndex = data.findIndex((p, i) => `project-${i}` === active.id);
      const newIndex = data.findIndex((p, i) => `project-${i}` === over.id);
      const newData = arrayMove(data, oldIndex, newIndex);
      onUpdate(newData);
    }
  };

  const updateProject = (index: number, newProject: Project) => {
    const newData = [...data];
    newData[index] = newProject;
    onUpdate(newData);
  };

  return (
    <div>
      {!hideTitle && (
        <h2 className="text-xl font-bold uppercase mb-3 border-b border-foreground/20 pb-1">
          Projects
        </h2>
      )}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={data.map((p, i) => `project-${i}`)}
          strategy={verticalListSortingStrategy}
        >
          <div className="pl-6">
            {data.map((project, index) => (
              <ProjectItem
                key={`project-${index}`}
                itemId={`project-${index}`}
                project={project}
                onUpdate={(newProject) => updateProject(index, newProject)}
              />
            ))}
          </div>
        </SortableContext>
        <DragOverlay dropAnimation={null}>
          {activeProjectId ? (
            <ProjectItem
              project={data.find((p, i) => `project-${i}` === activeProjectId)!}
              onUpdate={() => {}}
              isOverlay={true}
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
