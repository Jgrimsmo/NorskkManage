import { StyleSheet } from 'react-native';

export const tableStyles = StyleSheet.create({
  // Table Container Styles
  table: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    width: '100%',
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  tableContainer: {
    marginTop: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  
  // Table Header Styles
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F8F9FA',
    paddingVertical: 12,
    paddingHorizontal: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
    width: '100%',
  },
  tableHeaderCell: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRightWidth: 1,
    borderRightColor: '#F0F0F0',
    justifyContent: 'center',
  },
  tableHeaderCellLast: {
    borderRightWidth: 0,
  },
  tableHeaderText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    textTransform: 'uppercase',
  },
  
  // Table Row Styles
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 0,
    paddingHorizontal: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    alignItems: 'center',
    width: '100%',
  },
  tableRowEven: {
    backgroundColor: '#F9F9F9',
  },
  tableRowOdd: {
    backgroundColor: '#FFFFFF',
  },
  tableRowLast: {
    borderBottomWidth: 0,
  },
  
  // Table Cell Styles
  tableCell: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRightWidth: 1,
    borderRightColor: '#F0F0F0',
    justifyContent: 'center',
  },
  tableCellLast: {
    borderRightWidth: 0,
  },
  tableCellText: {
    fontSize: 14,
    color: '#000',
  },
  tableCellSubtext: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  tableCellTextSecondary: {
    fontSize: 14,
    color: '#666',
  },
  
  // Table Actions
  actionsCell: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  tableActions: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  
  // Table Enhancement Styles
  tableRoleHeader: {
    backgroundColor: '#F8F9FA',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  tableRoleHeaderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#495057',
  },
  
  // Table Text Styles
  tableText: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
  },
  tableSubText: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
});
