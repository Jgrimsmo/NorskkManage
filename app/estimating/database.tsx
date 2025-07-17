import React from 'react';
import { View, Text } from 'react-native';
import { MainLayout } from '@/components/MainLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { globalStyles } from '@/styles';

export default function ItemDatabaseScreen() {
  return (
    <MainLayout>
      <View style={[globalStyles.container, { padding: 0, margin: 0 }]}>
        <PageHeader 
          title="Item Database" 
          icon="library-outline"
        />
        
        <View style={globalStyles.contentContainer}>
          <View style={globalStyles.card}>
            <Text style={globalStyles.cardTitle}>Estimating Item Database</Text>
            <Text style={globalStyles.text}>
              This page will contain item database features including:
              {'\n\n'}• Material and service catalogs
              {'\n'}• Pricing management
              {'\n'}• Unit costs and markup
              {'\n'}• Supplier information
              {'\n'}• Historical pricing data
            </Text>
          </View>
        </View>
      </View>
    </MainLayout>
  );
}


