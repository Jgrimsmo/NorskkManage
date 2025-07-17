import { StyleSheet } from 'react-native';

export const componentStyles = StyleSheet.create({
  // Badge Styles
  badge: {
    backgroundColor: '#34C759',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  
  // Status Badge Styles
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusActive: {
    backgroundColor: '#007AFF',
  },
  statusCompleted: {
    backgroundColor: '#34C759',
  },
  statusDelayed: {
    backgroundColor: '#FF3B30',
  },
  statusOnHold: {
    backgroundColor: '#FF9500',
  },
  statusUpcoming: {
    backgroundColor: '#AF52DE',
  },
  statusCancelled: {
    backgroundColor: '#8E8E93',
  },
  
  // Assignment Styles
  assignmentsContainer: {
    flex: 1,
    marginTop: 4,
    gap: 4,
  },
  assignmentBadge: {
    backgroundColor: '#34C759',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 2,
  },
  assignmentBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '500',
  },
  
  // Resource Selection Styles
  resourceGroup: {
    marginBottom: 16,
  },
  resourceGroupTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  resourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 8,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  resourceItemSelected: {
    backgroundColor: '#E3F2FF',
    borderColor: '#007AFF',
  },
  resourceItemInfo: {
    flex: 1,
  },
  resourceItemName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    marginBottom: 2,
  },
  resourceItemDetail: {
    fontSize: 14,
    color: '#666',
  },
  
  // List Item Styles
  listItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  
  // Statistics Styles
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  
  // Photo Gallery Styles
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  photoThumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  photoImage: {
    width: '100%',
    height: '100%',
  },
  photoDeleteButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  photoUploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  // Icon Utilities
  iconWithMargin: {
    marginRight: 8,
  },
  iconSmallMargin: {
    marginRight: 4,
  },
  
  // Text Utilities
  italicText: {
    fontStyle: 'italic',
  },
  smallText: {
    fontSize: 14,
  },
  
  // Layout Utilities
  scrollContent: {
    flex: 1,
    paddingHorizontal: 16,
  },
  rowCentered: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowCenteredWithGap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  flexWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginVertical: 8,
  },

  // Utility Component Styles
  divider: {
    height: 1,
    backgroundColor: '#E5E5EA',
    marginVertical: 16,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Action Button Styles
  actionPdfButton: {
    backgroundColor: '#FF6B6B', // PDF/Document action
  },
  actionViewButton: {
    backgroundColor: '#007AFF', // View/Preview action  
  },
  actionEditButton: {
    backgroundColor: '#34C759', // Edit action
  },
  actionDeleteButton: {
    backgroundColor: '#FF3B30', // Delete action
  },
  actionPhotoButton: {
    backgroundColor: '#007AFF', // Photo/Image action
  },
  
  // Action Button Spacing
  actionButtonSpacing: {
    marginRight: 8,
  },
  actionButtonLast: {
    marginRight: 0,
  },
});
