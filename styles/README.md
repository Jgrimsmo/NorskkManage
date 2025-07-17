# Styles Structure

This directory contains the modular styles architecture for the NorskkManage app.

## File Structure

### Core Files
- **`index.ts`** - Main export file that combines all modular styles into `globalStyles`
- **`tokens.ts`** - Design tokens (colors, spacing, typography, etc.)

### Modular Style Files
- **`baseStyles.ts`** - Core layout and container styles
- **`buttonStyles.ts`** - All button-related styles
- **`tableStyles.ts`** - Table and data display styles
- **`modalStyles.ts`** - Modal and overlay styles
- **`componentStyles.ts`** - Form components and inputs
- **`textStyles.ts`** - Typography and text styles
- **`calendarStyles.ts`** - Calendar and date picker styles
- **`globalStyles.ts`** - Navigation-specific and legacy styles

## Usage

### Recommended (Consistent)
```tsx
import { globalStyles, colors } from '@/styles';
```

### Legacy (Avoid)
```tsx
import { buttonStyles } from '@/styles/buttonStyles';
import { tableStyles } from '@/styles/tableStyles';
```

## Migration Notes

The styles were refactored from a monolithic 1,171-line file into modular components for:
- **Better maintainability** - Each style category is in its own file
- **Easier navigation** - Find styles by category
- **Reduced conflicts** - Less merge conflicts in version control
- **Tree shaking** - Unused styles can be eliminated
- **Type safety** - Better TypeScript support

All components should import from the main `@/styles` export for consistency.
