import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Modal, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { MainLayout } from '@/components/MainLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { UniversalTable, TableColumn, TableAction } from '@/components/ui/UniversalTable';
import PhotoGalleryModal from '@/components/modals/PhotoGalleryModal';
import PDFPreviewModal from '@/components/modals/PDFPreviewModal';
import { useAuth } from '@/contexts/AuthContext';
import { globalStyles, colors } from '@/styles';
import { useReportManagement, DailyReport } from '../../hooks/useReportManagement';
import { PhotoService, Photo } from '../../services/photoService';
import { PDFService } from '../../services/pdfService';
import { TableHeaderFilter } from '@/components/ui/TableHeaderFilter';

export default function DailyReportsScreen() {
  const { hasPermission, PERMISSIONS, user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingReport, setEditingReport] = useState<DailyReport | null>(null);
  const [showPhotoGallery, setShowPhotoGallery] = useState(false);
  const [galleryPhotos, setGalleryPhotos] = useState<Photo[]>([]);
  const [galleryInitialIndex, setGalleryInitialIndex] = useState(0);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [showPDFPreview, setShowPDFPreview] = useState(false);
  const [previewReport, setPreviewReport] = useState<DailyReport | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const photoService = PhotoService.getInstance();
  
  // Filters
  const [filters, setFilters] = useState({ 
    project: '', 
    date: '' 
  });
  
  // Form state
  const [formData, setFormData] = useState({
    project: '',
    date: new Date().toISOString().split('T')[0],
    workCompleted: '',
    weatherConditions: '',
    safetyIncidents: '',
    materialsUsed: '',
    nextDayPlan: '',
    workersOnSite: '0',
    selectedCrewMembers: [] as string[],
    equipmentUsed: [] as string[],
    photos: [] as Photo[]
  });

  const {
    projectFilter,
    setProjectFilter,
    dateFilter,
    setDateFilter,
    uniqueProjects,
    filteredReports,
    loading,
    error,
    handleDeleteReport,
    loadReports,
    createReport,
    updateReport
  } = useReportManagement();

  // Apply filters to the reports
  const displayReports = useMemo(() => {
    let filtered = filteredReports;
    
    // Apply local filters on top of the hook's filters
    if (filters.project) {
      filtered = filtered.filter((report: DailyReport) => 
        report.project === filters.project
      );
    }
    
    if (filters.date) {
      filtered = filtered.filter((report: DailyReport) => 
        report.date === filters.date
      );
    }
    
    return filtered;
  }, [filteredReports, filters]);

  // Group reports by project for display
  const groupedReports = useMemo(() => {
    const groups: Record<string, DailyReport[]> = {};
    displayReports.forEach((report: DailyReport) => {
      const projectName = report.project || 'Unknown Project';
      if (!groups[projectName]) {
        groups[projectName] = [];
      }
      groups[projectName].push(report);
    });
    
    // Sort reports within each project by date (newest first)
    Object.keys(groups).forEach(projectName => {
      groups[projectName].sort((a: DailyReport, b: DailyReport) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    });
    
    return groups;
  }, [displayReports]);

  // Get unique values for filters
  const getUniqueProjects = () => {
    return [...new Set(filteredReports.map((report: DailyReport) => report.project).filter(Boolean))].sort();
  };

  const getUniqueDates = () => {
    const dates = [...new Set(filteredReports.map((report: DailyReport) => report.date).filter(Boolean))];
    return dates.sort().reverse(); // Most recent first
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleEditReport = (report: DailyReport) => {
    setEditingReport(report);
    setFormData({
      project: report.project,
      date: report.date,
      workCompleted: report.workCompleted || '',
      weatherConditions: report.weatherConditions || '',
      safetyIncidents: report.safetyIncidents || '',
      materialsUsed: report.materialsUsed || '',
      nextDayPlan: report.nextDayPlan || '',
      workersOnSite: report.workersOnSite?.toString() || '0',
      selectedCrewMembers: report.selectedCrewMembers || [],
      equipmentUsed: report.equipmentUsed || [],
      photos: report.photos || []
    });
    setShowModal(true);
  };

  const handleAddReport = () => {
    setEditingReport(null);
    setFormData({
      project: '',
      date: new Date().toISOString().split('T')[0],
      workCompleted: '',
      weatherConditions: '',
      safetyIncidents: '',
      materialsUsed: '',
      nextDayPlan: '',
      workersOnSite: '0',
      selectedCrewMembers: [],
      equipmentUsed: [],
      photos: []
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingReport(null);
  };

  // Photo management methods
  const handleAddPhoto = () => {
    Alert.alert(
      'Add Photo',
      'Choose how to add a photo:',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Take Photo', 
          onPress: () => handleTakePhoto() 
        },
        { 
          text: 'Choose from Gallery', 
          onPress: () => handleSelectFromGallery() 
        },
      ]
    );
  };

  const handleTakePhoto = async () => {
    // For new reports, we can't upload yet as we don't have a report ID
    // For existing reports, we can upload immediately
    if (editingReport?.id) {
      setUploadingPhoto(true);
      setUploadProgress(0);
      
      try {
        const photo = await photoService.takePhotoAndUpload(
          editingReport.id,
          (progress) => setUploadProgress(progress)
        );
        
        if (photo) {
          setFormData(prev => ({
            ...prev,
            photos: [...prev.photos, photo]
          }));
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to take and upload photo: ' + (error instanceof Error ? error.message : 'Unknown error'));
      } finally {
        setUploadingPhoto(false);
      }
    } else {
      // For new reports, just store locally until save
      try {
        const photo = await photoService.takePhoto();
        if (photo) {
          setFormData(prev => ({
            ...prev,
            photos: [...prev.photos, photo]
          }));
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to take photo: ' + (error instanceof Error ? error.message : 'Unknown error'));
      }
    }
  };

  const handleSelectFromGallery = async () => {
    // For new reports, we can't upload yet as we don't have a report ID
    // For existing reports, we can upload immediately
    if (editingReport?.id) {
      setUploadingPhoto(true);
      setUploadProgress(0);
      
      try {
        const photo = await photoService.selectFromGalleryAndUpload(
          editingReport.id,
          (progress) => setUploadProgress(progress)
        );
        
        if (photo) {
          setFormData(prev => ({
            ...prev,
            photos: [...prev.photos, photo]
          }));
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to select and upload photo: ' + (error instanceof Error ? error.message : 'Unknown error'));
      } finally {
        setUploadingPhoto(false);
      }
    } else {
      // For new reports, just store locally until save
      try {
        const photo = await photoService.selectFromGallery();
        if (photo) {
          setFormData(prev => ({
            ...prev,
            photos: [...prev.photos, photo]
          }));
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to select photo: ' + (error instanceof Error ? error.message : 'Unknown error'));
      }
    }
  };

  const handleRemovePhoto = (photoId: string) => {
    Alert.alert(
      'Remove Photo',
      'Are you sure you want to remove this photo?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setFormData(prev => ({
              ...prev,
              photos: prev.photos.filter(photo => photo.id !== photoId)
            }));
          },
        },
      ]
    );
  };

  const handleViewPhoto = (photos: Photo[], initialIndex: number) => {
    setGalleryPhotos(photos);
    setGalleryInitialIndex(initialIndex);
    setShowPhotoGallery(true);
  };

  const handleGeneratePDF = async (report: DailyReport) => {
    setPreviewReport(report);
    setShowPDFPreview(true);
  };

  const handleSave = async () => {
    if (!formData.project || !formData.date || !formData.workCompleted) {
      Alert.alert('Error', 'Please fill in all required fields (Project, Date, Work Completed)');
      return;
    }

    if (!user) {
      Alert.alert('Error', 'You must be logged in to save reports');
      return;
    }

    try {
      let photosToSave = formData.photos;

      // If creating a new report, we need to upload photos after creating the report
      if (!editingReport) {
        // Create report first without photos
        const reportData = {
          project: formData.project.trim(),
          date: formData.date,
          workCompleted: formData.workCompleted.trim(),
          weatherConditions: formData.weatherConditions.trim(),
          safetyIncidents: formData.safetyIncidents.trim(),
          materialsUsed: formData.materialsUsed.trim(),
          nextDayPlan: formData.nextDayPlan.trim(),
          workersOnSite: parseInt(formData.workersOnSite) || 0,
          selectedCrewMembers: formData.selectedCrewMembers,
          equipmentUsed: formData.equipmentUsed,
          photos: [], // Empty initially
          createdBy: user.uid
        };

        const newReport = await createReport(reportData as Omit<DailyReport, 'id' | 'createdAt' | 'updatedAt'>);
        
        // Now upload photos if any
        if (formData.photos.length > 0 && newReport?.id) {
          setUploadingPhoto(true);
          const uploadedPhotos: Photo[] = [];
          
          for (let i = 0; i < formData.photos.length; i++) {
            const photo = formData.photos[i];
            setUploadProgress(Math.round((i / formData.photos.length) * 100));
            
            if (!photo.uploaded) {
              // Upload photo to Firebase Storage
              const downloadURL = await photoService.uploadPhoto(photo, newReport.id);
              if (downloadURL) {
                uploadedPhotos.push({
                  ...photo,
                  uri: downloadURL,
                  uploaded: true
                });
              }
            } else {
              uploadedPhotos.push(photo);
            }
          }
          
          setUploadingPhoto(false);
          
          // Update report with uploaded photos
          if (uploadedPhotos.length > 0) {
            await updateReport(newReport.id, { photos: uploadedPhotos });
          }
        }
      } else {
        // Updating existing report
        const reportData = {
          project: formData.project.trim(),
          date: formData.date,
          workCompleted: formData.workCompleted.trim(),
          weatherConditions: formData.weatherConditions.trim(),
          safetyIncidents: formData.safetyIncidents.trim(),
          materialsUsed: formData.materialsUsed.trim(),
          nextDayPlan: formData.nextDayPlan.trim(),
          workersOnSite: parseInt(formData.workersOnSite) || 0,
          selectedCrewMembers: formData.selectedCrewMembers,
          equipmentUsed: formData.equipmentUsed,
          photos: photosToSave,
          createdBy: user.uid
        };

        await updateReport(editingReport.id, reportData);
      }

      closeModal();
      await loadReports();
    } catch (error) {
      setUploadingPhoto(false);
      Alert.alert('Error', `Failed to ${editingReport ? 'update' : 'create'} report: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleDeleteReportWithConfirm = async (report: DailyReport) => {
    Alert.alert(
      "Delete Report",
      `Are you sure you want to delete the report for ${report.project} on ${new Date(report.date).toLocaleDateString()}?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: async () => {
            try {
              await handleDeleteReport(report.id);
              await loadReports();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete report: ' + (error instanceof Error ? error.message : 'Unknown error'));
            }
          }
        }
      ]
    );
  };

  const handleViewPhotos = (report: DailyReport) => {
    // For now, show an alert with photo count
    // In the future, this could open a photo gallery modal
    Alert.alert(
      'Report Photos',
      `This report contains ${report.photos?.length || 0} photos.`,
      [{ text: 'OK' }]
    );
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await loadReports();
    } finally {
      setRefreshing(false);
    }
  };

  const canCreateReports = hasPermission(PERMISSIONS.CREATE_REPORTS);
  const canViewReports = hasPermission(PERMISSIONS.VIEW_REPORTS);
  const canDeleteReports = hasPermission(PERMISSIONS.DELETE_REPORTS);

  if (!canViewReports) {
    return (
      <MainLayout>
        <View style={globalStyles.container}>
          <View style={globalStyles.errorContainer}>
            <Text style={globalStyles.errorText}>Access Denied</Text>
            <Text style={globalStyles.textSecondary}>
              You don't have permission to view daily reports.
            </Text>
          </View>
        </View>
      </MainLayout>
    );
  }

  if (loading) {
    return (
      <MainLayout>
        <View style={globalStyles.container}>
          <View style={globalStyles.loadingContainer}>
            <Text style={globalStyles.loadingText}>Loading reports...</Text>
          </View>
        </View>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <View style={globalStyles.container}>
          <View style={globalStyles.errorContainer}>
            <Text style={globalStyles.errorText}>Error Loading Reports</Text>
            <Text style={globalStyles.textSecondary}>{error}</Text>
            <Button
              title="Retry"
              onPress={loadReports}
              style={globalStyles.retryButton}
            />
          </View>
        </View>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <View style={[globalStyles.container, { padding: 0, margin: 0 }]}>
        {/* Header */}
        <PageHeader 
          title="Daily Reports" 
          icon="document-text-outline"
          rightContent={
            canCreateReports ? (
              <TouchableOpacity
                style={globalStyles.primaryButton}
                onPress={handleAddReport}
              >
                <View style={[globalStyles.row, globalStyles.centered]}>
                  <Ionicons name="add" size={20} color="#FFFFFF" style={globalStyles.iconWithMargin} />
                  <Text style={globalStyles.primaryButtonText}>Add Report</Text>
                </View>
              </TouchableOpacity>
            ) : undefined
          }
        />

        {/* Content */}
        <ScrollView style={globalStyles.scrollContent}>
          {/* Table */}
          <View style={globalStyles.table}>
            {/* Header */}
            <View style={globalStyles.tableHeader}>
              <View style={[globalStyles.tableHeaderCell, { flex: 2, flexDirection: 'row', alignItems: 'center' }]}>
                <TableHeaderFilter
                  field="project"
                  currentValue={filters.project}
                  onFilterChange={handleFilterChange}
                  options={['', ...getUniqueProjects()]}
                  placeholder="All Projects"
                />
              </View>
              <View style={[globalStyles.tableHeaderCell, { flex: 1.5, flexDirection: 'row', alignItems: 'center' }]}>
                <TableHeaderFilter
                  field="date"
                  currentValue={filters.date}
                  onFilterChange={handleFilterChange}
                  options={['', ...getUniqueDates()]}
                  placeholder="All Dates"
                />
              </View>
              <View style={[globalStyles.tableHeaderCell, { flex: 1 }]}>
                <Text style={globalStyles.tableHeaderText}>Workers</Text>
              </View>
              <View style={[globalStyles.tableHeaderCell, { flex: 2.5 }]}>
                <Text style={globalStyles.tableHeaderText}>Work Completed</Text>
              </View>
              <View style={[globalStyles.tableHeaderCell, { flex: 1 }]}>
                <Text style={globalStyles.tableHeaderText}>Photos</Text>
              </View>
              <View style={[globalStyles.tableHeaderCell, globalStyles.tableHeaderCellLast, { flex: 2 }]}>
                <Text style={globalStyles.tableHeaderText}>Actions</Text>
              </View>
            </View>

            {/* Table Rows */}
            {Object.entries(groupedReports).map(([projectName, reports]) => 
              (reports as DailyReport[]).map((report, index) => (
                <View 
                  key={report.id} 
                  style={[
                    globalStyles.tableRow,
                    index === reports.length - 1 && globalStyles.tableRowLast
                  ]}
                >
                  <View style={[globalStyles.tableCell, { flex: 2 }]}>
                    <Text style={globalStyles.tableCellText} numberOfLines={2}>
                      {report.project || 'Unknown Project'}
                    </Text>
                  </View>
                  <View style={[globalStyles.tableCell, { flex: 1.5 }]}>
                    <Text style={globalStyles.tableCellText}>
                      {new Date(report.date).toLocaleDateString()}
                    </Text>
                  </View>
                  <View style={[globalStyles.tableCell, { flex: 1 }]}>
                    <Text style={globalStyles.tableCellText}>
                      {report.workersOnSite || 0}
                    </Text>
                  </View>
                  <View style={[globalStyles.tableCell, { flex: 2.5 }]}>
                    <Text style={globalStyles.tableCellText} numberOfLines={2}>
                      {report.workCompleted || 'No description'}
                    </Text>
                  </View>
                  <View style={[globalStyles.tableCell, { flex: 1 }]}>
                    <Text style={globalStyles.tableCellText}>
                      {report.photos?.length || 0}
                    </Text>
                  </View>
                  <View style={[globalStyles.tableCell, globalStyles.tableCellLast, { flex: 2 }]}>
                    <View style={globalStyles.actionsCell}>
                      <TouchableOpacity
                        style={[globalStyles.iconButton, globalStyles.actionPdfButton, globalStyles.actionButtonSpacing]}
                        onPress={() => handleGeneratePDF(report)}
                        disabled={generatingPDF}
                      >
                        <Ionicons name="document-text" size={16} color="#FFFFFF" />
                      </TouchableOpacity>
                      
                      {report.photos && report.photos.length > 0 && (
                        <TouchableOpacity
                          style={[globalStyles.iconButton, globalStyles.actionPhotoButton, globalStyles.actionButtonSpacing]}
                          onPress={() => handleViewPhoto(report.photos || [], 0)}
                        >
                          <Ionicons name="images" size={16} color="#FFFFFF" />
                        </TouchableOpacity>
                      )}
                      
                      {canCreateReports && (
                        <TouchableOpacity
                          style={[globalStyles.iconButton, globalStyles.actionEditButton, globalStyles.actionButtonSpacing]}
                          onPress={() => handleEditReport(report)}
                        >
                          <Ionicons name="pencil" size={16} color="#FFFFFF" />
                        </TouchableOpacity>
                      )}
                      
                      {canDeleteReports && (
                        <TouchableOpacity
                          style={[globalStyles.iconButton, globalStyles.actionDeleteButton]}
                          onPress={() => handleDeleteReportWithConfirm(report)}
                        >
                          <Ionicons name="trash" size={16} color="#FFFFFF" />
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                </View>
              ))
            )}

            {Object.keys(groupedReports).length === 0 && (
              <View style={globalStyles.emptyState}>
                <Ionicons name="document-text-outline" size={64} color="#666" />
                <Text style={globalStyles.emptyStateTitle}>No Daily Reports</Text>
                <Text style={globalStyles.emptyStateSubtext}>
                  {canCreateReports 
                    ? "Tap 'Add Report' to create your first daily report."
                    : "No daily reports have been created yet."
                  }
                </Text>
              </View>
            )}
          </View>
        </ScrollView>

        {/* Add/Edit Modal */}
        <Modal visible={showModal} animationType="slide" presentationStyle="fullScreen">
          <View style={globalStyles.container}>
            <PageHeader 
              title={editingReport ? 'Edit Report' : 'Add Report'}
              icon="document-text-outline"
              rightContent={
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
                      {editingReport ? 'Update Report' : 'Add Report'}
                    </Text>
                  </TouchableOpacity>
                </View>
              }
            />

            <ScrollView 
              style={globalStyles.contentContainer} 
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 50 }}
            >
              <View style={globalStyles.card}>
                <Text style={globalStyles.sectionTitle}>Report Details</Text>
                
                <View style={globalStyles.formField}>
                  <Text style={[globalStyles.formLabel, globalStyles.requiredField]}>Project</Text>
                  <Input
                    value={formData.project}
                    onChangeText={(text) => setFormData({ ...formData, project: text })}
                    placeholder="Enter project name"
                    autoCapitalize="words"
                  />
                </View>

                <View style={globalStyles.formField}>
                  <Text style={[globalStyles.formLabel, globalStyles.requiredField]}>Date</Text>
                  <Input
                    value={formData.date}
                    onChangeText={(text) => setFormData({ ...formData, date: text })}
                    placeholder="YYYY-MM-DD"
                  />
                </View>

                <View style={globalStyles.formField}>
                  <Text style={[globalStyles.formLabel, globalStyles.requiredField]}>Work Completed</Text>
                  <Input
                    value={formData.workCompleted}
                    onChangeText={(text) => setFormData({ ...formData, workCompleted: text })}
                    placeholder="Describe the work completed today"
                    multiline
                    numberOfLines={4}
                  />
                </View>

                <View style={globalStyles.formField}>
                  <Text style={globalStyles.formLabel}>Weather Conditions</Text>
                  <Input
                    value={formData.weatherConditions}
                    onChangeText={(text) => setFormData({ ...formData, weatherConditions: text })}
                    placeholder="Weather conditions during work"
                  />
                </View>

                <View style={globalStyles.formField}>
                  <Text style={globalStyles.formLabel}>Safety Incidents</Text>
                  <Input
                    value={formData.safetyIncidents}
                    onChangeText={(text) => setFormData({ ...formData, safetyIncidents: text })}
                    placeholder="Any safety incidents or concerns"
                    multiline
                    numberOfLines={3}
                  />
                </View>

                <View style={globalStyles.formField}>
                  <Text style={globalStyles.formLabel}>Materials Used</Text>
                  <Input
                    value={formData.materialsUsed}
                    onChangeText={(text) => setFormData({ ...formData, materialsUsed: text })}
                    placeholder="Materials and supplies used"
                    multiline
                    numberOfLines={3}
                  />
                </View>

                <View style={globalStyles.formField}>
                  <Text style={globalStyles.formLabel}>Next Day Plan</Text>
                  <Input
                    value={formData.nextDayPlan}
                    onChangeText={(text) => setFormData({ ...formData, nextDayPlan: text })}
                    placeholder="Plan for next day"
                    multiline
                    numberOfLines={3}
                  />
                </View>

                <View style={globalStyles.formField}>
                  <Text style={globalStyles.formLabel}>Workers on Site</Text>
                  <Input
                    value={formData.workersOnSite}
                    onChangeText={(text) => setFormData({ ...formData, workersOnSite: text })}
                    placeholder="Number of workers"
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <View style={globalStyles.card}>
                  <Text style={globalStyles.sectionTitle}>Photos</Text>
                  
                  <View style={globalStyles.formField}>
                    <View style={globalStyles.photoHeader}>
                      <Text style={globalStyles.formLabel}>Photos ({formData.photos.length})</Text>
                      <TouchableOpacity
                        style={[
                          globalStyles.secondaryButton, 
                          { paddingHorizontal: 12, paddingVertical: 6 },
                          uploadingPhoto && { opacity: 0.6 }
                        ]}
                        onPress={handleAddPhoto}
                        disabled={uploadingPhoto}
                      >
                        <View style={globalStyles.photoUploadButton}>
                          {uploadingPhoto ? (
                            <ActivityIndicator size={16} color={colors.primary} style={globalStyles.iconSmallMargin} />
                          ) : (
                            <Ionicons name="camera" size={16} color={colors.primary} style={globalStyles.iconSmallMargin} />
                          )}
                          <Text style={[globalStyles.secondaryButtonText, globalStyles.smallText]}>
                            {uploadingPhoto ? `Uploading... ${uploadProgress}%` : 'Add Photo'}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                    
                    {formData.photos.length > 0 ? (
                      <View style={globalStyles.photoGrid}>
                        {formData.photos.map((photo, index) => (
                          <TouchableOpacity
                            key={photo.id}
                            style={globalStyles.photoThumbnail}
                            onPress={() => handleViewPhoto(formData.photos, index)}
                          >
                            <Image
                              source={{ uri: photo.uri }}
                              style={globalStyles.photoImage}
                              resizeMode="cover"
                            />
                            <TouchableOpacity
                              style={globalStyles.photoDeleteButton}
                              onPress={() => handleRemovePhoto(photo.id)}
                            >
                              <Ionicons name="close" size={12} color={colors.danger} />
                            </TouchableOpacity>
                          </TouchableOpacity>
                        ))}
                      </View>
                    ) : (
                      <Text style={[globalStyles.textSecondary, globalStyles.italicText]}>
                        No photos added yet. Tap "Add Photo" to include photos with this report.
                      </Text>
                    )}
                  </View>
                </View>
            </ScrollView>
          </View>
        </Modal>

        {/* Photo Gallery Modal */}
        <PhotoGalleryModal
          visible={showPhotoGallery}
          onClose={() => setShowPhotoGallery(false)}
          photos={galleryPhotos}
          initialIndex={galleryInitialIndex}
          canDelete={false}
        />

        {/* PDF Preview Modal */}
        <PDFPreviewModal
          visible={showPDFPreview}
          onClose={() => setShowPDFPreview(false)}
          report={previewReport}
        />
      </View>
    </MainLayout>
  );
}
