# Pepper

Your friendly AI-powered job search assistant! Pepper is a modern, scalable frontend application built with Next.js, TypeScript, and Tailwind CSS featuring a custom design system, comprehensive user onboarding, resume editor with live preview, and dark mode support.

## ✨ Features

### Core Features
- **Complete User Onboarding** - 6-step registration flow with email verification
- **Smart Preferences** - Personalized job search based on user preferences
- **Resume Upload** - Drag-and-drop resume upload with validation
- **Resume Editor with Live Preview** - Advanced drag-and-drop resume editor with real-time preview
- **Job Board** - Two-pane job search interface with responsive mobile view
- **Job Filtering** - Advanced filtering with auto-collapse behavior
- **Bottom Navigation** - Collapsible navigation with Jobs, Resume, and Profile tabs
- **Authentication Protection** - Route protection with authorization checks
- **Vercel Analytics** - Real-time analytics and performance monitoring across all pages
- **Next.js 15.5.4** with App Router and TypeScript
- **Tailwind CSS v4** with custom OKLCH color scheme
- **Shadcn/ui** component library for consistent UI
- **Geist Fonts** for beautiful typography
- **Dark/Light Mode** with system preference detection
- **Lucide React** icons
- **Scalable Design System** with configurable tokens
- **Custom CSS Variables** for easy theming
- **DND Kit** for drag-and-drop functionality
  - `@dnd-kit/core` - Core drag-and-drop primitives
  - `@dnd-kit/sortable` - Sortable list functionality
  - `@dnd-kit/utilities` - CSS transform utilities

### User Flow
1. 📧 **Email Signup** - Simple email entry to start
2. ✅ **Email Verification** - Secure token-based verification
3. 👤 **Account Setup** - 3-step personal information collection
4. 🎯 **Preferences** - Job preferences and career goals
5. 📄 **Resume Upload** - Upload resume with drag-and-drop
6. ✏️ **Resume Editor** - Edit and customize resume with live preview
7. 🎉 **Dashboard** - Access job board and start searching!

### Resume Editor Features

#### 🎨 Layout & Responsive Design
- **Desktop Two-Pane Layout** - Editor on left (50vw), Live Preview on right (50vw)
- **Mobile Responsive** - Tab-based interface with Edit/Preview tabs for mobile devices
- **Mobile Warning Banner** - Desktop recommendation message for mobile users
- **Floating Minimap** - Bottom-right floating action button that expands to section reorder panel
- **Auto-Detection** - Viewport width detection (< 1024px triggers mobile layout)

#### 🖱️ Drag-and-Drop Functionality
Powered by **@dnd-kit** for smooth, accessible drag-and-drop:
- **Section-Level Reordering** - Drag entire sections in editor pane (via accordion titles)
- **Item-Level Reordering** - Reorder items within sections (education entries, projects, etc.)
- **Nested Reordering** - Drag nested items (skills within categories, coursework, bullet points)
- **Always-Visible Handles** - GripVertical icons always visible (not hover-only) for better UX
- **Smooth Animations** - Visual feedback during drag operations
- **Collision Detection** - Smart positioning using closest-center algorithm

#### 📋 Section Management
- **Collapsible Accordions** - Each section in editor pane can expand/collapse with chevron icons
- **Section Controls** - Add/remove buttons for all list-based sections
- **Empty States** - Helpful prompts when sections have no content
- **Type Safety** - Full TypeScript support with discriminated unions

#### 🔧 Comprehensive Sections
1. **Header** (non-draggable, always at top)
   - Name, email, phone, location
   - Multiple links with embedded URLs
   - Automatic validation

2. **Skills**
   - Categorized skill groups (draggable categories)
   - Pill-style tags with X buttons
   - Horizontal drag-and-drop within categories
   - Add/remove skills and categories

3. **Education**
   - University, major, degree
   - Optimized layout: Duration and GPA in same row (5-column grid)
   - Coursework as draggable pills
   - Description bullet points
   - Improved spacing between fields

4. **Projects**
   - Title, company/university
   - Duration with date range inputs and arrow connector
   - Draggable bullet point descriptions
   - Add/remove functionality

5. **Research Experience**
   - Role, company
   - Duration tracking
   - Bullet point responsibilities

6. **Professional Experience**
   - Same structure as research experience
   - Reused component with different title prop

7. **Certifications and Achievements**
   - Simple list with drag-to-reorder
   - Add/remove individual items

8. **Summary**
   - Professional summary textarea
   - Clean, minimal interface

