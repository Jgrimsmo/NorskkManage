import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MainLayout } from '@/components/MainLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { globalStyles } from '@/styles';

interface RecentProjectProps {
  name: string;
  status: 'active' | 'completed' | 'delayed' | 'upcoming';
  progress: number;
  dueDate: string;
}

const QuickActionButton: React.FC<{ title: string; icon: string; color: string; onPress: () => void }> = ({ 
  title, icon, color, onPress 
}) => (
  <TouchableOpacity style={[styles.quickAction, { backgroundColor: color }]} onPress={onPress}>
    <Ionicons name={icon as any} size={22} color="#FFFFFF" />
    <Text style={styles.quickActionText}>{title}</Text>
  </TouchableOpacity>
);

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return '#007AFF';
    case 'completed': return '#34C759';
    case 'delayed': return '#FF3B30';
    case 'upcoming': return '#FF9500';
    default: return '#8E8E93';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'active': return 'Active';
    case 'completed': return 'Completed';
    case 'delayed': return 'Delayed';
    case 'upcoming': return 'Upcoming';
    default: return 'Unknown';
  }
};

const ProjectCard: React.FC<RecentProjectProps> = ({ name, status, progress, dueDate }) => (
  <View style={styles.projectCard}>
    <View style={styles.projectHeader}>
      <Text style={styles.projectName}>{name}</Text>
      <View style={[styles.statusBadge, { backgroundColor: getStatusColor(status) }]}>
        <Text style={styles.statusText}>{getStatusText(status)}</Text>
      </View>
    </View>
    <View style={styles.progressContainer}>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>
      <Text style={styles.progressText}>{progress}%</Text>
    </View>
    <Text style={styles.dueDate}>Due: {dueDate}</Text>
  </View>
);

export default function IndexScreen() {
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const quickActions = [
    { title: 'New Project', icon: 'add-circle-outline', color: '#007AFF', route: '/management/projects' },
    { title: 'Time Tracking', icon: 'time-outline', color: '#34C759', route: '/management/timecards' },
    { title: 'Daily Report', icon: 'document-text-outline', color: '#FF9500', route: '/safety/daily-reports' },
    { title: 'Dispatch', icon: 'car-outline', color: '#5856D6', route: '/management/dispatch' },
    { title: 'Equipment', icon: 'construct-outline', color: '#AF52DE', route: '/management/equipment' },
    { title: 'Crew', icon: 'people-outline', color: '#32D74B', route: '/management/crew' },
  ];

  const recentProjects = [
    { name: 'Highway 401 Resurfacing', status: 'active', progress: 65, dueDate: 'Dec 15, 2024' },
    { name: 'Bridge Inspection - QEW', status: 'upcoming', progress: 0, dueDate: 'Jan 10, 2025' },
    { name: 'Downtown Road Repairs', status: 'delayed', progress: 30, dueDate: 'Nov 30, 2024' },
    { name: 'Airport Runway Maintenance', status: 'completed', progress: 100, dueDate: 'Oct 20, 2024' },
  ] as RecentProjectProps[];

  const handleQuickAction = (route: string) => {
    router.push(route as any);
  };

  return (
    <MainLayout>
      <View style={globalStyles.containerNoPadding}>
        <PageHeader 
          title="Dashboard"
          icon="grid-outline"
        />
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          {/* Header Section */}
          <View style={styles.header}>
            <Text style={styles.welcomeText}>Welcome back!</Text>
            <Text style={styles.dateText}>
              {currentTime.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </Text>
          </View>

          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.quickActionsContainer}>
              {quickActions.map((action, index) => (
                <QuickActionButton
                  key={index}
                  title={action.title}
                  icon={action.icon}
                  color={action.color}
                  onPress={() => handleQuickAction(action.route)}
                />
              ))}
            </View>
          </View>

          {/* Recent Projects */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Projects</Text>
            {recentProjects.map((project, index) => (
              <ProjectCard
                key={index}
                name={project.name}
                status={project.status}
                progress={project.progress}
                dueDate={project.dueDate}
              />
            ))}
          </View>

          {/* Stats Overview */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Today's Overview</Text>
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <Ionicons name="people-outline" size={24} color="#007AFF" />
                <Text style={styles.statNumber}>12</Text>
                <Text style={styles.statLabel}>Active Crew</Text>
              </View>
              <View style={styles.statCard}>
                <Ionicons name="construct-outline" size={24} color="#34C759" />
                <Text style={styles.statNumber}>8</Text>
                <Text style={styles.statLabel}>Equipment</Text>
              </View>
              <View style={styles.statCard}>
                <Ionicons name="document-text-outline" size={24} color="#FF9500" />
                <Text style={styles.statNumber}>3</Text>
                <Text style={styles.statLabel}>Reports</Text>
              </View>
            </View>
          </View>

          {/* Notifications */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notifications</Text>
            <View style={styles.notificationCard}>
              <View style={styles.notificationHeader}>
                <Ionicons name="warning-outline" size={20} color="#FF9500" />
                <Text style={styles.notificationTitle}>Upcoming Deadline</Text>
              </View>
              <Text style={styles.notificationText}>
                Highway 401 Resurfacing is due in 15 days
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 16,
    color: '#666',
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickAction: {
    width: '48%',
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
  projectCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  projectName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#F0F0F0',
    borderRadius: 3,
    marginRight: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    minWidth: 35,
  },
  dueDate: {
    fontSize: 14,
    color: '#666',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  notificationCard: {
    backgroundColor: '#FFF8E1',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9500',
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginLeft: 8,
  },
  notificationText: {
    fontSize: 14,
    color: '#666',
  },
});
