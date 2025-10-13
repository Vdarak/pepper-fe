"use client";

import { useState } from "react";
import { SkillsSection, SkillCategory } from "@/types/resume";
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
  horizontalListSortingStrategy,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

interface SkillsPreviewProps {
  data: SkillsSection;
  onUpdate: (newData: SkillsSection) => void;
  hideTitle?: boolean;
}

function SortableSkill({ skill, isOverlay = false }: { skill: string; isOverlay?: boolean }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: skill });

  const style = isOverlay
    ? {}
    : {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0 : 1,
      };

  return (
    <span
      ref={isOverlay ? undefined : setNodeRef}
      style={style}
      className="group inline-flex items-center cursor-grab hover:bg-accent/30 rounded px-1"
      {...(isOverlay ? {} : attributes)}
      {...(isOverlay ? {} : listeners)}
    >
      <GripVertical className="h-3 w-3 opacity-0 group-hover:opacity-100 -ml-1 mr-0.5" />
      {skill}
    </span>
  );
}

function CategoryPreview({
  category,
  categoryId,
  onUpdate,
}: {
  category: SkillCategory;
  categoryId: string;
  onUpdate: (newCategory: SkillCategory) => void;
}) {
  const [activeSkillId, setActiveSkillId] = useState<string | null>(null);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: categoryId });

  const categoryStyle = {
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

  const handleDragStart = (event: DragStartEvent) => {
    setActiveSkillId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = category.skills.indexOf(active.id as string);
      const newIndex = category.skills.indexOf(over.id as string);
      const newSkills = arrayMove(category.skills, oldIndex, newIndex);
      onUpdate({ ...category, skills: newSkills });
    }
    
    setActiveSkillId(null);
  };

  return (
    <div ref={setNodeRef} style={categoryStyle} className="mb-2 group">
      <span className="inline-flex items-center gap-1">
        <span
          {...attributes}
          {...listeners}
          className="cursor-grab inline-flex items-center"
        >
          <GripVertical className="h-4 w-4 opacity-0 group-hover:opacity-100 text-muted-foreground" />
        </span>
        <span
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) =>
            onUpdate({ ...category, name: e.currentTarget.textContent || "" })
          }
          className="font-semibold cursor-text outline-none hover:bg-accent/20 rounded px-1"
        >
          {category.name}:
        </span>
      </span>{" "}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={category.skills}
          strategy={horizontalListSortingStrategy}
        >
          <span className="inline-flex flex-wrap gap-1">
            {category.skills.map((skill, index) => (
              <>
                <SortableSkill key={skill} skill={skill} />
                {index < category.skills.length - 1 && <span>, </span>}
              </>
            ))}
          </span>
        </SortableContext>
        
        <DragOverlay dropAnimation={null}>
          {activeSkillId ? (
            <SortableSkill skill={activeSkillId} isOverlay={true} />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

export function SkillsPreview({ data, onUpdate, hideTitle }: SkillsPreviewProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleCategoryDragEnd = (event: DragEndEvent) => {
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

  return (
    <div>
      {!hideTitle && (
        <h2 className="text-xl font-bold uppercase mb-3 border-b border-foreground/20 pb-1">
          Skills
        </h2>
      )}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleCategoryDragEnd}
      >
        <SortableContext
          items={data.categories.map((_, index) => `category-${index}`)}
          strategy={verticalListSortingStrategy}
        >
          <div className="text-sm leading-relaxed">
            {data.categories.map((category, index) => (
              <CategoryPreview
                key={`category-${index}`}
                categoryId={`category-${index}`}
                category={category}
                onUpdate={(newCategory) => updateCategory(index, newCategory)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