#### ⚡ Live Preview Features
- **Real-time Sync** - Instant updates from editor to preview
- **Inline Editing** - Edit content directly in preview pane
- **Responsive Preview** - Mimics actual resume appearance
- **Professional Formatting** - Clean, ATS-friendly layout

#### 💾 Data Management
- **JSON Schema** - Structured resume data with TypeScript types
- **Download JSON** - Export edited resume data next to Save button
- **Sample Data** - Pre-loaded example for testing
- **State Management** - React hooks (useState, useCallback) for efficient updates

#### 🎯 Smart UX Features
- **Visual Affordances** - Always-visible drag handles for discoverability
- **Consistent Spacing** - Standardized margins (mb-1.5, mb-2, mt-4) and input heights (h-9)
- **Arrow Connectors** - Visual date range indicators in education/projects
- **Pill-Style Tags** - Skills and coursework with hover effects
- **Remove Buttons** - X icons and trash buttons for deletion
- **Grid Layouts** - Optimized field arrangements (5-column for dates, 2-column for fields)
- **Focus Management** - Proper tab order and keyboard navigation

#### 🔮 Future Enhancements (Planned)
- Add custom sections
- Export to PDF
- Multiple resume templates
- AI-powered content suggestions
- Version history
- Collaborative editing

### Job Board Features
- **Two-Pane Layout** - Desktop view with job list (30vw) and detail view (70vw)
- **Mobile Responsive** - Single-pane view with back navigation
- **Advanced Filters** - Collapsible filter panel (40vh expanded) with:
  - Job commitment (Full-time, Part-time, Contract, etc.)
  - Seniority level (Entry, Mid, Senior, Lead, etc.)
  - Location filtering
  - Salary range
  - Auto-collapse on scroll
  - Selected filters display in collapsed state
- **Job Cards** - Complete job information including:
  - Company logo and details
  - Job title, location, salary
  - Commitment type and seniority level
  - Quick actions (Bookmark, Like, Dislike)
  - Apply button with external link
- **Job Detail View** - Comprehensive job information:
  - Full job description
  - Requirements summary
  - Tech stack and tools
  - Company information
  - Collapsing sticky header on scroll
- **Bottom Navigation** - Accessible tab navigation:
  - Jobs, Resume, and Profile tabs
  - Auto-collapse after 5 seconds
  - Smooth animations (500ms bouncy effect)
  - Active route highlighting
- **Smooth Animations** - Polish throughout:
  - Filter slide transitions (300ms)
  - Navigation collapse/expand
  - Page transitions

> 📖 See [ONBOARDING_FLOW.md](./ONBOARDING_FLOW.md) for complete documentation

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Vdarak/pepper-fe.git
cd pepper-fe
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎨 Design System

The project features a comprehensive design system built with OKLCH colors for better color perception and consistency across different displays.

### Key Features:
- **OKLCH Color Space**: Perceptually uniform colors
- **CSS Custom Properties**: Easy theme customization
- **Configurable Tokens**: Centralized design configuration
- **Dark/Light Themes**: Automatic theme switching
- **Typography Scale**: Consistent text sizing
- **Shadow System**: Cohesive elevation patterns

### Customization

Update design tokens in `src/lib/design-tokens.ts`:

```typescript
export const designTokens = {
  fonts: {
    sans: 'Geist, ui-sans-serif, sans-serif, system-ui',
    // ... customize fonts
  },
  colors: {
    // ... customize colors
  },
  radius: {
    base: '0.625rem', // Change global border radius
  },
  // ... other design tokens
};
```

## 📁 Project Structure

