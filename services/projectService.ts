import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  onSnapshot, 
  query, 
  orderBy, 
  where,
  Timestamp,
  getDoc
} from 'firebase/firestore';
import { db } from '../config/firebase';

export interface Project {
  id: string;
  name: string;
  owner: string;
  projectNumber: string;
  status: 'Active' | 'On Hold' | 'Completed' | 'Cancelled';
  startDate: Date;
  address: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string; // To associate projects with users
}

export interface CreateProjectData {
  name: string;
  owner: string;
  projectNumber: string;
  status: 'Active' | 'On Hold' | 'Completed' | 'Cancelled';
  startDate: Date;
  address: string;
}

const COLLECTION_NAME = 'projects';

// Create a new project
export const createProject = async (projectData: CreateProjectData, userId: string): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...projectData,
      startDate: Timestamp.fromDate(projectData.startDate),
      createdAt: Timestamp.fromDate(new Date()),
      updatedAt: Timestamp.fromDate(new Date()),
      userId
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
};

// Get all projects for a user
export const getProjects = async (userId: string): Promise<Project[]> => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('userId', '==', userId)
    );
    
    const querySnapshot = await getDocs(q);
    const projects: Project[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      projects.push({
        id: doc.id,
        name: data.name,
        owner: data.owner,
        projectNumber: data.projectNumber,
        status: data.status,
        startDate: data.startDate.toDate(),
        address: data.address,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
        userId: data.userId
      });
    });
    
    // Sort by createdAt descending (newest first) on the client side
    projects.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    return projects;
  } catch (error) {
    console.error('Error getting projects:', error);
    throw error;
  }
};

// Subscribe to real-time updates for projects
export const subscribeToProjects = (
  userId: string, 
  callback: (projects: Project[]) => void
): (() => void) => {
  console.log('Setting up Firestore subscription for userId:', userId);
  
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('userId', '==', userId)
    );

    return onSnapshot(q, (querySnapshot) => {
      console.log('Firestore snapshot received, docs count:', querySnapshot.size);
      const projects: Project[] = [];
      querySnapshot.forEach((doc) => {
        console.log('Processing document:', doc.id);
        const data = doc.data();
        projects.push({
          id: doc.id,
          name: data.name,
          owner: data.owner,
          projectNumber: data.projectNumber,
          status: data.status,
          startDate: data.startDate.toDate(),
          address: data.address,
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
          userId: data.userId
        });
      });
      
      // Sort by createdAt descending (newest first) on the client side
      projects.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      
      console.log('Calling callback with', projects.length, 'projects');
      callback(projects);
    }, (error) => {
      console.error('Error in projects subscription:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      // Call callback with empty array so loading stops
      callback([]);
    });
  } catch (error) {
    console.error('Error setting up subscription:', error);
    // Return a no-op function and call callback immediately
    callback([]);
    return () => {};
  }
};

// Update a project
export const updateProject = async (
  projectId: string, 
  updates: Partial<Omit<Project, 'id' | 'createdAt' | 'userId'>>
): Promise<void> => {
  try {
    const projectRef = doc(db, COLLECTION_NAME, projectId);
    
    // Convert Date fields to Timestamps
    const updatedData: any = {
      ...updates,
      updatedAt: Timestamp.fromDate(new Date())
    };
    
    if (updates.startDate) {
      updatedData.startDate = Timestamp.fromDate(updates.startDate);
    }
    
    await updateDoc(projectRef, updatedData);
  } catch (error) {
    console.error('Error updating project:', error);
    throw error;
  }
};

// Delete a project
export const deleteProject = async (projectId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, projectId));
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
};

// Generate a unique project number
export const generateProjectNumber = (): string => {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `PROJ-${timestamp.slice(-6)}-${random}`;
};

// Get a single project by ID
export const getProjectById = async (projectId: string, userId: string): Promise<Project | null> => {
  try {
    const projectRef = doc(db, COLLECTION_NAME, projectId);
    const projectSnap = await getDoc(projectRef);
    
    if (projectSnap.exists()) {
      const data = projectSnap.data();
      
      // Check if the project belongs to the current user
      if (data.userId !== userId) {
        throw new Error('Unauthorized: Project does not belong to current user');
      }
      
      return {
        id: projectSnap.id,
        name: data.name,
        owner: data.owner,
        projectNumber: data.projectNumber,
        status: data.status,
        startDate: data.startDate.toDate(),
        address: data.address,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
        userId: data.userId
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching project:', error);
    throw error;
  }
};
