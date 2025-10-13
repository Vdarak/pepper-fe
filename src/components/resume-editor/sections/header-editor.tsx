"use client";

import { Header, Link } from "@/types/resume";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";

interface HeaderEditorProps {
  header: Header;
  onUpdate: (field: string, value: any) => void;
}

export function HeaderEditor({ header, onUpdate }: HeaderEditorProps) {
  const updateLink = (index: number, field: keyof Link, value: string | number) => {
    const newLinks = [...header.links];
    newLinks[index] = { ...newLinks[index], [field]: value };
    onUpdate("links", newLinks);
  };

  const addLink = () => {
    const newIndex = header.links.length + 1;
    const newLinks = [
      { index: newIndex, type: "", url: "", label: "" },
      ...header.links,
    ];
    onUpdate("links", newLinks);
  };

  const removeLink = (index: number) => {
    const newLinks = header.links.filter((_, i) => i !== index);
    // Reindex remaining links
    const reindexedLinks = newLinks.map((link, i) => ({ ...link, index: i + 1 }));
    onUpdate("links", reindexedLinks);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={header.Name}
              onChange={(e) => onUpdate("Name", e.target.value)}
              placeholder="Your Name"
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={header.email}
              onChange={(e) => onUpdate("email", e.target.value)}
              placeholder="email@example.com"
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={header.phone}
              onChange={(e) => onUpdate("phone", e.target.value)}
              placeholder="+1-234-567-8900"
            />
          </div>
          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={header.location}
              onChange={(e) => onUpdate("location", e.target.value)}
              placeholder="City, State"
            />
          </div>
        </div>

        <div>
          <Label className="mb-2 block">Links</Label>
          <Button onClick={addLink} size="sm" variant="outline" className="mb-3">
            <Plus className="mr-1 h-4 w-4" />
            Add Link
          </Button>
          <div className="space-y-4">
            {header.links.map((link, index) => (
              <div key={index} className="rounded-lg border p-3">
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-sm font-semibold">Link {link.index || index + 1}</Label>
                  <Button
                    onClick={() => removeLink(index)}
                    size="sm"
                    variant="ghost"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  <Input
                    placeholder="Label (e.g., LinkedIn)"
                    value={link.label}
                    onChange={(e) => updateLink(index, "label", e.target.value)}
                  />
                  <Input
                    placeholder="URL"
                    value={link.url}
                    onChange={(e) => updateLink(index, "url", e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
    </div>
  );
}
