import { StyleSheet } from 'react-native';

export const textStyles = StyleSheet.create({
  // Basic Text Styles
  text: {
    fontSize: 16,
    color: '#000',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#000',
  },
  textSecondary: {
    fontSize: 14,
    color: '#666',
  },
  textSmall: {
    fontSize: 12,
    color: '#666',
  },
  textBold: {
    fontWeight: 'bold',
  },
  textCenter: {
    textAlign: 'center',
  },
  textRight: {
    textAlign: 'right',
  },
  linkText: {
    color: '#007AFF',
    fontWeight: '500',
  },
  
  // Header Text Styles
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  
  // Card Text Styles
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    flex: 1,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  
  // List Text Styles
  listItemText: {
    fontSize: 16,
    color: '#000',
  },
  
  // Error and Loading Text
  errorText: {
    color: '#D32F2F',
    fontSize: 14,
    fontWeight: '500',
  },
  successText: {
    color: '#2E7D32',
    fontSize: 14,
    fontWeight: '500',
  },
  
  // Empty State Text
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
    textAlign: 'center',
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
  
  // Status Text
  statusText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  
  // Required Field
  requiredField: {
    color: '#FF3B30',
  },

  // Input Label Styles
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
    marginBottom: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
    marginBottom: 8,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
    marginBottom: 8,
  },

  // Form Section Title
  formSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
  },
});