```
pepper/
├── src/
│   ├── app/                       # Next.js App Router
│   │   ├── layout.tsx            # Root layout with theme provider
│   │   ├── page.tsx              # Email signup (home page)
│   │   ├── verify-email/         # Email verification page
│   │   ├── verify/               # Token verification handler
│   │   ├── account-setup/        # 3-step account creation
│   │   ├── preferences/          # Job preferences collection
│   │   ├── resume-upload/        # Resume upload page
│   │   ├── dashboard/            # Redirects to jobs page
│   │   ├── jobs/                 # Job board (main feature)
│   │   ├── resume/               # Resume management with editor
│   │   ├── profile/              # User profile page
│   │   ├── unauthorized/         # Auth error page
│   │   └── globals.css           # Global styles with design system
│   ├── components/               # Reusable components
│   │   ├── ui/                   # Shadcn/ui components
│   │   │   ├── button.tsx        # Button component
│   │   │   ├── card.tsx          # Card component
│   │   │   ├── input.tsx         # Input component
│   │   │   ├── label.tsx         # Label component
│   │   │   ├── checkbox.tsx      # Checkbox component
│   │   │   ├── radio-group.tsx   # Radio group component
│   │   │   ├── select.tsx        # Select dropdown
│   │   │   └── carousel.tsx      # Carousel component
│   │   ├── resume-editor/        # Resume editor system
│   │   │   ├── resume-editor.tsx       # Main editor coordinator
│   │   │   ├── editor-pane.tsx         # Left pane with accordions
│   │   │   ├── preview-pane.tsx        # Right pane with live preview
│   │   │   ├── floating-minimap.tsx    # Section reorder FAB
│   │   │   ├── sections/               # Section editors
│   │   │   │   ├── header-editor.tsx
│   │   │   │   ├── skills-editor.tsx
│   │   │   │   ├── education-editor.tsx
│   │   │   │   ├── projects-editor.tsx
│   │   │   │   ├── experience-editor.tsx
│   │   │   │   ├── certifications-editor.tsx
│   │   │   │   └── summary-editor.tsx
│   │   │   └── preview/                # Preview components
│   │   │       ├── header-preview.tsx
│   │   │       ├── skills-preview.tsx
│   │   │       ├── education-preview.tsx
│   │   │       ├── projects-preview.tsx
│   │   │       ├── experience-preview.tsx
│   │   │       ├── certifications-preview.tsx
│   │   │       └── summary-preview.tsx
│   │   ├── job-card.tsx          # Job listing card
│   │   ├── job-detail-view.tsx   # Job detail display
│   │   ├── job-filter.tsx        # Job filter panel
│   │   ├── bottom-nav.tsx        # Bottom navigation bar
│   │   ├── theme-provider.tsx    # Theme context provider
│   │   ├── theme-toggle.tsx      # Dark/light mode toggle
│   │   ├── resume-center.tsx     # Resume management UI
│   │   └── error-page.tsx        # Error display component
│   ├── types/                    # TypeScript type definitions
│   │   └── resume.ts             # Resume data structure types
│   ├── hooks/                    # Custom React hooks
│   │   └── useAuthProtection.ts  # Route authorization hook
│   └── lib/                      # Utilities and configuration
│       ├── api.ts                # API functions & error handling
│       ├── data.ts               # Countries, states, codes data
│       ├── sample-resume-data.ts # Sample resume for editor
│       ├── design-tokens.ts      # Design system configuration
│       └── utils.ts              # Utility functions
│       ├── design-tokens.ts      # Design system configuration
│       └── utils.ts              # Utility functions
├── components.json               # Shadcn/ui configuration
├── tailwind.config.js            # Tailwind CSS configuration
├── ONBOARDING_FLOW.md            # Complete onboarding documentation
└── README.md                     # This file
```

## 📚 Documentation

- **[ONBOARDING_FLOW.md](./ONBOARDING_FLOW.md)** - Complete user onboarding flow documentation
  - Step-by-step user journey
  - API endpoint reference
  - Technical implementation details
  - Testing guide
  - Future enhancements

- **[RESUME_EDITOR_ARCHITECTURE.md](./RESUME_EDITOR_ARCHITECTURE.md)** - Resume editor technical documentation
  - System architecture and component hierarchy
  - Drag-and-drop implementation patterns
  - State management strategies
  - TypeScript type definitions
  - Extension and customization guide

- **[RESUME_EDITOR_TESTING.md](./RESUME_EDITOR_TESTING.md)** - Resume editor testing guide
  - Component-by-component testing instructions
  - Drag-and-drop interaction testing
  - Mobile responsiveness verification
  - JSON schema validation
  - Known issues and troubleshooting

## 🧩 Component Architecture

### Resume Editor Components

The resume editor is built with a modular architecture using React, TypeScript, and @dnd-kit for drag-and-drop functionality.

#### `<ResumeEditor />`
**Main coordinator component** managing state and layout:
- **State Management**: Single source of truth for resume data
- **Mobile Detection**: useEffect hook checks viewport width (< 1024px)
- **Responsive Layouts**:
  - Desktop: Two-pane side-by-side (50vw each)
  - Mobile: Tab-based UI (Edit/Preview tabs)
- **Features**:
  - Save functionality with API integration
  - Download JSON button (exports resume data as formatted JSON)
  - Mobile warning banner for desktop recommendation
  - Real-time sync between editor and preview

