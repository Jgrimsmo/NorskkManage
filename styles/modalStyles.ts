import { StyleSheet } from 'react-native';

export const modalStyles = StyleSheet.create({
  // Modal Base Styles - Full Page Style
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  
  // Legacy overlay style (for backward compatibility with any existing overlays)
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  
  // Legacy content style (for backward compatibility)
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  
  // Full-page modal content with max width constraint
  modalContentFullPage: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    maxWidth: 800, // Clean max width for larger screens
    alignSelf: 'center',
    width: '100%',
  },
  
  // Modal Header Styles - Full Page Style
  modalPageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  modalPageTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  modalPageActions: {
    flexDirection: 'row',
    gap: 12,
  },
  
  // Legacy modal header (for backward compatibility)
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  modalCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCloseText: {
    fontSize: 18,
    color: '#666',
    fontWeight: '600',
  },
  
  // Modal Footer Styles
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 20,
  },
  modalCancelText: {
    fontSize: 16,
    color: '#007AFF',
  },
  modalSaveText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  
  // Modal Body - Full Page Style
  modalPageBody: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  
  // Modal Content Container for forms
  modalFormContainer: {
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: 16,
  },
  
  // Legacy modal body (for backward compatibility)
  modalBody: {
    flex: 1,
    paddingHorizontal: 16,
  },
  
  // Page Footer (similar to modal footer)
  pageFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    marginTop: 20,
  },
  
  // Alert Container
  alertContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    margin: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginLeft: 8,
  },
  alertMessage: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
    marginBottom: 20,
  },
});
