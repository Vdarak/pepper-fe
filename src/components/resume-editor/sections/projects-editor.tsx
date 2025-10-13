"use client";

import { Project } from "@/types/resume";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X, GripVertical, ArrowRight, Trash2 } from "lucide-react";
import { useState } from "react";
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

interface ProjectsEditorProps {
  data: Project[];
  onUpdate: (newData: Project[]) => void;
}

function SortableBullet({
  bullet,
  index,
  onUpdate,
  onRemove,
}: {
  bullet: string;
  index: number;
  onUpdate: (value: string) => void;
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: `bullet-${index}` });

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
        value={bullet}
        onChange={(e) => onUpdate(e.target.value)}
        placeholder="Bullet point..."
        className="flex-1"
      />
      <Button onClick={onRemove} size="icon" variant="ghost" className="mt-1">
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}

function ProjectItem({
  project,
  projectId,
  onUpdate,
  onRemove,
}: {
  project: Project;
  projectId: string;
  onUpdate: (newProject: Project) => void;
  onRemove: () => void;
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: projectId });

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

  const handleBulletDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const activeIndex = parseInt((active.id as string).split("-")[1]);
      const overIndex = parseInt((over.id as string).split("-")[1]);
      const newDescription = arrayMove(project.description, activeIndex, overIndex);
      onUpdate({ ...project, description: newDescription });
    }
  };

  const addBullet = () => {
    onUpdate({
      ...project,
      description: [...project.description, ""],
    });
  };

  const updateBullet = (index: number, value: string) => {
    const newDescription = [...project.description];
    newDescription[index] = value;
    onUpdate({ ...project, description: newDescription });
  };

  const removeBullet = (index: number) => {
    onUpdate({
      ...project,
      description: project.description.filter((_, i) => i !== index),
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
              value={project.title}
              onChange={(e) => onUpdate({ ...project, title: e.target.value })}
              className="font-semibold"
              placeholder="Project Title"
            />
            <Input
              value={project.entity}
              onChange={(e) =>
                onUpdate({ ...project, entity: e.target.value })
              }
              placeholder="Entity"
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
            value={project.duration.start}
            onChange={(e) =>
              onUpdate({
                ...project,
                duration: { ...project.duration, start: e.target.value },
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
            value={project.duration.end}
            onChange={(e) =>
              onUpdate({
                ...project,
                duration: { ...project.duration, end: e.target.value },
              })
            }
            placeholder="MMM YYYY / Present"
          />
        </div>
      </div>

      <div>
        <Label className="text-sm">Description</Label>
        {project.description.length === 0 ? (
          <Button onClick={addBullet} size="sm" variant="outline" className="mt-2">
            <Plus className="mr-1 h-4 w-4" />
            Add Bullet Point
          </Button>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleBulletDragEnd}
          >
            <SortableContext
              items={project.description.map((_, i) => `bullet-${i}`)}
              strategy={verticalListSortingStrategy}
            >
              <div className="mt-2 space-y-2">
                {project.description.map((bullet, index) => (
                  <SortableBullet
                    key={`bullet-${index}`}
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
          </DndContext>
        )}
      </div>
    </div>
  );
}

export function ProjectsEditor({ data, onUpdate }: ProjectsEditorProps) {
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
      const oldIndex = parseInt((active.id as string).replace('project-', ''));
      const newIndex = parseInt((over.id as string).replace('project-', ''));
      const newData = arrayMove(data, oldIndex, newIndex);
      onUpdate(newData);
    }
  };

  const updateProject = (index: number, newProject: Project) => {
    const newData = [...data];
    newData[index] = newProject;
    onUpdate(newData);
  };

  const removeProject = (index: number) => {
    const newData = data.filter((_, i) => i !== index);
    onUpdate(newData);
  };

  const addProject = () => {
    onUpdate([
      ...data,
      {
        title: "",
        entity: "",
        duration: { start: "", end: "", IsCurrent: false },
        description: [],
      },
    ]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <Button onClick={addProject} size="sm" variant="outline">
          <Plus className="mr-1 h-4 w-4" />
          Add Project
        </Button>
      </div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={data.map((_, index) => `project-${index}`)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {data.map((project, index) => (
              <ProjectItem
                key={`project-${index}`}
                projectId={`project-${index}`}
                project={project}
                onUpdate={(newProject) => updateProject(index, newProject)}
                onRemove={() => removeProject(index)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
