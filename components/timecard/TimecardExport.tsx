import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { globalStyles } from '@/styles';

interface Timecard {
  id: string;
  date: string;
  employee: string;
  project: string;
  equipment: string;
  costCode: string;
  workType: string;
  hours: number;
  notes: string;
  status: string;
  approved: boolean;
  approvedBy?: string;
  approvedDate?: string;
  createdBy: string;
  createdDate: string;
}

interface TimecardExportProps {
  timecards: Timecard[];
  selectedDateRange: string;
}

export const TimecardExport: React.FC<TimecardExportProps> = ({
  timecards,
  selectedDateRange
}) => {
  const exportToPDF = () => {
    Alert.alert(
      'Export to PDF',
      `Would you like to export ${timecards.length} timecards for ${selectedDateRange} to PDF?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Export', 
          onPress: () => {
            // TODO: Implement PDF export using react-native-pdf-lib or similar
            Alert.alert('Success', 'PDF export functionality will be implemented here');
          }
        }
      ]
    );
  };

  const exportToExcel = () => {
    Alert.alert(
      'Export to Excel',
      `Would you like to export ${timecards.length} timecards for ${selectedDateRange} to Excel?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Export', 
          onPress: () => {
            // TODO: Implement Excel export using react-native-xlsx or similar
            Alert.alert('Success', 'Excel export functionality will be implemented here');
          }
        }
      ]
    );
  };

  const exportToCSV = () => {
    try {
      // Create CSV content
      const headers = ['Date', 'Employee', 'Project', 'Equipment', 'Cost Code', 'Work Type', 'Hours', 'Notes', 'Status', 'Approved'];
      const csvContent = [
        headers.join(','),
        ...timecards.map(card => [
          card.date,
          `"${card.employee}"`,
          `"${card.project}"`,
          `"${card.equipment}"`,
          `"${card.costCode}"`,
          card.workType,
          card.hours,
          `"${card.notes.replace(/"/g, '""')}"`,
          card.status,
          card.approved ? 'Yes' : 'No'
        ].join(','))
      ].join('\n');

      // For web, create download link
      if (typeof window !== 'undefined') {
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `timecards-${selectedDateRange.replace(/\s+/g, '-')}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        Alert.alert('Success', 'CSV file downloaded successfully');
      } else {
        // For mobile, show the CSV content (could be saved to device storage)
        Alert.alert('CSV Export', 'CSV export functionality will be implemented for mobile devices');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to export CSV file');
    }
  };

  if (timecards.length === 0) {
    return null;
  }

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#007AFF',
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderRadius: 6,
          marginRight: 8
        }}
        onPress={exportToCSV}
      >
        <Text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: '500', marginRight: 4 }}>
          Export
        </Text>
        <Text style={{ color: '#FFFFFF', fontSize: 12 }}>
          ({timecards.length})
        </Text>
      </TouchableOpacity>
    </View>
  );
};
