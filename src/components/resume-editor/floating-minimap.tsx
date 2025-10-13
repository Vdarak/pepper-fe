"use client";

import { useState } from "react";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, List, X } from "lucide-react";
import { arrayMove } from "@dnd-kit/sortable";
import { Button } from "@/components/ui/button";

interface FloatingMinimapProps {
  sections: string[];
  onReorder: (newOrder: string[]) => void;
}

function SortableSectionItem({ section }: { section: string }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: section });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 rounded-md border bg-card px-3 py-2 text-sm hover:bg-accent cursor-grab active:cursor-grabbing"
      {...attributes}
      {...listeners}
    >
      <GripVertical className="h-4 w-4 text-muted-foreground flex-shrink-0" />
      <span className="capitalize">{section}</span>
    </div>
  );
}

export function FloatingMinimap({ sections, onReorder }: FloatingMinimapProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = sections.indexOf(active.id as string);
      const newIndex = sections.indexOf(over.id as string);
      const newOrder = arrayMove(sections, oldIndex, newIndex);
      onReorder(newOrder);
    }
  };

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg hover:scale-110 transition-transform"
        aria-label="Open section map"
      >
        <List className="h-6 w-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-72 rounded-lg border bg-background shadow-2xl">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <h3 className="font-semibold text-sm flex items-center gap-2">
          <List className="h-4 w-4" />
          Section Order
        </h3>
        <Button
          onClick={() => setIsExpanded(false)}
          size="icon"
          variant="ghost"
          className="h-8 w-8"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="max-h-[60vh] overflow-y-auto p-4">
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={sections} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {sections.map((section) => (
                <SortableSectionItem key={section} section={section} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}