#### `<EditorPane />`
**Left pane coordinator** with section management:
- **Accordion Pattern**: Collapsible sections with ChevronUp/ChevronDown icons
- **Section-Level Drag**: DndContext wrapping all sections for reordering
- **SortableSectionWrapper**: Custom component adding drag handles and collapse functionality
- **Header Exception**: Header section non-draggable (always at top)
- **Section Editors**: Renders all 7 section editor components
- **Props**: `resumeData`, `onUpdate`, `onReorderSections`, `isMobile`

#### `<PreviewPane />`
**Right pane coordinator** showing live preview:
- **Responsive Width**: Conditional width classes based on `isMobile` prop
- **Preview Components**: Renders all 7 preview components
- **Inline Editing**: Preview components support direct editing
- **Professional Layout**: ATS-friendly resume format
- **Real-time Updates**: Reflects editor changes instantly

#### `<FloatingMinimap />`
**Floating action button** for section reordering:
- **Position**: Fixed bottom-right (bottom-6 right-6)
- **States**:
  - Collapsed: Round FAB with List icon
  - Expanded: Full panel with section list
- **Drag-and-Drop**: Complete DndContext for section reordering
- **Visual Feedback**: Shows all sections with GripVertical handles
- **Close Button**: X icon to collapse back to FAB

#### Section Editors

All section editors follow consistent patterns:

**`<HeaderEditor />`**
- Name, email, phone, location fields
- Dynamic links array with add/remove
- Grid layout for contact information

**`<SkillsEditor />`**
- Nested drag-and-drop (categories + skills)
- `SortableCategory` and `SortableSkillPill` components
- Horizontal drag for skills, vertical for categories
- Always-visible GripVertical handles
- Add/remove categories and individual skills

**`<EducationEditor />`**
- Optimized 5-column grid for duration fields (2-1-2 pattern)
- GPA in separate row with w-32 width constraint
- `SortableCoursework` pills for courses
- Draggable bullet point descriptions
- Improved spacing: mb-1.5 for labels, mt-4 for sections, h-9 for inputs

**`<ProjectsEditor />`**
- Title, company/university fields
- Duration with arrow connector
- `SortableBullet` component for descriptions
- Add/remove project entries

**`<ExperienceEditor />`**
- Reusable component with `title` prop
- Same structure as projects
- Used for both research and professional experience

**`<CertificationsEditor />`**
- Simple list with `SortableCertification` items
- Empty state with helpful prompt
- Add/remove individual certifications

**`<SummaryEditor />`**
- Clean textarea for professional summary
- Consistent label spacing (mb-2)
- Textarea with min-h-[120px] and resize-y

#### Preview Components

All preview components follow consistent patterns and support inline editing:

- **`<HeaderPreview />`**: Contact info with links
- **`<SkillsPreview />`**: Categorized skills display
- **`<EducationPreview />`**: University entries with coursework
- **`<ProjectsPreview />`**: Project listings with bullets
- **`<ExperiencePreview />`**: Experience entries (research + professional)
- **`<CertificationsPreview />`**: Achievement list
- **`<SummaryPreview />`**: Professional summary text

#### Technical Implementation

**Drag-and-Drop System** (@dnd-kit):
```typescript
// Sensors for touch and mouse
const sensors = useSensors(
  useSensor(PointerSensor, {
    activationConstraint: { distance: 8 }
  })
);

// DndContext with collision detection
<DndContext
  sensors={sensors}
  collisionDetection={closestCenter}
  onDragEnd={handleDragEnd}
>
  <SortableContext items={items} strategy={verticalListSortingStrategy}>
    {/* Sortable items */}
  </SortableContext>
</DndContext>
```

**Mobile Detection**:
```typescript
useEffect(() => {
  const checkMobile = () => {
    setIsMobile(window.innerWidth < 1024);
  };
  checkMobile();
  window.addEventListener('resize', checkMobile);
  return () => window.removeEventListener('resize', checkMobile);
}, []);
```

**Type Safety**:
```typescript
// Discriminated unions for section types
type ResumeSection =
  | { type: "header"; data: Header }
  | { type: "skills"; data: SkillCategory[] }
  | { type: "education"; data: Education[] }
  // ... more sections
```

### Job Board Components

#### `<JobCard />`
Displays job listing in the left pane with:
- Company logo (object-contain for proper scaling)
- Job title, location, salary
- Commitment type and seniority level tags
- Action buttons: Bookmark, Like, Dislike (secondary variant)
- Apply button with external link icon (primary variant)

