import React, { useState, useEffect } from 'react';
import { View, Text, Modal, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { globalStyles } from '@/styles';
import { Input } from '@/components/ui/Input';
import { EmployeeAutocomplete } from './EmployeeAutocomplete';
import { ProjectDropdown, EquipmentDropdown, CostCodeDropdown, WorkTypeDropdown } from './SpecializedDropdowns';

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

interface Project {
  id: string;
  name: string;
  costCodes: string[];
}

interface CrewMember {
  id: string;
  name: string;
  role: string;
  phone?: string;
}

interface Equipment {
  id: string;
  name: string;
  type: string;
}

interface TimecardFormModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (timecard: Partial<Timecard>) => void;
  editingTimecard: Timecard | null;
  projects: Project[];
  crew: CrewMember[];
  equipment: Equipment[];
  costCodes: string[];
  workTypes: string[];
}

export const TimecardFormModal: React.FC<TimecardFormModalProps> = ({
  visible,
  onClose,
  onSave,
  editingTimecard,
  projects,
  crew,
  equipment,
  costCodes,
  workTypes
}) => {
  const [formData, setFormData] = useState<Partial<Timecard>>({
    date: new Date().toISOString().split('T')[0],
    employee: '',
    project: '',
    equipment: '',
    costCode: '',
    workType: 'T&M',
    hours: 0,
    notes: '',
    status: 'draft'
  });

  // Get cost codes for the selected project
  const getAvailableCostCodes = () => {
    if (!formData.project) return costCodes; // fallback to default
    const selectedProject = projects.find(p => p.name === formData.project);
    if (selectedProject && selectedProject.costCodes.length > 0) {
      return selectedProject.costCodes;
    }
    return costCodes; // fallback to default
  };

  useEffect(() => {
    if (editingTimecard) {
      setFormData(editingTimecard);
    } else {
      setFormData({
        date: new Date().toISOString().split('T')[0],
        employee: '',
        project: '',
        equipment: '',
        costCode: '',
        workType: 'T&M',
        hours: 0,
        notes: '',
        status: 'draft'
      });
    }
  }, [editingTimecard, visible]);

  const handleSave = () => {
    // Validation
    if (!formData.employee || !formData.project || !formData.hours) {
      Alert.alert('Error', 'Please fill in all required fields (Employee, Project, Hours)');
      return;
    }

    if (formData.hours <= 0 || formData.hours > 24) {
      Alert.alert('Error', 'Hours must be between 0.1 and 24');
      return;
    }

    onSave(formData);
    onClose();
  };

  const handleCancel = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      employee: '',
      project: '',
      equipment: '',
      costCode: '',
      workType: 'T&M',
      hours: 0,
      notes: '',
      status: 'draft'
    });
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={globalStyles.container}>
        <View style={globalStyles.pageHeader}>
          <Text style={globalStyles.pageTitle}>
            {editingTimecard ? 'Edit Timecard' : 'Add Timecard'}
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
            >
              <Text style={globalStyles.primaryButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView 
          style={globalStyles.contentContainer} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 150 }}
          keyboardShouldPersistTaps="handled"
          nestedScrollEnabled={false}
        >
          <View style={globalStyles.card}>
            <Text style={globalStyles.sectionTitle}>Timecard Details</Text>
            
            <View style={globalStyles.row}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={globalStyles.formLabel}>Date *</Text>
                <Input
                  value={formData.date}
                  onChangeText={(text) => setFormData({ ...formData, date: text })}
                  placeholder="YYYY-MM-DD"
                />
              </View>
              
              <View style={{ flex: 1, marginLeft: 8 }}>
                <Text style={globalStyles.formLabel}>Hours *</Text>
                <Input
                  value={formData.hours?.toString() || ''}
                  onChangeText={(text) => setFormData({ ...formData, hours: parseFloat(text) || 0 })}
                  placeholder="8.0"
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={globalStyles.formGroup}>
              <Text style={globalStyles.formLabel}>Employee *</Text>
              <EmployeeAutocomplete
                crew={crew}
                value={formData.employee || ''}
                onChange={(employee) => setFormData({ ...formData, employee })}
              />
            </View>

            <View style={globalStyles.formGroup}>
              <Text style={globalStyles.formLabel}>Project *</Text>
              <ProjectDropdown
                projects={projects}
                value={formData.project || ''}
                onChange={(project) => setFormData({ ...formData, project, costCode: '' })}
              />
            </View>

            <View style={globalStyles.row}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={globalStyles.formLabel}>Equipment</Text>
                <EquipmentDropdown
                  equipment={equipment}
                  value={formData.equipment || ''}
                  onChange={(equipment) => setFormData({ ...formData, equipment })}
                />
              </View>
              
              <View style={{ flex: 1, marginLeft: 8 }}>
                <Text style={globalStyles.formLabel}>Work Type</Text>
                <WorkTypeDropdown
                  workTypes={workTypes}
                  value={formData.workType || 'T&M'}
                  onChange={(workType) => setFormData({ ...formData, workType })}
                />
              </View>
            </View>

            <View style={globalStyles.formGroup}>
              <Text style={globalStyles.formLabel}>Cost Code</Text>
              <CostCodeDropdown
                costCodes={getAvailableCostCodes()}
                value={formData.costCode || ''}
                onChange={(costCode) => setFormData({ ...formData, costCode })}
              />
            </View>

            <View style={globalStyles.formGroup}>
              <Text style={globalStyles.formLabel}>Notes</Text>
              <Input
                value={formData.notes}
                onChangeText={(text) => setFormData({ ...formData, notes: text })}
                placeholder="Additional notes..."
                multiline
                numberOfLines={3}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};
