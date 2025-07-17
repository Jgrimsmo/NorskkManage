import React from 'react';
import { View, Text } from 'react-native';
import { MainLayout } from '@/components/MainLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { globalStyles } from '@/styles';

export default function EstimatingProjectsScreen() {
  return (
    <MainLayout>
      <View style={[globalStyles.container, { padding: 0, margin: 0 }]}>
        <PageHeader 
          title="Estimating Projects" 
          icon="calculator-outline"
        />
        
        <View style={globalStyles.contentContainer}>
          <Text style={globalStyles.subtitle}>Manage project estimates and bids</Text>
          
          <View style={globalStyles.card}>
            <Text style={globalStyles.cardTitle}>Project Estimating</Text>
            <Text style={globalStyles.text}>
              This page will contain project estimating features including:
              {'\n\n'}• Bid preparation and management
              {'\n'}• Cost calculations and breakdowns
              {'\n'}• Material and labor estimates
              {'\n'}• Proposal generation
              {'\n'}• Historical cost analysis
            </Text>
          </View>
        </View>
      </View>
    </MainLayout>
  );
}


