"use client";

import { Header, Link } from "@/types/resume";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, X, Link as LinkIcon } from "lucide-react";

interface HeaderEditorProps {
  header: Header;
  onUpdate: (field: string, value: any) => void;
}

export function HeaderEditor({ header, onUpdate }: HeaderEditorProps) {
  const updateLink = (index: number, field: keyof Link, value: string) => {
    const newLinks = [...header.links];
    newLinks[index] = { ...newLinks[index], [field]: value };
    onUpdate("links", newLinks);
  };

  const addLink = () => {
    const newLinks = [
      ...header.links,
      { type: "", url: "", label: "" },
    ];
    onUpdate("links", newLinks);
  };

  const removeLink = (index: number) => {
    const newLinks = header.links.filter((_, i) => i !== index);
    onUpdate("links", newLinks);
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
          <div className="mb-2 flex items-center justify-between">
            <Label>Links</Label>
            <Button onClick={addLink} size="sm" variant="outline">
              <Plus className="mr-1 h-4 w-4" />
              Add Link
            </Button>
          </div>
          <div className="space-y-3">
            {header.links.map((link, index) => (
              <div key={index} className="flex gap-2">
                <LinkIcon className="mt-2 h-4 w-4 text-muted-foreground" />
                <div className="flex-1 space-y-2">
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
                <Button
                  onClick={() => removeLink(index)}
                  size="icon"
                  variant="ghost"
                  className="mt-2"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
    </div>
  );
}
