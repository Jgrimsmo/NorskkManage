import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { globalStyles } from '@/styles';

interface TableHeaderFilterProps {
  field: string;
  currentValue: string;
  options: string[];
  onFilterChange: (field: string, value: string) => void;
  placeholder?: string;
}

export const TableHeaderFilter: React.FC<TableHeaderFilterProps> = ({
  field,
  currentValue,
  options,
  onFilterChange,
  placeholder = 'All'
}) => {
  const [isActive, setIsActive] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

  // Close dropdown when value changes externally
  useEffect(() => {
    setIsActive(false);
  }, [currentValue]);

  const handleFilterChange = (value: string) => {
    onFilterChange(field, value);
    setIsActive(false);
  };

  const openFilter = (event: any) => {
    // Get the button position for better dropdown placement
    if (event?.nativeEvent) {
      const { pageX, pageY } = event.nativeEvent;
      setDropdownPosition({
        top: pageY + 30,
        left: Math.max(20, pageX - 90) // Ensure it doesn't go off screen
      });
    } else {
      // Fallback positioning
      setDropdownPosition({ top: 120, left: 20 });
    }
    setIsActive(!isActive);
  };

  const getFilterDisplayName = (field: string) => {
    switch (field) {
      case 'date': return 'Dates';
      case 'project': return 'Projects';
      case 'type': return 'Types';
      default: return 'Items';
    }
  };

  const formatOptionText = (value: string, field: string) => {
    if (field === 'date' && value) {
      // Format date as MM/DD/YYYY for better readability
      try {
        return new Date(value).toLocaleDateString();
      } catch {
        return value;
      }
    }
    return value;
  };

  return (
    <View style={{ position: 'relative' }}>
      <TouchableOpacity
        style={{
          marginLeft: 8,
          padding: 4,
          borderRadius: 4,
          backgroundColor: currentValue ? '#007AFF' : '#E5E5EA'
        }}
        onPress={openFilter}
      >
        <Ionicons 
          name="filter" 
          size={12} 
          color={currentValue ? '#FFFFFF' : '#8E8E93'} 
        />
      </TouchableOpacity>
      
      {isActive && (
        <Modal 
          transparent 
          animationType="none" 
          visible={isActive}
          onRequestClose={() => setIsActive(false)}
        >
          <TouchableOpacity 
            style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.1)' }}
            activeOpacity={1}
            onPress={() => setIsActive(false)}
          >
            <View 
              style={{
                position: 'absolute',
                top: dropdownPosition.top,
                left: dropdownPosition.left,
                backgroundColor: '#FFFFFF',
                borderRadius: 8,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 8,
                elevation: 12,
                minWidth: 180,
                maxHeight: 300,
                borderWidth: 1,
                borderColor: '#E5E5EA',
              }}
              onStartShouldSetResponder={() => true}
            >
              <TouchableOpacity
                style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: '#F2F2F7' }}
                onPress={() => handleFilterChange('')}
                activeOpacity={0.7}
              >
                <Text style={{ fontSize: 14, color: '#007AFF', fontWeight: !currentValue ? '600' : 'normal' }}>
                  {placeholder} {getFilterDisplayName(field)}
                </Text>
              </TouchableOpacity>
              <ScrollView style={{ maxHeight: 250 }} showsVerticalScrollIndicator={false}>
                {options.map((value) => (
                  <TouchableOpacity
                    key={String(value)}
                    style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: '#F2F2F7' }}
                    onPress={() => handleFilterChange(value)}
                    activeOpacity={0.7}
                  >
                    <Text style={{ 
                      fontSize: 14, 
                      color: currentValue === value ? '#007AFF' : '#333',
                      fontWeight: currentValue === value ? '600' : 'normal'
                    }}>
                      {formatOptionText(value, field)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </TouchableOpacity>
        </Modal>
      )}
    </View>
  );
};
