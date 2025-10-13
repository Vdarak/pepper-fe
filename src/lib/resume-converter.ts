import { ResumeData, SectionItem } from "@/types/resume";
import { ResumeInfoResponse } from "@/lib/api";

/**
 * ============================================================================
 * RESUME DATA CONVERTER MODULE
 * ============================================================================
 * 
 * This module provides bidirectional conversion between two data formats:
 * 
 * 1. API Format (from backend):
 *    - Resume data is stored as an array of sections
 *    - Each section has: IDResumeSection (string), SectionTitle (string), Items (JSON string)
 *    - The Items field is a stringified JSON that must be parsed
 * 
 * 2. Editor Format (for frontend):
 *    - Resume data is a structured object with: header, data array, section_idx
 *    - Data is fully parsed and typed for easy manipulation in React components
 *    - section_idx tracks the order of sections for drag-and-drop reordering
 * 
 * Key Functions:
 * - convertApiToResumeData(): Transforms API response → Editor format
 * - convertResumeDataToApi(): Transforms Editor format → API request format
 * 
 * ============================================================================
 */

/**
 * ============================================================================
 * FUNCTION: convertApiToResumeData
 * ============================================================================
 * 
 * PURPOSE:
 * Converts the API resume response format into the editor's ResumeData format.
 * This is the PRIMARY function for loading resume data into the editor.
 * 
 * INPUT (apiData: ResumeInfoResponse):
 * {
 *   resume_data: [
 *     {
 *       IDResumeSection: "uuid-123",     // Unique identifier for the section
 *       SectionTitle: "Skills",          // Display name of the section
 *       Items: '{"categories":[...]}'    // JSON STRING that needs parsing
 *     },
 *     ...
 *   ]
 * }
 * 
 * OUTPUT (ResumeData):
 * {
 *   header: { Name, email, phone, location, links[] },  // User's contact info
 *   data: [                                              // Array of resume sections
 *     { section: "skills", item: {...} },
 *     { section: "education", item: [...] },
 *     ...
 *   ],
 *   section_idx: ["skills", "education", ...]           // Section order for UI
 * }
 * 
 * WORKFLOW:
 * 1. Initialize empty data structures (header, data array, section_idx array)
 * 2. Loop through each section from API
 * 3. Parse the JSON string in the Items field
 * 4. Normalize section titles to lowercase for consistent matching
 * 5. Map each section type to its corresponding editor format
 * 6. Track section IDs for future updates
 * 7. Build section_idx array to preserve order
 * 8. Return complete ResumeData object
 * 
 * SECTION HANDLING:
 * - Header: Extracted separately, not added to section_idx
 * - Skills: Handles both array and nested object formats
 * - Education, Projects, Experience: Ensures array format
 * - Certifications: Maps multiple variations to single type
 * - Summary: Extracts text content and metadata
 * 
 * ERROR HANDLING:
 * - Try-catch for JSON parsing failures
 * - Console warnings for unknown section types
 * - Graceful fallback to empty arrays/objects
 * 
 * ============================================================================
 */
