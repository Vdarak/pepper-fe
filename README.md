# Pepper

Your friendly AI-powered job search assistant! Pepper is a modern, scalable frontend application built with Next.js, TypeScript, and Tailwind CSS featuring a custom design system, comprehensive user onboarding, and dark mode support.

## ✨ Features

### Core Features
- **Complete User Onboarding** - 6-step registration flow with email verification
- **Smart Preferences** - Personalized job search based on user preferences
- **Resume Upload** - Drag-and-drop resume upload with validation
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

### User Flow
1. 📧 **Email Signup** - Simple email entry to start
2. ✅ **Email Verification** - Secure token-based verification
3. 👤 **Account Setup** - 3-step personal information collection
4. 🎯 **Preferences** - Job preferences and career goals
5. 📄 **Resume Upload** - Upload resume with drag-and-drop
6. 🎉 **Dashboard** - Access job board and start searching!

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
│   │   ├── resume/               # Resume management
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
│   │   ├── job-card.tsx          # Job listing card
│   │   ├── job-detail-view.tsx   # Job detail display
│   │   ├── job-filter.tsx        # Job filter panel
│   │   ├── bottom-nav.tsx        # Bottom navigation bar
│   │   ├── theme-provider.tsx    # Theme context provider
│   │   ├── theme-toggle.tsx      # Dark/light mode toggle
│   │   ├── resume-center.tsx     # Resume management UI
│   │   └── error-page.tsx        # Error display component
│   ├── hooks/                    # Custom React hooks
│   │   └── useAuthProtection.ts  # Route authorization hook
│   └── lib/                      # Utilities and configuration
│       ├── api.ts                # API functions & error handling
│       ├── data.ts               # Countries, states, codes data
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

## 🧩 Component Architecture

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
- `POST /resume/upload` - Upload resume

#### Job Board
- `GET /jobs/fetch_jobs` - Fetch job listings (accepts `size` parameter)

#### Authentication
- `GET /user/check-authorization` - Verify user session
- `POST /user/logout` - End user session

> 📖 See [ONBOARDING_FLOW.md](./ONBOARDING_FLOW.md) for complete API documentation

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
