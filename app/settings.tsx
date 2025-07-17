import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MainLayout } from '@/components/MainLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { GradientShowcase } from '@/components/ui/GradientShowcase';
import { UniversalTable, TableColumn } from '@/components/ui/UniversalTable';
import { globalStyles, gradients } from '@/styles';

// Sample data for table demo
interface SampleProject {
  id: string;
  name: string;
  status: 'Active' | 'Completed' | 'Planning';
  budget: number;
  completion: number;
}

export default function SettingsScreen() {
  const [showGradientDemo, setShowGradientDemo] = useState(false);
  const [showTableDemo, setShowTableDemo] = useState(false);
  const [selectedGradient, setSelectedGradient] = useState<readonly string[]>(gradients.professional.corporate);
  const [selectedGradientName, setSelectedGradientName] = useState('Corporate');

  const handleGradientSelect = (gradient: readonly string[], name: string) => {
    setSelectedGradient(gradient);
    setSelectedGradientName(name);
  };

  // Sample data for table demo
  const sampleProjects: SampleProject[] = [
    { id: '1', name: 'Downtown Plaza', status: 'Active', budget: 250000, completion: 75 },
    { id: '2', name: 'Highway Bridge', status: 'Completed', budget: 180000, completion: 100 },
    { id: '3', name: 'Shopping Center', status: 'Planning', budget: 420000, completion: 15 },
    { id: '4', name: 'Office Complex', status: 'Active', budget: 320000, completion: 45 },
  ];

  // Table columns for demo
  const tableColumns: TableColumn[] = [
    {
      key: 'name',
      title: 'Project',
      flex: 2,
      sortable: true,
      filterable: true,
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
          value === 'Completed' ? globalStyles.statusCompleted :
          value === 'Active' ? globalStyles.statusActive :
          globalStyles.statusUpcoming
        ]}>
          <Text style={globalStyles.statusText}>{value}</Text>
        </View>
      )
    },
    {
      key: 'budget',
      title: 'Budget',
      flex: 1.5,
      sortable: true,
      render: (value) => (
        <Text style={globalStyles.tableCellText}>
          ${value.toLocaleString()}
        </Text>
      )
    },
    {
      key: 'completion',
      title: 'Progress',
      flex: 1,
      sortable: true,
      render: (value) => (
        <Text style={globalStyles.tableCellText}>{value}%</Text>
      )
    }
  ];

  if (showTableDemo) {
    return (
      <MainLayout>
        <View style={globalStyles.containerNoPadding}>
          <PageHeader 
            title="Universal Table Demo"
            icon="grid-outline"
            rightContent={
              <TouchableOpacity
                style={globalStyles.secondaryButton}
                onPress={() => setShowTableDemo(false)}
              >
                <Text style={globalStyles.secondaryButtonText}>Back to Settings</Text>
              </TouchableOpacity>
            }
          />
          <View style={globalStyles.container}>
            <Text style={[globalStyles.sectionTitle, { marginBottom: 16 }]}>
              Universal Table Component Demo
            </Text>
            <Text style={[globalStyles.text, { marginBottom: 20, color: '#666' }]}>
              This demonstrates the Universal Table with sorting, filtering, and custom renderers.
            </Text>
            
            <UniversalTable
              data={sampleProjects}
              columns={tableColumns}
              sortable={true}
              filterable={true}
              alternateRowColors={true}
              emptyMessage="No projects found"
              onRowPress={(project) => alert(`Selected: ${project.name}`)}
            />
          </View>
        </View>
      </MainLayout>
    );
  }

  if (showGradientDemo) {
    return (
      <MainLayout>
        <View style={globalStyles.containerNoPadding}>
          <PageHeader 
            title={`Monochrome Demo - ${selectedGradientName}`}
            icon="color-palette-outline"
            gradient={selectedGradient}
            rightContent={
              <TouchableOpacity
                style={globalStyles.secondaryButton}
                onPress={() => setShowGradientDemo(false)}
              >
                <Text style={globalStyles.secondaryButtonText}>Back to Settings</Text>
              </TouchableOpacity>
            }
          />
          <GradientShowcase onGradientSelect={handleGradientSelect} />
        </View>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <View style={globalStyles.containerNoPadding}>
        <PageHeader 
          title="Application Settings"
          icon="settings-outline"
        />
        <View style={globalStyles.container}>
          <View style={styles.placeholderCard}>
            <Text style={styles.cardTitle}>Settings Configuration</Text>
            <Text style={styles.cardText}>
              This page will contain configuration options including:
              {'\n\n'}• User profile and preferences
              {'\n'}• Company information
              {'\n'}• System configurations
              {'\n'}• Security settings
              {'\n'}• Data backup and export
              {'\n'}• Notification preferences
            </Text>
          </View>

          <TouchableOpacity
            style={[globalStyles.primaryButton, { marginTop: 20 }]}
            onPress={() => setShowGradientDemo(true)}
          >
            <Text style={globalStyles.primaryButtonText}>⚫ View Monochrome Gradients</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[globalStyles.secondaryButton, { marginTop: 12 }]}
            onPress={() => setShowTableDemo(true)}
          >
            <Text style={globalStyles.secondaryButtonText}>📊 View Universal Table Demo</Text>
          </TouchableOpacity>
        </View>
      </View>
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  placeholderCard: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  cardText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
});
