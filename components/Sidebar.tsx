import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';

interface SidebarItem {
  label: string;
  path: string;
  icon: string;
  children?: SidebarItem[];
}

const sidebarItems: SidebarItem[] = [
  {
    label: 'Dashboard',
    path: '/',
    icon: 'grid-outline',
  },
  {
    label: 'Management',
    path: '/management',
    icon: 'business-outline',
    children: [
      { label: 'Projects', path: '/management/projects', icon: 'folder-outline' },
      { label: 'Timecards', path: '/management/timecards', icon: 'time-outline' },
      { label: 'Dispatch', path: '/management/dispatch', icon: 'car-outline' },
      { label: 'Crew', path: '/management/crew', icon: 'people-outline' },
      { label: 'Equipment', path: '/management/equipment', icon: 'construct-outline' },
    ],
  },
  {
    label: 'Safety',
    path: '/safety',
    icon: 'shield-checkmark-outline',
    children: [
      { label: 'Daily Reports', path: '/safety/daily-reports', icon: 'document-text-outline' },
      { label: 'FLHA', path: '/safety/flha', icon: 'warning-outline' },
    ],
  },
  {
    label: 'Estimating',
    path: '/estimating',
    icon: 'calculator-outline',
    children: [
      { label: 'Estimating Projects', path: '/estimating/projects', icon: 'clipboard-outline' },
      { label: 'Item Database', path: '/estimating/database', icon: 'library-outline' },
    ],
  },
];

const bottomSidebarItems: SidebarItem[] = [
  {
    label: 'Settings',
    path: '/settings',
    icon: 'settings-outline',
  },
];

interface SidebarProps {
  isOpen: boolean;
  isCollapsed?: boolean;
  isMobile?: boolean;
  onClose: () => void;
  onToggleCollapse?: () => void;
}

