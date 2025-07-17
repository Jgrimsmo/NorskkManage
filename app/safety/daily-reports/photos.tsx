import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MainLayout } from '@/components/MainLayout';
import { globalStyles, colors } from '@/styles';
import { useReportManagement } from '../../../hooks/useReportManagement';
import { Photo } from '../../../services/photoService';

const { width } = Dimensions.get('window');
const imageWidth = (width - 48) / 2; // 2 columns with padding

export default function ReportPhotosScreen() {
  const { reportId, project, date } = useLocalSearchParams<{ 
    reportId: string; 
    project: string; 
    date: string; 
  }>();
  const { reports } = useReportManagement();

  const report = reports.find(r => r.id === reportId);
  const photos = report?.photos || [];

  const handleBack = () => {
    router.back();
  };

  const renderPhoto = (photo: Photo, index: number) => (
    <TouchableOpacity
      key={photo.id}
      style={{
        width: imageWidth,
        height: imageWidth,
        marginBottom: 16,
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: '#F0F0F0'
      }}
      onPress={() => {
        // In a real app, this would open a full-screen image viewer
        // For now, we'll just show an alert
      }}
    >
      <Image
        source={{ uri: photo.uri }}
        style={{
          flex: 1,
          width: '100%',
          height: '100%'
        }}
        resizeMode="cover"
      />
      <View style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.7)',
        padding: 8
      }}>
        <Text style={{ color: 'white', fontSize: 10, textAlign: 'center' }}>
          {photo.name || `Photo ${index + 1}`}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <MainLayout>
      <View style={globalStyles.container}>
        <View style={globalStyles.pageHeader}>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="images-outline" size={24} color="#007AFF" style={{ marginRight: 8 }} />
            <View>
              <Text style={globalStyles.pageTitle}>Report Photos</Text>
              <Text style={globalStyles.textSecondary}>
                {project} - {new Date(date).toLocaleDateString()}
              </Text>
            </View>
          </View>
          <TouchableOpacity 
            style={globalStyles.modalCloseButton}
            onPress={handleBack}
          >
            <Ionicons name="close" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {photos.length === 0 ? (
          <View style={globalStyles.emptyState}>
            <Ionicons name="images-outline" size={64} color="#666" />
            <Text style={globalStyles.emptyStateTitle}>No Photos</Text>
            <Text style={globalStyles.emptyStateSubtext}>
              This report doesn't have any photos attached.
            </Text>
          </View>
        ) : (
          <ScrollView style={{ flex: 1 }}>
            <View style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              paddingHorizontal: 16,
              paddingTop: 16
            }}>
              {photos.map((photo, index) => renderPhoto(photo, index))}
            </View>
          </ScrollView>
        )}
      </View>
    </MainLayout>
  );
}
