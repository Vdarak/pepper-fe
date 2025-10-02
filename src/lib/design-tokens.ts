/**
 * Design System Configuration
 * 
 * This file centralizes all design tokens for easy management and scaling.
 * Update these values to change the entire design system.
 */

export const designTokens = {
  // Typography
  fonts: {
    sans: 'Geist, ui-sans-serif, sans-serif, system-ui',
    serif: 'Geist, ui-sans-serif, sans-serif, system-ui', // Change to 'Instrument Serif, serif' if needed
    mono: 'Geist Mono, ui-monospace, monospace',
  },

  // Color System (OKLCH)
  colors: {
    light: {
      background: 'oklch(1 0 0)',
      foreground: 'oklch(0.1450 0 0)',
      card: 'oklch(1 0 0)',
      cardForeground: 'oklch(0.1450 0 0)',
      popover: 'oklch(1 0 0)',
      popoverForeground: 'oklch(0.1450 0 0)',
      primary: 'oklch(0.7204 0.1562 21.7354)',
      primaryForeground: 'oklch(0.9850 0 0)',
      secondary: 'oklch(0.9700 0 0)',
      secondaryForeground: 'oklch(0.2050 0 0)',
      muted: 'oklch(0.9700 0 0)',
      mutedForeground: 'oklch(0.5560 0 0)',
      accent: 'oklch(0.9430 0.0286 17.6699)',
      accentForeground: 'oklch(0.2050 0 0)',
      destructive: 'oklch(0.5770 0.2450 27.3250)',
      destructiveForeground: 'oklch(1 0 0)',
      border: 'oklch(0.9126 0.0165 17.4595)',
      input: 'oklch(0.9430 0.0286 17.6699)',
      ring: 'oklch(0.7204 0.1562 21.7354)',
    },
    dark: {
      background: 'oklch(0.1450 0 0)',
      foreground: 'oklch(0.9850 0 0)',
      card: 'oklch(0.2050 0 0)',
      cardForeground: 'oklch(0.9850 0 0)',
      popover: 'oklch(0.2690 0 0)',
      popoverForeground: 'oklch(0.9850 0 0)',
      primary: 'oklch(0.7204 0.1562 21.7354)',
      primaryForeground: 'oklch(0.2050 0 0)',
      secondary: 'oklch(0.2690 0 0)',
      secondaryForeground: 'oklch(0.9850 0 0)',
      muted: 'oklch(0.2690 0 0)',
      mutedForeground: 'oklch(0.7080 0 0)',
      accent: 'oklch(0.4259 0.0175 17.8616)',
      accentForeground: 'oklch(0.9850 0 0)',
      destructive: 'oklch(0.7040 0.1910 22.2160)',
      destructiveForeground: 'oklch(0.9850 0 0)',
      border: 'oklch(0.3601 0.0155 17.8947)',
      input: 'oklch(0.3880 0.0397 19.0288)',
      ring: 'oklch(0.7204 0.1562 21.7354)',
    },
    charts: {
      chart1: 'oklch(0.8100 0.1000 252)',
      chart2: 'oklch(0.6200 0.1900 260)',
      chart3: 'oklch(0.5500 0.2200 263)',
      chart4: 'oklch(0.4900 0.2200 264)',
      chart5: 'oklch(0.4200 0.1800 266)',
    },
    sidebar: {
      light: {
        sidebar: 'oklch(0.9850 0 0)',
        sidebarForeground: 'oklch(0.1450 0 0)',
        sidebarPrimary: 'oklch(0.2050 0 0)',
        sidebarPrimaryForeground: 'oklch(0.9850 0 0)',
        sidebarAccent: 'oklch(0.9700 0 0)',
        sidebarAccentForeground: 'oklch(0.2050 0 0)',
        sidebarBorder: 'oklch(0.9220 0 0)',
        sidebarRing: 'oklch(0.7080 0 0)',
      },
      dark: {
        sidebar: 'oklch(0.2050 0 0)',
        sidebarForeground: 'oklch(0.9850 0 0)',
        sidebarPrimary: 'oklch(0.4880 0.2430 264.3760)',
        sidebarPrimaryForeground: 'oklch(0.9850 0 0)',
        sidebarAccent: 'oklch(0.2690 0 0)',
        sidebarAccentForeground: 'oklch(0.9850 0 0)',
        sidebarBorder: 'oklch(0.2750 0 0)',
        sidebarRing: 'oklch(0.4390 0 0)',
      },
    },
  },

  // Border Radius
  radius: {
    base: '0.625rem', // 10px
    sm: 'calc(var(--radius) - 4px)',
    md: 'calc(var(--radius) - 2px)',
    lg: 'var(--radius)',
    xl: 'calc(var(--radius) + 4px)',
  },

  // Shadows
  shadows: {
    color: '#f77878',
    opacity: 0.1,
    definitions: {
      '2xs': '0 1px 3px 0px hsl(0 88.8112% 71.9608% / 0.05)',
      xs: '0 1px 3px 0px hsl(0 88.8112% 71.9608% / 0.05)',
      sm: '0 1px 3px 0px hsl(0 88.8112% 71.9608% / 0.10), 0 1px 2px -1px hsl(0 88.8112% 71.9608% / 0.10)',
      default: '0 1px 3px 0px hsl(0 88.8112% 71.9608% / 0.10), 0 1px 2px -1px hsl(0 88.8112% 71.9608% / 0.10)',
      md: '0 1px 3px 0px hsl(0 88.8112% 71.9608% / 0.10), 0 2px 4px -1px hsl(0 88.8112% 71.9608% / 0.10)',
      lg: '0 1px 3px 0px hsl(0 88.8112% 71.9608% / 0.10), 0 4px 6px -1px hsl(0 88.8112% 71.9608% / 0.10)',
      xl: '0 1px 3px 0px hsl(0 88.8112% 71.9608% / 0.10), 0 8px 10px -1px hsl(0 88.8112% 71.9608% / 0.10)',
      '2xl': '0 1px 3px 0px hsl(0 88.8112% 71.9608% / 0.25)',
    },
  },

  // Spacing
  spacing: {
    base: '0.25rem', // 4px
  },

  // Typography Scale
  typography: {
    tracking: {
      normal: '0em',
    },
  },
} as const;

