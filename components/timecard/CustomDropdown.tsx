import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList } from 'react-native';
import { globalStyles } from '@/styles';

interface DropdownOption {
  label: string;
  value: string;
}

interface CustomDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: DropdownOption[];
  placeholder: string;
  disabled?: boolean;
}

export const CustomDropdown: React.FC<CustomDropdownProps> = ({ 
  value, 
  onChange, 
  options, 
  placeholder, 
  disabled = false 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View style={{ position: 'relative', width: '100%' }}>
      <TouchableOpacity
        style={[
          globalStyles.input, 
          disabled && { backgroundColor: '#f5f5f5' },
          { paddingVertical: 12 }
        ]}
        onPress={() => !disabled && setIsOpen(true)}
        disabled={disabled}
      >
        <Text style={[
          globalStyles.text,
          !value && { color: '#999', fontStyle: 'italic' }
        ]}>
          {value || placeholder}
        </Text>
      </TouchableOpacity>
      
      <Modal visible={isOpen} transparent animationType="none">
        <TouchableOpacity 
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <View 
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 8,
              maxHeight: 300,
              width: '80%',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 8,
              elevation: 5,
            }}
            onStartShouldSetResponder={() => true}
          >
            <FlatList
              data={[{ label: placeholder, value: '' }, ...options]}
              keyExtractor={(item, index) => `${item.value}-${index}`}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    borderBottomWidth: 1,
                    borderBottomColor: '#f0f0f0',
                  }}
                  onPress={() => {
                    onChange(item.value);
                    setIsOpen(false);
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    globalStyles.text,
                    !item.value && { color: '#999', fontStyle: 'italic' }
                  ]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};