export function convertApiToResumeData(apiData: ResumeInfoResponse): ResumeData {
  // ========================================================================
  // STEP 1: Initialize data structures
  // ========================================================================
  
  // Array to hold all resume sections (skills, education, experience, etc.)
  // Each item will have: { section: "sectionName", item: sectionData }
  const data: SectionItem[] = [];
  
  // Header object containing user's contact information
  // Default values prevent undefined errors if API doesn't provide data
  let header: ResumeData["header"] = {
    Name: "",
    email: "",
    phone: "",
    location: "",
    links: []  // Social links, portfolio, LinkedIn, etc.
  };

  // ========================================================================
  // STEP 2: Setup tracking dictionaries
  // ========================================================================
  
  // Maps normalized section names → section IDs from database
  // Used when saving data back to API to maintain database relationships
  // Example: { "skills": "uuid-123", "education": "uuid-456" }
  const sectionIds: { [key: string]: string } = {};
  
  // Tracks the ORDER of sections as they appear in the resume
  // Critical for drag-and-drop reordering functionality
  // Example: ["skills", "education", "experience", "projects"]
  // Note: "header" is NOT included as it's always at the top
  const section_idx: string[] = [];

  // ========================================================================
  // STEP 3: Debug logging (development aid)
  // ========================================================================
  console.log("Converting API data to resume format...");
  console.log("API sections:", apiData.resume_data.map(s => s.SectionTitle));

  // ========================================================================
  // STEP 4: Main processing loop - iterate through each section
  // ========================================================================
  for (const section of apiData.resume_data) {
    // Normalize section title to lowercase for case-insensitive matching
    // This prevents issues like "Skills" vs "skills" vs "SKILLS"
    const sectionTitle = section.SectionTitle.toLowerCase();
    
    // Store the database ID mapped to the normalized name
    // We'll need this when saving changes back to the API
    sectionIds[sectionTitle] = section.IDResumeSection;
    
    // ======================================================================
    // STEP 4a: Parse the JSON string in Items field
    // ======================================================================
    // API stores section data as a stringified JSON for flexibility
    // We need to parse it to work with actual JavaScript objects
    let sectionData: any;
    try {
      sectionData = JSON.parse(section.Items);
    } catch (error) {
      // If parsing fails (malformed JSON, empty string, etc.), log and skip
      console.error(`Failed to parse Items for section ${section.SectionTitle}:`, error);
      continue;  // Skip to next section
    }

    console.log(`Processing section: "${section.SectionTitle}" (${sectionTitle})`);

    // ======================================================================
    // STEP 4b: Switch statement - Map each section to its editor format
    // ======================================================================
    // Each case handles a specific section type and transforms its data
    // into the format expected by the editor components
    switch (sectionTitle) {
      // ====================================================================
      // CASE: HEADER
      // ====================================================================
      // Special section containing user's contact information
      // NOT added to section_idx because it's always displayed first
      // and is not part of the reorderable sections
      case "header":
        header = {
          Name: sectionData.Name || "",              // Full name
          email: sectionData.email || "",            // Email address
          phone: sectionData.phone || "",            // Phone number
          location: sectionData.location || "",      // City, State or full address
          
          // Social/professional links (LinkedIn, GitHub, Portfolio, etc.)
          links: (sectionData.links || []).map((link: any, index: number) => ({
            index: link.index || index + 1,          // Display order
            type: link.type || link.label || "",     // "LinkedIn", "GitHub", etc.
            url: link.url || "",                     // Full URL
            label: link.label || link.type || ""     // Display text
          }))
        };
        console.log("  → Mapped to header");
        break;

      // ====================================================================
      // CASE: SKILLS
      // ====================================================================
      // Technical/professional skills organized into categories
      // 
      // COMPLEXITY: Handles TWO different API formats for backward compatibility
      // 
      // Format 1 - Direct Array:
      // [
      //   { name: "Languages", skills: ["Python", "Java"] },
      //   { name: "Frameworks", skills: ["React", "Django"] }
      // ]
      // 
      // Format 2 - Nested Object:
      // {
      //   categories: [
      //     { name: "Languages", skills: ["Python", "Java"] },
      //     { name: "Frameworks", skills: ["React", "Django"] }
      //   ]
      // }
      case "skills":
        let skillCategories;
        
        // Check if sectionData is already an array (Format 1)
        if (Array.isArray(sectionData)) {
          skillCategories = sectionData.map((cat: any) => ({
            name: cat.name || cat.category || "",   // Category name
            skills: cat.skills || []                 // Array of skill strings
          }));
        } 
        // Check if sectionData has a categories property (Format 2)
        else if (sectionData.categories) {
          skillCategories = (sectionData.categories || []).map((cat: any) => ({
            name: cat.name || cat.category || "",
            skills: cat.skills || []
          }));
        } 
        // Fallback for unexpected format
        else {
          skillCategories = [];
        }
        
        // Add to data array with "skills" as section identifier
        data.push({
          section: "skills",
          item: {
            categories: skillCategories  // Wrapped in object for consistency
          }
        });
        
        // Add to section_idx to enable reordering in UI
        section_idx.push("skills");
        console.log("  → Mapped to skills with", skillCategories.length, "categories");
        break;

      // ====================================================================
      // CASE: EDUCATION
      // ====================================================================
      // Academic background - degrees, universities, coursework
      // 
      // Expected Format (per item):
      // {
      //   major: "Computer Science",
      //   university: "MIT",
      //   duration: { start: "2018", end: "2022", IsCurrent: false },
      //   gpa: "3.9",
      //   coursework: ["Data Structures", "Algorithms"],
      //   description: ["Dean's List", "Research Assistant"]
      // }
      case "education":
        // Ensure data is in array format (some APIs might send single object)
        const educationItems = Array.isArray(sectionData) ? sectionData : [sectionData];
        
        // Map each education entry to standardized format
        const educations = educationItems.map((edu: any) => ({
          major: edu.major || "",                    // Degree/Major
          university: edu.university || "",          // Institution name
          duration: edu.duration || {                // Time period
            start: "", 
            end: "", 
            IsCurrent: false                         // Is this current education?
          },
          gpa: edu.gpa || "",                        // Grade point average
          coursework: edu.coursework || [],          // Relevant courses
          description: edu.description || []         // Additional details/achievements
        }));
        
        data.push({
          section: "education",
          item: educations  // Array of education objects
        });
        section_idx.push("education");
        console.log("  → Mapped to education");
        break;

      // ====================================================================
      // CASE: PROJECTS
      // ====================================================================
      // Personal or professional projects showcasing skills
      // 
      // Expected Format (per item):
      // {
      //   title: "E-commerce Platform",
      //   entity: "Personal Project",
      //   duration: { start: "Jan 2023", end: "Mar 2023", IsCurrent: false },
      //   description: ["Built with React", "Deployed on AWS"]
      // }
      case "projects":
        // Ensure array format
        const projectItems = Array.isArray(sectionData) ? sectionData : [sectionData];
        
        // Map each project to standardized format
        const projects = projectItems.map((project: any) => ({
          title: project.title || "",                // Project name
          entity: project.entity || "",              // Organization/context
          duration: project.duration || {            // Time period
            start: "", 
            end: "", 
            IsCurrent: false                         // Is this ongoing?
          },
          description: project.description || []     // Bullet points about project
        }));
        
        data.push({
          section: "projects",
          item: projects  // Array of project objects
        });
        section_idx.push("projects");
        console.log("  → Mapped to projects");
        break;

      // ====================================================================
      // CASE: EXPERIENCE (Multiple Variations)
      // ====================================================================
      // Work experience - handles multiple naming conventions from API
      // Matches: "experience", "work experience", "research experience", "professional experience"
      // 
      // INTELLIGENT MAPPING:
      // - If section contains "research" → maps to "research experience"
      // - Otherwise → maps to "professional experience"
      // 
      // This allows users to have separate sections for research vs. professional work
      // 
      // Expected Format (per item):
      // {
      //   role: "Software Engineer",
      //   company: "Google",
      //   duration: { start: "Jan 2022", end: "Present", IsCurrent: true },
      //   description: ["Led team of 5", "Improved performance by 40%"]
      // }
      case "experience":
      case "work experience":
      case "research experience":
      case "professional experience":
        // Determine section type based on presence of "research" in title
        const sectionType = sectionTitle.includes("research") 
          ? "research experience"      // Academic/research positions
          : "professional experience";  // Industry/corporate positions
        
        // Ensure array format
        const experienceItems = Array.isArray(sectionData) ? sectionData : [sectionData];
        
        // Map each experience entry to standardized format
        const experiences = experienceItems.map((exp: any) => ({
          role: exp.role || "",                      // Job title
          company: exp.company || "",                // Company/organization name
          duration: exp.duration || {                // Employment period
            start: "", 
            end: "", 
            IsCurrent: false                         // Currently working here?
          },
          description: exp.description || []         // Responsibilities/achievements
        }));
        
        data.push({
          section: sectionType,  // Use the determined section type
          item: experiences
        });
        section_idx.push(sectionType);
        console.log(`  → Mapped to ${sectionType} (${experiences.length} items)`);
        break;

      // ====================================================================
      // CASE: CERTIFICATIONS AND ACHIEVEMENTS
      // ====================================================================
      // Professional certifications, awards, publications, etc.
      // Handles multiple naming variations from API
      // 
      // Expected Format (per item):
      // {
      //   title: "AWS Solutions Architect",
      //   entity: "Amazon Web Services",
      //   duration: { start: "2023", end: "2025", IsCurrent: true },
      //   description: ["Credential ID: ABC123"]
      // }
      case "certifications and achievements":
      case "certifications":
      case "achievements":
        // Ensure array format
        const certItems = Array.isArray(sectionData) ? sectionData : [sectionData];
        
        // Map each certification to standardized format
        const certifications = certItems.map((cert: any) => ({
          title: cert.title || "",                   // Certification/Award name
          entity: cert.entity || "",                 // Issuing organization
          duration: cert.duration || {               // Validity period
            start: "", 
            end: "", 
            IsCurrent: false                         // Still valid?
          },
          description: cert.description || []        // Additional details
        }));
        
        data.push({
          section: "certifications and achievements",  // Normalized name
          item: certifications
        });
        section_idx.push("certifications and achievements");
        console.log("  → Mapped to certifications and achievements");
        break;

      // ====================================================================
      // CASE: SUMMARY
      // ====================================================================
      // Professional summary or objective statement at top of resume
      // 
      // Expected Format:
      // {
      //   content: "Software engineer with 5 years...",
      //   generated: false  // Was this AI-generated?
      // }
      // 
      // FLEXIBILITY: Checks multiple possible field names for backward compatibility
      // - summary, description, or content
      case "summary":
        data.push({
          section: "summary",
          item: {
            // Try multiple field names to find the summary text
            content: sectionData.summary || sectionData.description || sectionData.content || "",
            generated: sectionData.generated || false  // Track if AI-generated
          }
        });
        section_idx.push("summary");
        console.log("  → Mapped to summary");
        break;

      // ====================================================================
      // DEFAULT CASE: Unknown Section Type
      // ====================================================================
      // If we encounter a section title we don't recognize, log a warning
      // This helps developers identify new section types that need handling
      default:
        console.warn(`  → Unknown section type: "${sectionTitle}" - SKIPPED`);
        break;
    }
  }  // End of for loop

  // ========================================================================
  // STEP 5: Debug logging - Verify conversion results
  // ========================================================================
  console.log("Final section_idx:", section_idx);
  console.log("Final data sections:", data.map(d => d.section));

  // ========================================================================
  // STEP 6: Return the complete ResumeData object
  // ========================================================================
  // This object is now ready to be consumed by React components
  return {
    header,       // Contact information
    data,         // All resume sections (skills, education, etc.)
    section_idx   // Section ordering for drag-and-drop
  };
}