/**
 * Generate CSS custom properties for the design system
 */
export function generateCSSVariables() {
  return {
    // Light theme variables
    ':root': {
      // Colors
      '--background': designTokens.colors.light.background,
      '--foreground': designTokens.colors.light.foreground,
      '--card': designTokens.colors.light.card,
      '--card-foreground': designTokens.colors.light.cardForeground,
      '--popover': designTokens.colors.light.popover,
      '--popover-foreground': designTokens.colors.light.popoverForeground,
      '--primary': designTokens.colors.light.primary,
      '--primary-foreground': designTokens.colors.light.primaryForeground,
      '--secondary': designTokens.colors.light.secondary,
      '--secondary-foreground': designTokens.colors.light.secondaryForeground,
      '--muted': designTokens.colors.light.muted,
      '--muted-foreground': designTokens.colors.light.mutedForeground,
      '--accent': designTokens.colors.light.accent,
      '--accent-foreground': designTokens.colors.light.accentForeground,
      '--destructive': designTokens.colors.light.destructive,
      '--destructive-foreground': designTokens.colors.light.destructiveForeground,
      '--border': designTokens.colors.light.border,
      '--input': designTokens.colors.light.input,
      '--ring': designTokens.colors.light.ring,
      
      // Charts
      '--chart-1': designTokens.colors.charts.chart1,
      '--chart-2': designTokens.colors.charts.chart2,
      '--chart-3': designTokens.colors.charts.chart3,
      '--chart-4': designTokens.colors.charts.chart4,
      '--chart-5': designTokens.colors.charts.chart5,

      // Sidebar
      '--sidebar': designTokens.colors.sidebar.light.sidebar,
      '--sidebar-foreground': designTokens.colors.sidebar.light.sidebarForeground,
      '--sidebar-primary': designTokens.colors.sidebar.light.sidebarPrimary,
      '--sidebar-primary-foreground': designTokens.colors.sidebar.light.sidebarPrimaryForeground,
      '--sidebar-accent': designTokens.colors.sidebar.light.sidebarAccent,
      '--sidebar-accent-foreground': designTokens.colors.sidebar.light.sidebarAccentForeground,
      '--sidebar-border': designTokens.colors.sidebar.light.sidebarBorder,
      '--sidebar-ring': designTokens.colors.sidebar.light.sidebarRing,

      // Typography
      '--font-sans': designTokens.fonts.sans,
      '--font-serif': designTokens.fonts.serif,
      '--font-mono': designTokens.fonts.mono,

      // Radius
      '--radius': designTokens.radius.base,

      // Shadows
      '--shadow-color': designTokens.shadows.color,
      '--shadow-opacity': designTokens.shadows.opacity.toString(),
      ...Object.entries(designTokens.shadows.definitions).reduce((acc, [key, value]) => {
        acc[`--shadow-${key}`] = value;
        return acc;
      }, {} as Record<string, string>),

      // Spacing
      '--spacing': designTokens.spacing.base,

      // Typography
      '--tracking-normal': designTokens.typography.tracking.normal,
    },

    // Dark theme variables
    '.dark': {
      '--background': designTokens.colors.dark.background,
      '--foreground': designTokens.colors.dark.foreground,
      '--card': designTokens.colors.dark.card,
      '--card-foreground': designTokens.colors.dark.cardForeground,
      '--popover': designTokens.colors.dark.popover,
      '--popover-foreground': designTokens.colors.dark.popoverForeground,
      '--primary': designTokens.colors.dark.primary,
      '--primary-foreground': designTokens.colors.dark.primaryForeground,
      '--secondary': designTokens.colors.dark.secondary,
      '--secondary-foreground': designTokens.colors.dark.secondaryForeground,
      '--muted': designTokens.colors.dark.muted,
      '--muted-foreground': designTokens.colors.dark.mutedForeground,
      '--accent': designTokens.colors.dark.accent,
      '--accent-foreground': designTokens.colors.dark.accentForeground,
      '--destructive': designTokens.colors.dark.destructive,
      '--destructive-foreground': designTokens.colors.dark.destructiveForeground,
      '--border': designTokens.colors.dark.border,
      '--input': designTokens.colors.dark.input,
      '--ring': designTokens.colors.dark.ring,

      // Sidebar dark theme
      '--sidebar': designTokens.colors.sidebar.dark.sidebar,
      '--sidebar-foreground': designTokens.colors.sidebar.dark.sidebarForeground,
      '--sidebar-primary': designTokens.colors.sidebar.dark.sidebarPrimary,
      '--sidebar-primary-foreground': designTokens.colors.sidebar.dark.sidebarPrimaryForeground,
      '--sidebar-accent': designTokens.colors.sidebar.dark.sidebarAccent,
      '--sidebar-accent-foreground': designTokens.colors.sidebar.dark.sidebarAccentForeground,
      '--sidebar-border': designTokens.colors.sidebar.dark.sidebarBorder,
      '--sidebar-ring': designTokens.colors.sidebar.dark.sidebarRing,
    },
  };
}

export default designTokens;