#### `<JobDetailView />`
Shows full job details in the right pane:
- Sticky collapsing header (auto-collapses on scroll)
- Company information section
- Full job description
- Requirements summary
- Tech stack and tools list
- Independent scroll container

#### `<JobFilter />`
Collapsible filter panel with advanced features:
- **Expanded State** - 40vh height with all filter options
- **Collapsed State** - Compact view showing selected filters as tags
- **Auto-Collapse** - Triggers on scroll down in job list
- **Manual Collapse** - "Apply Filters" button
- **Animations** - Smooth 300ms slide transitions
- **Filter Types**: Commitment, Seniority, Location, Salary

#### `<BottomNav />`
Smart navigation bar with three tabs:
- Jobs, Resume, and Profile navigation
- Auto-collapse behaviors:
  - After 5 seconds of expansion
  - 2 seconds after hover ends
  - When user scrolls
- Bouncy animation (500ms cubic-bezier)
- Active route highlighting
- Mobile-optimized touch targets

#### `<ThemeToggle />`
Dark/light mode switcher:
- Sun/Moon icon toggle
- System preference detection
- Smooth theme transitions
- Available in all authenticated pages

### Responsive Design

#### Desktop (≥768px)
- Two-pane layout: Job list (30vw) + Detail view (70vw)
- Independent scrolling for each pane
- Filter panel at top of left pane
- Bottom navigation always visible
- First job auto-selected on load

#### Mobile (<768px)
- Single-pane view with smooth transitions
- Job list shows all available jobs
- Tap job card to view full details
- Back button to return to list
- Filter panel slides over content
- Bottom navigation collapsible for more screen space

## 🛠️ Available Scripts

