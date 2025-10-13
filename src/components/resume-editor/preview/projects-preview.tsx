"use client";

import { Project } from "@/types/resume";
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
}: {
  bullet: string;
  index: number;
  onUpdate: (value: string) => void;
  projectId: string;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: `${projectId}-bullet-${index}` });

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

function ProjectItem({
  project,
  onUpdate,
}: {
  project: Project;
  onUpdate: (newProject: Project) => void;
}) {
  const projectId = project.title.replace(/\s+/g, "-");
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: project.title });

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
              onUpdate({ ...project, title: e.currentTarget.textContent || "" })
            }
            className="cursor-text outline-none hover:bg-accent/20 rounded px-1"
          >
            {project.title}
          </span>
        </div>
        <div className="text-sm">
          <span
            contentEditable
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
            contentEditable
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
          contentEditable
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
        </DndContext>
      )}
    </div>
  );
}

export function ProjectsPreview({ data, onUpdate, hideTitle }: ProjectsPreviewProps) {
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
      const oldIndex = data.findIndex((p) => p.title === active.id);
      const newIndex = data.findIndex((p) => p.title === over.id);
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
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={data.map((p) => p.title)}
          strategy={verticalListSortingStrategy}
        >
          <div className="pl-6">
            {data.map((project, index) => (
              <ProjectItem
                key={project.title}
                project={project}
                onUpdate={(newProject) => updateProject(index, newProject)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
