import React from 'react';
import { View, Text } from 'react-native';
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

interface TimecardSummaryProps {
  timecards: Timecard[];
  selectedDateRange: string;
}

export const TimecardSummary: React.FC<TimecardSummaryProps> = ({
  timecards,
  selectedDateRange
}) => {
  // Calculate summary statistics
  const totalHours = timecards.reduce((sum, card) => sum + card.hours, 0);
  const totalCards = timecards.length;
  const approvedCards = timecards.filter(card => card.approved).length;
  const pendingCards = timecards.filter(card => !card.approved && card.status === 'submitted').length;
  const draftCards = timecards.filter(card => card.status === 'draft').length;
  
  // Calculate hours by employee
  const hoursByEmployee = timecards.reduce((acc, card) => {
    acc[card.employee] = (acc[card.employee] || 0) + card.hours;
    return acc;
  }, {} as Record<string, number>);

  // Calculate hours by project
  const hoursByProject = timecards.reduce((acc, card) => {
    acc[card.project] = (acc[card.project] || 0) + card.hours;
    return acc;
  }, {} as Record<string, number>);

  const topEmployees = Object.entries(hoursByEmployee)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3);

  const topProjects = Object.entries(hoursByProject)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3);

  return (
    <View style={globalStyles.card}>
      <Text style={globalStyles.sectionTitle}>Summary - {selectedDateRange}</Text>
      
      <View style={globalStyles.row}>
        <View style={[globalStyles.card, { flex: 1, margin: 4, alignItems: 'center', backgroundColor: '#007AFF', paddingVertical: 16 }]}>
          <Text style={[globalStyles.pageTitle, { color: '#FFFFFF', fontSize: 20 }]}>{totalHours.toFixed(1)}</Text>
          <Text style={[globalStyles.text, { color: '#FFFFFF', fontSize: 12 }]}>Total Hours</Text>
        </View>
        
        <View style={[globalStyles.card, { flex: 1, margin: 4, alignItems: 'center', backgroundColor: '#34C759', paddingVertical: 16 }]}>
          <Text style={[globalStyles.pageTitle, { color: '#FFFFFF', fontSize: 20 }]}>{approvedCards}</Text>
          <Text style={[globalStyles.text, { color: '#FFFFFF', fontSize: 12 }]}>Approved</Text>
        </View>
        
        <View style={[globalStyles.card, { flex: 1, margin: 4, alignItems: 'center', backgroundColor: '#FF9500', paddingVertical: 16 }]}>
          <Text style={[globalStyles.pageTitle, { color: '#FFFFFF', fontSize: 20 }]}>{pendingCards}</Text>
          <Text style={[globalStyles.text, { color: '#FFFFFF', fontSize: 12 }]}>Pending</Text>
        </View>
        
        <View style={[globalStyles.card, { flex: 1, margin: 4, alignItems: 'center', backgroundColor: '#8E8E93', paddingVertical: 16 }]}>
          <Text style={[globalStyles.pageTitle, { color: '#FFFFFF', fontSize: 20 }]}>{draftCards}</Text>
          <Text style={[globalStyles.text, { color: '#FFFFFF', fontSize: 12 }]}>Drafts</Text>
        </View>
      </View>

      {topEmployees.length > 0 && (
        <View style={{ marginTop: 20 }}>
          <Text style={globalStyles.sectionTitle}>Top Employees by Hours</Text>
          {topEmployees.map(([employee, hours], index) => (
            <View key={employee} style={globalStyles.listItem}>
              <Text style={globalStyles.listItemText}>
                {index + 1}. {employee}
              </Text>
              <Text style={globalStyles.textSecondary}>
                {hours.toFixed(1)} hrs
              </Text>
            </View>
          ))}
        </View>
      )}

      {topProjects.length > 0 && (
        <View style={{ marginTop: 20 }}>
          <Text style={globalStyles.sectionTitle}>Top Projects by Hours</Text>
          {topProjects.map(([project, hours], index) => (
            <View key={project} style={globalStyles.listItem}>
              <Text style={globalStyles.listItemText}>
                {index + 1}. {project}
              </Text>
              <Text style={globalStyles.textSecondary}>
                {hours.toFixed(1)} hrs
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};