/**
 * ============================================================================
 * FUNCTION: convertResumeDataToApi
 * ============================================================================
 * 
 * PURPOSE:
 * Converts the editor's ResumeData format back into the API format for saving.
 * This is the INVERSE operation of convertApiToResumeData().
 * 
 * INPUT (resumeData: ResumeData):
 * {
 *   header: { Name, email, phone, location, links[] },
 *   data: [
 *     { section: "skills", item: {...} },
 *     { section: "education", item: [...] },
 *     ...
 *   ],
 *   section_idx: ["skills", "education", ...]
 * }
 * 
 * INPUT (sectionIds: optional):
 * {
 *   "header": "uuid-123",
 *   "skills": "uuid-456",
 *   "education": "uuid-789",
 *   ...
 * }
 * Purpose: Maps section names to their database IDs for updates
 * If not provided, empty strings are used (for new resumes)
 * 
 * OUTPUT:
 * {
 *   resume_data: [
 *     {
 *       IDResumeSection: "uuid-123",           // Database ID
 *       SectionTitle: "Header",                // Display name
 *       Items: '{"Name":"John","email":...}'   // JSON STRING (not object!)
 *     },
 *     ...
 *   ]
 * }
 * 
 * CRITICAL DETAILS:
 * 1. Items field MUST be a stringified JSON (not an object)
 * 2. Header is ALWAYS added first (not based on section_idx order)
 * 3. Section titles are capitalized for API consistency
 * 4. Empty IDResumeSection ("") is valid for new sections
 * 
 * WORKFLOW:
 * 1. Initialize empty resume_data array
 * 2. Add header section first (with stringified Items)
 * 3. Loop through each section in data array
 * 4. Map section names to proper format and titles
 * 5. Stringify the item data into Items field
 * 6. Attach database ID from sectionIds if available
 * 7. Return complete API-ready object
 * 
 * ============================================================================
 */
