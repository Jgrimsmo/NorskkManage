import { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp,
  orderBy,
  query
} from 'firebase/firestore';
import { Photo } from '../services/photoService';

// Types
export interface DailyReport {
  id: string;
  project: string;
  date: string;
  workCompleted: string;
  photos?: Photo[];
  selectedCrewMembers?: string[];
  workersOnSite?: number;
  weatherConditions?: string;
  safetyIncidents?: string;
  equipmentUsed?: string[];
  materialsUsed?: string;
  nextDayPlan?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface UseReportManagement {
  projectFilter: string;
  setProjectFilter: (filter: string) => void;
  dateFilter: string;
  setDateFilter: (filter: string) => void;
  uniqueProjects: string[];
  filteredReports: DailyReport[];
  reports: DailyReport[];
  loading: boolean;
  error: string | null;
  handleDeleteReport: (reportId: string) => Promise<void>;
  loadReports: () => Promise<void>;
  createReport: (report: Omit<DailyReport, 'id' | 'createdAt' | 'updatedAt'>) => Promise<{ id: string }>;
  updateReport: (reportId: string, report: Partial<DailyReport>) => Promise<void>;
}

export function useReportManagement(): UseReportManagement {
  const [reports, setReports] = useState<DailyReport[]>([]);
  const [projectFilter, setProjectFilter] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load reports from Firebase on mount
  useEffect(() => {
    const q = query(collection(db, 'dailyReports'), orderBy('date', 'desc'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const reportsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
          updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || new Date().toISOString()
        })) as DailyReport[];
        
        setReports(reportsData);
        setLoading(false);
        setError(null);
      },
      (error) => {
        console.error('Error loading reports:', error);
        setError('Failed to load reports');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const loadReports = async (): Promise<void> => {
    // Reports are loaded automatically via the snapshot listener
    // This function is kept for compatibility but doesn't need to do anything
  };

  const handleDeleteReport = async (reportId: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, 'dailyReports', reportId));
    } catch (err) {
      console.error('Error deleting report:', err);
      throw new Error(err instanceof Error ? err.message : 'Failed to delete report');
    }
  };

  const createReport = async (reportData: Omit<DailyReport, 'id' | 'createdAt' | 'updatedAt'>): Promise<{ id: string }> => {
    try {
      const docRef = await addDoc(collection(db, 'dailyReports'), {
        ...reportData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return { id: docRef.id };
    } catch (err) {
      console.error('Error creating report:', err);
      throw new Error(err instanceof Error ? err.message : 'Failed to create report');
    }
  };

  const updateReport = async (reportId: string, updates: Partial<DailyReport>): Promise<void> => {
    try {
      const { id, createdAt, ...updateData } = updates as any;
      await updateDoc(doc(db, 'dailyReports', reportId), {
        ...updateData,
        updatedAt: serverTimestamp()
      });
    } catch (err) {
      console.error('Error updating report:', err);
      throw new Error(err instanceof Error ? err.message : 'Failed to update report');
    }
  };

  // Computed values
  const uniqueProjects = Array.from(new Set(reports.map(report => report.project)));

  const filteredReports = reports.filter(report => {
    const projectMatch = !projectFilter || report.project === projectFilter;
    const dateMatch = !dateFilter || report.date === dateFilter;
    return projectMatch && dateMatch;
  });

  return {
    reports,
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
  };
}
