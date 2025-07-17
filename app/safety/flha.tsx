import React from 'react';
import { View, Text } from 'react-native';
import { MainLayout } from '@/components/MainLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { globalStyles } from '@/styles';

export default function FLHAScreen() {
  return (
    <MainLayout>
      <View style={[globalStyles.container, { padding: 0, margin: 0 }]}>
        <PageHeader 
          title="Field Level Hazard Assessment" 
          icon="shield-checkmark-outline"
        />
        
        <View style={globalStyles.contentContainer}>
          <View style={globalStyles.card}>
            <Text style={globalStyles.cardTitle}>FLHA Management</Text>
            <Text style={globalStyles.text}>
              This page will contain FLHA management features including:
              {'\n\n'}• Hazard identification and assessment
              {'\n'}• Risk evaluation and controls
              {'\n'}• Safety measures documentation
              {'\n'}• Team safety briefings
              {'\n'}• Compliance tracking
            </Text>
          </View>
        </View>
      </View>
    </MainLayout>
  );
}


