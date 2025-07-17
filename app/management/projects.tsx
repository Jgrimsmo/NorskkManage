import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Modal, 
  Alert,
  TextInput,
  Platform,
  ActivityIndicator
} from 'react-native';
import { MainLayout } from '@/components/MainLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { UniversalTable, TableColumn, TableAction } from '@/components/ui/UniversalTable';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { globalStyles, colors } from '@/styles';
import { DatePicker } from '@/components/ui/DatePicker';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Project,
  CreateProjectData,
  createProject,
  subscribeToProjects,
  updateProject as updateProjectInDB,
  deleteProject as deleteProjectFromDB,
  generateProjectNumber
} from '@/services/projectService';

interface AddProjectFormData {
  name: string;
  owner: string;
  projectNumber: string;
  address: string;
  startDate: Date;
  status: 'Active' | 'On Hold' | 'Completed' | 'Cancelled';
}

interface EditableFieldProps {
  value: string;
  onSave: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
}

interface StatusDropdownProps {
  value: 'Active' | 'On Hold' | 'Completed' | 'Cancelled';
  onSelect: (status: 'Active' | 'On Hold' | 'Completed' | 'Cancelled') => void;
}

const EditableField: React.FC<EditableFieldProps> = ({ value, onSave, placeholder, multiline = false }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  const handleSave = () => {
    onSave(tempValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempValue(value);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <TextInput
        style={[globalStyles.input, { marginBottom: 0, minHeight: multiline ? 60 : 40 }]}
        value={tempValue}
        onChangeText={setTempValue}
        onBlur={handleSave}
        onSubmitEditing={handleSave}
        placeholder={placeholder}
        multiline={multiline}
        autoFocus
        returnKeyType="done"
        blurOnSubmit
      />
    );
  }

  return (
    <TouchableOpacity onPress={() => setIsEditing(true)} style={globalStyles.minHeight24}>
      <Text style={[globalStyles.tableCellText, value ? {} : { color: colors.gray, fontStyle: 'italic' }]}>
        {value || placeholder || 'Tap to edit'}
      </Text>
    </TouchableOpacity>
  );
};

