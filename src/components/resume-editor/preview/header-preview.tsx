"use client";

import { Header } from "@/types/resume";
import { Mail, Phone, MapPin, ExternalLink } from "lucide-react";
import { useState } from "react";

interface HeaderPreviewProps {
  header: Header;
  onUpdate: (field: string, value: any) => void;
}

export function HeaderPreview({ header, onUpdate }: HeaderPreviewProps) {
  const [, setEditingField] = useState<string | null>(null);

  const EditableText = ({
    value,
    field,
    className = "",
    placeholder = "",
  }: {
    value: string;
    field: string;
    className?: string;
    placeholder?: string;
  }) => (
    <span
      contentEditable
      suppressContentEditableWarning
      onFocus={() => setEditingField(field)}
      onBlur={(e) => {
        setEditingField(null);
        onUpdate(field, e.currentTarget.textContent || "");
      }}
      className={`cursor-text outline-none hover:bg-accent/20 rounded px-1 ${className}`}
    >
      {value || placeholder}
    </span>
  );

  return (
    <div className="border-b-2 border-foreground pb-4">
      <h1 className="text-3xl font-bold">
        <EditableText value={header.Name} field="Name" placeholder="Your Name" />
      </h1>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
        <div className="flex items-center gap-1.5">
          <Mail className="h-4 w-4" />
          <EditableText value={header.email} field="email" placeholder="email@example.com" />
        </div>
        <div className="flex items-center gap-1.5">
          <Phone className="h-4 w-4" />
          <EditableText value={header.phone} field="phone" placeholder="+1-234-567-8900" />
        </div>
        <div className="flex items-center gap-1.5">
          <MapPin className="h-4 w-4" />
          <EditableText value={header.location} field="location" placeholder="City, State" />
        </div>
        {header.links.map((link, index) => (
          <a
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-primary hover:underline"
            contentEditable={false}
          >
            <ExternalLink className="h-4 w-4" />
            <span
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => {
                const newLinks = [...header.links];
                newLinks[index] = { ...link, label: e.currentTarget.textContent || "" };
                onUpdate("links", newLinks);
              }}
              className="cursor-text outline-none hover:bg-accent/20 rounded px-1"
            >
              {link.label}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
