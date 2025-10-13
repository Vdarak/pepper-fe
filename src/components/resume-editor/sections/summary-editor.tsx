"use client";

import { Summary } from "@/types/resume";
import { Label } from "@/components/ui/label";

interface SummaryEditorProps {
  data: Summary;
  onUpdate: (newData: Summary) => void;
}

export function SummaryEditor({ data, onUpdate }: SummaryEditorProps) {
  return (
    <div className="space-y-3">
      <div>
        <Label htmlFor="summary" className="mb-2 block">Content</Label>
        <textarea
          id="summary"
          value={data.content}
          onChange={(e) => onUpdate({ ...data, content: e.target.value })}
          className="mt-1.5 w-full rounded-md border bg-background px-3 py-2 text-sm min-h-[120px] resize-y"
          placeholder="Professional summary..."
        />
      </div>
    </div>
  );
}
