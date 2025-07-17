import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { globalStyles } from '@/styles';
import { CustomDropdown } from './CustomDropdown';

interface FiltersProps {
  filters: {
    date: string;
    employee: string;
    project: string;
    equipment: string;
    costCode: string;
    workType: string;
    status: string;
  };
  onFiltersChange: (filters: any) => void;
  uniqueValues: {
    employee: string[];
    project: string[];
    equipment: string[];
    costCode: string[];
    workType: string[];
  };
}

export const AdvancedFilters: React.FC<FiltersProps> = ({
  filters,
  onFiltersChange,
  uniqueValues
}) => {
  const handleFilterChange = (field: string, value: string) => {
    onFiltersChange({ ...filters, [field]: value });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      date: '',
      employee: '',
      project: '',
      equipment: '',
      costCode: '',
      workType: '',
      status: ''
    });
  };

  return (
    <View style={{ marginVertical: 16 }}>
      <Text style={[globalStyles.text, { fontSize: 16, fontWeight: '600', marginBottom: 12, color: '#333' }]}>
        Filters:
      </Text>
      
      {/* First Row of Filters */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 8, gap: 8 }}>
        <View style={{ flex: 1 }}>
          <Text style={[globalStyles.text, { fontSize: 12, fontWeight: '500', marginBottom: 4, color: '#666' }]}>
            Employee:
          </Text>
          <CustomDropdown
            value={filters.employee}
            onChange={(value) => handleFilterChange('employee', value)}
            options={uniqueValues.employee.map(emp => ({ label: emp, value: emp }))}
            placeholder="All Employees"
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[globalStyles.text, { fontSize: 12, fontWeight: '500', marginBottom: 4, color: '#666' }]}>
            Project:
          </Text>
          <CustomDropdown
            value={filters.project}
            onChange={(value) => handleFilterChange('project', value)}
            options={uniqueValues.project.map(proj => ({ label: proj, value: proj }))}
            placeholder="All Projects"
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[globalStyles.text, { fontSize: 12, fontWeight: '500', marginBottom: 4, color: '#666' }]}>
            Status:
          </Text>
          <CustomDropdown
            value={filters.status}
            onChange={(value) => handleFilterChange('status', value)}
            options={[
              { label: 'Approved', value: 'Approved' },
              { label: 'Pending', value: 'Pending' },
              { label: 'Needs Review', value: 'Needs Review' }
            ]}
            placeholder="All Statuses"
          />
        </View>
      </View>

      {/* Second Row of Filters */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 8, gap: 8 }}>
        <View style={{ flex: 1 }}>
          <Text style={[globalStyles.text, { fontSize: 12, fontWeight: '500', marginBottom: 4, color: '#666' }]}>
            Equipment:
          </Text>
          <CustomDropdown
            value={filters.equipment}
            onChange={(value) => handleFilterChange('equipment', value)}
            options={uniqueValues.equipment.map(eq => ({ label: eq, value: eq }))}
            placeholder="All Equipment"
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[globalStyles.text, { fontSize: 12, fontWeight: '500', marginBottom: 4, color: '#666' }]}>
            Cost Code:
          </Text>
          <CustomDropdown
            value={filters.costCode}
            onChange={(value) => handleFilterChange('costCode', value)}
            options={uniqueValues.costCode.map(code => ({ label: code, value: code }))}
            placeholder="All Cost Codes"
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[globalStyles.text, { fontSize: 12, fontWeight: '500', marginBottom: 4, color: '#666' }]}>
            Work Type:
          </Text>
          <CustomDropdown
            value={filters.workType}
            onChange={(value) => handleFilterChange('workType', value)}
            options={uniqueValues.workType.map(type => ({ label: type, value: type }))}
            placeholder="All Work Types"
          />
        </View>
      </View>

      {/* Clear Filters Button */}
      <TouchableOpacity
        style={{
          backgroundColor: '#6c757d',
          paddingHorizontal: 16,
          paddingVertical: 8,
          borderRadius: 6,
          alignSelf: 'center',
          marginTop: 12,
        }}
        onPress={clearAllFilters}
      >
        <Text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: '500' }}>
          Clear All Filters
        </Text>
      </TouchableOpacity>
    </View>
  );
};
