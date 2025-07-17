import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { auth } from '../config/firebase';

// Permission constants
export const PERMISSIONS = {
  VIEW_REPORTS: 'view_reports',
  CREATE_REPORTS: 'create_reports',
  EDIT_REPORTS: 'edit_reports',
  DELETE_REPORTS: 'delete_reports',
  VIEW_PROJECTS: 'view_projects',
  CREATE_PROJECTS: 'create_projects',
  EDIT_PROJECTS: 'edit_projects',
  DELETE_PROJECTS: 'delete_projects',
  VIEW_CREW: 'view_crew',
  MANAGE_CREW: 'manage_crew',
  VIEW_EQUIPMENT: 'view_equipment',
  MANAGE_EQUIPMENT: 'manage_equipment',
  VIEW_TIMECARDS: 'view_timecards',
  MANAGE_TIMECARDS: 'manage_timecards',
  ADMIN: 'admin'
} as const;

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];

interface UserRole {
  name: string;
  permissions: Permission[];
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  userRole: UserRole | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  hasPermission: (permission: Permission) => boolean;
  PERMISSIONS: typeof PERMISSIONS;
}

// Default roles and permissions
const DEFAULT_ROLES: Record<string, UserRole> = {
  admin: {
    name: 'Administrator',
    permissions: Object.values(PERMISSIONS) as Permission[]
  },
  foreman: {
    name: 'Foreman',
    permissions: [
      PERMISSIONS.VIEW_REPORTS,
      PERMISSIONS.CREATE_REPORTS,
      PERMISSIONS.EDIT_REPORTS,
      PERMISSIONS.VIEW_PROJECTS,
      PERMISSIONS.VIEW_CREW,
      PERMISSIONS.MANAGE_CREW,
      PERMISSIONS.VIEW_EQUIPMENT,
      PERMISSIONS.VIEW_TIMECARDS,
      PERMISSIONS.MANAGE_TIMECARDS
    ]
  },
  worker: {
    name: 'Worker',
    permissions: [
      PERMISSIONS.VIEW_REPORTS,
      PERMISSIONS.CREATE_REPORTS,
      PERMISSIONS.VIEW_PROJECTS,
      PERMISSIONS.VIEW_CREW,
      PERMISSIONS.VIEW_EQUIPMENT,
      PERMISSIONS.VIEW_TIMECARDS
    ]
  },
  viewer: {
    name: 'Viewer',
    permissions: [
      PERMISSIONS.VIEW_REPORTS,
      PERMISSIONS.VIEW_PROJECTS,
      PERMISSIONS.VIEW_CREW,
      PERMISSIONS.VIEW_EQUIPMENT,
      PERMISSIONS.VIEW_TIMECARDS
    ]
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
        // In a real app, you would fetch the user's role from your database
        // For now, we'll assign roles based on email or use a default
        const role = getUserRole(user);
        setUserRole(role);
      } else {
        setUserRole(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const getUserRole = (user: User): UserRole => {
    // In a real app, this would fetch from your database
    // For demo purposes, assign roles based on email domain or use admin as default
    const email = user.email?.toLowerCase() || '';
    
    if (email.includes('admin')) {
      return DEFAULT_ROLES.admin;
    } else if (email.includes('foreman')) {
      return DEFAULT_ROLES.foreman;
    } else if (email.includes('worker')) {
      return DEFAULT_ROLES.worker;
    } else {
      // Default to admin for development
      return DEFAULT_ROLES.admin;
    }
  };

  const hasPermission = (permission: Permission): boolean => {
    if (!userRole) return false;
    return userRole.permissions.includes(permission);
  };

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = async (email: string, password: string) => {
    await createUserWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    await signOut(auth);
  };

  const value = {
    user,
    loading,
    userRole,
    signIn,
    signUp,
    logout,
    hasPermission,
    PERMISSIONS,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
