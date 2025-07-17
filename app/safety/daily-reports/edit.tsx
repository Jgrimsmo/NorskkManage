import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MainLayout } from '@/components/MainLayout';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { globalStyles } from '@/styles';
import { useReportManagement, DailyReport } from '../../../hooks/useReportManagement';

export default function EditReportScreen() {
  const { reportId } = useLocalSearchParams<{ reportId?: string }>();
  const { user } = useAuth();
  const { reports, createReport, updateReport } = useReportManagement();
  
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<Partial<DailyReport>>({
    project: '',
    date: new Date().toISOString().split('T')[0],
    workCompleted: '',
    weatherConditions: '',
    safetyIncidents: '',
    materialsUsed: '',
    nextDayPlan: '',
    workersOnSite: 0,
    selectedCrewMembers: [],
    equipmentUsed: [],
    photos: []
  });

  const isEditing = !!reportId;

  useEffect(() => {
    if (isEditing && reportId) {
      const existingReport = reports.find(r => r.id === reportId);
      if (existingReport) {
        setReport(existingReport);
      }
    }
  }, [isEditing, reportId, reports]);

  const handleSave = async () => {
    if (!report.project || !report.date || !report.workCompleted) {
      Alert.alert('Error', 'Please fill in all required fields (Project, Date, Work Completed)');
      return;
    }

    if (!user) {
      Alert.alert('Error', 'You must be logged in to save reports');
      return;
    }

    setLoading(true);
    try {
      if (isEditing && reportId) {
        await updateReport(reportId, report);
      } else {
        await createReport({
          ...report,
          createdBy: user.uid
        } as Omit<DailyReport, 'id' | 'createdAt' | 'updatedAt'>);
      }
      
      Alert.alert(
        'Success', 
        `Report ${isEditing ? 'updated' : 'created'} successfully`,
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      Alert.alert('Error', `Failed to ${isEditing ? 'update' : 'create'} report: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  const updateField = (field: keyof DailyReport, value: any) => {
    setReport(prev => ({ ...prev, [field]: value }));
  };

  return (
    <MainLayout>
      <View style={[globalStyles.container, { padding: 0, margin: 0 }]}>
        <View style={globalStyles.pageHeader}>
          <Text style={globalStyles.pageTitle}>
            {isEditing ? 'Edit Report' : 'New Daily Report'}
          </Text>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <TouchableOpacity
              style={globalStyles.secondaryButton}
              onPress={handleCancel}
            >
              <Text style={globalStyles.secondaryButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={globalStyles.primaryButton}
              onPress={handleSave}
              disabled={loading}
            >
              <Text style={globalStyles.primaryButtonText}>
                {loading ? 'Saving...' : (isEditing ? 'Update Report' : 'Save Report')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView 
          style={globalStyles.contentContainer} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 50 }}
        >
          <View style={globalStyles.card}>
            <Text style={globalStyles.inputLabel}>Project *</Text>
            <Input
              value={report.project}
              onChangeText={(value: string) => updateField('project', value)}
              placeholder="Enter project name"
            />

            <Text style={globalStyles.inputLabel}>Date *</Text>
            <Input
              value={report.date}
              onChangeText={(value: string) => updateField('date', value)}
              placeholder="YYYY-MM-DD"
            />

            <Text style={globalStyles.inputLabel}>Workers on Site</Text>
            <Input
              value={report.workersOnSite?.toString() || ''}
              onChangeText={(value: string) => updateField('workersOnSite', parseInt(value) || 0)}
              placeholder="0"
              keyboardType="numeric"
            />

            <Text style={globalStyles.inputLabel}>Weather Conditions</Text>
            <Input
              value={report.weatherConditions}
              onChangeText={(value: string) => updateField('weatherConditions', value)}
              placeholder="e.g., Clear, 65°F"
            />

            <Text style={globalStyles.inputLabel}>Work Completed *</Text>
            <Input
              value={report.workCompleted}
              onChangeText={(value: string) => updateField('workCompleted', value)}
              placeholder="Describe the work completed today"
              multiline
              numberOfLines={4}
              style={{ minHeight: 100 }}
            />

            <Text style={globalStyles.inputLabel}>Materials Used</Text>
            <Input
              value={report.materialsUsed}
              onChangeText={(value: string) => updateField('materialsUsed', value)}
              placeholder="List materials and quantities used"
              multiline
              numberOfLines={3}
              style={{ minHeight: 80 }}
            />

            <Text style={globalStyles.inputLabel}>Next Day Plan</Text>
            <Input
              value={report.nextDayPlan}
              onChangeText={(value: string) => updateField('nextDayPlan', value)}
              placeholder="Plan for tomorrow's work"
              multiline
              numberOfLines={3}
              style={{ minHeight: 80 }}
            />

            <Text style={globalStyles.inputLabel}>Safety Incidents</Text>
            <Input
              value={report.safetyIncidents}
              onChangeText={(value: string) => updateField('safetyIncidents', value)}
              placeholder="Describe any safety incidents or note 'None'"
              multiline
              numberOfLines={3}
              style={{ minHeight: 80 }}
            />
          </View>
        </ScrollView>
      </View>
    </MainLayout>
  );
}
