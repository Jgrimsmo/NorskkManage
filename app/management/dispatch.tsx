import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Modal, FlatList } from 'react-native';
import { MainLayout } from '@/components/MainLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { globalStyles, colors } from '@/styles';
import { Ionicons } from '@expo/vector-icons';
import { getFirestore, collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { useAuth } from '@/contexts/AuthContext';

// Types
interface Project {
  id: string;
  name: string;
  costCodes?: string[];
}

interface CrewMember {
  id: string;
  name: string;
  role: string;
  phone?: string;
  status?: string;
}

interface Equipment {
  id: string;
  name: string;
  type: string;
  status?: string;
}

interface Assignment {
  id?: string;
  resourceId: string;
  resourceType: 'crew' | 'equipment';
  projectId: string;
  projectName: string;
  date: string;
  status: string;
  createdAt: string;
}

interface CalendarDay {
  date: string;
  dayName: string;
  dayNumber: number;
  isToday: boolean;
  isCurrentMonth?: boolean;
  monthName?: string;
  year?: number;
}

interface SelectedResource {
  id: string;
  type: 'crew' | 'equipment';
  data: CrewMember | Equipment;
}

// Helper functions
const getCurrentWeek = (): CalendarDay[] => {
  const today = new Date();
  const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
  const week: CalendarDay[] = [];
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    week.push({
      date: date.toISOString().split('T')[0],
      dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNumber: date.getDate(),
      isToday: date.toDateString() === new Date().toDateString()
    });
  }
  return week;
};

const getCurrentMonth = (): CalendarDay[] => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  
  const startDate = new Date(firstDay);
  startDate.setDate(firstDay.getDate() - firstDay.getDay());
  
  const endDate = new Date(lastDay);
  endDate.setDate(lastDay.getDate() + (6 - lastDay.getDay()));
  
  const monthDates: CalendarDay[] = [];
  const currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    monthDates.push({
      date: currentDate.toISOString().split('T')[0],
      dayName: currentDate.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNumber: currentDate.getDate(),
      isToday: currentDate.toDateString() === new Date().toDateString(),
      isCurrentMonth: currentDate.getMonth() === month,
      monthName: currentDate.toLocaleDateString('en-US', { month: 'long' }),
      year: currentDate.getFullYear()
    });
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return monthDates;
};

const getEquipmentIcon = (type: string): string => {
  switch (type) {
    case 'Excavator': return '🚜';
    case 'Skid Steer': return '🚛';
    case 'Attachment': return '🔧';
    case 'Compactor': return '🚌';
    case 'Dump Truck': return '🚚';
    case 'Crane': return '🏗️';
    case 'Bulldozer': return '🚜';
    case 'Loader': return '🚛';
    default: return '⚙️';
  }
};

