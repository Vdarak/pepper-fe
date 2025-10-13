"use client";

import { SkillsSection, SkillCategory } from "@/types/resume";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X, GripVertical } from "lucide-react";
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
  horizontalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface SkillsEditorProps {
  data: SkillsSection;
  onUpdate: (newData: SkillsSection) => void;
}

function SortableSkillPill({
  skill,
  onRemove,
}: {
  skill: string;
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: skill });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm"
      {...attributes}
      {...listeners}
    >
      <GripVertical className="h-3 w-3 cursor-grab text-muted-foreground" />
      <span>{skill}</span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="ml-1 rounded-full hover:bg-destructive/20"
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  );
}

function SortableCategory({
  category,
  categoryId,
  onUpdate,
  onRemove,
}: {
  category: SkillCategory;
  categoryId: string;
  onUpdate: (newCategory: SkillCategory) => void;
  onRemove: () => void;
}) {
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [newSkillName, setNewSkillName] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: categoryId });

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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = category.skills.indexOf(active.id as string);
      const newIndex = category.skills.indexOf(over.id as string);
      const newSkills = arrayMove(category.skills, oldIndex, newIndex);
      onUpdate({ ...category, skills: newSkills });
    }
  };

  const addSkill = () => {
    if (newSkillName.trim()) {
      onUpdate({
        ...category,
        skills: [...category.skills, newSkillName.trim()],
      });
      setNewSkillName("");
      setIsAddingSkill(false);
    }
  };

  const removeSkill = (skill: string) => {
    onUpdate({
      ...category,
      skills: category.skills.filter((s) => s !== skill),
    });
  };

  return (
    <div ref={setNodeRef} style={style} className="space-y-2 rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div {...attributes} {...listeners} className="cursor-grab">
            <GripVertical className="h-5 w-5 text-muted-foreground" />
          </div>
          <Input
            value={category.name}
            onChange={(e) => onUpdate({ ...category, name: e.target.value })}
            className="h-8 w-40 font-semibold"
          />
        </div>
        <div>
          {confirmDelete ? (
            <div className="flex gap-2">
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
            <Button onClick={() => setConfirmDelete(true)} size="sm" variant="ghost">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={category.skills}
          strategy={horizontalListSortingStrategy}
        >
          <div className="flex flex-wrap gap-2">
            {category.skills.map((skill) => (
              <SortableSkillPill
                key={skill}
                skill={skill}
                onRemove={() => removeSkill(skill)}
              />
            ))}
            {isAddingSkill ? (
              <div className="flex items-center gap-2">
                <Input
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") addSkill();
                    if (e.key === "Escape") {
                      setIsAddingSkill(false);
                      setNewSkillName("");
                    }
                  }}
                  onBlur={() => {
                    if (newSkillName.trim()) {
                      addSkill();
                    } else {
                      setIsAddingSkill(false);
                    }
                  }}
                  placeholder="Skill name"
                  className="h-8 w-32"
                  autoFocus
                />
                <Button onClick={addSkill} size="sm" variant="ghost">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <button
                onClick={() => setIsAddingSkill(true)}
                className="inline-flex items-center gap-1 rounded-full border border-dashed px-3 py-1 text-sm hover:bg-accent"
              >
                <Plus className="h-3 w-3" />
                Add Skill
              </button>
            )}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}

export function SkillsEditor({ data, onUpdate }: SkillsEditorProps) {
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
      const oldIndex = parseInt((active.id as string).replace('category-', ''));
      const newIndex = parseInt((over.id as string).replace('category-', ''));
      const newCategories = arrayMove(data.categories, oldIndex, newIndex);
      onUpdate({ categories: newCategories });
    }
  };

  const updateCategory = (index: number, newCategory: SkillCategory) => {
    const newCategories = [...data.categories];
    newCategories[index] = newCategory;
    onUpdate({ categories: newCategories });
  };

  const removeCategory = (index: number) => {
    const newCategories = data.categories.filter((_, i) => i !== index);
    onUpdate({ categories: newCategories });
  };

  const addCategory = () => {
    onUpdate({
      categories: [
        ...data.categories,
        { name: "New Category", skills: [] },
      ],
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <Button onClick={addCategory} size="sm" variant="outline">
          <Plus className="mr-1 h-4 w-4" />
          Add Category
        </Button>
      </div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={data.categories.map((_, index) => `category-${index}`)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {data.categories.map((category, index) => (
              <SortableCategory
                key={`category-${index}`}
                categoryId={`category-${index}`}
                category={category}
                onUpdate={(newCategory) => updateCategory(index, newCategory)}
                onRemove={() => removeCategory(index)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
