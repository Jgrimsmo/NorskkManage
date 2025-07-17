// Example usage of UniversalTable component

import React, { useState, useEffect } from 'react';
import { View, Text, Alert } from 'react-native';
import { UniversalTable, TableColumn, TableAction } from '@/components/ui/UniversalTable';
import { globalStyles } from '@/styles';

// Example: Equipment Management Table
interface Equipment {
  id: string;
  name: string;
  type: string;
  status: 'Active' | 'Maintenance' | 'Retired';
  hours: number;
  location: string;
}

export const EquipmentTableExample = () => {
  const [equipment, setEquipment] = useState<Equipment[]>([
    { id: '1', name: 'CAT 320', type: 'Excavator', status: 'Active', hours: 1234, location: 'Site A' },
    { id: '2', name: 'Bobcat S650', type: 'Skid Steer', status: 'Maintenance', hours: 567, location: 'Shop' },
    { id: '3', name: 'Plate Compactor', type: 'Compactor', status: 'Active', hours: 89, location: 'Site B' },
  ]);

  // Define table columns
  const columns: TableColumn[] = [
    {
      key: 'name',
      title: 'Equipment',
      flex: 2,
      sortable: true,
      filterable: true,
      render: (value, row) => (
        <View>
          <Text style={[globalStyles.tableCellText, { fontWeight: '600' }]}>{value}</Text>
          <Text style={globalStyles.tableSubText}>Type: {row.type}</Text>
        </View>
      )
    },
    {
      key: 'status',
      title: 'Status',
      flex: 1,
      sortable: true,
      filterable: true,
      render: (value) => (
        <View style={[
          globalStyles.statusBadge,
          value === 'Active' ? globalStyles.statusCompleted : 
          value === 'Maintenance' ? globalStyles.statusUpcoming :
          globalStyles.statusDelayed
        ]}>
          <Text style={globalStyles.statusText}>{value}</Text>
        </View>
      )
    },
    {
      key: 'hours',
      title: 'Hours',
      flex: 1,
      sortable: true,
      render: (value) => (
        <Text style={globalStyles.tableCellText}>{value.toLocaleString()}</Text>
      )
    },
    {
      key: 'location',
      title: 'Location',
      flex: 1.5,
      sortable: true,
      filterable: true,
    }
  ];

  // Define table actions
  const actions: TableAction[] = [
    {
      icon: 'pencil',
      label: 'Edit',
      onPress: (row) => Alert.alert('Edit', `Edit ${row.name}`),
      color: '#007AFF'
    },
    {
      icon: 'build',
      label: 'Maintenance',
      onPress: (row) => Alert.alert('Maintenance', `Schedule maintenance for ${row.name}`),
      color: '#FF9500',
      visible: (row) => row.status === 'Active'
    },
    {
      icon: 'trash',
      label: 'Delete',
      onPress: (row) => Alert.alert('Delete', `Delete ${row.name}?`),
      color: '#FF3B30'
    }
  ];

  return (
    <View style={globalStyles.container}>
      <UniversalTable
        data={equipment}
        columns={columns}
        actions={actions}
        sortable={true}
        filterable={true}
        searchable={true}
        alternateRowColors={true}
        onRowPress={(row) => Alert.alert('Row Pressed', `Selected: ${row.name}`)}
        emptyMessage="No equipment found"
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

// Example: Employee Table
interface Employee {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  status: 'Active' | 'Inactive';
  hireDate: string;
}

export const EmployeeTableExample = () => {
  const columns: TableColumn[] = [
    {
      key: 'name',
      title: 'Employee',
      flex: 2,
      sortable: true,
      filterable: true,
      render: (value, row) => (
        <View>
          <Text style={[globalStyles.tableCellText, { fontWeight: '600' }]}>{value}</Text>
          <Text style={globalStyles.tableSubText}>{row.email}</Text>
        </View>
      )
    },
    {
      key: 'role',
      title: 'Role',
      flex: 1.5,
      sortable: true,
      filterable: true,
    },
    {
      key: 'phone',
      title: 'Phone',
      flex: 1.5,
      render: (value) => (
        <Text style={globalStyles.tableCellText}>{value || 'N/A'}</Text>
      )
    },
    {
      key: 'status',
      title: 'Status',
      flex: 1,
      sortable: true,
      filterable: true,
      render: (value) => (
        <View style={[
          globalStyles.statusBadge,
          value === 'Active' ? globalStyles.statusCompleted : globalStyles.statusDelayed
        ]}>
          <Text style={globalStyles.statusText}>{value}</Text>
        </View>
      )
    }
  ];

  const actions: TableAction[] = [
    {
      icon: 'pencil',
      label: 'Edit',
      onPress: (row) => Alert.alert('Edit', `Edit ${row.name}`),
    },
    {
      icon: 'call',
      label: 'Call',
      onPress: (row) => Alert.alert('Call', `Call ${row.phone}`),
      color: '#34C759',
      visible: (row) => !!row.phone
    }
  ];

  // Mock data
  const employees: Employee[] = [
    { id: '1', name: 'John Doe', role: 'Foreman', email: 'john@example.com', phone: '555-0123', status: 'Active', hireDate: '2023-01-15' },
    { id: '2', name: 'Jane Smith', role: 'Operator', email: 'jane@example.com', phone: '555-0124', status: 'Active', hireDate: '2023-03-20' },
  ];

  return (
    <UniversalTable
      data={employees}
      columns={columns}
      actions={actions}
      sortable={true}
      filterable={true}
      alternateRowColors={true}
      emptyMessage="No employees found"
    />
  );
};

// Example: Simple Data Table (No Actions)
interface ProjectSummary {
  name: string;
  status: string;
  budget: number;
  completion: number;
}

export const ProjectSummaryTable = () => {
  const columns: TableColumn[] = [
    { key: 'name', title: 'Project', flex: 2, sortable: true },
    { 
      key: 'status', 
      title: 'Status', 
      flex: 1, 
      sortable: true,
      render: (value) => (
        <Text style={[globalStyles.tableCellText, { 
          color: value === 'Complete' ? '#34C759' : 
                 value === 'In Progress' ? '#FF9500' : '#666'
        }]}>
          {value}
        </Text>
      )
    },
    { 
      key: 'budget', 
      title: 'Budget', 
      flex: 1, 
      sortable: true,
      render: (value) => (
        <Text style={globalStyles.tableCellText}>
          ${value.toLocaleString()}
        </Text>
      )
    },
    { 
      key: 'completion', 
      title: 'Progress', 
      flex: 1, 
      render: (value) => (
        <Text style={globalStyles.tableCellText}>{value}%</Text>
      )
    }
  ];

  const projects: ProjectSummary[] = [
    { name: 'Downtown Plaza', status: 'In Progress', budget: 250000, completion: 75 },
    { name: 'Highway Bridge', status: 'Complete', budget: 180000, completion: 100 },
    { name: 'Shopping Center', status: 'Planning', budget: 420000, completion: 15 },
  ];

  return (
    <UniversalTable
      data={projects}
      columns={columns}
      sortable={true}
      alternateRowColors={true}
      emptyMessage="No projects found"
    />
  );
};

export default {
  EquipmentTableExample,
  EmployeeTableExample,
  ProjectSummaryTable
};
