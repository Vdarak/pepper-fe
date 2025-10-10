/**
 * Design System Configuration
 * 
 * This file centralizes all design tokens for easy management and scaling.
 * Update these values to change the entire design system.
 * These tokens are synced with globals.css
 */

export const designTokens = {
  // Typography
  fonts: {
    sans: 'Geist, ui-sans-serif, sans-serif, system-ui',
    serif: 'Geist, ui-sans-serif, sans-serif, system-ui',
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
      chart1: 'oklch(0.8100 0.1000 252)',
      chart2: 'oklch(0.6200 0.1900 260)',
      chart3: 'oklch(0.5500 0.2200 263)',
      chart4: 'oklch(0.4900 0.2200 264)',
      chart5: 'oklch(0.4200 0.1800 266)',
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
      chart1: 'oklch(0.8100 0.1000 252)',
      chart2: 'oklch(0.6200 0.1900 260)',
      chart3: 'oklch(0.5500 0.2200 263)',
      chart4: 'oklch(0.4900 0.2200 264)',
      chart5: 'oklch(0.4200 0.1800 266)',
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

  // Border Radius
  radius: {
    base: '0.625rem', // 10px
    sm: 'calc(0.625rem - 4px)',
    md: 'calc(0.625rem - 2px)',
    lg: '0.625rem',
    xl: 'calc(0.625rem + 4px)',
  },

  // Shadows
  shadows: {
    x: '0',
    y: '1px',
    blur: '3px',
    spread: '0px',
    opacity: '0.1',
    color: '#f77878',
    '2xs': '0 1px 3px 0px hsl(0 88.8112% 71.9608% / 0.05)',
    xs: '0 1px 3px 0px hsl(0 88.8112% 71.9608% / 0.05)',
    sm: '0 1px 3px 0px hsl(0 88.8112% 71.9608% / 0.10), 0 1px 2px -1px hsl(0 88.8112% 71.9608% / 0.10)',
    default: '0 1px 3px 0px hsl(0 88.8112% 71.9608% / 0.10), 0 1px 2px -1px hsl(0 88.8112% 71.9608% / 0.10)',
    md: '0 1px 3px 0px hsl(0 88.8112% 71.9608% / 0.10), 0 2px 4px -1px hsl(0 88.8112% 71.9608% / 0.10)',
    lg: '0 1px 3px 0px hsl(0 88.8112% 71.9608% / 0.10), 0 4px 6px -1px hsl(0 88.8112% 71.9608% / 0.10)',
    xl: '0 1px 3px 0px hsl(0 88.8112% 71.9608% / 0.10), 0 8px 10px -1px hsl(0 88.8112% 71.9608% / 0.10)',
    '2xl': '0 1px 3px 0px hsl(0 88.8112% 71.9608% / 0.25)',
  },

  // Spacing
  spacing: '0.25rem', // 4px

  // Typography Scale - Golden Ratio (1.618)
  typography: {
    // Font sizes
    fontSize: {
      xs: '0.618rem',    // ~9.89px
      sm: '0.764rem',    // ~12.22px
      base: '1rem',      // 16px
      lg: '1.236rem',    // ~19.78px
      xl: '1.618rem',    // ~25.89px
      '2xl': '2rem',     // 32px
      '3xl': '2.618rem', // ~41.89px
      '4xl': '3.236rem', // ~51.78px
      '5xl': '4.236rem', // ~67.78px
      '6xl': '5.236rem', // ~83.78px
      '7xl': '6.854rem', // ~109.66px
      '8xl': '8.472rem', // ~135.55px
      '9xl': '10.09rem', // ~161.44px
    },
    
    // Font weights
    fontWeight: {
      thin: '100',
      extralight: '200',
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
      black: '900',
    },
    
    // Line heights
    lineHeight: {
      none: '1',
      tight: '1.236',    // Golden ratio inverse
      snug: '1.382',     // Silver ratio
      normal: '1.618',   // Golden ratio
      relaxed: '2',
      loose: '2.618',    // Golden ratio squared
    },
    
    // Letter spacing
    letterSpacing: {
      tightest: '-0.05em',
      tighter: '-0.025em',
      tight: '-0.0125em',
      normal: '0em',
      wide: '0.0125em',
      wider: '0.025em',
      widest: '0.05em',
    },
  },
} as const;

/**
 * Helper function to access nested token values
 * @example getToken('typography.fontSize.xl') // returns '1.618rem'
 */
export const getToken = (path: string): string => {
  const keys = path.split('.');
  let value: any = designTokens;
  
  for (const key of keys) {
    value = value?.[key];
    if (value === undefined) {
      console.warn(`Token path "${path}" not found`);
      return '';
    }
  }
  
  return value;
};

/**
 * Type-safe token accessor
 */
export type TokenPath = 
  | `colors.light.${keyof typeof designTokens.colors.light}`
  | `colors.dark.${keyof typeof designTokens.colors.dark}`
  | `typography.fontSize.${keyof typeof designTokens.typography.fontSize}`
  | `typography.fontWeight.${keyof typeof designTokens.typography.fontWeight}`
  | `typography.lineHeight.${keyof typeof designTokens.typography.lineHeight}`
  | `typography.letterSpacing.${keyof typeof designTokens.typography.letterSpacing}`
  | `fonts.${keyof typeof designTokens.fonts}`
  | `radius.${keyof typeof designTokens.radius}`
  | 'spacing';

export default designTokens;