import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { globalStyles } from '@/styles';

interface ConfirmDeleteModalProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  visible,
  onCancel,
  onConfirm,
  title = "Delete Entry",
  message = "Are you sure you want to delete this item? This action cannot be undone."
}) => {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={{
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
      }}>
        <View style={[globalStyles.card, {
          backgroundColor: '#FFFFFF',
          minWidth: 300,
          maxWidth: 400,
          padding: 24,
          borderRadius: 12,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.25,
          shadowRadius: 8,
          elevation: 8
        }]}>
          {/* Title */}
          <Text style={[globalStyles.cardTitle, {
            fontSize: 18,
            fontWeight: '600',
            marginBottom: 12,
            textAlign: 'center',
            color: '#DC3545'
          }]}>
            {title}
          </Text>
          
          {/* Message */}
          <Text style={[globalStyles.text, {
            fontSize: 14,
            lineHeight: 20,
            marginBottom: 24,
            textAlign: 'center',
            color: '#6C757D'
          }]}>
            {message}
          </Text>
          
          {/* Buttons */}
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            gap: 12
          }}>
            <TouchableOpacity
              style={[globalStyles.secondaryButton, {
                flex: 1,
                backgroundColor: '#6C757D',
                borderColor: '#6C757D'
              }]}
              onPress={onCancel}
            >
              <Text style={[globalStyles.secondaryButtonText, {
                color: '#FFFFFF'
              }]}>
                Cancel
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[globalStyles.secondaryButton, {
                flex: 1,
                backgroundColor: '#DC3545',
                borderColor: '#DC3545'
              }]}
              onPress={onConfirm}
            >
              <Text style={[globalStyles.secondaryButtonText, {
                color: '#FFFFFF'
              }]}>
                Delete
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
