"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export interface AvailableSectionType {
  name: string;
  displayName: string;
}

interface AddSectionButtonsProps {
  onAddSection: (sectionName: string) => void;
  existingSections: string[];
  availableSectionTypes: AvailableSectionType[];
}

/**
 * Component to display "+ Add [Section]" buttons for all available section types
 * Wraps to multiple rows if needed
 */
export function AddSectionButtons({
  onAddSection,
  existingSections,
  availableSectionTypes,
}: AddSectionButtonsProps) {
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customSectionName, setCustomSectionName] = useState("");

  // Filter out sections that already exist
  const availableSections = availableSectionTypes.filter(
    (section) => !existingSections.includes(section.name)
  );

  const handleAddCustomSection = () => {
    if (customSectionName.trim()) {
      onAddSection(customSectionName.trim().toLowerCase());
      setCustomSectionName("");
      setShowCustomInput(false);
    }
  };

  return (
    <div className="border rounded-lg p-4 bg-muted/20">
      <h3 className="text-sm font-semibold mb-3 text-muted-foreground">
        Add New Section
      </h3>
      
      {/* Available section buttons - wrapping layout */}
      <div className="flex flex-wrap gap-2 mb-3">
        {availableSections.map((section) => (
          <Button
            key={section.name}
            variant="outline"
            size="sm"
            onClick={() => onAddSection(section.name)}
            className="gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" />
            <span className="capitalize">{section.displayName}</span>
          </Button>
        ))}
      </div>

      {/* Custom section input */}
      <div className="pt-2 border-t">
        {!showCustomInput ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowCustomInput(true)}
            className="gap-1.5 text-muted-foreground hover:text-foreground"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Custom Section</span>
          </Button>
        ) : (
          <div className="flex gap-2">
            <Input
              placeholder="Section name..."
              value={customSectionName}
              onChange={(e) => setCustomSectionName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddCustomSection();
                if (e.key === "Escape") {
                  setShowCustomInput(false);
                  setCustomSectionName("");
                }
              }}
              className="h-8 text-sm"
              autoFocus
            />
            <Button
              size="sm"
              onClick={handleAddCustomSection}
              disabled={!customSectionName.trim()}
            >
              Add
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setShowCustomInput(false);
                setCustomSectionName("");
              }}
            >
              Cancel
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
