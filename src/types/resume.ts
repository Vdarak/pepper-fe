/**
 * Resume Type Definitions
 * Defines the structure of resume data for the editor and preview
 */

export interface Link {
  index: number;
  type: string;
  url: string;
  label: string;
}

export interface Header {
  Name: string;
  email: string;
  phone: string;
  location: string;
  links: Link[];
}

export interface Duration {
  start: string;
  end: string;
  IsCurrent: boolean;
}

export interface SkillCategory {
  name: string;
  skills: string[];
}

export interface SkillsSection {
  categories: SkillCategory[];
}

export interface Education {
  major: string;
  university: string;
  duration: Duration;
  gpa: string;
  coursework: string[];
  description: string[];
}

export interface Project {
  title: string;
  entity: string;
  duration: Duration;
  description: string[];
}

export interface Experience {
  role: string;
  company: string;
  duration: Duration;
  description: string[];
}

export interface Summary {
  generated: boolean;
  content: string;
}

export interface Certification {
  title: string;
  entity: string;
  duration: Duration;
  description: string[];
}

export type SectionItem =
  | { section: "skills"; item: SkillsSection }
  | { section: "education"; item: Education[] }
  | { section: "projects"; item: Project[] }
  | { section: "research experience"; item: Experience[] }
  | { section: "professional experience"; item: Experience[] }
  | { section: "certifications and achievements"; item: Certification[] }
  | { section: "summary"; item: Summary };

export interface ResumeData {
  header: Header;
  data: SectionItem[];
  section_idx: string[];
}

// Helper type for section names
export type SectionName =
  | "skills"
  | "education"
  | "projects"
  | "research experience"
  | "professional experience"
  | "certifications and achievements"
  | "summary";
