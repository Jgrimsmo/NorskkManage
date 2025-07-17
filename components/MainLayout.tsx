import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePathname } from 'expo-router';
import { Sidebar } from './Sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { width } = Dimensions.get('window');
  const isMobile = width < 768;
  const pathname = usePathname();

  // Get page title and subtitle based on current path
  const getPageInfo = (path: string) => {
    const pageMap: Record<string, { title: string; subtitle: string }> = {
      '/dashboard': { title: 'Dashboard', subtitle: 'Welcome to your management dashboard' },
      '/management/projects': { title: 'Projects', subtitle: 'Manage your construction projects' },
      '/management/timecards': { title: 'Timecards', subtitle: 'Track employee time and attendance' },
      '/management/dispatch': { title: 'Dispatch', subtitle: 'Coordinate crews and equipment deployment' },
      '/management/crew': { title: 'Crew', subtitle: 'Manage your workforce and teams' },
      '/management/equipment': { title: 'Equipment', subtitle: 'Track and maintain your equipment fleet' },
      '/safety/daily-reports': { title: 'Daily Reports', subtitle: 'Daily safety and progress reporting' },
      '/safety/flha': { title: 'FLHA', subtitle: 'Field Level Hazard Assessments' },
      '/estimating/projects': { title: 'Estimating Projects', subtitle: 'Manage project estimates and bids' },
      '/estimating/database': { title: 'Item Database', subtitle: 'Manage estimating items and pricing' },
      '/settings': { title: 'Settings', subtitle: 'Configure your application preferences' },
    };
    return pageMap[path] || { title: 'Page', subtitle: 'Page description' };
  };

  const pageInfo = getPageInfo(pathname);

  return (
    <View style={styles.container}>
      {/* Sidebar */}
      <Sidebar 
        isOpen={isMobile ? sidebarOpen : true} 
        isCollapsed={!isMobile && sidebarCollapsed}
        onClose={() => setSidebarOpen(false)}
        onToggleCollapse={!isMobile ? () => setSidebarCollapsed(!sidebarCollapsed) : undefined}
        isMobile={isMobile}
      />
      
      {/* Overlay for mobile */}
      {isMobile && sidebarOpen && (
        <TouchableOpacity 
          style={styles.overlay} 
          onPress={() => setSidebarOpen(false)}
          activeOpacity={1}
        />
      )}
      
      {/* Main content */}
      <View style={styles.mainContent}>
        {/* Mobile hamburger menu */}
        {isMobile && (
          <View style={styles.mobileHeader}>
            <TouchableOpacity
              style={styles.hamburgerButton}
              onPress={() => setSidebarOpen(true)}
            >
              <Ionicons name="menu" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.mobileTitle}>{pageInfo.title}</Text>
          </View>
        )}
        
        {/* Page content */}
        <View style={styles.content}>
          {children}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F2F2F7',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 10,
  },
  mainContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  mobileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  hamburgerButton: {
    padding: 8,
    marginRight: 12,
  },
  mobileTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  pageHeader: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  pageSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  content: {
    flex: 1,
  },
});
