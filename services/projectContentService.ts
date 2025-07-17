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

// ===== COST CODES =====
export interface CostCode {
  id: string;
  code: string;
  description: string;
  category: string;
  projectId: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface CreateCostCodeData {
  code: string;
  description: string;
  category: string;
  projectId: string;
}

const COST_CODES_COLLECTION = 'costCodes';

// Create a new cost code
export const createCostCode = async (costCodeData: CreateCostCodeData, userId: string): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, COST_CODES_COLLECTION), {
      ...costCodeData,
      createdAt: Timestamp.fromDate(new Date()),
      updatedAt: Timestamp.fromDate(new Date()),
      userId
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating cost code:', error);
    throw error;
  }
};

// Get cost codes for a project
export const subscribeToCostCodes = (
  projectId: string, 
  userId: string, 
  callback: (costCodes: CostCode[]) => void
): (() => void) => {
  console.log('Setting up Firestore subscription for cost codes, projectId:', projectId, 'userId:', userId);
  
  const q = query(
    collection(db, COST_CODES_COLLECTION),
    where('projectId', '==', projectId),
    where('userId', '==', userId)
  );

  return onSnapshot(q, (querySnapshot) => {
    console.log('Firestore cost codes snapshot received, docs count:', querySnapshot.docs.length);
    
    const costCodes: CostCode[] = [];
    querySnapshot.forEach((doc) => {
      console.log('Processing cost code document:', doc.id);
      const data = doc.data();
      costCodes.push({
        id: doc.id,
        code: data.code,
        description: data.description,
        category: data.category,
        projectId: data.projectId,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
        userId: data.userId
      });
    });

    // Sort by code
    costCodes.sort((a, b) => a.code.localeCompare(b.code));
    
    console.log('Calling callback with', costCodes.length, 'cost codes');
    callback(costCodes);
  });
};

// Update a cost code
export const updateCostCode = async (
  costCodeId: string, 
  updates: Partial<Omit<CostCode, 'id' | 'createdAt' | 'userId' | 'projectId'>>
): Promise<void> => {
  try {
    const costCodeRef = doc(db, COST_CODES_COLLECTION, costCodeId);
    
    const updatedData: any = {
      ...updates,
      updatedAt: Timestamp.fromDate(new Date())
    };
    
    await updateDoc(costCodeRef, updatedData);
  } catch (error) {
    console.error('Error updating cost code:', error);
    throw error;
  }
};

// Delete a cost code
export const deleteCostCode = async (costCodeId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, COST_CODES_COLLECTION, costCodeId));
  } catch (error) {
    console.error('Error deleting cost code:', error);
    throw error;
  }
};

// ===== SCOPE ITEMS =====
export interface ScopeItem {
  id: string;
  name: string;
  description: string;
  status: 'Not Started' | 'In Progress' | 'Completed';
  progress: number;
  projectId: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface CreateScopeItemData {
  name: string;
  description: string;
  status: 'Not Started' | 'In Progress' | 'Completed';
  progress: number;
  projectId: string;
}

const SCOPE_ITEMS_COLLECTION = 'scopeItems';

// Create a new scope item
export const createScopeItem = async (scopeItemData: CreateScopeItemData, userId: string): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, SCOPE_ITEMS_COLLECTION), {
      ...scopeItemData,
      createdAt: Timestamp.fromDate(new Date()),
      updatedAt: Timestamp.fromDate(new Date()),
      userId
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating scope item:', error);
    throw error;
  }
};

// Get scope items for a project
export const subscribeToScopeItems = (
  projectId: string, 
  userId: string, 
  callback: (scopeItems: ScopeItem[]) => void
): (() => void) => {
  console.log('Setting up Firestore subscription for scope items, projectId:', projectId, 'userId:', userId);
  
  const q = query(
    collection(db, SCOPE_ITEMS_COLLECTION),
    where('projectId', '==', projectId),
    where('userId', '==', userId)
  );

  return onSnapshot(q, (querySnapshot) => {
    console.log('Firestore scope items snapshot received, docs count:', querySnapshot.docs.length);
    
    const scopeItems: ScopeItem[] = [];
    querySnapshot.forEach((doc) => {
      console.log('Processing scope item document:', doc.id);
      const data = doc.data();
      scopeItems.push({
        id: doc.id,
        name: data.name,
        description: data.description,
        status: data.status,
        progress: data.progress,
        projectId: data.projectId,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
        userId: data.userId
      });
    });

    // Sort by name
    scopeItems.sort((a, b) => a.name.localeCompare(b.name));
    
    console.log('Calling callback with', scopeItems.length, 'scope items');
    callback(scopeItems);
  });
};

// Update a scope item
export const updateScopeItem = async (
  scopeItemId: string, 
  updates: Partial<Omit<ScopeItem, 'id' | 'createdAt' | 'userId' | 'projectId'>>
): Promise<void> => {
  try {
    const scopeItemRef = doc(db, SCOPE_ITEMS_COLLECTION, scopeItemId);
    
    const updatedData: any = {
      ...updates,
      updatedAt: Timestamp.fromDate(new Date())
    };
    
    await updateDoc(scopeItemRef, updatedData);
  } catch (error) {
    console.error('Error updating scope item:', error);
    throw error;
  }
};

// Delete a scope item
export const deleteScopeItem = async (scopeItemId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, SCOPE_ITEMS_COLLECTION, scopeItemId));
  } catch (error) {
    console.error('Error deleting scope item:', error);
    throw error;
  }
};


