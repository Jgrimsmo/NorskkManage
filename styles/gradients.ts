// Monochromatic gradient palette for page headers and UI elements
export const gradients = {
  // Black to Gray Gradients
  dark: {
    charcoal: ['#2C3E50', '#34495E'], // Current sidebar colors - consistent
    slate: ['#485563', '#29323c'], // Dark slate - professional
    midnight: ['#232526', '#414345'], // Midnight dark - elegant
    graphite: ['#4B4B4D', '#6C6C6E'], // Graphite - modern
    steel: ['#5A6C7D', '#4A5568'], // Steel gray - industrial
  },

  // Gray to Light Gray Gradients  
  neutral: {
    concrete: ['#A8A8A8', '#C0C0C0'], // Concrete - balanced
    silver: ['#BDC3C7', '#D5DBDB'], // Silver - refined
    mist: ['#ECF0F1', '#F8F9FA'], // Light mist - subtle
    fog: ['#95A5A6', '#BDC3C7'], // Fog - soft
    ash: ['#7F8C8D', '#95A5A6'], // Ash - muted
  },

  // Professional Monochrome (Main theme)
  professional: {
    corporate: ['#2C3E50', '#34495E'], // Same as sidebar - unified
    executive: ['#34495E', '#5D6D7E'], // Executive - authoritative  
    business: ['#485563', '#29323c'], // Business - serious
    formal: ['#566573', '#717D7E'], // Formal - polished
    minimal: ['#5A6C7D', '#85929E'], // Minimal - clean
  }
} as const;

// Helper function to get gradient by category and name
export const getGradient = (category: keyof typeof gradients, name: string): readonly string[] => {
  const categoryGradients = gradients[category] as Record<string, readonly string[]>;
  return categoryGradients[name] || gradients.professional.corporate;
};

// Suggested page-specific gradients - all monochromatic
export const pageGradients = {
  // Management pages - all using professional dark gradients
  timecards: gradients.professional.corporate,    // Consistent with sidebar
  projects: gradients.dark.slate,                 // Professional dark
  crew: gradients.professional.business,          // Business-appropriate
  equipment: gradients.dark.steel,                // Industrial feel
  dispatch: gradients.professional.minimal,       // Clean and efficient
  
  // Safety pages - slightly lighter for distinction
  dailyReports: gradients.neutral.ash,            // Muted and professional
  flha: gradients.dark.graphite,                  // Important but not colorful
  
  // Other pages
  dashboard: gradients.professional.corporate,    // Same as sidebar - unified
  estimating: gradients.professional.formal,      // Polished and precise
  settings: gradients.dark.slate,                 // Neutral and functional
} as const;

// Predefined gradient combinations for quick selection - all monochromatic
export const gradientSets = {
  // Dark professional set
  darkProfessional: [
    gradients.professional.corporate,
    gradients.dark.charcoal,
    gradients.dark.slate,
    gradients.professional.business,
    gradients.dark.midnight,
  ],
  
  // Light professional set
  lightProfessional: [
    gradients.neutral.silver,
    gradients.neutral.concrete,
    gradients.neutral.ash,
    gradients.neutral.fog,
    gradients.neutral.mist,
  ],
  
  // Mixed professional set
  mixedProfessional: [
    gradients.professional.corporate,
    gradients.neutral.ash,
    gradients.dark.steel,
    gradients.professional.minimal,
    gradients.neutral.fog,
  ],
  
  // Consistent dark theme - all similar to sidebar
  consistentDark: [
    gradients.professional.corporate,
    gradients.professional.executive,
    gradients.professional.business,
    gradients.professional.formal,
    gradients.professional.minimal,
  ]
} as const;
