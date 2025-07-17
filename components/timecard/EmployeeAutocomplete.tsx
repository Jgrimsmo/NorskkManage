import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, FlatList } from 'react-native';
import { globalStyles } from '@/styles';

interface CrewMember {
  id: string;
  name: string;
  role: string;
  phone?: string;
}

interface EmployeeAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  crew: CrewMember[];
  disabled?: boolean;
}

export const EmployeeAutocomplete: React.FC<EmployeeAutocompleteProps> = ({ 
  value, 
  onChange, 
  crew, 
  disabled = false 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value || '');
  const [filteredCrew, setFilteredCrew] = useState<CrewMember[]>([]);

  useEffect(() => {
    setInputValue(value || '');
  }, [value]);

  useEffect(() => {
    // Filter crew based on input value
    if (inputValue.length === 0) {
      setFilteredCrew(crew);
    } else {
      const filtered = crew.filter(member =>
        member.name.toLowerCase().includes(inputValue.toLowerCase())
      );
      setFilteredCrew(filtered);
    }
  }, [inputValue, crew]);

  const handleInputChange = (text: string) => {
    setInputValue(text);
    onChange(text);
    if (!isOpen && crew.length > 0) {
      setIsOpen(true);
    }
  };

  const handleSelectEmployee = (employeeName: string) => {
    setInputValue(employeeName);
    onChange(employeeName);
    setIsOpen(false);
  };

  const handleFocus = () => {
    if (!disabled && crew.length > 0) {
      setIsOpen(true);
    }
  };

  const handleBlur = () => {
    // Delay closing to allow for selection
    setTimeout(() => setIsOpen(false), 200);
  };

  return (
    <View style={{ width: '100%', zIndex: 10000, marginBottom: isOpen ? 150 : 0 }}>
      <TextInput
        style={[globalStyles.input, disabled && { backgroundColor: '#f5f5f5', color: '#999' }]}
        value={inputValue}
        onChangeText={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder="Start typing employee name..."
        editable={!disabled}
      />
      
      {isOpen && filteredCrew.length > 0 && (
        <View style={{
          position: 'absolute',
          top: 50, // Fixed position below input
          left: 0,
          right: 0,
          backgroundColor: '#FFFFFF',
          borderRadius: 8,
          borderWidth: 1,
          borderColor: '#E5E5EA',
          maxHeight: 150, // Reduced from 200 to 150
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.25,
          shadowRadius: 12,
          elevation: 999,
          zIndex: 10001,
        }}>
          <FlatList
            data={filteredCrew}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  borderBottomWidth: index < filteredCrew.length - 1 ? 1 : 0,
                  borderBottomColor: '#f0f0f0',
                  backgroundColor: '#FFFFFF',
                }}
                onPress={() => handleSelectEmployee(item.name)}
                activeOpacity={0.7}
              >
                <Text style={[globalStyles.text, { fontWeight: '500' }]}>{item.name}</Text>
                <Text style={[globalStyles.text, { fontSize: 12, color: '#666', marginTop: 2 }]}>{item.role}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
};