export function convertResumeDataToApi(
  resumeData: ResumeData,
  sectionIds?: { [key: string]: string }
): { resume_data: Array<{ IDResumeSection: string; SectionTitle: string; Items: string }> } {
  // ========================================================================
  // STEP 1: Initialize the resume_data array
  // ========================================================================
  // This will hold all sections in API format
  const resume_data: Array<{ IDResumeSection: string; SectionTitle: string; Items: string }> = [];

  // ========================================================================
  // STEP 2: Add header section FIRST
  // ========================================================================
  // Header is special - it's always first and not part of normal sections
  // 
  // IMPORTANT: We construct a plain object, then stringify it for Items field
  const headerData = {
    Name: resumeData.header.Name,
    email: resumeData.header.email,
    phone: resumeData.header.phone,
    location: resumeData.header.location,
    
    // Map links array with all required fields
    links: resumeData.header.links.map(link => ({
      index: link.index,      // Order in which links appear
      type: link.type,        // "LinkedIn", "GitHub", "Portfolio", etc.
      url: link.url,          // Full URL
      label: link.label       // Display text for the link
    }))
  };

  // Add header to resume_data with stringified Items
  resume_data.push({
    IDResumeSection: sectionIds?.["header"] || "",  // Database ID or empty for new
    SectionTitle: "Header",                         // Capitalized for API
    Items: JSON.stringify(headerData)               // MUST be string, not object!
  });

  // ========================================================================
  // STEP 3: Process all other sections
  // ========================================================================
  // Loop through the data array (which contains all non-header sections)
  // Each section needs to be mapped to its API format with proper naming
  for (const sectionItem of resumeData.data) {
    // Variables to hold the transformed data and section title
    let items: any;           // Will hold the data to be stringified
    let sectionTitle: string; // Will hold the capitalized section name for API

    // ======================================================================
    // Switch on section type to format data appropriately
    // ======================================================================
    switch (sectionItem.section) {
      // ====================================================================
      // CASE: PROJECTS
      // ====================================================================
      case "projects":
        // Ensure we have an array, then map to clean format
        items = Array.isArray(sectionItem.item) 
          ? sectionItem.item.map((project: any) => ({
              title: project.title,          // Project name
              entity: project.entity,        // Organization/context
              duration: project.duration,    // Time period object
              description: project.description  // Array of bullet points
            }))
          : [];  // Fallback to empty array if not array format
        sectionTitle = "Projects";  // API expects capitalized title
        break;

      sectionTitle = "Projects";  // API expects capitalized title
        break;

      // ====================================================================
      // CASE: SUMMARY
      // ====================================================================
      case "summary":
        // Summary is stored as an object with content and metadata
        items = {
          summary: sectionItem.item.content,      // The actual summary text
          generated: sectionItem.item.generated   // Track if AI-generated
        };
        sectionTitle = "Summary";
        break;

      // ====================================================================
      // CASE: SKILLS
      // ====================================================================
      case "skills":
        // Skills are organized in categories
        // Convert back to direct array format (API prefers this)
        // Maps the 'name' field (used in editor) back for API consistency
        items = (sectionItem.item.categories || []).map((cat: any) => ({
          name: cat.name,           // Category name (e.g., "Languages")
          skills: cat.skills || []  // Array of skill strings
        }));
        sectionTitle = "Skills";
        break;

      // ====================================================================
      // CASE: EDUCATION
      // ====================================================================
      case "education":
        // Education data is already in the correct array format
        // Pass through directly without transformation
        items = sectionItem.item;
        sectionTitle = "Education";
        break;

      // ====================================================================
      // CASE: RESEARCH EXPERIENCE
      // ====================================================================
      case "research experience":
        // Research positions (academic/lab work)
        items = sectionItem.item;  // Already in correct format
        sectionTitle = "Research Experience";
        break;

      // ====================================================================
      // CASE: PROFESSIONAL EXPERIENCE
      // ====================================================================
      case "professional experience":
        // Industry/corporate work experience
        items = sectionItem.item;  // Already in correct format
        sectionTitle = "Professional Experience";
        break;

      // ====================================================================
      // CASE: CERTIFICATIONS AND ACHIEVEMENTS
      // ====================================================================
      case "certifications and achievements":
        // Professional certs, awards, publications, etc.
        items = sectionItem.item;  // Already in correct format
        sectionTitle = "Certifications and Achievements";
        break;

      // ====================================================================
      // DEFAULT: Unknown section type
      // ====================================================================
      // If we encounter a section we don't recognize, pass it through
      // This provides forward compatibility with new section types
      default:
        items = (sectionItem as any).item;      // Use data as-is
        sectionTitle = (sectionItem as any).section;  // Use section name as-is
    }

    // ======================================================================
    // STEP 4: Add the formatted section to resume_data
    // ======================================================================
    // Each section needs three pieces of information:
    // 1. IDResumeSection: Database ID (from sectionIds) or empty string
    // 2. SectionTitle: Properly capitalized section name
    // 3. Items: JSON STRING of the section data (NOT an object!)
    resume_data.push({
      // Look up the database ID using normalized section name
      // sectionItem.section is lowercase (e.g., "skills")
      // If no ID exists (new section), use empty string
      IDResumeSection: sectionIds?.[sectionItem.section.toLowerCase()] || "",
      
      // Use the capitalized section title determined in switch statement
      SectionTitle: sectionTitle,
      
      // CRITICAL: Stringify the items object/array into a JSON string
      // API expects a string, not a JavaScript object
      Items: JSON.stringify(items)
    });
  }  // End of for loop

  // ========================================================================
  // STEP 5: Return the complete API-ready object
  // ========================================================================
  // This object can now be sent directly to the backend API
  return {
    resume_data  // Array of all sections in API format
  };
}
