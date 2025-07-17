import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Alert,
  TextInput,
  Modal,
  ActivityIndicator
} from 'react-native';
import { MainLayout } from '@/components/MainLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { globalStyles, colors } from '@/styles';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Project,
  getProjectById
} from '@/services/projectService';
import {
  CostCode,
  ScopeItem,
  subscribeToCostCodes,
  subscribeToScopeItems,
  createCostCode,
  createScopeItem,
  updateCostCode,
  updateScopeItem,
  deleteCostCode,
  deleteScopeItem,
  CreateCostCodeData,
  CreateScopeItemData
} from '@/services/projectContentService';
import { CostCodeModal } from '@/components/modals/CostCodeModal';
import { ScopeItemModal } from '@/components/modals/ScopeItemModal';

interface DailyReport {
  id: string;
  date: Date;
  weather: string;
  workCompleted: string;
  crew: string[];
  photos: number;
}

export default function ProjectDetailScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { id } = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState('costcodes');
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Firebase data states
  const [costCodes, setCostCodes] = useState<CostCode[]>([]);
  const [scopeItems, setScopeItems] = useState<ScopeItem[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  // Modal states
  const [showAddCostCode, setShowAddCostCode] = useState(false);
  const [showAddScopeItem, setShowAddScopeItem] = useState(false);
  const [editingCostCode, setEditingCostCode] = useState<CostCode | null>(null);
  const [editingScopeItem, setEditingScopeItem] = useState<ScopeItem | null>(null);

  // Form states for inline editing
  const [newCostCode, setNewCostCode] = useState<CreateCostCodeData>({
    code: '',
    description: '',
    category: 'Labor',
    projectId: project?.id || ''
  });
  const [newScopeItem, setNewScopeItem] = useState<CreateScopeItemData>({
    name: '',
    description: '',
    status: 'Not Started',
    progress: 0,
    projectId: project?.id || ''
  });

  // Mock data for daily reports (this would be connected to Firebase later)
  const [dailyReports, setDailyReports] = useState<DailyReport[]>([
    {
      id: '1',
      date: new Date('2025-07-15'),
      weather: 'Sunny, 24°C',
      workCompleted: 'Continued excavation work on section 2',
      crew: ['John Doe', 'Jane Smith', 'Bob Wilson'],
      photos: 8
    },
    {
      id: '2',
      date: new Date('2025-07-14'),
      weather: 'Cloudy, 22°C',
      workCompleted: 'Completed excavation section 1, started section 2',
      crew: ['John Doe', 'Jane Smith'],
      photos: 12
    }
  ]);

  const tabs = [
    { id: 'costcodes', label: 'Cost Codes', icon: 'pricetag-outline' },
    { id: 'scope', label: 'Scope of Work', icon: 'list-outline' },
    { id: 'reports', label: 'Daily Reports', icon: 'document-text-outline' },
    { id: 'photos', label: 'Photos', icon: 'camera-outline' },
    { id: 'drawings', label: 'Drawings', icon: 'blueprint-outline' }
  ];

  // Fetch project data on component mount
  useEffect(() => {
    const fetchProject = async () => {
      if (!user || !id) {
        setLoading(false);
        return;
      }

      try {
        const projectData = await getProjectById(id as string, user.uid);
        if (projectData) {
          setProject(projectData);
        } else {
          Alert.alert('Error', 'Project not found');
          router.back();
        }
      } catch (error) {
        console.error('Error fetching project:', error);
        Alert.alert('Error', 'Failed to load project data');
        router.back();
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [user, id]);

  // Subscribe to project content data
  useEffect(() => {
    if (!user || !project?.id) {
      return;
    }

    console.log('Setting up subscriptions for project content');
    setDataLoading(true);

    let completedSubscriptions = 0;
    const totalSubscriptions = 2;

    const checkAllLoaded = () => {
      completedSubscriptions++;
      if (completedSubscriptions >= totalSubscriptions) {
        setDataLoading(false);
      }
    };

    // Subscribe to cost codes
    const unsubscribeCostCodes = subscribeToCostCodes(
      project.id,
      user.uid,
      (costCodes) => {
        setCostCodes(costCodes);
        checkAllLoaded();
      }
    );

    // Subscribe to scope items
    const unsubscribeScopeItems = subscribeToScopeItems(
      project.id,
      user.uid,
      (scopeItems) => {
        setScopeItems(scopeItems);
        checkAllLoaded();
      }
    );

    return () => {
      console.log('Cleaning up project content subscriptions');
      unsubscribeCostCodes();
      unsubscribeScopeItems();
    };
  }, [user, project]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
      case 'In Progress':
      case 'Completed': return colors.success;
      case 'On Hold':
      case 'Delayed':
      case 'Not Started': return colors.warning;
      case 'Planned': return colors.info;
      case 'Cancelled': return colors.danger;
      default: return colors.gray;
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Handler functions for modals and CRUD operations
  const handleSaveCostCode = async (data?: CreateCostCodeData) => {
    if (!user) return;
    
    const dataToSave = data || newCostCode;
    
    if (editingCostCode) {
      // Update existing cost code
      await updateCostCode(editingCostCode.id, dataToSave);
      setEditingCostCode(null);
    } else {
      // Create new cost code
      await createCostCode(dataToSave, user.uid);
      setNewCostCode({
        code: '',
        description: '',
        category: 'Labor',
        projectId: project?.id || ''
      });
      setShowAddCostCode(false);
    }
  };

  const handleSaveScopeItem = async (data?: CreateScopeItemData) => {
    if (!user) return;
    
    const dataToSave = data || newScopeItem;
    
    if (editingScopeItem) {
      // Update existing scope item
      await updateScopeItem(editingScopeItem.id, dataToSave);
      setEditingScopeItem(null);
    } else {
      // Create new scope item
      await createScopeItem(dataToSave, user.uid);
      setNewScopeItem({
        name: '',
        description: '',
        status: 'Not Started',
        progress: 0,
        projectId: project?.id || ''
      });
      setShowAddScopeItem(false);
    }
  };

  const handleDeleteScopeItem = async (scopeItemId: string) => {
    Alert.alert(
      'Delete Scope Item',
      'Are you sure you want to delete this scope item?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteScopeItem(scopeItemId);
            } catch (error) {
              console.error('Error deleting scope item:', error);
              Alert.alert('Error', 'Failed to delete scope item');
            }
          }
        }
      ]
    );
  };

  const handleDeleteCostCode = async (costCodeId: string) => {
    Alert.alert(
      'Delete Cost Code',
      'Are you sure you want to delete this cost code?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteCostCode(costCodeId);
            } catch (error) {
              console.error('Error deleting cost code:', error);
              Alert.alert('Error', 'Failed to delete cost code');
            }
          }
        }
      ]
    );
  };

  const renderCostCodes = () => (
    <View style={globalStyles.table}>
      <View style={{ flex: 1 }}>
        {/* Table Header */}
        <View style={globalStyles.tableHeader}>
          <View style={[globalStyles.tableHeaderCell, { flex: 1.2 }]}> {/* Code */}
            <Text style={globalStyles.tableHeaderText}>Code</Text>
          </View>
          <View style={[globalStyles.tableHeaderCell, { flex: 2.5 }]}> {/* Description */}
            <Text style={globalStyles.tableHeaderText}>Description</Text>
          </View>
          <View style={[globalStyles.tableHeaderCell, { flex: 1.5 }]}> {/* Category */}
            <Text style={globalStyles.tableHeaderText}>Category</Text>
          </View>
          <View style={[globalStyles.tableHeaderCell, globalStyles.tableHeaderCellLast, { flex: 1.2 }]}> {/* Actions */}
            <Text style={globalStyles.tableHeaderText}>Actions</Text>
          </View>
        </View>
        {/* Table Rows */}
        {costCodes.map((code, index) => (
          <View key={code.id} style={[globalStyles.tableRow, index === costCodes.length - 1 && globalStyles.tableRowLast]}>
            <View style={[globalStyles.tableCell, { flex: 1.2 }]}> {/* Code */}
              <Text style={globalStyles.tableCellText}>{code.code}</Text>
            </View>
            <View style={[globalStyles.tableCell, { flex: 2.5 }]}> {/* Description */}
              <Text style={globalStyles.tableCellText}>{code.description}</Text>
            </View>
            <View style={[globalStyles.tableCell, { flex: 1.5 }]}> {/* Category */}
              <Text style={globalStyles.tableCellText}>{code.category}</Text>
            </View>
            <View style={[globalStyles.tableCell, globalStyles.tableCellLast, { flex: 1.2, flexDirection: 'row', gap: 8 }]}> {/* Actions */}
              <TouchableOpacity 
                style={[globalStyles.iconButton, { backgroundColor: colors.primary }]}
                onPress={() => {
                  setEditingCostCode(code);
                  setShowAddCostCode(true);
                }}
              >
                <Ionicons name="pencil" size={16} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={[globalStyles.iconButton, { backgroundColor: colors.danger }]}
                onPress={() => handleDeleteCostCode(code.id)}
              >
                <Ionicons name="trash" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  const renderScopeOfWork = () => (
    <View style={globalStyles.table}>
      <View style={{ flex: 1 }}>
        {/* Table Header */}
        <View style={globalStyles.tableHeader}>
          <View style={[globalStyles.tableHeaderCell, { flex: 2 }]}> {/* Scope Item */}
            <Text style={globalStyles.tableHeaderText}>Scope Item</Text>
          </View>
          <View style={[globalStyles.tableHeaderCell, { flex: 2.5 }]}> {/* Description */}
            <Text style={globalStyles.tableHeaderText}>Description</Text>
          </View>
          <View style={[globalStyles.tableHeaderCell, { flex: 1.2 }]}> {/* Status */}
            <Text style={globalStyles.tableHeaderText}>Status</Text>
          </View>
          <View style={[globalStyles.tableHeaderCell, { flex: 1.2 }]}> {/* Progress */}
            <Text style={globalStyles.tableHeaderText}>Progress</Text>
          </View>
          <View style={[globalStyles.tableHeaderCell, globalStyles.tableHeaderCellLast, { flex: 1.2 }]}> {/* Actions */}
            <Text style={globalStyles.tableHeaderText}>Actions</Text>
          </View>
        </View>
        {/* Table Rows */}
        {scopeItems.map((item, index) => (
          <View key={item.id} style={[globalStyles.tableRow, index === scopeItems.length - 1 && globalStyles.tableRowLast]}>
            <View style={[globalStyles.tableCell, { flex: 2 }]}> {/* Scope Item */}
              <Text style={globalStyles.tableCellText}>{item.name}</Text>
            </View>
            <View style={[globalStyles.tableCell, { flex: 2.5 }]}> {/* Description */}
              <Text style={globalStyles.tableCellText} numberOfLines={2}>{item.description}</Text>
            </View>
            <View style={[globalStyles.tableCell, { flex: 1.2 }]}> {/* Status */}
              <View style={[globalStyles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                <Text style={globalStyles.statusText}>{item.status}</Text>
              </View>
            </View>
            <View style={[globalStyles.tableCell, { flex: 1.2 }]}> {/* Progress */}
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{
                  flex: 1,
                  height: 6,
                  backgroundColor: '#E5E5EA',
                  borderRadius: 3,
                  marginRight: 8,
                  overflow: 'hidden'
                }}>
                  <View style={{
                    height: '100%',
                    width: `${item.progress}%`,
                    backgroundColor: colors.primary,
                    borderRadius: 3
                  }} />
                </View>
                <Text style={globalStyles.tableCellText}>{item.progress}%</Text>
              </View>
            </View>
            <View style={[globalStyles.tableCell, globalStyles.tableCellLast, { flex: 1.2, flexDirection: 'row', gap: 8 }]}> {/* Actions */}
              <TouchableOpacity 
                style={[globalStyles.iconButton, { backgroundColor: colors.primary }]}
                onPress={() => {
                  setEditingScopeItem(item);
                  setShowAddScopeItem(true);
                }}
              >
                <Ionicons name="pencil" size={16} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={[globalStyles.iconButton, { backgroundColor: colors.danger }]}
                onPress={() => handleDeleteScopeItem(item.id)}
              >
                <Ionicons name="trash" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  const renderDailyReports = () => (
    <View style={globalStyles.table}>
      <View style={{ flex: 1 }}>
        {/* Table Header */}
        <View style={globalStyles.tableHeader}>
          <View style={[globalStyles.tableHeaderCell, { flex: 1.2 }]}> {/* Date */}
            <Text style={globalStyles.tableHeaderText}>Date</Text>
          </View>
          <View style={[globalStyles.tableHeaderCell, { flex: 1.5 }]}> {/* Weather */}
            <Text style={globalStyles.tableHeaderText}>Weather</Text>
          </View>
          <View style={[globalStyles.tableHeaderCell, { flex: 2.5 }]}> {/* Work Completed */}
            <Text style={globalStyles.tableHeaderText}>Work Completed</Text>
          </View>
          <View style={[globalStyles.tableHeaderCell, { flex: 1.2 }]}> {/* Crew Size */}
            <Text style={globalStyles.tableHeaderText}>Crew Size</Text>
          </View>
          <View style={[globalStyles.tableHeaderCell, { flex: 1 }]}> {/* Photos */}
            <Text style={globalStyles.tableHeaderText}>Photos</Text>
          </View>
          <View style={[globalStyles.tableHeaderCell, globalStyles.tableHeaderCellLast, { flex: 1.2 }]}> {/* Actions */}
            <Text style={globalStyles.tableHeaderText}>Actions</Text>
          </View>
        </View>
        {/* Table Rows */}
        {dailyReports.map((report, index) => (
          <View key={report.id} style={[globalStyles.tableRow, index === dailyReports.length - 1 && globalStyles.tableRowLast]}>
            <View style={[globalStyles.tableCell, { flex: 1.2 }]}> {/* Date */}
              <Text style={globalStyles.tableCellText}>{formatDate(report.date)}</Text>
            </View>
            <View style={[globalStyles.tableCell, { flex: 1.5 }]}> {/* Weather */}
              <Text style={globalStyles.tableCellText}>{report.weather}</Text>
            </View>
            <View style={[globalStyles.tableCell, { flex: 2.5 }]}> {/* Work Completed */}
              <Text style={globalStyles.tableCellText} numberOfLines={2}>{report.workCompleted}</Text>
            </View>
            <View style={[globalStyles.tableCell, { flex: 1.2 }]}> {/* Crew Size */}
              <Text style={globalStyles.tableCellText}>{report.crew.length} members</Text>
            </View>
            <View style={[globalStyles.tableCell, { flex: 1 }]}> {/* Photos */}
              <Text style={globalStyles.tableCellText}>{report.photos}</Text>
            </View>
            <View style={[globalStyles.tableCell, globalStyles.tableCellLast, { flex: 1.2 }]}> {/* Actions */}
              <TouchableOpacity 
                style={[globalStyles.iconButton, { backgroundColor: colors.primary }]}
                onPress={() => router.push(`/safety/daily-reports/${report.id}` as any)}
              >
                <Ionicons name="eye" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  const renderPhotos = () => (
    <View>
      <View style={globalStyles.card}>
        <Text style={globalStyles.textSecondary}>Photo gallery functionality will be implemented here.</Text>
        <Text style={globalStyles.textSecondary}>Features: Date filtering, photo organization, modal viewing.</Text>
      </View>
    </View>
  );

  const renderDrawings = () => (
    <View>
      <View style={globalStyles.card}>
        <Text style={globalStyles.textSecondary}>Drawing management functionality will be implemented here.</Text>
        <Text style={globalStyles.textSecondary}>Features: File upload, drawing viewer, version control.</Text>
      </View>
    </View>
  );

  const renderTabContent = () => {
    return (
      <View style={{ flex: 1 }}>
        {/* Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={[globalStyles.navContainer, { marginHorizontal: 16, marginTop: 8 }]}>
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab.id}
                style={[
                  globalStyles.navButton,
                  activeTab === tab.id && globalStyles.navButtonActive
                ]}
                onPress={() => setActiveTab(tab.id)}
              >
                <Ionicons 
                  name={tab.icon as any} 
                  size={16} 
                  color={activeTab === tab.id ? '#FFFFFF' : colors.gray}
                  style={{ marginBottom: 4 }}
                />
                <Text style={[
                  globalStyles.navButtonText,
                  activeTab === tab.id && globalStyles.navButtonTextActive
                ]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Tab Content */}
        <View style={{ flex: 1, paddingHorizontal: 20, paddingVertical: 8 }}>
          {(() => {
            switch (activeTab) {
              case 'costcodes': return renderCostCodes();
              case 'scope': return renderScopeOfWork();
              case 'reports': return renderDailyReports();
              case 'photos': return renderPhotos();
              case 'drawings': return renderDrawings();
              default: return renderCostCodes();
            }
          })()}
        </View>
      </View>
    );
  };

  // Show loading state
  if (loading) {
    return (
      <MainLayout>
        <View style={[globalStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={{ marginTop: 16, fontSize: 16, color: colors.text }}>
            Loading project...
          </Text>
        </View>
      </MainLayout>
    );
  }

  // Show error state if project not found
  if (!project) {
    return (
      <MainLayout>
        <View style={[globalStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <Ionicons name="alert-circle-outline" size={64} color={colors.gray} />
          <Text style={{ marginTop: 16, fontSize: 18, color: colors.text }}>
            Project not found
          </Text>
          <TouchableOpacity 
            style={[globalStyles.primaryButton, { marginTop: 16 }]}
            onPress={() => router.back()}
          >
            <Text style={globalStyles.primaryButtonText}>Go Back</Text>
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
          title={`${project.name} - ${tabs.find(tab => tab.id === activeTab)?.label || 'Cost Codes'}`}
          icon="folder-outline"
          rightContent={
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              {/* Action button based on active tab */}
              {activeTab === 'costcodes' && (
                <TouchableOpacity
                  style={globalStyles.primaryButton}
                  onPress={() => {
                    setEditingCostCode(null);
                    setShowAddCostCode(true);
                  }}
                >
                  <View style={[globalStyles.row, globalStyles.centered]}>
                    <Ionicons name="add" size={20} color="#FFFFFF" style={globalStyles.iconWithMargin} />
                    <Text style={globalStyles.primaryButtonText}>Add Code</Text>
                  </View>
                </TouchableOpacity>
              )}
              {activeTab === 'scope' && (
                <TouchableOpacity
                  style={globalStyles.primaryButton}
                  onPress={() => {
                    setEditingScopeItem(null);
                    setShowAddScopeItem(true);
                  }}
                >
                  <View style={[globalStyles.row, { alignItems: 'center' }]}>
                    <Ionicons name="add" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                    <Text style={globalStyles.primaryButtonText}>Add Scope</Text>
                  </View>
                </TouchableOpacity>
              )}
              {activeTab === 'reports' && (
                <TouchableOpacity
                  style={globalStyles.primaryButton}
                  onPress={() => router.push('/safety/daily-reports')}
                >
                  <View style={[globalStyles.row, { alignItems: 'center' }]}>
                    <Ionicons name="add" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                    <Text style={globalStyles.primaryButtonText}>Daily Reports</Text>
                  </View>
                </TouchableOpacity>
              )}
              {activeTab === 'photos' && (
                <TouchableOpacity
                  style={globalStyles.primaryButton}
                >
                  <View style={[globalStyles.row, { alignItems: 'center' }]}>
                    <Ionicons name="add" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                    <Text style={globalStyles.primaryButtonText}>Upload Photos</Text>
                  </View>
                </TouchableOpacity>
              )}
              {activeTab === 'drawings' && (
                <TouchableOpacity
                  style={globalStyles.primaryButton}
                >
                  <View style={[globalStyles.row, { alignItems: 'center' }]}>
                    <Ionicons name="add" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                    <Text style={globalStyles.primaryButtonText}>Upload Drawing</Text>
                  </View>
                </TouchableOpacity>
              )}
              <View style={[globalStyles.statusBadge, { backgroundColor: getStatusColor(project.status) }]}>
                <Text style={globalStyles.statusText}>{project.status}</Text>
              </View>
            </View>
          }
        />

        {/* Content */}
        <View style={{ flex: 1, flexDirection: 'row', minHeight: 0 }}>
          {/* Navigation Column */}
          <View style={[globalStyles.navContainer, { paddingHorizontal: 8, paddingTop: 8, minWidth: 160, maxWidth: 220, flexShrink: 0 }]}> 
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab.id}
                style={[
                  globalStyles.navButton,
                  activeTab === tab.id && globalStyles.navButtonActive
                ]}
                onPress={() => setActiveTab(tab.id)}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Ionicons 
                    name={tab.icon as any} 
                    size={16} 
                    color={activeTab === tab.id ? '#FFFFFF' : colors.gray}
                    style={{ marginRight: 8 }}
                  />
                  <Text style={[
                    globalStyles.navButtonText,
                    activeTab === tab.id && globalStyles.navButtonTextActive
                  ]}>
                    {tab.label}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Tab Content Column */}
          <View style={{ flex: 1, minWidth: 0 }}>
            <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 8 }}>
              {(() => {
                switch (activeTab) {
                  case 'costcodes': return renderCostCodes();
                  case 'scope': return renderScopeOfWork();
                  case 'reports': return renderDailyReports();
                  case 'photos': return renderPhotos();
                  case 'drawings': return renderDrawings();
                  default: return renderCostCodes();
                }
              })()}
            </ScrollView>
          </View>
        </View>

        {/* Modals */}
        <CostCodeModal
          visible={showAddCostCode || editingCostCode !== null}
          onClose={() => {
            setShowAddCostCode(false);
            setEditingCostCode(null);
          }}
          onSave={handleSaveCostCode}
          costCode={editingCostCode}
          projectId={project.id}
        />

        <ScopeItemModal
          visible={showAddScopeItem || editingScopeItem !== null}
          onClose={() => {
            setShowAddScopeItem(false);
            setEditingScopeItem(null);
          }}
          onSave={handleSaveScopeItem}
          scopeItem={editingScopeItem}
          projectId={project.id}
        />
      </View>
    </MainLayout>
  );
}
