import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MainLayout } from '@/components/MainLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { UniversalTable, TableColumn, TableAction } from '@/components/ui/UniversalTable';
import { globalStyles, colors } from '@/styles';
import { getFirestore, collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';

// Equipment types
const EQUIPMENT_TYPES = [
  'Excavator',
  'Bulldozer',
  'Loader',
  'Dump Truck',
  'Crane',
  'Compactor',
  'Generator',
  'Welder',
  'Air Compressor',
  'Concrete Mixer',
  'Scaffolding',
  'Pump',
  'Other'
];

// Equipment status options
const EQUIPMENT_STATUS = [
  'Available',
  'In Use',
  'Maintenance',
  'Out of Service',
  'Rented Out'
];

interface Equipment {
  id: string;
  name: string;
  type: string;
  serialNumber: string;
  status: string;
  location: string;
  purchaseDate: string;
  purchasePrice: number;
  hoursUsed: number;
  lastMaintenance: string;
  nextMaintenance: string;
  notes: string;
  createdAt: any;
  updatedAt: any;
}

export default function EquipmentScreen() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [filteredEquipment, setFilteredEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: ''
  });
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    serialNumber: '',
    status: 'Available',
    location: '',
    purchaseDate: '',
    purchasePrice: '',
    hoursUsed: '0',
    lastMaintenance: '',
    nextMaintenance: '',
    notes: ''
  });

  // Table configuration for UniversalTable
  const [editingCell, setEditingCell] = useState<{id: string, field: string} | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleCellEdit = (item: Equipment, field: string, value: any) => {
    // Update the equipment item in the state immediately for better UX
    setEquipment(prev => prev.map(eq => 
      eq.id === item.id ? { ...eq, [field]: value } : eq
    ));
    
    // Update in Firebase
    updateEquipmentField(item.id, field, value);
  };

  const updateEquipmentField = async (id: string, field: string, value: any) => {
    try {
      await updateDoc(doc(db, 'equipment', id), {
        [field]: value,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating equipment:', error);
      Alert.alert('Error', 'Failed to update equipment');
    }
  };

  const renderEditableCell = (value: any, item: Equipment, field: string, isNumeric = false) => {
    const isEditing = editingCell?.id === item.id && editingCell?.field === field;
    
    if (isEditing) {
      return (
        <Input
          value={editValue}
          onChangeText={setEditValue}
          onBlur={() => {
            const finalValue = isNumeric ? (parseFloat(editValue) || 0) : editValue;
            handleCellEdit(item, field, finalValue);
            setEditingCell(null);
          }}
          onSubmitEditing={() => {
            const finalValue = isNumeric ? (parseFloat(editValue) || 0) : editValue;
            handleCellEdit(item, field, finalValue);
            setEditingCell(null);
          }}
          autoFocus
          keyboardType={isNumeric ? "numeric" : "default"}
          style={{ 
            fontSize: 14, 
            padding: 4, 
            backgroundColor: '#f0f8ff',
            borderRadius: 4,
            minHeight: 32
          }}
        />
      );
    }

    return (
      <TouchableOpacity
        onPress={() => {
          setEditingCell({ id: item.id, field });
          setEditValue(String(value || ''));
        }}
        style={{ flex: 1, minHeight: 32, justifyContent: 'center' }}
      >
        <Text style={[globalStyles.tableCellText, { color: '#007AFF' }]}>
          {isNumeric ? value.toLocaleString() : (value || 'Tap to edit')}
        </Text>
      </TouchableOpacity>
    );
  };

  const tableColumns: TableColumn[] = [
    {
      key: 'name',
      title: 'Equipment',
      flex: 2,
      sortable: true,
      filterable: true,
      render: (value, row) => (
        <View>
          <Text style={[globalStyles.tableCellText, { fontWeight: '600' }]}>{value}</Text>
          <Text style={globalStyles.tableSubText}>S/N: {row.serialNumber || 'N/A'}</Text>
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
      render: (value) => (
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
      )
    },
    {
      key: 'location',
      title: 'Location',
      flex: 1.5,
      sortable: true,
      filterable: true,
      render: (value, row) => renderEditableCell(value, row, 'location')
    },
    {
      key: 'hoursUsed',
      title: 'Hours',
      flex: 1,
      sortable: true,
      render: (value, row) => renderEditableCell(value, row, 'hoursUsed', true)
    }
  ];

  const tableActions: TableAction[] = [
    {
      icon: 'eye',
      label: 'View Details',
      onPress: (row) => openModal(row),
      color: '#6B7280'
    },
    {
      icon: 'pencil',
      label: 'Quick Edit',
      onPress: (row) => openModal(row),
      color: '#007AFF'
    },
    {
      icon: 'build',
      label: 'Maintenance',
      onPress: (row) => {
        Alert.alert(
          'Schedule Maintenance',
          `Schedule maintenance for ${row.name}?`,
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Schedule', 
              onPress: () => {
                // TODO: Open maintenance scheduling modal
                Alert.alert('Success', 'Maintenance scheduled (feature coming soon)');
              }
            }
          ]
        );
      },
      color: '#FF9500',
      visible: (row) => row.status === 'Available' || row.status === 'In Use'
    },
    {
      icon: 'trash',
      label: 'Delete',
      onPress: (row) => handleDelete(row),
      color: '#FF3B30'
    }
  ];

  // Load equipment from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'equipment'),
      (snapshot) => {
        const equipmentData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Equipment[];
        
        // Sort by name
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

  // Apply filters
  useEffect(() => {
    let filtered = equipment;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filter
    if (filters.type) {
      filtered = filtered.filter(item => item.type === filters.type);
    }

    setFilteredEquipment(filtered);
  }, [equipment, searchTerm, filters]);

  const openModal = (equipmentItem?: Equipment) => {
    if (equipmentItem) {
      setEditingEquipment(equipmentItem);
      setFormData({
        name: equipmentItem.name,
        type: equipmentItem.type,
        serialNumber: equipmentItem.serialNumber,
        status: equipmentItem.status,
        location: equipmentItem.location,
        purchaseDate: equipmentItem.purchaseDate,
        purchasePrice: equipmentItem.purchasePrice.toString(),
        hoursUsed: equipmentItem.hoursUsed.toString(),
        lastMaintenance: equipmentItem.lastMaintenance,
        nextMaintenance: equipmentItem.nextMaintenance,
        notes: equipmentItem.notes
      });
    } else {
      setEditingEquipment(null);
      setFormData({
        name: '',
        type: '',
        serialNumber: '',
        status: 'Available',
        location: '',
        purchaseDate: '',
        purchasePrice: '',
        hoursUsed: '0',
        lastMaintenance: '',
        nextMaintenance: '',
        notes: ''
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingEquipment(null);
  };

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.type) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      const equipmentData = {
        name: formData.name.trim(),
        type: formData.type,
        serialNumber: formData.serialNumber.trim(),
        status: formData.status,
        location: formData.location.trim(),
        purchaseDate: formData.purchaseDate,
        purchasePrice: parseFloat(formData.purchasePrice) || 0,
        hoursUsed: parseInt(formData.hoursUsed) || 0,
        lastMaintenance: formData.lastMaintenance,
        nextMaintenance: formData.nextMaintenance,
        notes: formData.notes.trim(),
        updatedAt: serverTimestamp()
      };

      if (editingEquipment) {
        await updateDoc(doc(db, 'equipment', editingEquipment.id), equipmentData);
      } else {
        await addDoc(collection(db, 'equipment'), {
          ...equipmentData,
          createdAt: serverTimestamp()
        });
      }

      closeModal();
    } catch (error) {
      console.error('Error saving equipment:', error);
      Alert.alert('Error', 'Failed to save equipment');
    }
  };

  const handleDelete = async (equipmentItem: Equipment) => {
    Alert.alert(
      'Delete Equipment',
      `Are you sure you want to delete "${equipmentItem.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'equipment', equipmentItem.id));
            } catch (error) {
              console.error('Error deleting equipment:', error);
              Alert.alert('Error', 'Failed to delete equipment');
            }
          }
        }
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available': return '#10B981';
      case 'In Use': return '#3B82F6';
      case 'Maintenance': return '#F59E0B';
      case 'Out of Service': return '#EF4444';
      case 'Rented Out': return '#8B5CF6';
      default: return '#6B7280';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Filter change handler
  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  // Get unique equipment types for filter
  const getUniqueTypes = () => {
    return [...new Set(equipment.map(item => item.type).filter(Boolean))].sort();
  };

  if (loading) {
    return (
      <MainLayout>
        <View style={globalStyles.loadingContainer}>
          <Text style={globalStyles.loadingText}>Loading equipment...</Text>
        </View>
      </MainLayout>
    );
  }

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
              onPress={() => openModal()}
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

          {/* Equipment Table */}
          <UniversalTable
            data={filteredEquipment}
            columns={tableColumns}
            actions={tableActions}
            loading={loading}
            sortable={true}
            filterable={true}
            alternateRowColors={true}
            emptyMessage={equipment.length === 0 ? 'No equipment added yet' : 'No equipment found'}
            keyExtractor={(item) => item.id}
          />
        </View>

        {/* Add/Edit Equipment Modal */}
        <Modal
          visible={showModal}
          animationType="slide"
          presentationStyle="fullScreen"
          onRequestClose={closeModal}
        >
          <View style={globalStyles.container}>
            <View style={globalStyles.pageHeader}>
              <Text style={globalStyles.pageTitle}>
                {editingEquipment ? 'Edit Equipment' : 'Add Equipment'}
              </Text>
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <TouchableOpacity
                  style={globalStyles.secondaryButton}
                  onPress={closeModal}
                >
                  <Text style={globalStyles.secondaryButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={globalStyles.primaryButton}
                  onPress={handleSave}
                >
                  <Text style={globalStyles.primaryButtonText}>
                    {editingEquipment ? 'Update Equipment' : 'Add Equipment'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <ScrollView 
              style={globalStyles.contentContainer} 
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 50 }}
            >
              <View style={globalStyles.card}>
                <Text style={globalStyles.sectionTitle}>Equipment Details</Text>
                
                <View style={globalStyles.formRow}>
                  <View style={globalStyles.formField}>
                    <Text style={globalStyles.formLabel}>Equipment Name *</Text>
                    <Input
                      placeholder="Enter equipment name"
                      value={formData.name}
                      onChangeText={(text) => setFormData({ ...formData, name: text })}
                    />
                  </View>
                  
                  <View style={globalStyles.formField}>
                    <Text style={globalStyles.formLabel}>Serial Number</Text>
                    <Input
                      placeholder="Enter serial number"
                      value={formData.serialNumber}
                      onChangeText={(text) => setFormData({ ...formData, serialNumber: text })}
                    />
                  </View>
                </View>

                <View style={globalStyles.formRow}>
                  <View style={globalStyles.formField}>
                    <Text style={globalStyles.formLabel}>Equipment Type *</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={globalStyles.pickerScrollContainer}>
                      <View style={globalStyles.pickerContainer}>
                        {EQUIPMENT_TYPES.map(type => (
                          <TouchableOpacity
                            key={type}
                            style={[
                              globalStyles.pickerOption,
                              formData.type === type && globalStyles.pickerOptionSelected
                            ]}
                            onPress={() => setFormData({ ...formData, type })}
                          >
                            <Text style={[
                              globalStyles.pickerOptionText,
                              formData.type === type && globalStyles.pickerOptionTextSelected
                            ]}>
                              {type}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </ScrollView>
                  </View>
                </View>

                <View style={globalStyles.formRow}>
                  <View style={globalStyles.formField}>
                    <Text style={globalStyles.formLabel}>Status</Text>
                    <View style={globalStyles.pickerContainer}>
                      {EQUIPMENT_STATUS.map(status => (
                        <TouchableOpacity
                          key={status}
                          style={[
                            globalStyles.pickerOption,
                            formData.status === status && globalStyles.pickerOptionSelected
                          ]}
                          onPress={() => setFormData({ ...formData, status })}
                        >
                          <Text style={[
                            globalStyles.pickerOptionText,
                            formData.status === status && globalStyles.pickerOptionTextSelected
                          ]}>
                            {status}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                  
                  <View style={globalStyles.formField}>
                    <Text style={globalStyles.formLabel}>Location</Text>
                    <Input
                      placeholder="Enter current location"
                      value={formData.location}
                      onChangeText={(text) => setFormData({ ...formData, location: text })}
                    />
                  </View>
                </View>
              </View>

              <View style={globalStyles.card}>
                <Text style={globalStyles.sectionTitle}>Financial Information</Text>
                
                <View style={globalStyles.formRow}>
                  <View style={globalStyles.formField}>
                    <Text style={globalStyles.formLabel}>Purchase Date</Text>
                    <Input
                      placeholder="YYYY-MM-DD"
                      value={formData.purchaseDate}
                      onChangeText={(text) => setFormData({ ...formData, purchaseDate: text })}
                    />
                  </View>
                  
                  <View style={globalStyles.formField}>
                    <Text style={globalStyles.formLabel}>Purchase Price</Text>
                    <Input
                      placeholder="Enter purchase price"
                      value={formData.purchasePrice}
                      onChangeText={(text) => setFormData({ ...formData, purchasePrice: text })}
                      keyboardType="numeric"
                    />
                  </View>
                </View>
              </View>

              <View style={globalStyles.card}>
                <Text style={globalStyles.sectionTitle}>Usage & Maintenance</Text>
                
                <View style={globalStyles.formRow}>
                  <View style={globalStyles.formField}>
                    <Text style={globalStyles.formLabel}>Hours Used</Text>
                    <Input
                      placeholder="Enter total hours"
                      value={formData.hoursUsed}
                      onChangeText={(text) => setFormData({ ...formData, hoursUsed: text })}
                      keyboardType="numeric"
                    />
                  </View>
                </View>

                <View style={globalStyles.formRow}>
                  <View style={globalStyles.formField}>
                    <Text style={globalStyles.formLabel}>Last Maintenance</Text>
                    <Input
                      placeholder="YYYY-MM-DD"
                      value={formData.lastMaintenance}
                      onChangeText={(text) => setFormData({ ...formData, lastMaintenance: text })}
                    />
                  </View>
                  
                  <View style={globalStyles.formField}>
                    <Text style={globalStyles.formLabel}>Next Maintenance</Text>
                    <Input
                      placeholder="YYYY-MM-DD"
                      value={formData.nextMaintenance}
                      onChangeText={(text) => setFormData({ ...formData, nextMaintenance: text })}
                    />
                  </View>
                </View>

                <View style={globalStyles.formField}>
                  <Text style={globalStyles.formLabel}>Notes</Text>
                  <Input
                    placeholder="Additional notes about this equipment"
                    value={formData.notes}
                    onChangeText={(text) => setFormData({ ...formData, notes: text })}
                    multiline
                    numberOfLines={3}
                    style={{ height: 80 }}
                  />
                </View>
              </View>
            </ScrollView>
          </View>
        </Modal>
      </View>
    </MainLayout>
  );
}
