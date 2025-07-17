import { StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, fontSize, fontWeight, shadows } from './tokens';

export const baseStyles = StyleSheet.create({
  // Container Styles
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  containerNoPadding: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 0,
    margin: 0,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  section: {
    marginBottom: spacing.xxl,
    paddingHorizontal: spacing.lg,
  },

  // Layout Styles
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowWithGap: {
    flexDirection: 'row',
    gap: 12,
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  spaceAround: {
    justifyContent: 'space-around',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  flex1: {
    flex: 1,
  },
  minHeight24: {
    minHeight: 24,
  },

  // Card Styles
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  cardTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    flex: 1,
  },
  cardSubtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  cardContent: {
    marginBottom: spacing.md,
  },

  // Text Styles
  text: {
    fontSize: fontSize.lg,
    color: colors.text,
  },
  textSecondary: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
  textSmall: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  textBold: {
    fontWeight: fontWeight.bold,
  },
  textCenter: {
    textAlign: 'center',
  },
  textRight: {
    textAlign: 'right',
  },
  linkText: {
    color: colors.primary,
    fontWeight: fontWeight.medium,
  },

  // Utility Styles
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.lg,
  },
  shadow: shadows.md,

  // Loading Styles
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: spacing.lg,
    fontSize: fontSize.lg,
    color: colors.textSecondary,
  },

  // Error Styles
  errorContainer: {
    backgroundColor: colors.errorLight,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    marginBottom: spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: colors.error,
  },
  errorText: {
    color: colors.errorDark,
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
  },

  // Success Styles
  successContainer: {
    backgroundColor: colors.successLight,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    marginBottom: spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: colors.success,
  },
  successText: {
    color: colors.successDark,
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
  },

  // Empty State
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
  },
  emptyStateTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  emptyStateSubtext: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
  },

  // Page Header
  pageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    marginBottom: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 12,
    ...shadows.md,
  },

  // Controls Container
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  searchContainer: {
    flex: 1,
    marginRight: spacing.md,
  },

  // Form Styles
  formGroup: {
    marginBottom: spacing.lg,
  },
  formSection: {
    marginBottom: spacing.xl,
  },
  formRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  formField: {
    flex: 1,
  },

  // Input Styles
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: fontSize.md,
    backgroundColor: colors.background,
    minHeight: 40,
  },
  inputMultiline: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: fontSize.md,
    backgroundColor: colors.background,
    minHeight: 60,
  },
  formInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: fontSize.md,
    color: colors.text,
    backgroundColor: colors.surface,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: fontSize.md,
    color: colors.text,
    backgroundColor: colors.surface,
    flex: 1,
  },

  // Picker Styles
  pickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  pickerScrollContainer: {
    maxHeight: 200,
  },
  pickerOption: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  pickerOptionSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  pickerOptionText: {
    fontSize: fontSize.md,
    color: colors.text,
  },
  pickerOptionTextSelected: {
    color: colors.white,
    fontWeight: fontWeight.medium,
  },
  picker: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
  },

  // Dropdown and Filter Styles
  dropdown: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
    minHeight: 40,
  },
  dropdownText: {
    fontSize: fontSize.md,
    color: colors.text,
  },
  dropdownContainer: {
    position: 'relative',
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filterGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.lg,
  },
  filterLabel: {
    fontSize: fontSize.sm,
    color: colors.text,
    marginRight: spacing.sm,
    fontWeight: fontWeight.medium,
  },
});
