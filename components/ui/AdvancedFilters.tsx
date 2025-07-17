import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Input } from './Input';
import { DatePicker } from './DatePicker';
import { globalStyles } from '@/styles';

interface FilterOption {
  field: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'dateRange';
  options?: string[];
  value?: any;
}

interface AdvancedFiltersProps {
  filters: FilterOption[];
  onFiltersChange: (filters: Record<string, any>) => void;
  onReset: () => void;
}

export const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  filters,
  onFiltersChange,
  onReset,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [filterValues, setFilterValues] = useState<Record<string, any>>({});

  const handleFilterChange = (field: string, value: any) => {
    const newFilters = { ...filterValues, [field]: value };
    setFilterValues(newFilters);
  };

  const applyFilters = () => {
    onFiltersChange(filterValues);
    setIsVisible(false);
  };

  const resetFilters = () => {
    setFilterValues({});
    onReset();
    setIsVisible(false);
  };

  const activeFiltersCount = Object.values(filterValues).filter(v => v && v !== '').length;

  const renderFilterInput = (filter: FilterOption) => {
    switch (filter.type) {
      case 'text':
        return (
          <Input
            placeholder={`Enter ${filter.label.toLowerCase()}`}
            value={filterValues[filter.field] || ''}
            onChangeText={(value) => handleFilterChange(filter.field, value)}
          />
        );

      case 'select':
        return (
          <TouchableOpacity
            style={[globalStyles.secondaryButton, { flexDirection: 'row', justifyContent: 'space-between' }]}
            onPress={() => {
              // Implement dropdown logic
            }}
          >
            <Text style={globalStyles.secondaryButtonText}>
              {filterValues[filter.field] || `Select ${filter.label}`}
            </Text>
            <Ionicons name="chevron-down" size={16} color="#666" />
          </TouchableOpacity>
        );

      case 'date':
        return (
          <DatePicker
            value={filterValues[filter.field]}
            onDateChange={(date: Date) => handleFilterChange(filter.field, date)}
            placeholder={`Select ${filter.label.toLowerCase()}`}
          />
        );

      case 'dateRange':
        return (
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <View style={{ flex: 1 }}>
              <DatePicker
                value={filterValues[`${filter.field}_start`]}
                onDateChange={(date: Date) => handleFilterChange(`${filter.field}_start`, date)}
                placeholder="Start date"
              />
            </View>
            <View style={{ flex: 1 }}>
              <DatePicker
                value={filterValues[`${filter.field}_end`]}
                onDateChange={(date: Date) => handleFilterChange(`${filter.field}_end`, date)}
                placeholder="End date"
              />
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View>
      <TouchableOpacity
        style={[
          globalStyles.secondaryButton,
          { 
            flexDirection: 'row', 
            alignItems: 'center', 
            justifyContent: 'center',
            position: 'relative'
          }
        ]}
        onPress={() => setIsVisible(true)}
      >
        <Ionicons name="funnel-outline" size={18} color="#007AFF" style={{ marginRight: 8 }} />
        <Text style={globalStyles.secondaryButtonText}>Advanced Filters</Text>
        {activeFiltersCount > 0 && (
          <View
            style={{
              position: 'absolute',
              top: -8,
              right: -8,
              backgroundColor: '#FF3B30',
              borderRadius: 10,
              width: 20,
              height: 20,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: 'bold' }}>
              {activeFiltersCount}
            </Text>
          </View>
        )}
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setIsVisible(false)}
      >
        <View style={globalStyles.modalContainer}>
          <View style={globalStyles.modalHeader}>
            <TouchableOpacity onPress={() => setIsVisible(false)}>
              <Text style={globalStyles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={globalStyles.modalTitle}>Advanced Filters</Text>
            <TouchableOpacity onPress={resetFilters}>
              <Text style={globalStyles.secondaryButtonText}>Reset</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={globalStyles.modalContent}>
            {filters.map((filter) => (
              <View key={filter.field} style={{ marginBottom: 20 }}>
                <Text style={globalStyles.inputLabel}>{filter.label}</Text>
                {renderFilterInput(filter)}
              </View>
            ))}
          </ScrollView>

          <View style={globalStyles.modalFooter}>
            <TouchableOpacity
              style={globalStyles.primaryButton}
              onPress={applyFilters}
            >
              <Text style={globalStyles.primaryButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};