export function Sidebar({ isOpen, isCollapsed = false, isMobile = false, onClose, onToggleCollapse }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { logout } = useAuth();
  const [expandedSections, setExpandedSections] = React.useState<string[]>(['Management', 'Safety', 'Estimating']);

  const toggleSection = (label: string) => {
    setExpandedSections(prev => 
      prev.includes(label) 
        ? prev.filter(item => item !== label)
        : [...prev, label]
    );
  };

  const navigateTo = (path: string) => {
    router.push(path as any);
    if (isOpen) {
      onClose();
    }
  };

  const handleBack = () => {
    router.back();
    if (isOpen) {
      onClose();
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
            } catch (error: any) {
              Alert.alert('Error', error.message);
            }
          }
        },
      ]
    );
  };

  const renderSidebarItem = (item: SidebarItem, level = 0) => {
    const isActive = pathname === item.path;
    const isExpanded = expandedSections.includes(item.label);
    const hasChildren = item.children && item.children.length > 0;

    // In collapsed mode, don't show children and adjust layout
    if (isCollapsed && level > 0) {
      return null;
    }

    return (
      <View key={item.path}>
        <TouchableOpacity
          style={[
            styles.sidebarItem,
            { 
              paddingLeft: isCollapsed ? 20 : 12 + (level * 16),
              justifyContent: isCollapsed ? 'center' : 'flex-start'
            },
            isActive && styles.activeItem,
          ]}
          onPress={() => {
            if (hasChildren && !isCollapsed) {
              toggleSection(item.label);
            } else {
              navigateTo(item.path);
            }
          }}
        >
          <Ionicons 
            name={item.icon as any} 
            size={20} 
            color={isActive ? '#FFD700' : 'rgba(255,255,255,0.8)'} 
            style={[styles.icon, isCollapsed && { marginRight: 0 }]}
          />
          {!isCollapsed && (
            <>
              <Text style={[
                styles.sidebarText, 
                level === 0 && styles.headerText,
                level > 0 && styles.childText,
                isActive && styles.activeText
              ]}>
                {item.label}
              </Text>
              {hasChildren && (
                <Ionicons
                  name={isExpanded ? 'chevron-down' : 'chevron-forward'}
                  size={16}
                  color="rgba(255,255,255,0.6)"
                  style={styles.chevron}
                />
              )}
            </>
          )}
        </TouchableOpacity>

        {hasChildren && isExpanded && !isCollapsed && (
          <View>
            {item.children!.map(child => renderSidebarItem(child, level + 1))}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={[styles.sidebar, { width: isOpen ? (isCollapsed ? 72 : 280) : 0 }]}>
      <LinearGradient
        colors={['#2C3E50', '#4A4A4A']}
        style={styles.gradientBackground}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        {/* Fixed Header */}
        <View style={styles.sidebarHeader}>
          {!isCollapsed && (
            <View style={styles.headerContent}>
              <Text style={styles.appTitle}>NorskkManage</Text>
              {!isMobile && onToggleCollapse && (
                <TouchableOpacity
                  style={styles.collapseButton}
                  onPress={onToggleCollapse}
                >
                  <Ionicons 
                    name="chevron-back" 
                    size={18} 
                    color="#FFFFFF" 
                  />
                </TouchableOpacity>
              )}
            </View>
          )}
          {isCollapsed && (
            <View style={styles.collapsedHeader}>
              <TouchableOpacity
                style={styles.expandButton}
                onPress={onToggleCollapse}
              >
                <Ionicons name="chevron-forward" size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          )}
        </View>
        
        {/* Scrollable Content */}
        <ScrollView style={styles.scrollableContent} showsVerticalScrollIndicator={false}>
          {/* Main navigation items */}
          <View style={styles.mainNavigation}>
            {sidebarItems.map(item => renderSidebarItem(item))}
          </View>
          
          {/* Settings in scrollable area */}
          <View style={styles.settingsSection}>
            {bottomSidebarItems.map(item => renderSidebarItem(item))}
          </View>
        </ScrollView>
        
        {/* Fixed Bottom Buttons */}
        <View style={styles.fixedBottomSection}>
          {/* Logout button */}
          <TouchableOpacity
            style={[
              styles.logoutButton,
              isCollapsed && { justifyContent: 'center', paddingLeft: 20 }
            ]}
            onPress={handleLogout}
          >
            <Ionicons 
              name="log-out-outline" 
              size={20} 
              color="#FF6B6B" 
              style={[styles.icon, isCollapsed && { marginRight: 0 }]}
            />
            {!isCollapsed && <Text style={styles.logoutText}>Logout</Text>}
          </TouchableOpacity>
          
          {/* Back button */}
          <TouchableOpacity
            style={[
              styles.backButton,
              isCollapsed && { justifyContent: 'center', paddingLeft: 20 }
            ]}
            onPress={handleBack}
          >
            <Ionicons 
              name="arrow-back-outline" 
              size={20} 
              color="rgba(255,255,255,0.8)" 
              style={[styles.icon, isCollapsed && { marginRight: 0 }]}
            />
            {!isCollapsed && <Text style={styles.backText}>Back</Text>}
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    overflow: 'hidden',
    flexDirection: 'column',
    shadowColor: '#000',
    shadowOffset: {
      width: 4,
      height: 0,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  gradientBackground: {
    flex: 1,
    borderTopRightRadius: 24,
    borderBottomRightRadius: 24,
  },
  sidebarHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  collapseButton: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.15)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  expandButton: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.15)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  collapsedHeader: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  appTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  scrollableContent: {
    flex: 1,
  },
  mainNavigation: {
    paddingBottom: 8,
    paddingTop: 4,
  },
  settingsSection: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    paddingTop: 8,
    marginTop: 4,
  },
  fixedBottomSection: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    paddingTop: 8,
    paddingBottom: 8,
  },
  sidebarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingRight: 16,
    marginHorizontal: 8,
    marginVertical: 1,
    minHeight: 40,
    justifyContent: 'flex-start',
    borderRadius: 12,
  },
  activeItem: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#FFD700',
  },
  icon: {
    marginRight: 10,
  },
  sidebarText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    flex: 1,
    fontWeight: '500',
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  childText: {
    fontSize: 11,
    fontWeight: '400',
  },
  activeText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  chevron: {
    marginLeft: 6,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingLeft: 16,
    paddingRight: 16,
    marginHorizontal: 8,
    marginVertical: 1,
    minHeight: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,107,107,0.1)',
  },
  logoutText: {
    fontSize: 13,
    color: '#FF6B6B',
    flex: 1,
    fontWeight: '600',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingLeft: 16,
    paddingRight: 16,
    marginHorizontal: 8,
    marginVertical: 1,
    minHeight: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  backText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    flex: 1,
    fontWeight: '500',
  },
});
