import { ResumeData, SectionItem } from "@/types/resume";
import { ResumeInfoResponse } from "@/lib/api";

// Converter functions for API <-> Editor data format transformation

/**
 * Convert API resume response to ResumeData format for editor
 * Items is a JSON string that needs to be parsed
 */
export function convertApiToResumeData(apiData: ResumeInfoResponse): ResumeData {
  const data: SectionItem[] = [];
  let header: ResumeData["header"] = {
    Name: "",
    email: "",
    phone: "",
    location: "",
    links: []
  };

  // Store section IDs for tracking and normalized section names
  const sectionIds: { [key: string]: string } = {};
  const section_idx: string[] = [];

  console.log("Converting API data to resume format...");
  console.log("API sections:", apiData.resume_data.map(s => s.SectionTitle));

  // Process each section
  for (const section of apiData.resume_data) {
    const sectionTitle = section.SectionTitle.toLowerCase();
    sectionIds[sectionTitle] = section.IDResumeSection;
    
    // Parse the Items JSON string
    let sectionData: any;
    try {
      sectionData = JSON.parse(section.Items);
    } catch (error) {
      console.error(`Failed to parse Items for section ${section.SectionTitle}:`, error);
      continue;
    }

    console.log(`Processing section: "${section.SectionTitle}" (${sectionTitle})`);

    switch (sectionTitle) {
      case "header":
        // Extract header data (don't add to section_idx)
        header = {
          Name: sectionData.Name || "",
          email: sectionData.email || "",
          phone: sectionData.phone || "",
          location: sectionData.location || "",
          links: (sectionData.links || []).map((link: any, index: number) => ({
            index: link.index || index + 1,
            type: link.type || link.label || "",
            url: link.url || "",
            label: link.label || link.type || ""
          }))
        };
        console.log("  → Mapped to header");
        break;

      case "skills":
        // Handle both nested categories object and direct array format
        let skillCategories;
        
        if (Array.isArray(sectionData)) {
          // Direct array format: [{ name: "Languages", skills: [...] }]
          skillCategories = sectionData.map((cat: any) => ({
            name: cat.name || cat.category || "",
            skills: cat.skills || []
          }));
        } else if (sectionData.categories) {
          // Nested categories format: { categories: [{ name: "...", skills: [...] }] }
          skillCategories = (sectionData.categories || []).map((cat: any) => ({
            name: cat.name || cat.category || "",
            skills: cat.skills || []
          }));
        } else {
          skillCategories = [];
        }
        
        data.push({
          section: "skills",
          item: {
            categories: skillCategories
          }
        });
        section_idx.push("skills");
        console.log("  → Mapped to skills with", skillCategories.length, "categories");
        break;

      case "education":
        // Handle both array and object formats
        const educationItems = Array.isArray(sectionData) ? sectionData : [sectionData];
        data.push({
          section: "education",
          item: educationItems
        });
        section_idx.push("education");
        console.log("  → Mapped to education");
        break;

      case "projects":
        // Handle projects
        const projectItems = Array.isArray(sectionData) ? sectionData : [sectionData];
        const projects = projectItems.map((project: any) => ({
          title: project.title || "",
          entity: project.entity || "",
          duration: project.duration || { start: "", end: "", IsCurrent: false },
          description: project.description || []
        }));
        
        data.push({
          section: "projects",
          item: projects
        });
        section_idx.push("projects");
        console.log("  → Mapped to projects");
        break;

      case "experience":
      case "work experience":
      case "research experience":
      case "professional experience":
        // Map to research experience or professional experience based on section name
        const sectionType = sectionTitle.includes("research") 
          ? "research experience" 
          : "professional experience";
        
        const experienceItems = Array.isArray(sectionData) ? sectionData : [sectionData];
        data.push({
          section: sectionType,
          item: experienceItems
        });
        section_idx.push(sectionType);
        console.log(`  → Mapped to ${sectionType} (${experienceItems.length} items)`);
        break;

      case "certifications and achievements":
      case "certifications":
      case "achievements":
        const certItems = Array.isArray(sectionData) ? sectionData : [sectionData];
        data.push({
          section: "certifications and achievements",
          item: certItems
        });
        section_idx.push("certifications and achievements");
        console.log("  → Mapped to certifications and achievements");
        break;

      case "summary":
        data.push({
          section: "summary",
          item: {
            content: sectionData.summary || sectionData.description || sectionData.content || "",
            generated: sectionData.generated || false
          }
        });
        section_idx.push("summary");
        console.log("  → Mapped to summary");
        break;

      default:
        console.warn(`  → Unknown section type: "${sectionTitle}" - SKIPPED`);
        break;
    }
  }

  console.log("Final section_idx:", section_idx);
  console.log("Final data sections:", data.map(d => d.section));

  return {
    header,
    data,
    section_idx
  };
}

/**
 * Convert ResumeData back to API format for saving
 * Returns format with Items as JSON strings
 */
export function convertResumeDataToApi(
  resumeData: ResumeData,
  sectionIds?: { [key: string]: string }
): { resume_data: Array<{ IDResumeSection: string; SectionTitle: string; Items: string }> } {
  const resume_data: Array<{ IDResumeSection: string; SectionTitle: string; Items: string }> = [];

  // Add header section first
  const headerData = {
    Name: resumeData.header.Name,
    email: resumeData.header.email,
    phone: resumeData.header.phone,
    location: resumeData.header.location,
    links: resumeData.header.links.map(link => ({
      index: link.index,
      type: link.type,
      url: link.url,
      label: link.label
    }))
  };

  resume_data.push({
    IDResumeSection: sectionIds?.["header"] || "",
    SectionTitle: "Header",
    Items: JSON.stringify(headerData)
  });

  // Add all other sections
  for (const sectionItem of resumeData.data) {
    let items: any;
    let sectionTitle: string;

    switch (sectionItem.section) {
      case "projects":
        items = Array.isArray(sectionItem.item) 
          ? sectionItem.item.map((project: any) => ({
              title: project.title,
              entity: project.entity,
              duration: project.duration,
              description: project.description
            }))
          : [];
        sectionTitle = "Projects";
        break;

      case "summary":
        items = {
          summary: sectionItem.item.content,
          generated: sectionItem.item.generated
        };
        sectionTitle = "Summary";
        break;

      case "skills":
        // Map 'name' field back to 'category' field for API (if needed)
        // Return as direct array format
        items = (sectionItem.item.categories || []).map((cat: any) => ({
          name: cat.name,
          skills: cat.skills || []
        }));
        sectionTitle = "Skills";
        break;

      case "education":
        items = sectionItem.item;
        sectionTitle = "Education";
        break;

      case "research experience":
        items = sectionItem.item;
        sectionTitle = "Research Experience";
        break;

      case "professional experience":
        items = sectionItem.item;
        sectionTitle = "Professional Experience";
        break;

      case "certifications and achievements":
        items = sectionItem.item;
        sectionTitle = "Certifications and Achievements";
        break;

      default:
        items = (sectionItem as any).item;
        sectionTitle = (sectionItem as any).section;
    }

    resume_data.push({
      IDResumeSection: sectionIds?.[sectionItem.section.toLowerCase()] || "",
      SectionTitle: sectionTitle,
      Items: JSON.stringify(items)
    });
  }

  return {
    resume_data
  };
}