- `npm run dev` - Start development server (default: http://localhost:3000)
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🔌 API Configuration

The app connects to a backend API. Configure the API URL:

```javascript
// In browser console or code
localStorage.setItem('pepper-api-url', 'http://localhost:8000/api');
```

**Default API URL**: `http://localhost:8000/api`

### API Endpoints

#### Onboarding
- `POST /user/signup/request` - Email signup
- `GET /user/signup/verify` - Token verification
- `POST /user/signup/account-setup` - Account creation
- `POST /user/signup/user-pref` - Save preferences
- `POST /resume/upload` - Upload resume file

#### Resume Management
- `GET /resume/fetch` - Fetch user's resume data (JSON format)
- `POST /resume/save` - Save edited resume data
- `PUT /resume/update` - Update existing resume
- `GET /resume/download` - Download resume as PDF (future)
- `POST /resume/parse` - Parse uploaded resume file to JSON (future)
- `GET /resume/templates` - Fetch available resume templates (future)

#### Job Board
- `GET /jobs/fetch_jobs` - Fetch job listings (accepts `size` parameter)
- `POST /jobs/bookmark` - Bookmark a job
- `POST /jobs/like` - Like a job
- `POST /jobs/dislike` - Dislike a job
- `GET /jobs/{id}` - Fetch specific job details

#### Authentication
- `GET /user/check-authorization` - Verify user session
- `POST /user/logout` - End user session
- `GET /user/profile` - Fetch user profile data
- `PUT /user/profile` - Update user profile

> 📖 See [ONBOARDING_FLOW.md](./ONBOARDING_FLOW.md) for complete API documentation

### Resume API Details

#### Save Resume
```typescript
POST /resume/save
Content-Type: application/json

// Request Body
{
  "resumeData": {
    "header": { /* header data */ },
    "sections": [
      { "type": "skills", "data": [ /* skills */ ] },
      { "type": "education", "data": [ /* education */ ] },
      // ... other sections
    ]
  }
}

// Response
{
  "success": true,
  "message": "Resume saved successfully",
  "resumeId": "uuid-here"
}
```

#### Fetch Resume
```typescript
GET /resume/fetch
Authorization: Bearer <token> or Cookie-based

// Response
{
  "success": true,
  "resume": {
    "header": {
      "name": "John Doe",
      "email": "john@example.com",
      // ... other header fields
    },
    "sections": [
      {
        "type": "skills",
        "data": [
          {
            "category": "Programming",
            "skills": ["JavaScript", "TypeScript", "React"]
          }
        ]
      },
      // ... other sections
    ]
  }
}
```

#### Download JSON
The frontend `handleDownloadJSON()` function creates a client-side download without requiring an API call:
- Formats resume data as pretty-printed JSON
- Creates a blob with `application/json` MIME type
- Triggers browser download with filename: `resume_[name]_[timestamp].json`

### Resume Data Structure

The resume data follows a strongly-typed TypeScript schema defined in `src/types/resume.ts`:

```typescript
// Main Resume Structure
interface ResumeData {
  header: Header;
  sections: ResumeSection[];
}

// Discriminated Union for Type Safety
type ResumeSection =
  | { type: "summary"; data: Summary }
  | { type: "skills"; data: SkillCategory[] }
  | { type: "education"; data: Education[] }
  | { type: "projects"; data: Project[] }
  | { type: "research"; data: Experience[] }
  | { type: "professional"; data: Experience[] }
  | { type: "certifications"; data: string[] };

// Section Interfaces
interface Header {
  name: string;
  email: string;
  phone: string;
  location: string;
  links: Link[];
}

interface SkillCategory {
  category: string;
  skills: string[];
}

interface Education {
  university: string;
  major: string;
  duration: Duration;
  gpa: string;
  coursework: string[];
  description: string[];
}

interface Project {
  title: string;
  "company/university": string;
  duration: Duration;
  description: string[];
}

interface Experience {
  role: string;
  company: string;
  duration: Duration;
  description: string[];
}

interface Duration {
  start: string;
  end: string;
  IsCurrent: boolean;
}
```

**Key Design Decisions**:
- **Discriminated Unions**: Enables type-safe section rendering
- **Nested Arrays**: Skills, coursework, and bullet points support drag-and-drop
- **Duration Object**: Consistent date handling across sections
- **Optional Fields**: GPA, coursework can be empty
- **Link Objects**: Embedded URLs with display text for header

## 🔒 Authentication & Authorization

Pepper implements comprehensive route protection to ensure secure access to user-specific features.

### Protected Routes

All authenticated pages use the `useAuthProtection` hook:
- `/dashboard` - Main dashboard (redirects to `/jobs`)
- `/jobs` - Job board
- `/resume` - Resume management
- `/profile` - User profile

### How It Works

1. **Authorization Check** - On page load, the app verifies the user session via `/user/check-authorization`
2. **Loading State** - Shows a loading spinner while checking authorization
3. **Redirect** - Unauthorized users are redirected to `/unauthorized`
4. **Session Management** - Uses cookies for persistent authentication

### Implementation Example

```typescript
import { useAuthProtection } from "@/hooks/useAuthProtection";

export default function ProtectedPage() {
  const { isAuthorized, isChecking } = useAuthProtection();

  // Show loading state while checking
  if (isChecking) {
    return <Loader2 className="w-8 h-8 animate-spin" />;
  }

  // Hook automatically redirects if not authorized
  return <div>Protected content</div>;
}
```

## 🎯 Built With

- [Next.js](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Shadcn/ui](https://ui.shadcn.com/) - Component library
- [Lucide React](https://lucide.dev/) - Icon library
- [@dnd-kit](https://dndkit.com/) - Drag-and-drop library (core, sortable, utilities)
- [next-themes](https://github.com/pacocoursey/next-themes) - Theme switching
- [Geist Font](https://vercel.com/font) - Typography
- [Vercel Analytics](https://vercel.com/analytics) - Real-time web analytics

## 📊 Analytics

This project uses **Vercel Analytics** to track real-time user interactions and performance metrics across all pages. Analytics are automatically enabled for all routes including:

- Homepage (Email Signup)
- Email Verification
- Account Setup
- Preferences
- Resume Upload
- Dashboard & Jobs
- Resume Management
- User Profile

### Features
- **Real-time Metrics** - Track page views, user sessions, and interactions
- **Web Vitals** - Monitor Core Web Vitals (LCP, FID, CLS, FCP, TTFB)
- **Zero Configuration** - Works automatically when deployed to Vercel
- **Privacy-Focused** - No cookies, GDPR compliant
- **Performance Impact** - Minimal overhead with automatic code splitting

### Implementation

Analytics are globally enabled in the root layout (`src/app/layout.tsx`):

```tsx
import { Analytics } from "@vercel/analytics/react";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

This ensures all pages in the application automatically send analytics data without requiring individual page modifications.

### Viewing Analytics

Once deployed to Vercel:
1. Navigate to your project dashboard on Vercel
2. Click on the "Analytics" tab
3. View real-time traffic, page views, and performance metrics

> **Note**: Analytics will only collect data when deployed to Vercel. In local development, the component has no effect.

## 🚀 Deployment

This project is optimized for deployment on [Vercel](https://vercel.com/):

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy with zero configuration!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Vdarak/pepper-fe)

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Built with ❤️ and lots of ☕
