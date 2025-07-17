import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Modal, FlatList } from 'react-native';
import { MainLayout } from '@/components/MainLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { UniversalTable, TableColumn, TableAction } from '@/components/ui/UniversalTable';
import { globalStyles, colors } from '@/styles';
import { Ionicons } from '@expo/vector-icons';
import { getFirestore, collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

// Predefined roles for dropdown
const CREW_ROLES = [
  "Foreman",
  "Operator", 
  "Laborer",
  "Director",
  "Accounting",
  "Project Manager",
  "Subcontractor"
];

// Types
interface CrewMember {
  id: string;
  name: string;
  role: string;
  phone?: string;
  status?: string;
  email?: string;
  dateHired?: string;
}

interface CrewForm {
  name: string;
  role: string;
  phone: string;
  email: string;
}

// Fallback data for initial seeding
const initialCrew: Omit<CrewMember, 'id'>[] = [
  { name: "John Smith", role: "Foreman", phone: "555-0123", status: "Active" },
  { name: "Anna Lee", role: "Operator", phone: "555-0456", status: "Active" },
  { name: "Mike Brown", role: "Laborer", phone: "555-0789", status: "Active" }
];

// Add/Edit Crew Modal Component
const CrewModal = ({ 
  visible, 
  onClose, 
  onSave, 
  editingMember, 
  title 
}: {
  visible: boolean;
  onClose: () => void;
  onSave: (form: CrewForm) => void;
  editingMember?: CrewMember | null;
  title: string;
}) => {
  const [form, setForm] = useState<CrewForm>({
    name: '',
    role: '',
    phone: '',
    email: ''
  });
  const [showRoleModal, setShowRoleModal] = useState(false);

  // Update form when editing
  useEffect(() => {
    if (editingMember) {
      setForm({
        name: editingMember.name || '',
        role: editingMember.role || '',
        phone: editingMember.phone || '',
        email: editingMember.email || ''
      });
    } else {
      setForm({ name: '', role: '', phone: '', email: '' });
    }
  }, [editingMember, visible]);

  const handleSave = () => {
    if (!form.name.trim() || !form.role) {
      Alert.alert('Error', 'Please fill in all required fields (Name and Role)');
      return;
    }
    onSave(form);
    setForm({ name: '', role: '', phone: '', email: '' });
  };

  const handleCancel = () => {
    setForm({ name: '', role: '', phone: '', email: '' });
    onClose();
  };

  return (
    <>
      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={handleCancel}
      >
        <View style={globalStyles.container}>
          <View style={globalStyles.pageHeader}>
            <Text style={globalStyles.pageTitle}>{title}</Text>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity
                style={globalStyles.secondaryButton}
                onPress={handleCancel}
              >
                <Text style={globalStyles.secondaryButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={globalStyles.primaryButton}
                onPress={handleSave}
              >
                <Text style={globalStyles.primaryButtonText}>
                  {editingMember ? 'Save Changes' : 'Add Member'}
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
              <Text style={globalStyles.inputLabel}>Name *</Text>
              <Input
                value={form.name}
                onChangeText={(text) => setForm(prev => ({ ...prev, name: text }))}
                placeholder="Enter crew member name"
              />

              <Text style={globalStyles.inputLabel}>Role *</Text>
              <TouchableOpacity
                style={globalStyles.dropdown}
                onPress={() => setShowRoleModal(true)}
              >
                <Text style={[globalStyles.dropdownText, !form.role && { color: colors.textSecondary }]}>
                  {form.role || 'Select Role'}
                </Text>
                <Ionicons name="chevron-down" size={16} color={colors.textSecondary} />
              </TouchableOpacity>

              <Text style={globalStyles.inputLabel}>Phone</Text>
              <Input
                value={form.phone}
                onChangeText={(text) => setForm(prev => ({ ...prev, phone: text }))}
                placeholder="Enter phone number"
                keyboardType="phone-pad"
              />

              <Text style={globalStyles.inputLabel}>Email</Text>
              <Input
                value={form.email}
                onChangeText={(text) => setForm(prev => ({ ...prev, email: text }))}
                placeholder="Enter email address"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* Role Selection Modal */}
      <Modal
        visible={showRoleModal}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={() => setShowRoleModal(false)}
      >
        <View style={globalStyles.container}>
          <View style={globalStyles.pageHeader}>
            <Text style={globalStyles.pageTitle}>Select Role</Text>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity
                style={globalStyles.secondaryButton}
                onPress={() => setShowRoleModal(false)}
              >
                <Text style={globalStyles.secondaryButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <ScrollView 
            style={globalStyles.contentContainer} 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 50 }}
          >
            <View style={globalStyles.card}>
              {CREW_ROLES.map((role) => (
                <TouchableOpacity
                  key={role}
                  style={[
                    globalStyles.listItem,
                    form.role === role && globalStyles.resourceItemSelected
                  ]}
                  onPress={() => {
                    setForm(prev => ({ ...prev, role }));
                    setShowRoleModal(false);
                  }}
                >
                  <Text style={globalStyles.listItemText}>{role}</Text>
                  {form.role === role && (
                    <Ionicons name="checkmark-circle" size={20} color={colors.success} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      </Modal>
    </>
  );
};

// Crew Table Row Component
const CrewRow = ({ 
  member, 
  onEdit, 
  onDelete,
  isRoleHeader = false,
  roleCount = 0
}: {
  member: CrewMember;
  onEdit: (member: CrewMember) => void;
  onDelete: (member: CrewMember) => void;
  isRoleHeader?: boolean;
  roleCount?: number;
}) => {
  if (isRoleHeader) {
    return (
      <View style={globalStyles.tableRoleHeader}>
        <Text style={globalStyles.tableRoleHeaderText}>
          {member.role} ({roleCount})
        </Text>
      </View>
    );
  }

  return (
    <View style={globalStyles.tableRow}>
      <View style={[globalStyles.tableCell, { flex: 2 }]}>
        <Text style={globalStyles.tableCellText}>{member.name}</Text>
      </View>
      <View style={[globalStyles.tableCell, { flex: 1.5 }]}>
        <Text style={globalStyles.tableCellTextSecondary}>{member.role}</Text>
      </View>
      <View style={[globalStyles.tableCell, { flex: 1.5 }]}>
        <Text style={globalStyles.tableCellTextSecondary}>{member.phone || '-'}</Text>
      </View>
      <View style={[globalStyles.tableCell, { flex: 1 }]}>
        <View style={globalStyles.actionsCell}>
          <TouchableOpacity
            style={[globalStyles.iconButton, globalStyles.actionEditButton, globalStyles.actionButtonSpacing]}
            onPress={() => onEdit(member)}
          >
            <Ionicons name="create-outline" size={16} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[globalStyles.iconButton, globalStyles.actionDeleteButton]}
            onPress={() => onDelete(member)}
          >
            <Ionicons name="trash-outline" size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default function CrewScreen() {
  const { user } = useAuth();
  
  // State management
  const [crew, setCrew] = useState<CrewMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState<CrewMember | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Table configuration for UniversalTable
  const tableColumns: TableColumn[] = [
    {
      key: 'name',
      title: 'Name',
      flex: 2,
      sortable: true,
      filterable: true,
      render: (value, row) => (
        <View>
          <Text style={[globalStyles.tableCellText, { fontWeight: '600' }]}>{value}</Text>
          {row.email && (
            <Text style={globalStyles.tableSubText}>{row.email}</Text>
          )}
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
          <Text style={globalStyles.statusText}>{value || 'Active'}</Text>
        </View>
      )
    }
  ];

  const tableActions: TableAction[] = [
    {
      icon: 'person',
      label: 'View Profile',
      onPress: (row) => {
        setEditingMember(row);
        setShowModal(true);
      },
      color: '#6B7280'
    },
    {
      icon: 'pencil',
      label: 'Edit',
      onPress: (row) => {
        setEditingMember(row);
        setShowModal(true);
      },
      color: '#007AFF'
    },
    {
      icon: 'call',
      label: 'Call',
      onPress: (row) => {
        if (row.phone) {
          Alert.alert(
            'Call Employee',
            `Call ${row.name} at ${row.phone}?`,
            [
              { text: 'Cancel', style: 'cancel' },
              { 
                text: 'Call', 
                onPress: () => {
                  // In a real app, you'd use Linking.openURL(`tel:${row.phone}`)
                  Alert.alert('Calling', `Calling ${row.name}...`);
                }
              }
            ]
          );
        } else {
          Alert.alert('No Phone', `No phone number available for ${row.name}`);
        }
      },
      color: '#34C759',
      visible: (row) => !!row.phone
    },
    {
      icon: 'mail',
      label: 'Email',
      onPress: (row) => {
        if (row.email) {
          Alert.alert('Email', `Send email to ${row.email}? (Feature coming soon)`);
        } else {
          Alert.alert('No Email', `No email address available for ${row.name}`);
        }
      },
      color: '#007AFF',
      visible: (row) => !!row.email
    },
    {
      icon: 'trash',
      label: 'Delete',
      onPress: (row) => handleDelete(row),
      color: '#FF3B30'
    }
  ];

  // Group crew members by role
  const groupedCrew = crew.reduce((groups, member) => {
    const role = member.role || 'Unassigned';
    if (!groups[role]) {
      groups[role] = [];
    }
    groups[role].push(member);
    return groups;
  }, {} as {[key: string]: CrewMember[]});

  // Filter crew based on search query
  const filteredCrew = crew.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (member.phone && member.phone.includes(searchQuery))
  );

  const filteredGroupedCrew = filteredCrew.reduce((groups, member) => {
    const role = member.role || 'Unassigned';
    if (!groups[role]) {
      groups[role] = [];
    }
    groups[role].push(member);
    return groups;
  }, {} as {[key: string]: CrewMember[]});

  // Load crew from Firebase
  const loadCrew = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const db = getFirestore();
      const crewSnapshot = await getDocs(collection(db, 'crew'));
      
      if (crewSnapshot.docs.length === 0) {
        // Seed with initial data if no crew exists
        console.log("No crew found, seeding with initial data...");
        await seedInitialCrew();
        return;
      }
      
      const crewData = crewSnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
        role: doc.data().role,
        phone: doc.data().phone,
        email: doc.data().email,
        status: doc.data().status || 'Active',
        dateHired: doc.data().dateHired
      }));
      
      setCrew(crewData);
    } catch (err) {
      console.error("Error loading crew:", err);
      setError("Failed to load crew members. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCrew();
  }, [loadCrew]);

  const seedInitialCrew = async () => {
    try {
      const db = getFirestore();
      const promises = initialCrew.map(member => 
        addDoc(collection(db, 'crew'), {
          ...member,
          dateHired: new Date().toISOString(),
          status: 'Active'
        })
      );
      await Promise.all(promises);
      
      // Reload crew after seeding
      await loadCrew();
    } catch (err) {
      console.error("Error seeding crew:", err);
      setError("Failed to initialize crew data.");
    }
  };

  const handleAdd = () => {
    setEditingMember(null);
    setShowModal(true);
  };

  const handleEdit = (member: CrewMember) => {
    setEditingMember(member);
    setShowModal(true);
  };

  const handleSave = async (form: CrewForm) => {
    try {
      const db = getFirestore();
      
      if (editingMember) {
        // Update existing member
        await updateDoc(doc(db, 'crew', editingMember.id), {
          ...form,
          updatedAt: new Date().toISOString()
        });
        setCrew(prev => prev.map(member => 
          member.id === editingMember.id 
            ? { ...member, ...form }
            : member
        ));
      } else {
        // Add new member
        const docRef = await addDoc(collection(db, 'crew'), {
          ...form,
          status: 'Active',
          dateHired: new Date().toISOString(),
          createdAt: new Date().toISOString()
        });
        const newMember: CrewMember = {
          id: docRef.id,
          ...form,
          status: 'Active',
          dateHired: new Date().toISOString()
        };
        setCrew(prev => [...prev, newMember]);
      }
      
      setShowModal(false);
      setEditingMember(null);
    } catch (err) {
      console.error("Error saving crew member:", err);
      Alert.alert('Error', 'Failed to save crew member. Please try again.');
    }
  };

  const handleDelete = (member: CrewMember) => {
    Alert.alert(
      "Delete Crew Member",
      `Are you sure you want to delete ${member.name}?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: async () => {
            try {
              const db = getFirestore();
              await deleteDoc(doc(db, 'crew', member.id));
              setCrew(prev => prev.filter(m => m.id !== member.id));
            } catch (err) {
              console.error("Error deleting crew member:", err);
              Alert.alert('Error', 'Failed to delete crew member. Please try again.');
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <MainLayout>
        <View style={[globalStyles.container, globalStyles.centered]}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[globalStyles.text, { marginTop: 16 }]}>
            Loading crew members...
          </Text>
        </View>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <View style={[globalStyles.container, globalStyles.centered]}>
          <Ionicons name="alert-circle" size={48} color={colors.danger} />
          <Text style={[globalStyles.errorText, { marginTop: 16, textAlign: 'center' }]}>
            {error}
          </Text>
          <TouchableOpacity
            style={[globalStyles.primaryButton, { marginTop: 16 }]}
            onPress={loadCrew}
          >
            <Text style={globalStyles.primaryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <View style={[globalStyles.container, { padding: 0, margin: 0 }]}>
        {/* Header */}
        <PageHeader 
          title="Crew Management" 
          icon="people-outline"
          rightContent={
            <TouchableOpacity 
              style={globalStyles.primaryButton}
              onPress={handleAdd}
            >
              <View style={[globalStyles.row, { alignItems: 'center' }]}>
                <Ionicons name="add" size={20} color="#FFFFFF" style={globalStyles.iconWithMargin} />
                <Text style={globalStyles.primaryButtonText}>Add Crew Member</Text>
              </View>
            </TouchableOpacity>
          }
        />

        {/* Content */}
        <View style={globalStyles.contentContainer}>
          {/* Search Bar */}
          <View style={globalStyles.card}>
            <View style={[globalStyles.row, { alignItems: 'center', gap: 8 }]}>
              <Ionicons name="search" size={20} color={colors.textSecondary} />
              <Input
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search crew members..."
                style={{ flex: 1 }}
              />
            </View>
          </View>

          {/* Summary Stats */}
          <View style={globalStyles.card}>
            <Text style={globalStyles.cardTitle}>Team Overview</Text>
            <View style={[globalStyles.row, { justifyContent: 'space-around', marginTop: 12 }]}>
              <View style={globalStyles.statItem}>
                <Text style={globalStyles.statNumber}>{crew.length}</Text>
                <Text style={globalStyles.statLabel}>Total Members</Text>
              </View>
              <View style={globalStyles.statItem}>
                <Text style={globalStyles.statNumber}>{Object.keys(groupedCrew).length}</Text>
                <Text style={globalStyles.statLabel}>Roles</Text>
              </View>
              <View style={globalStyles.statItem}>
                <Text style={globalStyles.statNumber}>
                  {crew.filter(m => m.status === 'Active').length}
                </Text>
                <Text style={globalStyles.statLabel}>Active</Text>
              </View>
            </View>
          </View>

          {/* Crew Table */}
          <UniversalTable
            data={filteredCrew}
            columns={tableColumns}
            actions={tableActions}
            loading={loading}
            sortable={true}
            filterable={true}
            alternateRowColors={true}
            emptyMessage={crew.length === 0 ? 'No crew members added yet' : 'No crew members found'}
            keyExtractor={(item) => item.id}
          />
        </View>

        {/* Modal */}
        <CrewModal
          visible={showModal}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
          editingMember={editingMember}
          title={editingMember ? 'Edit Crew Member' : 'Add Crew Member'}
        />
      </View>
    </MainLayout>
  );
}
