import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { MainLayout } from '@/components/MainLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { UniversalTable, TableColumn, TableAction } from '@/components/ui/UniversalTable';
import { Input } from '@/components/ui/Input';
import { globalStyles } from '@/styles';
import { Ionicons } from '@expo/vector-icons';
import { getFirestore, collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

interface Equipment {
  id: string;
  name: string;
  type: string;
  serialNumber: string;
  status: 'Available' | 'In Use' | 'Maintenance' | 'Retired';
  location: string;
  purchaseDate: string;
  purchasePrice: number;
  hoursUsed: number;
  lastMaintenance: string;
  nextMaintenance: string;
  notes: string;
}

export default function EquipmentScreenWithUniversalTable() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Load equipment data
  useEffect(() => {
    const db = getFirestore();
    const unsubscribe = onSnapshot(
      collection(db, 'equipment'),
      (snapshot) => {
        const equipmentData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Equipment[];
        
        equipmentData.sort((a, b) => a.name.localeCompare(b.name));
        setEquipment(equipmentData);
        setLoading(false);
      },
      (error) => {
        console.error('Error loading equipment:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Define table columns using UniversalTable
  const columns: TableColumn[] = [
    {
      key: 'name',
      title: 'Equipment',
      flex: 2,
      sortable: true,
      filterable: true,
      render: (value, row) => (
        <View>
          <Text style={[globalStyles.tableCellText, { fontWeight: '600' }]}>
            {value}
          </Text>
          <Text style={globalStyles.tableSubText}>
            S/N: {row.serialNumber || 'N/A'}
          </Text>
        </View>
      )
    },
    {
      key: 'type',
      title: 'Type',
      flex: 1.5,
      sortable: true,
      filterable: true,
    },
    {
      key: 'status',
      title: 'Status',
      flex: 1,
      sortable: true,
      filterable: true,
      render: (value) => {
        const getStatusColor = (status: string) => {
          switch (status) {
            case 'Available': return '#34C759';
            case 'In Use': return '#007AFF';
            case 'Maintenance': return '#FF9500';
            case 'Retired': return '#8E8E93';
            default: return '#666';
          }
        };

        return (
          <View style={[
            globalStyles.badge,
            { backgroundColor: getStatusColor(value) + '20' }
          ]}>
            <Text style={[
              globalStyles.badgeText,
              { color: getStatusColor(value) }
            ]}>
              {value}
            </Text>
          </View>
        );
      }
    },
    {
      key: 'location',
      title: 'Location',
      flex: 1.5,
      sortable: true,
      filterable: true,
      render: (value) => (
        <Text style={globalStyles.tableCellText}>
          {value || 'Not specified'}
        </Text>
      )
    },
    {
      key: 'hoursUsed',
      title: 'Hours',
      flex: 1,
      sortable: true,
      render: (value) => (
        <Text style={globalStyles.tableCellText}>
          {value.toLocaleString()}
        </Text>
      )
    }
  ];

  // Define table actions
  const actions: TableAction[] = [
    {
      icon: 'pencil',
      label: 'Edit',
      onPress: (row) => {
        Alert.alert('Edit Equipment', `Edit ${row.name}`);
        // TODO: Open edit modal
      },
      color: '#007AFF'
    },
    {
      icon: 'build',
      label: 'Maintenance',
      onPress: (row) => {
        Alert.alert('Schedule Maintenance', `Schedule maintenance for ${row.name}`);
        // TODO: Open maintenance modal
      },
      color: '#FF9500',
      visible: (row) => row.status === 'Available' || row.status === 'In Use'
    },
    {
      icon: 'trash',
      label: 'Delete',
      onPress: (row) => {
        Alert.alert(
          'Delete Equipment',
          `Are you sure you want to delete ${row.name}?`,
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Delete', 
              style: 'destructive',
              onPress: () => handleDelete(row.id)
            }
          ]
        );
      },
      color: '#FF3B30'
    }
  ];

  const handleDelete = async (id: string) => {
    try {
      const db = getFirestore();
      await deleteDoc(doc(db, 'equipment', id));
    } catch (error) {
      console.error('Error deleting equipment:', error);
      Alert.alert('Error', 'Failed to delete equipment');
    }
  };

  // Filter data based on search term
  const filteredData = equipment.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MainLayout>
      <View style={[globalStyles.container, { padding: 0, margin: 0 }]}>
        {/* Header */}
        <PageHeader 
          title="Equipment" 
          icon="construct-outline"
          rightContent={
            <TouchableOpacity
              style={globalStyles.primaryButton}
              onPress={() => Alert.alert('Add Equipment', 'Open add equipment modal')}
            >
              <View style={[globalStyles.row, { alignItems: 'center' }]}>
                <Ionicons name="add" size={20} color="#FFFFFF" style={globalStyles.iconWithMargin} />
                <Text style={globalStyles.primaryButtonText}>Add Equipment</Text>
              </View>
            </TouchableOpacity>
          }
        />

        {/* Content */}
        <View style={{ flex: 1, paddingHorizontal: 20, paddingVertical: 8 }}>
          {/* Search */}
          <View style={globalStyles.controlsContainer}>
            <View style={globalStyles.searchContainer}>
              <Input
                placeholder="Search equipment..."
                value={searchTerm}
                onChangeText={setSearchTerm}
                style={globalStyles.searchInput}
              />
            </View>
          </View>

          {/* Universal Table */}
          <UniversalTable
            data={filteredData}
            columns={columns}
            actions={actions}
            loading={loading}
            sortable={true}
            filterable={true}
            alternateRowColors={true}
            onRowPress={(row) => Alert.alert('Equipment Details', `View details for ${row.name}`)}
            emptyMessage={equipment.length === 0 ? 'No equipment added yet' : 'No equipment found'}
            keyExtractor={(item) => item.id}
          />
        </View>
      </View>
    </MainLayout>
  );
}