const StatusDropdown: React.FC<StatusDropdownProps> = ({ value, onSelect }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [buttonRef, setButtonRef] = useState<View | null>(null);
  const statuses: Array<'Active' | 'On Hold' | 'Completed' | 'Cancelled'> = ['Active', 'On Hold', 'Completed', 'Cancelled'];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Active': return globalStyles.statusActive;
      case 'On Hold': return globalStyles.statusOnHold;
      case 'Completed': return globalStyles.statusCompleted;
      case 'Cancelled': return globalStyles.statusCancelled;
      default: return globalStyles.statusActive;
    }
  };

  const handlePress = () => {
    if (buttonRef) {
      buttonRef.measure((x, y, width, height, pageX, pageY) => {
        setDropdownPosition({
          top: pageY + height + 5,
          left: pageX
        });
        setShowDropdown(true);
      });
    }
  };

  return (
    <View style={{ position: 'relative' }}>
      <TouchableOpacity
        ref={setButtonRef}
        style={[globalStyles.statusBadge, getStatusStyle(value)]}
        onPress={handlePress}
      >
        <Text style={globalStyles.statusText}>{value}</Text>
        <Ionicons name="chevron-down" size={12} color="#FFFFFF" style={{ marginLeft: 4 }} />
      </TouchableOpacity>
      
      {showDropdown && (
        <Modal transparent animationType="fade" onRequestClose={() => setShowDropdown(false)}>
          <TouchableOpacity 
            style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' }}
            onPress={() => setShowDropdown(false)}
          >
            <View style={{
              position: 'absolute',
              top: dropdownPosition.top,
              left: dropdownPosition.left,
              backgroundColor: '#FFFFFF',
              borderRadius: 8,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 8,
              elevation: 8,
              minWidth: 120,
            }}>
              {statuses.map((status) => (
                <TouchableOpacity
                  key={status}
                  style={{
                    padding: 12,
                    borderBottomWidth: status !== statuses[statuses.length - 1] ? 1 : 0,
                    borderBottomColor: '#F2F2F7',
                  }}
                  onPress={() => {
                    onSelect(status);
                    setShowDropdown(false);
                  }}
                >
                  <Text style={{
                    fontSize: 14,
                    color: value === status ? colors.primary : colors.text
                  }}>
                    {status}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </Modal>
      )}
    </View>
  );
};

export default function ProjectsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState<AddProjectFormData>({
    name: '',
    owner: '',
    projectNumber: '',
    address: '',
    startDate: new Date(),
    status: 'Active'
  });
  const [editingDateProject, setEditingDateProject] = useState<string | null>(null);

  // Table configuration for UniversalTable
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return '#34C759';
      case 'Completed': return '#007AFF';
      case 'On Hold': return '#FF9500';
      case 'Planning': return '#8E8E93';
      default: return '#666';
    }
  };

  const tableColumns: TableColumn[] = [
    {
      key: 'name',
      title: 'Project Name',
      flex: 3,
      sortable: true,
      filterable: true,
      render: (value, row) => (
        <TouchableOpacity 
          onPress={() => router.push(`/management/projects/${row.id}`)}
          style={{ flex: 1 }}
        >
          <Text style={[globalStyles.tableCellText, { fontWeight: '600', color: '#007AFF' }]}>
            {value}
          </Text>
          {row.address && (
            <Text style={globalStyles.tableSubText}>{row.address}</Text>
          )}
        </TouchableOpacity>
      )
    },
    {
      key: 'owner',
      title: 'Owner',
      flex: 2,
      sortable: true,
      filterable: true,
      editable: true,
      onEdit: (row, value) => updateProject(row.id, 'owner', value),
    },
    {
      key: 'projectNumber',
      title: 'Project #',
      flex: 1.5,
      sortable: true,
      filterable: true,
    },
    {
      key: 'status',
      title: 'Status',
      flex: 1.2,
      sortable: true,
      filterable: true,
      editable: true,
      editType: 'select' as const,
      onEdit: (row, value) => updateProject(row.id, 'status', value),
      render: (value) => (
        <View style={[
          globalStyles.statusBadge,
          { backgroundColor: getStatusColor(value) + '20' }
        ]}>
          <Text style={[
            globalStyles.statusText,
            { color: getStatusColor(value) }
          ]}>
            {value}
          </Text>
        </View>
      )
    },
    {
      key: 'startDate',
      title: 'Start Date',
      flex: 1.3,
      sortable: true,
      render: (value) => (
        <Text style={globalStyles.tableCellText}>
          {value ? new Date(value.seconds * 1000).toLocaleDateString() : 'Not set'}
        </Text>
      )
    }
  ];

  const tableActions: TableAction[] = [
    {
      icon: 'eye',
      label: 'View',
      onPress: (row) => router.push(`/management/projects/${row.id}`),
      color: '#007AFF'
    },
    {
      icon: 'pencil',
      label: 'Edit',
      onPress: (row) => {
        setEditingProject(row);
        setFormData({
          name: row.name,
          owner: row.owner,
          projectNumber: row.projectNumber,
          address: row.address || '',
          startDate: row.startDate ? new Date(row.startDate.seconds * 1000) : new Date(),
          status: row.status
        });
        setShowEditModal(true);
      },
      color: '#FF9500'
    },
    {
      icon: 'trash',
      label: 'Delete',
      onPress: (row) => handleDeleteProject(row.id),
      color: '#FF3B30'
    }
  ];

  // Subscribe to real-time updates from Firebase
  useEffect(() => {
    console.log('Projects useEffect triggered');
    console.log('User:', user ? 'authenticated' : 'not authenticated');
    console.log('User UID:', user?.uid);
    
    if (!user) {
      console.log('No user found, skipping Firebase subscription');
      setLoading(false);
      return;
    }

    console.log('Setting up Firebase subscription for user:', user.uid);
    
    // Set a timeout to prevent infinite loading
    const loadingTimeout = setTimeout(() => {
      console.log('Loading timeout reached, stopping loading state');
      setLoading(false);
    }, 10000); // 10 seconds timeout
    
    const unsubscribe = subscribeToProjects(user.uid, (updatedProjects) => {
      console.log('Received projects from Firebase:', updatedProjects.length, 'projects');
      clearTimeout(loadingTimeout);
      setProjects(updatedProjects);
      setLoading(false);
    });

    return () => {
      console.log('Cleaning up Firebase subscription');
      clearTimeout(loadingTimeout);
      unsubscribe();
    };
  }, [user]);

  const handleAddProject = async () => {
    if (!formData.name.trim() || !formData.owner.trim()) {
      Alert.alert('Error', 'Please fill in required fields (Name and Owner)');
      return;
    }

    if (!user) {
      Alert.alert('Error', 'You must be logged in to create projects');
      return;
    }

    try {
      const projectData: CreateProjectData = {
        name: formData.name,
        owner: formData.owner,
        projectNumber: formData.projectNumber || generateProjectNumber(),
        status: formData.status,
        startDate: formData.startDate,
        address: formData.address
      };

      await createProject(projectData, user.uid);
      
      // Reset form
      setFormData({
        name: '',
        owner: '',
        projectNumber: '',
        address: '',
        startDate: new Date(),
        status: 'Active'
      });
      setShowAddModal(false);
      
      Alert.alert('Success', 'Project created successfully');
    } catch (error) {
      console.error('Error creating project:', error);
      Alert.alert('Error', 'Failed to create project. Please try again.');
    }
  };

  const handleDeleteProject = (id: string) => {
    Alert.alert(
      'Delete Project',
      'Are you sure you want to delete this project? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteProjectFromDB(id);
              Alert.alert('Success', 'Project deleted successfully');
            } catch (error) {
              console.error('Error deleting project:', error);
              Alert.alert('Error', 'Failed to delete project. Please try again.');
            }
          }
        }
      ]
    );
  };

  const updateProject = async (id: string, field: keyof Project, value: any) => {
    try {
      await updateProjectInDB(id, { [field]: value });
    } catch (error) {
      console.error('Error updating project:', error);
      Alert.alert('Error', 'Failed to update project. Please try again.');
    }
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setFormData({
      name: project.name,
      owner: project.owner,
      projectNumber: project.projectNumber,
      address: project.address,
      startDate: project.startDate,
      status: project.status
    });
    setShowEditModal(true);
  };

  const handleUpdateProject = async () => {
    if (!formData.name.trim() || !formData.owner.trim()) {
      Alert.alert('Error', 'Please fill in required fields (Name and Owner)');
      return;
    }

    if (!editingProject) {
      Alert.alert('Error', 'No project selected for editing');
      return;
    }

    try {
      const updates = {
        name: formData.name,
        owner: formData.owner,
        projectNumber: formData.projectNumber,
        status: formData.status,
        startDate: formData.startDate,
        address: formData.address
      };

      await updateProjectInDB(editingProject.id, updates);
      
      // Reset form and close modal
      setFormData({
        name: '',
        owner: '',
        projectNumber: '',
        address: '',
        startDate: new Date(),
        status: 'Active'
      });
      setEditingProject(null);
      setShowEditModal(false);
      
      Alert.alert('Success', 'Project updated successfully');
    } catch (error) {
      console.error('Error updating project:', error);
      Alert.alert('Error', 'Failed to update project. Please try again.');
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Active': return globalStyles.statusActive;
      case 'On Hold': return globalStyles.statusOnHold;
      case 'Completed': return globalStyles.statusCompleted;
      case 'Cancelled': return globalStyles.statusCancelled;
      default: return globalStyles.statusActive;
    }
  };

  return (
    <MainLayout>
      <View style={globalStyles.containerNoPadding}>
        {/* Header */}
        <PageHeader 
          title="Projects" 
          icon="briefcase-outline"
          rightContent={
            <TouchableOpacity
              style={globalStyles.primaryButton}
              onPress={() => setShowAddModal(true)}
            >
              <View style={[globalStyles.row, { alignItems: 'center' }]}>
                <Ionicons name="add" size={20} color="#FFFFFF" style={globalStyles.iconWithMargin} />
                <Text style={globalStyles.primaryButtonText}>Add Project</Text>
              </View>
            </TouchableOpacity>
          }
        />

        {/* Content */}
        {loading ? (
          <View style={globalStyles.centered}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[globalStyles.loadingText, { color: colors.text }]}>
              Loading projects...
            </Text>
          </View>
        ) : (
          <View style={globalStyles.contentContainer}>
            <UniversalTable
              data={projects}
              columns={tableColumns}
              actions={tableActions}
              loading={loading}
              sortable={true}
              filterable={true}
              alternateRowColors={true}
              emptyMessage="No projects added yet"
              keyExtractor={(item) => item.id}
            />
          </View>
        )}

        {/* Add Project Modal */}
        <Modal
          visible={showAddModal}
          animationType="slide"
          presentationStyle="fullScreen"
          onRequestClose={() => setShowAddModal(false)}
        >
          <View style={globalStyles.container}>
            <View style={globalStyles.pageHeader}>
              <Text style={globalStyles.pageTitle}>Add New Project</Text>
              <View style={globalStyles.rowWithGap}>
                <TouchableOpacity
                  style={globalStyles.secondaryButton}
                  onPress={() => setShowAddModal(false)}
                >
                  <Text style={globalStyles.secondaryButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={globalStyles.primaryButton}
                  onPress={handleAddProject}
                  disabled={loading}
                >
                  <Text style={globalStyles.primaryButtonText}>
                    {loading ? 'Adding...' : 'Add Project'}
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
                <Text style={globalStyles.inputLabel}>Project Name *</Text>
                <TextInput
                  style={globalStyles.input}
                  value={formData.name}
                  onChangeText={(text) => setFormData({...formData, name: text})}
                  placeholder="Enter project name"
                />

                <Text style={globalStyles.inputLabel}>Owner/Client *</Text>
                <TextInput
                  style={globalStyles.input}
                  value={formData.owner}
                  onChangeText={(text) => setFormData({...formData, owner: text})}
                  placeholder="Enter owner/client name"
                />

                <Text style={globalStyles.inputLabel}>Project Number</Text>
                <TextInput
                  style={globalStyles.input}
                  value={formData.projectNumber}
                  onChangeText={(text) => setFormData({...formData, projectNumber: text})}
                  placeholder="Auto-generated if empty"
                />

                <Text style={globalStyles.inputLabel}>Address</Text>
                <TextInput
                  style={globalStyles.inputMultiline}
                  value={formData.address}
                  onChangeText={(text) => setFormData({...formData, address: text})}
                  placeholder="Enter project address"
                  multiline
                />

                <Text style={globalStyles.inputLabel}>Start Date</Text>
                <DatePicker
                  value={formData.startDate}
                  onDateChange={(date) => setFormData({...formData, startDate: date})}
                  placeholder="Select start date"
                />

                <Text style={globalStyles.inputLabel}>Status</Text>
                <View style={globalStyles.rowCenteredWithGap}> 
                  {(['Active', 'On Hold', 'Completed', 'Cancelled'] as const).map((status) => (
                    <TouchableOpacity
                      key={status}
                      style={[
                        globalStyles.navButton,
                        formData.status === status && globalStyles.navButtonActive
                      ]}
                      onPress={() => setFormData({...formData, status})}
                    >
                      <Text style={[
                        globalStyles.navButtonText,
                        formData.status === status && globalStyles.navButtonTextActive
                      ]}>
                        {status}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </ScrollView>
          </View>
        </Modal>

        {/* Edit Project Modal */}
        <Modal
          visible={showEditModal}
          animationType="slide"
          presentationStyle="fullScreen"
          onRequestClose={() => setShowEditModal(false)}
        >
          <View style={globalStyles.container}>
            <View style={globalStyles.pageHeader}>
              <Text style={globalStyles.pageTitle}>Edit Project</Text>
              <View style={globalStyles.rowWithGap}>
                <TouchableOpacity
                  style={globalStyles.secondaryButton}
                  onPress={() => setShowEditModal(false)}
                >
                  <Text style={globalStyles.secondaryButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={globalStyles.primaryButton}
                  onPress={handleUpdateProject}
                  disabled={loading}
                >
                  <Text style={globalStyles.primaryButtonText}>
                    {loading ? 'Updating...' : 'Update Project'}
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
                <Text style={globalStyles.inputLabel}>Project Name *</Text>
                <TextInput
                  style={globalStyles.input}
                  value={formData.name}
                  onChangeText={(text) => setFormData({...formData, name: text})}
                  placeholder="Enter project name"
                />

                <Text style={globalStyles.inputLabel}>Owner/Client *</Text>
                <TextInput
                  style={globalStyles.input}
                  value={formData.owner}
                  onChangeText={(text) => setFormData({...formData, owner: text})}
                  placeholder="Enter owner/client name"
                />

                <Text style={globalStyles.inputLabel}>Project Number</Text>
                <TextInput
                  style={globalStyles.input}
                  value={formData.projectNumber}
                  onChangeText={(text) => setFormData({...formData, projectNumber: text})}
                  placeholder="Enter project number"
                />

                <Text style={globalStyles.inputLabel}>Address</Text>
                <TextInput
                  style={globalStyles.inputMultiline}
                  value={formData.address}
                  onChangeText={(text) => setFormData({...formData, address: text})}
                  placeholder="Enter project address"
                  multiline
                />

                <Text style={globalStyles.inputLabel}>Start Date</Text>
                <DatePicker
                  value={formData.startDate}
                  onDateChange={(date) => setFormData({...formData, startDate: date})}
                  placeholder="Select start date"
                />

                <Text style={globalStyles.inputLabel}>Status</Text>
                <View style={globalStyles.rowCenteredWithGap}> 
                  {(['Active', 'On Hold', 'Completed', 'Cancelled'] as const).map((status) => (
                    <TouchableOpacity
                      key={status}
                      style={[
                        globalStyles.navButton,
                        formData.status === status && globalStyles.navButtonActive
                      ]}
                      onPress={() => setFormData({...formData, status})}
                    >
                      <Text style={[
                        globalStyles.navButtonText,
                        formData.status === status && globalStyles.navButtonTextActive
                      ]}>
                        {status}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </ScrollView>
          </View>
        </Modal>
      </View>
    </MainLayout>
  );
}
