"use client";

import { Summary } from "@/types/resume";

interface SummaryPreviewProps {
  data: Summary;
  onUpdate: (newData: Summary) => void;
  hideTitle?: boolean;
}

export function SummaryPreview({ data, onUpdate, hideTitle }: SummaryPreviewProps) {
  return (
    <div>
      {!hideTitle && (
        <h2 className="text-xl font-bold uppercase mb-3 border-b border-foreground/20 pb-1">
          Summary
        </h2>
      )}
      <p
        contentEditable
        suppressContentEditableWarning
        onBlur={(e) =>
          onUpdate({ ...data, content: e.currentTarget.textContent || "" })
        }
        className="text-sm leading-relaxed cursor-text outline-none hover:bg-accent/20 rounded px-1"
      >
        {data.content}
      </p>
    </div>
  );
}