export default function DispatchScreen() {
  const { user } = useAuth();
  
  // State management
  const [assignments, setAssignments] = useState<{[key: string]: Assignment}>({});
  const [projects, setProjects] = useState<Project[]>([]);
  const [crew, setCrew] = useState<CrewMember[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [selectedResources, setSelectedResources] = useState<SelectedResource[]>([]);
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');
  const [currentWeek, setCurrentWeek] = useState<CalendarDay[]>(getCurrentWeek());
  const [currentMonth, setCurrentMonth] = useState<CalendarDay[]>(getCurrentMonth());
  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showResourceModal, setShowResourceModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);

  // Load data on component mount
  useEffect(() => {
    loadDispatchData();
  }, []);

  // Set selected project when projects are loaded
  useEffect(() => {
    if (projects.length > 0 && !selectedProject) {
      setSelectedProject(projects[0].id);
    }
  }, [projects, selectedProject]);

  const loadDispatchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const db = getFirestore();
      
      // Load all collections in parallel
      const [projectsSnapshot, crewSnapshot, equipmentSnapshot, assignmentsSnapshot] = await Promise.all([
        getDocs(collection(db, 'projects')),
        getDocs(collection(db, 'crew')),
        getDocs(collection(db, 'equipment')),
        getDocs(collection(db, 'assignments'))
      ]);

      // Process projects data
      const projectsList: Project[] = projectsSnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
        costCodes: doc.data().costCodes || []
      }));

      // Add default projects if none exist
      if (projectsList.length === 0) {
        projectsList.push(
          { id: 'default-1', name: 'General Construction' },
          { id: 'default-2', name: 'Site Preparation' },
          { id: 'default-3', name: 'Equipment Maintenance' }
        );
      }
      setProjects(projectsList);

      // Process crew data
      const crewList: CrewMember[] = crewSnapshot.docs.length > 0 
        ? crewSnapshot.docs.map(doc => ({
            id: doc.id,
            name: doc.data().name,
            role: doc.data().role,
            phone: doc.data().phone,
            status: doc.data().status || 'Available'
          }))
        : [
            { id: '1', name: 'John Smith', role: 'Foreman', status: 'Available' },
            { id: '2', name: 'Mike Johnson', role: 'Operator', status: 'Available' },
            { id: '3', name: 'Dave Wilson', role: 'Laborer', status: 'Available' },
            { id: '4', name: 'Tom Brown', role: 'Laborer', status: 'Available' }
          ];
      setCrew(crewList);

      // Process equipment data
      const equipmentList: Equipment[] = equipmentSnapshot.docs.length > 0
        ? equipmentSnapshot.docs.map(doc => ({
            id: doc.id,
            name: doc.data().name,
            type: doc.data().type,
            status: doc.data().status || 'Available'
          }))
        : [
            { id: '1', name: 'CAT 320', type: 'Excavator', status: 'Available' },
            { id: '2', name: 'Bobcat S650', type: 'Skid Steer', status: 'Available' },
            { id: '3', name: 'Hydraulic Hammer', type: 'Attachment', status: 'Available' },
            { id: '4', name: 'Plate Compactor', type: 'Compactor', status: 'Available' }
          ];
      setEquipment(equipmentList);

      // Process assignments data
      const assignmentsObj: {[key: string]: Assignment} = {};
      assignmentsSnapshot.docs.forEach(doc => {
        const data = doc.data();
        assignmentsObj[doc.id] = {
          id: doc.id,
          resourceId: data.resourceId,
          resourceType: data.resourceType,
          projectId: data.projectId,
          projectName: data.projectName,
          date: data.date,
          status: data.status || 'Scheduled',
          createdAt: data.createdAt || new Date().toISOString()
        };
      });
      setAssignments(assignmentsObj);

    } catch (err) {
      console.error("Error loading dispatch data:", err);
      setError("Failed to load dispatch data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Add assignment function
  const addAssignment = async (date: string) => {
    if (selectedResources.length === 0) {
      setWarningMessage('Please select at least one crew member or equipment first');
      setShowWarning(true);
      return;
    }

    const selectedProjectData = projects.find(p => p.id === selectedProject);
    
    // Check for existing assignments on this date
    const existingAssignments = Object.values(assignments).filter(assignment => assignment.date === date);
    const alreadyAssigned: string[] = [];
    
    selectedResources.forEach(selectedResource => {
      const isAlreadyAssigned = existingAssignments.some(assignment => 
        assignment.resourceId === selectedResource.id
      );
      
      if (isAlreadyAssigned) {
        const resourceName = selectedResource.data.name;
        const resourceType = selectedResource.type === 'crew' ? 'crew member' : 'equipment';
        alreadyAssigned.push(`${resourceName} (${resourceType})`);
      }
    });

    // Show warning if any resources are already assigned
    if (alreadyAssigned.length > 0) {
      const message = alreadyAssigned.length === 1
        ? `${alreadyAssigned[0]} is already assigned for this date.`
        : `The following resources are already assigned for this date:\n\n${alreadyAssigned.join('\n')}\n\nPlease remove them from selection or choose a different date.`;
      
      setWarningMessage(message);
      setShowWarning(true);
      return;
    }
    
    try {
      const db = getFirestore();
      
      // Create assignments for all selected resources
      for (const selectedResource of selectedResources) {
        const newAssignment: Assignment = {
          resourceId: selectedResource.id,
          resourceType: selectedResource.type,
          projectId: selectedProject,
          projectName: selectedProjectData?.name || 'Unknown Project',
          date: date,
          status: 'Scheduled',
          createdAt: new Date().toISOString()
        };
        
        // Add to Firebase
        const docRef = await addDoc(collection(db, "assignments"), newAssignment);
        
        // Update local state
        setAssignments(prev => ({
          ...prev,
          [docRef.id]: { ...newAssignment, id: docRef.id }
        }));
      }
    } catch (err) {
      console.error("Error adding assignments:", err);
      setError("Failed to add assignments. Please try again.");
    }
  };

  const removeAssignment = async (assignmentId: string) => {
    const assignment = assignments[assignmentId];
    if (!assignment) return;

    Alert.alert(
      "Remove Assignment",
      "Are you sure you want to remove this assignment?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Remove", 
          style: "destructive",
          onPress: async () => {
            try {
              const db = getFirestore();
              await deleteDoc(doc(db, "assignments", assignmentId));
              
              setAssignments(prev => {
                const newAssignments = { ...prev };
                delete newAssignments[assignmentId];
                return newAssignments;
              });
            } catch (err) {
              console.error("Error removing assignment:", err);
              setError("Failed to remove assignment. Please try again.");
            }
          }
        }
      ]
    );
  };

  const navigateWeek = (direction: number) => {
    const startDate = new Date(currentWeek[0].date);
    startDate.setDate(startDate.getDate() + (direction * 7));
    
    const week: CalendarDay[] = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      week.push({
        date: date.toISOString().split('T')[0],
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNumber: date.getDate(),
        isToday: date.toDateString() === new Date().toDateString()
      });
    }
    setCurrentWeek(week);
  };

  const navigateMonth = (direction: number) => {
    const currentDate = new Date(currentMonth[15].date);
    currentDate.setMonth(currentDate.getMonth() + direction);
    
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const startDate = new Date(firstDay);
    startDate.setDate(firstDay.getDate() - firstDay.getDay());
    
    const endDate = new Date(lastDay);
    endDate.setDate(lastDay.getDate() + (6 - lastDay.getDay()));
    
    const monthDates: CalendarDay[] = [];
    const current = new Date(startDate);
    
    while (current <= endDate) {
      monthDates.push({
        date: current.toISOString().split('T')[0],
        dayName: current.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNumber: current.getDate(),
        isToday: current.toDateString() === new Date().toDateString(),
        isCurrentMonth: current.getMonth() === month,
        monthName: current.toLocaleDateString('en-US', { month: 'long' }),
        year: current.getFullYear()
      });
      current.setDate(current.getDate() + 1);
    }
    
    setCurrentMonth(monthDates);
  };

  // Helper function to toggle resource selection
  const toggleResourceSelection = (resource: SelectedResource) => {
    setSelectedResources(prev => {
      const isSelected = prev.some(r => r.id === resource.id);
      if (isSelected) {
        return prev.filter(r => r.id !== resource.id);
      } else {
        return [...prev, resource];
      }
    });
  };

  // Helper function to check if resource is selected
  const isResourceSelected = (resourceId: string): boolean => {
    return selectedResources.some(r => r.id === resourceId);
  };

  // Memoized grouped data
  const groupedCrew = useMemo(() => {
    return crew.reduce((acc, member) => {
      if (!acc[member.role]) acc[member.role] = [];
      acc[member.role].push(member);
      return acc;
    }, {} as {[key: string]: CrewMember[]});
  }, [crew]);

  const groupedEquipment = useMemo(() => {
    return equipment.reduce((acc, item) => {
      const type = item.type || 'Other';
      if (!acc[type]) acc[type] = [];
      acc[type].push(item);
      return acc;
    }, {} as {[key: string]: Equipment[]});
  }, [equipment]);

  // Get assignments for a specific date
  const getAssignmentsForDate = (date: string): Assignment[] => {
    return Object.values(assignments).filter(assignment => assignment.date === date);
  };

  // Get resource info by ID and type
  const getResourceInfo = (resourceId: string, resourceType: 'crew' | 'equipment') => {
    if (resourceType === 'crew') {
      return crew.find(member => member.id === resourceId);
    } else {
      return equipment.find(item => item.id === resourceId);
    }
  };

  // Render calendar day
  const renderCalendarDay = (day: CalendarDay) => {
    const dayAssignments = getAssignmentsForDate(day.date);
    const hasAssignments = dayAssignments.length > 0;
    
    // Calculate flex basis for responsive layout
    const isWeekView = viewMode === 'week';
    const dayWidth = isWeekView ? (100 / 7) : (100 / 7);

    return (
      <TouchableOpacity
        key={day.date}
        style={[
          globalStyles.calendarDay,
          day.isToday && globalStyles.calendarDayToday,
          viewMode === 'month' && !day.isCurrentMonth && globalStyles.calendarDayInactive,
          {
            width: isWeekView ? `${dayWidth - 2}%` : `${dayWidth - 1}%`,
            minHeight: isWeekView ? 120 : 100,
          }
        ]}
        onPress={() => addAssignment(day.date)}
      >
        <Text style={[
          globalStyles.calendarDayText,
          day.isToday && globalStyles.calendarDayTextToday,
          viewMode === 'month' && !day.isCurrentMonth && globalStyles.calendarDayTextInactive
        ]}>
          {day.dayName}
        </Text>
        <Text style={[
          globalStyles.calendarDayNumber,
          day.isToday && globalStyles.calendarDayNumberToday,
          viewMode === 'month' && !day.isCurrentMonth && globalStyles.calendarDayNumberInactive
        ]}>
          {day.dayNumber}
        </Text>
        
        {hasAssignments && (
          <View style={globalStyles.assignmentsContainer}>
            {dayAssignments.map((assignment) => {
              const resource = getResourceInfo(assignment.resourceId, assignment.resourceType);
              if (!resource) return null;
              
              return (
                <TouchableOpacity
                  key={assignment.id}
                  style={[
                    globalStyles.assignmentBadge,
                    { backgroundColor: assignment.resourceType === 'crew' ? colors.success : colors.info }
                  ]}
                  onPress={(e) => {
                    e.stopPropagation();
                    if (assignment.id) {
                      removeAssignment(assignment.id);
                    }
                  }}
                >
                  <Text style={globalStyles.assignmentBadgeText} numberOfLines={1}>
                    {assignment.resourceType === 'equipment' && getEquipmentIcon((resource as Equipment).type)} {resource.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  // Render project selection modal
  const renderProjectModal = () => (
    <Modal
      visible={showProjectModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowProjectModal(false)}
    >
      <View style={globalStyles.modalOverlay}>
        <View style={globalStyles.modalContainer}>
          <View style={globalStyles.modalHeader}>
            <Text style={globalStyles.modalTitle}>Select Project</Text>
            <TouchableOpacity
              style={globalStyles.modalCloseButton}
              onPress={() => setShowProjectModal(false)}
            >
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={globalStyles.modalContent}>
            {projects.map((project) => (
              <TouchableOpacity
                key={project.id}
                style={[
                  globalStyles.resourceItem,
                  selectedProject === project.id && globalStyles.resourceItemSelected
                ]}
                onPress={() => {
                  setSelectedProject(project.id);
                  setShowProjectModal(false);
                }}
              >
                <View style={globalStyles.resourceItemInfo}>
                  <Text style={globalStyles.resourceItemName}>{project.name}</Text>
                </View>
                {selectedProject === project.id && (
                  <Ionicons name="checkmark-circle" size={20} color={colors.success} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  // Render resource selection modal
  const renderResourceModal = () => (
    <Modal
      visible={showResourceModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowResourceModal(false)}
    >
      <View style={globalStyles.modalOverlay}>
        <View style={globalStyles.modalContainer}>
          <View style={globalStyles.modalHeader}>
            <Text style={globalStyles.modalTitle}>Select Resources</Text>
            <TouchableOpacity
              style={globalStyles.modalCloseButton}
              onPress={() => setShowResourceModal(false)}
            >
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={globalStyles.modalContent}>
            {/* Crew Section */}
            <Text style={globalStyles.sectionTitle}>Crew Members</Text>
            {Object.entries(groupedCrew).map(([role, members]) => (
              <View key={role} style={globalStyles.resourceGroup}>
                <Text style={globalStyles.resourceGroupTitle}>{role}</Text>
                {members.map((member) => (
                  <TouchableOpacity
                    key={member.id}
                    style={[
                      globalStyles.resourceItem,
                      isResourceSelected(member.id) && globalStyles.resourceItemSelected
                    ]}
                    onPress={() => toggleResourceSelection({
                      id: member.id,
                      type: 'crew',
                      data: member
                    })}
                  >
                    <View style={globalStyles.resourceItemInfo}>
                      <Text style={globalStyles.resourceItemName}>{member.name}</Text>
                      <Text style={globalStyles.resourceItemDetail}>{member.status}</Text>
                    </View>
                    {isResourceSelected(member.id) && (
                      <Ionicons name="checkmark-circle" size={20} color={colors.success} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            ))}

            {/* Equipment Section */}
            <Text style={globalStyles.sectionTitle}>Equipment</Text>
            {Object.entries(groupedEquipment).map(([type, items]) => (
              <View key={type} style={globalStyles.resourceGroup}>
                <Text style={globalStyles.resourceGroupTitle}>{type}</Text>
                {items.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      globalStyles.resourceItem,
                      isResourceSelected(item.id) && globalStyles.resourceItemSelected
                    ]}
                    onPress={() => toggleResourceSelection({
                      id: item.id,
                      type: 'equipment',
                      data: item
                    })}
                  >
                    <View style={globalStyles.resourceItemInfo}>
                      <Text style={globalStyles.resourceItemName}>
                        {getEquipmentIcon(item.type)} {item.name}
                      </Text>
                      <Text style={globalStyles.resourceItemDetail}>{item.status}</Text>
                    </View>
                    {isResourceSelected(item.id) && (
                      <Ionicons name="checkmark-circle" size={20} color={colors.success} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </ScrollView>

          <View style={globalStyles.modalFooter}>
            <TouchableOpacity
              style={globalStyles.secondaryButton}
              onPress={() => setSelectedResources([])}
            >
              <Text style={globalStyles.secondaryButtonText}>Clear All</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={globalStyles.primaryButton}
              onPress={() => setShowResourceModal(false)}
            >
              <Text style={globalStyles.primaryButtonText}>
                Done ({selectedResources.length} selected)
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  // Render warning modal
  const renderWarningModal = () => (
    <Modal
      visible={showWarning}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowWarning(false)}
    >
      <View style={globalStyles.modalOverlay}>
        <View style={globalStyles.alertContainer}>
          <View style={globalStyles.alertHeader}>
            <Ionicons name="warning" size={24} color={colors.warning} />
            <Text style={globalStyles.alertTitle}>Warning</Text>
          </View>
          <Text style={globalStyles.alertMessage}>{warningMessage}</Text>
          <TouchableOpacity
            style={globalStyles.primaryButton}
            onPress={() => setShowWarning(false)}
          >
            <Text style={globalStyles.primaryButtonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  if (loading) {
    return (
      <MainLayout>
        <View style={[globalStyles.container, globalStyles.centered]}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[globalStyles.text, { marginTop: 16 }]}>
            Loading dispatch calendar...
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
            onPress={loadDispatchData}
          >
            <Text style={globalStyles.primaryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </MainLayout>
    );
  }

  const calendarDays = viewMode === 'week' ? currentWeek : currentMonth;
  const currentPeriod = viewMode === 'week' 
    ? `Week of ${currentWeek[0].dayName}, ${currentWeek[0].monthName} ${currentWeek[0].dayNumber}`
    : `${currentMonth[15].monthName} ${currentMonth[15].year}`;

  return (
    <MainLayout>
      <View style={[globalStyles.container, { padding: 0, margin: 0 }]}>
        {/* Header */}
        <PageHeader 
          title="Dispatch & Scheduling" 
          icon="car-outline"
          rightContent={
            <TouchableOpacity 
              style={globalStyles.primaryButton}
              onPress={() => setShowResourceModal(true)}
            >
              <View style={[globalStyles.row, { alignItems: 'center' }]}>
                <Ionicons name="people" size={20} color="#FFFFFF" style={globalStyles.iconWithMargin} />
                <Text style={globalStyles.primaryButtonText}>
                  Select Resources ({selectedResources.length})
                </Text>
              </View>
            </TouchableOpacity>
          }
        />

        {/* Controls */}
        <View style={globalStyles.contentContainer}>
          <View style={globalStyles.toolbar}>
            {/* Project selector */}
            <View style={globalStyles.filterGroup}>
              <Text style={globalStyles.filterLabel}>Project:</Text>
              <View style={globalStyles.dropdownContainer}>
                <TouchableOpacity 
                  style={globalStyles.dropdown}
                  onPress={() => setShowProjectModal(true)}
                >
                  <Text style={globalStyles.dropdownText}>
                    {projects.find(p => p.id === selectedProject)?.name || 'Select Project'}
                  </Text>
                  <Ionicons name="chevron-down" size={16} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>
            </View>

            {/* View mode toggle */}
            <View style={[globalStyles.row, { gap: 8 }]}>
              <TouchableOpacity
                style={[
                  globalStyles.toggleButton,
                  viewMode === 'week' && globalStyles.toggleButtonActive
                ]}
                onPress={() => setViewMode('week')}
              >
                <Text style={[
                  globalStyles.toggleButtonText,
                  viewMode === 'week' && globalStyles.toggleButtonTextActive
                ]}>
                  Week
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  globalStyles.toggleButton,
                  viewMode === 'month' && globalStyles.toggleButtonActive
                ]}
                onPress={() => setViewMode('month')}
              >
                <Text style={[
                  globalStyles.toggleButtonText,
                  viewMode === 'month' && globalStyles.toggleButtonTextActive
                ]}>
                  Month
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Calendar navigation */}
          <View style={globalStyles.calendarHeader}>
            <TouchableOpacity
              style={globalStyles.navigationButton}
              onPress={() => viewMode === 'week' ? navigateWeek(-1) : navigateMonth(-1)}
            >
              <Ionicons name="chevron-back" size={24} color={colors.primary} />
            </TouchableOpacity>
            
            <View style={[globalStyles.row, { alignItems: 'center', gap: 12 }]}>
              <TouchableOpacity
                style={globalStyles.secondaryButton}
                onPress={() => {
                  if (viewMode === 'week') {
                    setCurrentWeek(getCurrentWeek());
                  } else {
                    setCurrentMonth(getCurrentMonth());
                  }
                }}
              >
                <Text style={globalStyles.secondaryButtonText}>Today</Text>
              </TouchableOpacity>
              <Text style={globalStyles.calendarTitle}>{currentPeriod}</Text>
            </View>
            
            <TouchableOpacity
              style={globalStyles.navigationButton}
              onPress={() => viewMode === 'week' ? navigateWeek(1) : navigateMonth(1)}
            >
              <Ionicons name="chevron-forward" size={24} color={colors.primary} />
            </TouchableOpacity>
          </View>

          {/* Calendar grid */}
          <View style={globalStyles.card}>
            <View style={[
              globalStyles.calendarGrid,
              viewMode === 'month' && globalStyles.calendarGridMonth
            ]}>
              {calendarDays.map(renderCalendarDay)}
            </View>
          </View>

          {/* Selected resources summary */}
          {selectedResources.length > 0 && (
            <View style={globalStyles.card}>
              <Text style={globalStyles.cardTitle}>Selected Resources</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={[globalStyles.row, { gap: 8 }]}>
                  {selectedResources.map((resource) => (
                    <View
                      key={resource.id}
                      style={[
                        globalStyles.badge,
                        { backgroundColor: resource.type === 'crew' ? colors.success : colors.info }
                      ]}
                    >
                      <Text style={globalStyles.badgeText}>
                        {resource.type === 'equipment' && getEquipmentIcon((resource.data as Equipment).type)} {resource.data.name}
                      </Text>
                      <TouchableOpacity
                        onPress={() => setSelectedResources(prev => prev.filter(r => r.id !== resource.id))}
                      >
                        <Ionicons name="close-circle" size={16} color="#FFFFFF" style={{ marginLeft: 4 }} />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </ScrollView>
            </View>
          )}
        </View>

        {/* Modals */}
        {renderProjectModal()}
        {renderResourceModal()}
        {renderWarningModal()}
      </View>
    </MainLayout>
  );
}
