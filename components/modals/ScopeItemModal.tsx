import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { globalStyles, colors } from '@/styles';
import { Picker, PickerItem } from '@/components/ui/Picker';
import { ScopeItem, CreateScopeItemData } from '@/services/projectContentService';

interface ScopeItemModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: CreateScopeItemData) => Promise<void>;
  scopeItem?: ScopeItem | null;
  projectId: string;
}

const scopeStatuses: ('Not Started' | 'In Progress' | 'Completed')[] = [
  'Not Started',
  'In Progress',
  'Completed'
];

export const ScopeItemModal: React.FC<ScopeItemModalProps> = ({
  visible,
  onClose,
  onSave,
  scopeItem,
  projectId
}) => {
  const [formData, setFormData] = useState<CreateScopeItemData>({
    name: '',
    description: '',
    status: 'Not Started',
    progress: 0,
    projectId
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (scopeItem) {
      setFormData({
        name: scopeItem.name,
        description: scopeItem.description,
        status: scopeItem.status,
        progress: scopeItem.progress,
        projectId: scopeItem.projectId
      });
    } else {
      setFormData({
        name: '',
        description: '',
        status: 'Not Started',
        progress: 0,
        projectId
      });
    }
  }, [scopeItem, projectId]);

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.description.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving scope item:', error);
      Alert.alert('Error', 'Failed to save scope item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={globalStyles.modalOverlay}>
        <View style={globalStyles.modalContent}>
          <View style={globalStyles.modalHeader}>
            <Text style={globalStyles.modalTitle}>
              {scopeItem ? 'Edit Scope Item' : 'Add Scope Item'}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={colors.gray} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={globalStyles.inputLabel}>Name *</Text>
            <TextInput
              style={globalStyles.input}
              value={formData.name}
              onChangeText={(text: string) => setFormData({ ...formData, name: text })}
              placeholder="Scope item name"
            />

            <Text style={globalStyles.inputLabel}>Description *</Text>
            <TextInput
              style={[globalStyles.input, { height: 80 }]}
              value={formData.description}
              onChangeText={(text: string) => setFormData({ ...formData, description: text })}
              placeholder="Description of the scope item"
              multiline
              textAlignVertical="top"
            />

            <Text style={globalStyles.inputLabel}>Status</Text>
            <View style={globalStyles.pickerContainer}>
              <Picker
                selectedValue={formData.status}
                onValueChange={(value: string) => setFormData({ ...formData, status: value as 'Not Started' | 'In Progress' | 'Completed' })}
                style={globalStyles.picker}
              >
                {scopeStatuses.map((status) => (
                  <PickerItem key={status} label={status} value={status} />
                ))}
              </Picker>
            </View>

            <Text style={globalStyles.inputLabel}>Progress (%)</Text>
            <TextInput
              style={globalStyles.input}
              value={formData.progress.toString()}
              onChangeText={(text: string) => {
                const progress = parseInt(text) || 0;
                setFormData({ ...formData, progress: Math.min(100, Math.max(0, progress)) });
              }}
              placeholder="0"
              keyboardType="numeric"
            />
          </ScrollView>

          <View style={globalStyles.modalFooter}>
            <TouchableOpacity 
              style={globalStyles.secondaryButton}
              onPress={onClose}
            >
              <Text style={globalStyles.secondaryButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[globalStyles.primaryButton, loading && { opacity: 0.7 }]}
              onPress={handleSave}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={globalStyles.primaryButtonText}>
                  {scopeItem ? 'Update' : 'Add Scope Item'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};