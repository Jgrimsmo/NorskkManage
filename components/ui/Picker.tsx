import React from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, Platform } from 'react-native';
import { globalStyles, colors } from '@/styles';
import './Picker.css';

interface PickerProps {
  selectedValue: string;
  onValueChange: (value: string) => void;
  children: React.ReactElement[];
  style?: any;
  enabled?: boolean;
}

interface PickerItemProps {
  label: string;
  value: string;
}

export const PickerItem: React.FC<PickerItemProps> = ({ label, value }) => {
  return null; // This is just for type checking, actual rendering is handled by Picker
};

export const Picker: React.FC<PickerProps> = ({
  selectedValue,
  onValueChange,
  children,
  style,
  enabled = true
}) => {
  const [modalVisible, setModalVisible] = React.useState(false);

  // Extract options from children
  const options = React.Children.map(children, (child) => {
    const props = child.props as PickerItemProps;
    return {
      label: props.label,
      value: props.value
    };
  }) || [];

  const selectedLabel = options.find(option => option.value === selectedValue)?.label || selectedValue;

  if (Platform.OS === 'web') {
    return (
      <select
        value={selectedValue}
        onChange={(e) => onValueChange(e.target.value)}
        className="picker-select"
        disabled={!enabled}
        aria-label="Select option"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }

  return (
    <>
      <TouchableOpacity
        style={[
          globalStyles.formInput,
          {
            justifyContent: 'center',
            backgroundColor: enabled ? 'white' : '#f5f5f5',
          },
          style
        ]}
        onPress={() => enabled && setModalVisible(true)}
        disabled={!enabled}
      >
        <Text style={{
          color: enabled ? colors.text : colors.gray,
          fontSize: 16
        }}>
          {selectedLabel}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={globalStyles.modalContainer}>
          <View style={globalStyles.modalHeader}>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={globalStyles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={globalStyles.modalTitle}>Select Option</Text>
            <View style={{ width: 60 }} />
          </View>

          <ScrollView style={globalStyles.modalContent}>
            {options.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  globalStyles.listItem,
                  selectedValue === option.value && {
                    backgroundColor: colors.light
                  }
                ]}
                onPress={() => {
                  onValueChange(option.value);
                  setModalVisible(false);
                }}
              >
                <Text style={[
                  globalStyles.listItemText,
                  selectedValue === option.value && {
                    color: colors.primary,
                    fontWeight: '600'
                  }
                ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Modal>
    </>
  );
};
