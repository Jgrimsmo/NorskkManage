import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { MainLayout } from '@/components/MainLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { globalStyles, colors } from '@/styles';
import { Ionicons } from '@expo/vector-icons';
import { getFirestore, collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { useAuth } from '@/contexts/AuthContext';

// Import modular components
import { DateSelector } from '@/components/timecard/DateSelector';
import { TimecardTable } from '@/components/timecard/TimecardTable';
import { TimecardFormModal } from '@/components/timecard/TimecardFormModal';
import { TimecardExport } from '@/components/timecard/TimecardExport';
import { ConfirmDeleteModal } from '@/components/ui/ConfirmDeleteModal';

// Import utilities and constants
import {
  Timecard,
  Project,
  CrewMember,
  Equipment,
  PayPeriod,
  PAY_PERIODS,
  SAMPLE_CREW,
  SAMPLE_COST_CODES,
  WORK_TYPES,
  SAMPLE_EQUIPMENT,
  getCurrentPayPeriod,
  getDateRangeString,
  calculateDateRange
} from '@/utils/timecardUtils';
export default function TimecardsScreen() {
  // Authentication
  const { user } = useAuth();

  // State management
  const [viewMode, setViewMode] = useState<'payPeriod' | 'month' | 'customRange'>('payPeriod');
  const [selectedPayPeriod, setSelectedPayPeriod] = useState<PayPeriod>(getCurrentPayPeriod());
  const [selectedMonth, setSelectedMonth] = useState(getCurrentPayPeriod().start.slice(0, 7));
  const [customRange, setCustomRange] = useState({ 
    start: getCurrentPayPeriod().start, 
    end: getCurrentPayPeriod().end 
  });
  
  const [filters, setFilters] = useState({ 
    date: '', employee: '', project: '', equipment: '', 
    costCode: '', workType: '', status: '' 
  });

  // Data states
  const [timecards, setTimecards] = useState<Timecard[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [crew, setCrew] = useState<CrewMember[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [projectCostCodes, setProjectCostCodes] = useState<{[key: string]: string[]}>({});
  
  // UI states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingTimecard, setEditingTimecard] = useState<Timecard | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingTimecard, setDeletingTimecard] = useState<string | null>(null);

  // Fetch data from Firebase
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const db = getFirestore();
        
        // Fetch timecards with real-time listener
        const timecardsUnsubscribe = onSnapshot(
          collection(db, 'timeEntries'),
          (snapshot) => {
            const timecardsList = snapshot.docs.map((doc) => {
              const data = doc.data();
              return {
                id: doc.id,
                date: data.date || '',
                employee: data.employee || '',
                project: data.project || '',
                equipment: data.equipment || '',
                costCode: data.costCode || '',
                workType: data.workType || '',
                hours: data.hours || 0,
                notes: data.notes || '',
                status: data.status || (data.approved ? "Approved" : "Pending"),
                approved: data.approved || false,
                approvedBy: data.approvedBy || '',
                approvedDate: data.approvedDate || '',
                createdBy: data.createdBy || '',
                createdDate: data.createdDate || ''
              };
            });
            setTimecards(timecardsList);
          },
          (error) => {
            console.error('Error loading timecards:', error);
            console.error('Error code:', error.code);
            console.error('Error message:', error.message);
            setError("Failed to load timecards. Please try again.");
          }
        );

        // Fetch projects data
        const projectsSnapshot = await getDocs(collection(db, 'projects'));
        const projectsList = projectsSnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
          costCodes: doc.data().costCodes || []
        }));

        // Add default projects if none exist
        if (projectsList.length === 0) {
          projectsList.push(
            { id: 'default-1', name: 'General Construction', costCodes: SAMPLE_COST_CODES },
            { id: 'default-2', name: 'Site Preparation', costCodes: SAMPLE_COST_CODES },
            { id: 'default-3', name: 'Equipment Maintenance', costCodes: SAMPLE_COST_CODES }
          );
        }

        setProjects(projectsList);

        // Build cost codes mapping
        const costCodesMap: {[key: string]: string[]} = {};
        projectsList.forEach((project: Project) => {
          costCodesMap[project.name] = project.costCodes.length > 0 ? project.costCodes : SAMPLE_COST_CODES;
        });
        setProjectCostCodes(costCodesMap);

        // Fetch crew data
        const crewSnapshot = await getDocs(collection(db, 'crew'));
        const crewList = crewSnapshot.docs.length > 0 
          ? crewSnapshot.docs.map((doc) => ({
              id: doc.id,
              name: doc.data().name,
              role: doc.data().role,
              phone: doc.data().phone
            }))
          : SAMPLE_CREW;
        setCrew(crewList);

        // Fetch equipment data
        const equipmentSnapshot = await getDocs(collection(db, 'equipment'));
        const equipmentList = equipmentSnapshot.docs.length > 0
          ? equipmentSnapshot.docs.map((doc) => ({
              id: doc.id,
              name: doc.data().name,
              type: doc.data().type
            }))
          : [
              { id: '1', name: "CAT 320", type: "Excavator" },
              { id: '2', name: "Bobcat S650", type: "Skid Steer" },
              { id: '3', name: "Hydraulic Hammer", type: "Attachment" },
              { id: '4', name: "Plate Compactor", type: "Compactor" }
            ];
        setEquipment(equipmentList);

        setLoading(false);

        // Return cleanup function
        return () => {
          timecardsUnsubscribe();
        };

      } catch (err) {
        console.error("Error loading data:", err);
        setError("Failed to load data. Please try again.");
        setCrew(SAMPLE_CREW);
        setLoading(false);
      }
    };

    const cleanup = fetchData();
    
    // Return cleanup function
    return () => {
      if (cleanup instanceof Promise) {
        cleanup.then(cleanupFn => {
          if (typeof cleanupFn === 'function') {
            cleanupFn();
          }
        });
      }
    };
  }, []);

  // Refresh function to reload data
  const handleRefresh = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const db = getFirestore();
      
      // Re-fetch all data
      const [projectsSnapshot, crewSnapshot, equipmentSnapshot, timecardsSnapshot] = await Promise.all([
        getDocs(collection(db, "projects")),
        getDocs(collection(db, "crew")),
        getDocs(collection(db, "equipment")),
        getDocs(collection(db, "timeEntries"))
      ]);

      // Process and update all data (reuse the same logic from useEffect)
      const projectsList = (projectsSnapshot as any).docs.map((doc: any) => ({
        id: doc.id,
        name: doc.data().name,
        costCodes: doc.data().costCodes || []
      }));

      // Add default projects if none exist in management section
      if (projectsList.length === 0) {
        projectsList.push(
          { id: 'default-1', name: 'General Construction', costCodes: SAMPLE_COST_CODES },
          { id: 'default-2', name: 'Site Preparation', costCodes: SAMPLE_COST_CODES },
          { id: 'default-3', name: 'Equipment Maintenance', costCodes: SAMPLE_COST_CODES }
        );
      }

      setProjects(projectsList);

      const costCodesMap: {[key: string]: string[]} = {};
      projectsList.forEach((project: Project) => {
        costCodesMap[project.name] = project.costCodes.length > 0 ? project.costCodes : SAMPLE_COST_CODES;
      });
      setProjectCostCodes(costCodesMap);

      const crewList = (crewSnapshot as any).docs.length > 0 
        ? (crewSnapshot as any).docs.map((doc: any) => ({
            id: doc.id,
            name: doc.data().name,
            role: doc.data().role,
            phone: doc.data().phone
          }))
        : SAMPLE_CREW;
      setCrew(crewList);

      const equipmentList = (equipmentSnapshot as any).docs.length > 0
        ? (equipmentSnapshot as any).docs.map((doc: any) => ({
            id: doc.id,
            name: doc.data().name,
            type: doc.data().type
          }))
        : [
            { id: '1', name: "CAT 320", type: "Excavator" },
            { id: '2', name: "Bobcat S650", type: "Skid Steer" },
            { id: '3', name: "Hydraulic Hammer", type: "Attachment" },
            { id: '4', name: "Plate Compactor", type: "Compactor" }
          ];
      setEquipment(equipmentList);

      const timecardsList = (timecardsSnapshot as any).docs.map((doc: any) => {
        const data = doc.data();
        return {
          id: doc.id,
          date: data.date || '',
          employee: data.employee || '',
          project: data.project || '',
          equipment: data.equipment || '',
          costCode: data.costCode || '',
          workType: data.workType || '',
          hours: data.hours || 0,
          notes: data.notes || '',
          status: data.status || (data.approved ? "Approved" : "Pending"),
          approved: data.approved || false,
          approvedBy: data.approvedBy || '',
          approvedDate: data.approvedDate || '',
          createdBy: data.createdBy || '',
          createdDate: data.createdDate || ''
        };
      });
      setTimecards(timecardsList);

    } catch (err) {
      console.error("Error refreshing data:", err);
      setError("Failed to refresh data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Helper functions
  const canAssignEmployees = () => {
    return true; // user?.role === 'admin' || user?.role === 'manager';
  };

  const getDefaultEmployeeName = () => {
    return canAssignEmployees() ? "" : (user?.displayName || user?.email || "");
  };

  const canApproveEntries = () => {
    return true; // user?.role === 'admin' || user?.role === 'manager';
  };

  const getCostCodesForProject = (projectName: string) => {
    if (!projectName) return [];
    return projectCostCodes[projectName] || SAMPLE_COST_CODES;
  };

  // Date calculation using imported utility
  const visibleDates = calculateDateRange(viewMode, selectedPayPeriod, selectedMonth, customRange);

  // CRUD operations
  const handleChange = async (id: string, field: keyof Timecard, value: any) => {
    try {
      setTimecards(timecards.map(entry => {
        if (entry.id === id) {
          const updatedEntry = { ...entry, [field]: value };
          if (field === 'project') {
            updatedEntry.costCode = '';
          }
          return updatedEntry;
        }
        return entry;
      }));

      const db = getFirestore();
      const updateData: any = { [field]: value };
      if (field === 'project') {
        updateData.costCode = '';
      }

      await updateDoc(doc(db, "timeEntries", id), updateData);
    } catch (error) {
      console.error("Error updating time entry:", error);
      setError("Failed to save changes. Please try again.");
    }
  };

  const handleAddEntry = async (date: string) => {
    try {
      const newEntryData = {
        date,
        employee: getDefaultEmployeeName(),
        project: "",
        equipment: "",
        costCode: "",
        workType: "",
        hours: 0,
        notes: "",
        status: "draft",
        approved: false,
        createdBy: user?.displayName || user?.email || "",
        createdDate: new Date().toISOString()
      };

      const db = getFirestore();
      const docRef = await addDoc(collection(db, "timeEntries"), newEntryData);
      
      const newEntry: Timecard = {
        id: docRef.id,
        ...newEntryData
      };

      setTimecards(prev => [...prev, newEntry].sort((a, b) => a.date.localeCompare(b.date)));
    } catch (error) {
      console.error("Error adding time entry:", error);
      setError("Failed to add entry. Please try again.");
    }
  };

  const handleEditTimecard = (timecard: Timecard) => {
    setEditingTimecard(timecard);
    setShowFormModal(true);
  };

  const handleSaveTimecard = async (timecardData: Partial<Timecard>) => {
    try {
      const db = getFirestore();
      
      if (editingTimecard) {
        // Update existing timecard
        await updateDoc(doc(db, "timeEntries", editingTimecard.id), timecardData);
        setTimecards(prev => prev.map(tc => 
          tc.id === editingTimecard.id ? { ...tc, ...timecardData } : tc
        ));
      } else {
        // Add new timecard
        const newEntryData = {
          ...timecardData,
          approved: false,
          createdBy: user?.displayName || user?.email || "",
          createdDate: new Date().toISOString()
        };
        
        const docRef = await addDoc(collection(db, "timeEntries"), newEntryData);
        const newEntry: Timecard = {
          ...newEntryData as Timecard,
          id: docRef.id
        };
        setTimecards(prev => [...prev, newEntry].sort((a, b) => a.date.localeCompare(b.date)));
      }
      
      setEditingTimecard(null);
    } catch (error) {
      console.error("Error saving timecard:", error);
      setError("Failed to save timecard. Please try again.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in to delete entries.');
      return;
    }

    setDeletingTimecard(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingTimecard) return;
    
    try {
      const db = getFirestore();
      await deleteDoc(doc(db, "timeEntries", deletingTimecard));
      
      // Close the modal
      setShowDeleteModal(false);
      setDeletingTimecard(null);
      
      Alert.alert('Success', 'Time entry deleted successfully.');
    } catch (error) {
      console.error("Error deleting time entry:", error);
      setError("Failed to delete entry. Please try again.");
      Alert.alert('Error', `Failed to delete entry: ${error instanceof Error ? error.message : 'Unknown error'}`);
      
      // Close the modal on error too
      setShowDeleteModal(false);
      setDeletingTimecard(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setDeletingTimecard(null);
  };

  // Test direct delete function (bypassing Alert for debugging)
  const handleStatusChange = async (id: string, status: string) => {
    try {
      const db = getFirestore();
      const updateData: any = { status };
      
      // If setting to approved, also set approved fields
      if (status === 'approved') {
        updateData.approved = true;
        updateData.approvedBy = user?.displayName || user?.email || "";
        updateData.approvedDate = new Date().toISOString();
      } else {
        // If changing from approved to something else, unset approved fields
        updateData.approved = false;
        updateData.approvedBy = "";
        updateData.approvedDate = "";
      }

      await updateDoc(doc(db, "timeEntries", id), updateData);
      
      setTimecards(prev => prev.map(entry => 
        entry.id === id ? { ...entry, ...updateData } : entry
      ));
    } catch (error) {
      console.error("Error updating status:", error);
      setError("Failed to update status. Please try again.");
    }
  };

  const handleApprove = async (id: string) => {
    if (!canApproveEntries()) {
      Alert.alert("Permission Denied", "You don't have permission to approve entries.");
      return;
    }

    try {
      const approvalData = {
        status: "Approved",
        approved: true,
        approvedBy: user?.displayName || user?.email || "",
        approvedDate: new Date().toISOString()
      };

      const db = getFirestore();
      await updateDoc(doc(db, "timeEntries", id), approvalData);
      
      setTimecards(prev => prev.map(entry => 
        entry.id === id ? { 
          ...entry, 
          status: approvalData.status,
          approved: approvalData.approved,
          approvedBy: approvalData.approvedBy,
          approvedDate: approvalData.approvedDate
        } : entry
      ));
    } catch (error) {
      console.error("Error approving entry:", error);
      setError("Failed to approve entry. Please try again.");
    }
  };

  // Apply filters to timecards
  const filteredTimecards = timecards.filter(timecard => {
    // Filter by date range
    const isInDateRange = visibleDates.includes(timecard.date);
    if (!isInDateRange) return false;

    // Apply header filters
    if (filters.date && timecard.date !== filters.date) return false;
    if (filters.employee && timecard.employee !== filters.employee) return false;
    if (filters.project && timecard.project !== filters.project) return false;
    if (filters.equipment && timecard.equipment !== filters.equipment) return false;
    if (filters.costCode && timecard.costCode !== filters.costCode) return false;
    if (filters.workType && timecard.workType !== filters.workType) return false;
    if (filters.status && timecard.status !== filters.status) return false;

    return true;
  });



  return (
    <MainLayout>
      <View style={[globalStyles.container, { padding: 0, margin: 0 }]}>
        {/* Header */}
        <PageHeader 
          title="Time Tracking" 
          icon="time-outline"
          rightContent={
            <TouchableOpacity
              style={globalStyles.primaryButton}
              onPress={() => {
                setEditingTimecard(null);
                setShowFormModal(true);
              }}
            >
              <View style={[globalStyles.row, globalStyles.centered]}>
                <Ionicons name="add" size={20} color="#FFFFFF" style={globalStyles.iconWithMargin} />
                <Text style={globalStyles.primaryButtonText}>Add Timecard</Text>
              </View>
            </TouchableOpacity>
          }
        />

        {/* Content */}
        {loading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={{ marginTop: 16, fontSize: 16, color: colors.text }}>
              Loading timecards...
            </Text>
          </View>
        ) : error ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
            <Text style={[globalStyles.errorText, { marginBottom: 16 }]}>{error}</Text>
            <TouchableOpacity 
              style={globalStyles.secondaryButton}
              onPress={() => setError(null)}
            >
              <Text style={globalStyles.secondaryButtonText}>Dismiss</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={globalStyles.contentContainer}>
            {/* Toolbar Section */}
            <View style={[globalStyles.card, { marginBottom: 16, paddingBottom: 20 }]}>
              {/* Date Selection */}
              <View style={globalStyles.cardHeader}>
                <Text style={globalStyles.cardTitle}>Date Range</Text>
              </View>
              <DateSelector
                viewMode={viewMode}
                selectedPayPeriod={selectedPayPeriod}
                selectedMonth={selectedMonth}
                customRange={customRange}
                payPeriods={PAY_PERIODS}
                onViewModeChange={setViewMode}
                onPayPeriodChange={setSelectedPayPeriod}
                onMonthChange={setSelectedMonth}
                onCustomRangeChange={setCustomRange}
              />
              
              {/* Summary and Export */}
              <View style={[globalStyles.row, globalStyles.spaceBetween, { marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#F0F0F0' }]}>
                <View style={globalStyles.row}>
                  <Text style={globalStyles.textSecondary}>
                    {filteredTimecards.length} of {timecards.length} entries
                  </Text>
                  {Object.values(filters).some(f => f !== '') && (
                    <Text style={[globalStyles.linkText, { marginLeft: 8, fontSize: 12 }]}>
                      (filtered)
                    </Text>
                  )}
                </View>
                
                <TimecardExport
                  timecards={filteredTimecards}
                  selectedDateRange={getDateRangeString(viewMode, selectedPayPeriod, selectedMonth, customRange)}
                />
              </View>
            </View>

            {/* Table Section */}
            <View style={globalStyles.table}>
              <TimecardTable
                timecards={filteredTimecards}
                onEdit={handleEditTimecard}
                onDelete={handleDelete}
                onApprove={handleApprove}
                onStatusChange={handleStatusChange}
                currentUser={user}
                isManager={canApproveEntries()}
                filters={filters}
                onFiltersChange={setFilters}
              />
            </View>
          </View>
        )}

        {/* Form Modal */}
        <TimecardFormModal
          visible={showFormModal}
          onClose={() => {
            setShowFormModal(false);
            setEditingTimecard(null);
          }}
          onSave={handleSaveTimecard}
          editingTimecard={editingTimecard}
          projects={projects}
          crew={crew}
          equipment={equipment}
          costCodes={SAMPLE_COST_CODES}
          workTypes={WORK_TYPES}
        />

        {/* Delete Confirmation Modal */}
        <ConfirmDeleteModal
          visible={showDeleteModal}
          onCancel={handleCancelDelete}
          onConfirm={handleConfirmDelete}
          title="Delete Time Entry"
          message="Are you sure you want to delete this time entry? This action cannot be undone."
        />
      </View>
    </MainLayout>
  );
}


