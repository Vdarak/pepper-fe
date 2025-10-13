import {
  Duration,
  Education,
  Project,
  Experience,
  Summary,
  Certification,
  SkillsSection,
} from "@/types/resume";

/**
 * Helper functions to create default/empty items for each section type
 */

export function createEmptyDuration(): Duration {
  return {
    start: "",
    end: "",
    IsCurrent: false,
  };
}

export function createEmptyEducation(): Education {
  return {
    major: "",
    university: "",
    duration: createEmptyDuration(),
    gpa: "",
    coursework: [],
    description: [],
  };
}

export function createEmptyProject(): Project {
  return {
    title: "",
    entity: "",
    duration: createEmptyDuration(),
    description: [],
  };
}

export function createEmptyExperience(): Experience {
  return {
    role: "",
    company: "",
    duration: createEmptyDuration(),
    description: [],
  };
}

export function createEmptyCertification(): Certification {
  return {
    title: "",
    entity: "",
    duration: createEmptyDuration(),
    description: [],
  };
}

export function createEmptySummary(): Summary {
  return {
    generated: false,
    content: "",
  };
}

export function createEmptySkills(): SkillsSection {
  return {
    categories: [
      {
        name: "",
        skills: [],
      },
    ],
  };
}

/**
 * Create default empty data for a given section type
 */
export function createDefaultSectionData(sectionName: string): any {
  const normalizedName = sectionName.toLowerCase();

  switch (normalizedName) {
    case "summary":
      return createEmptySummary();

    case "skills":
      return createEmptySkills();

    case "education":
      return [createEmptyEducation()];

    case "projects":
      return [createEmptyProject()];

    case "experience":
    case "professional experience":
    case "research experience":
      return [createEmptyExperience()];

    case "certifications":
    case "certifications and achievements":
    case "achievements":
      return [createEmptyCertification()];

    // For custom sections, create a generic structure similar to experience
    default:
      return [
        {
          title: "",
          entity: "",
          duration: createEmptyDuration(),
          description: [],
        },
      ];
  }
}

/**
 * Get the proper section title format for display
 */
export function getSectionDisplayName(sectionName: string): string {
  const normalizedName = sectionName.toLowerCase();

  // Map common variations to standard names
  const nameMap: { [key: string]: string } = {
    summary: "Summary",
    skills: "Skills",
    education: "Education",
    projects: "Projects",
    experience: "Experience",
    "professional experience": "Professional Experience",
    "research experience": "Research Experience",
    certifications: "Certifications",
    "certifications and achievements": "Certifications and Achievements",
    achievements: "Achievements",
  };

  // Return mapped name or capitalize the custom name
  return (
    nameMap[normalizedName] ||
    sectionName
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ")
  );
}
