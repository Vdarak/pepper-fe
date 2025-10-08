# Pepper 🌶️

Your friendly AI-powered job search assistant! Pepper is a modern, scalable frontend application built with Next.js, TypeScript, and Tailwind CSS featuring a custom design system, comprehensive user onboarding, and dark mode support.

## ✨ Features

### Core Features
- **Complete User Onboarding** - 6-step registration flow with email verification
- **Smart Preferences** - Personalized job search based on user preferences
- **Resume Upload** - Drag-and-drop resume upload with validation
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
6. 🎉 **Dashboard** - Ready to search for jobs!

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
│   │   ├── dashboard/            # Main dashboard
│   │   └── globals.css           # Global styles with design system
│   ├── components/               # Reusable components
│   │   ├── ui/                   # Shadcn/ui components
│   │   ├── theme-provider.tsx    # Theme context provider
│   │   ├── theme-toggle.tsx      # Dark/light mode toggle
│   │   └── error-page.tsx        # Error display component
│   └── lib/                      # Utilities and configuration
│       ├── api.ts                # API functions & error handling
│       ├── data.ts               # Countries, states, codes data
│       ├── design-tokens.ts      # Design system configuration
│       └── utils.ts              # Utility functions
├── components.json               # Shadcn/ui configuration
├── tailwind.config.js            # Tailwind CSS configuration
└── ONBOARDING_FLOW.md            # Complete onboarding documentation
```

## 📚 Documentation

- **[ONBOARDING_FLOW.md](./ONBOARDING_FLOW.md)** - Complete user onboarding flow documentation
  - Step-by-step user journey
  - API endpoint reference
  - Technical implementation details
  - Testing guide
  - Future enhancements

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

The onboarding flow uses these endpoints:
- `POST /user/signup/request` - Email signup
- `GET /user/signup/verify` - Token verification
- `POST /user/signup/account-setup` - Account creation
- `POST /user/signup/user-pref` - Save preferences
- `POST /resume/upload` - Upload resume

> 📖 See [ONBOARDING_FLOW.md](./ONBOARDING_FLOW.md) for complete API documentation

## 🎯 Built With

- [Next.js](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Shadcn/ui](https://ui.shadcn.com/) - Component library
- [Lucide React](https://lucide.dev/) - Icon library
- [next-themes](https://github.com/pacocoursey/next-themes) - Theme switching
- [Geist Font](https://vercel.com/font) - Typography

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
