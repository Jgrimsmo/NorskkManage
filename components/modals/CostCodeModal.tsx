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
import { CostCode, CreateCostCodeData } from '@/services/projectContentService';

interface CostCodeModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: CreateCostCodeData) => Promise<void>;
  costCode?: CostCode | null;
  projectId: string;
}

const costCodeCategories = [
  'Labor',
  'Materials', 
  'Equipment',
  'Subcontractors',
  'Overhead',
  'Other'
];

export const CostCodeModal: React.FC<CostCodeModalProps> = ({
  visible,
  onClose,
  onSave,
  costCode,
  projectId
}) => {
  const [formData, setFormData] = useState<CreateCostCodeData>({
    code: '',
    description: '',
    category: 'Labor',
    projectId
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (costCode) {
      setFormData({
        code: costCode.code,
        description: costCode.description,
        category: costCode.category,
        projectId: costCode.projectId
      });
    } else {
      setFormData({
        code: '',
        description: '',
        category: 'Labor',
        projectId
      });
    }
  }, [costCode, projectId]);

  const handleSave = async () => {
    if (!formData.code.trim() || !formData.description.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving cost code:', error);
      Alert.alert('Error', 'Failed to save cost code');
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
              {costCode ? 'Edit Cost Code' : 'Add Cost Code'}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={colors.gray} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={globalStyles.inputLabel}>Code *</Text>
            <TextInput
              style={globalStyles.input}
              value={formData.code}
              onChangeText={(text) => setFormData({ ...formData, code: text })}
              placeholder="e.g., LAB-001"
              autoCapitalize="characters"
            />

            <Text style={globalStyles.inputLabel}>Description *</Text>
            <TextInput
              style={[globalStyles.input, { height: 80 }]}
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
              placeholder="Description of the cost code"
              multiline
              textAlignVertical="top"
            />

            <Text style={globalStyles.inputLabel}>Category</Text>
            <View style={globalStyles.pickerContainer}>
              <Picker
                selectedValue={formData.category}
                onValueChange={(value: string) => setFormData({ ...formData, category: value })}
                style={globalStyles.picker}
              >
                {costCodeCategories.map((category) => (
                  <PickerItem key={category} label={category} value={category} />
                ))}
              </Picker>
            </View>
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
                  {costCode ? 'Update' : 'Add Cost Code'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
