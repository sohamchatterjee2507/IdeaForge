import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  getDoc, 
  addDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp,
  orderBy,
  increment,
  runTransaction
} from 'firebase/firestore';
import { db } from './firebase';
import { Idea, IdeaContent, Purchase } from '../types';
import { handleFirestoreError, OperationType } from './firestore-errors';
import { toDate } from './utils';

const IDEAS_COL = 'ideas';
const CONTENT_COL = 'ideaContent';
const PURCHASES_COL = 'purchases';

export const ideaService = {
  async getAllIdeas(adminMode = false) {
    try {
      let q = query(collection(db, IDEAS_COL), orderBy('createdAt', 'desc'));
      if (!adminMode) {
        q = query(collection(db, IDEAS_COL), where('visible', '==', true), orderBy('createdAt', 'desc'));
      }
      const snapshot = await getDocs(q);
      return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Idea));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, IDEAS_COL);
      return [];
    }
  },

  async getIdeaById(id: string) {
    try {
      const d = await getDoc(doc(db, IDEAS_COL, id));
      if (!d.exists()) return null;
      return { id: d.id, ...d.data() } as Idea;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `${IDEAS_COL}/${id}`);
      return null;
    }
  },

  async getIdeaContent(id: string) {
    try {
      const d = await getDoc(doc(db, CONTENT_COL, id));
      if (!d.exists()) return null;
      return d.data() as IdeaContent;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `${CONTENT_COL}/${id}`);
      return null;
    }
  },

  async createIdea(ideaMeta: Omit<Idea, 'id' | 'createdAt' | 'purchaseCount'>, content: IdeaContent) {
    try {
      const ideaData = {
        ...ideaMeta,
        createdAt: serverTimestamp(),
        purchaseCount: 0,
      };
      const ideaRef = await addDoc(collection(db, IDEAS_COL), ideaData);
      await setDoc(doc(db, CONTENT_COL, ideaRef.id), content);
      return ideaRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, IDEAS_COL);
    }
  },

  async updateIdea(id: string, ideaMeta: Partial<Idea>, content?: Partial<IdeaContent>) {
    try {
      await updateDoc(doc(db, IDEAS_COL, id), ideaMeta);
      if (content) {
        await updateDoc(doc(db, CONTENT_COL, id), content);
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `${IDEAS_COL}/${id}`);
    }
  },

  async toggleVisibility(id: string, visible: boolean) {
    try {
      await updateDoc(doc(db, IDEAS_COL, id), { visible });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `${IDEAS_COL}/${id}`);
    }
  },

  async deleteIdea(id: string) {
    try {
      await deleteDoc(doc(db, IDEAS_COL, id));
      await deleteDoc(doc(db, CONTENT_COL, id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `${IDEAS_COL}/${id}`);
    }
  },

  async createPurchase(userId: string, userEmail: string, idea: Idea) {
    try {
      const purchaseData = {
        userId,
        userEmail,
        ideaId: idea.id,
        ideaTitle: idea.title,
        price: idea.price,
        status: 'pending' as const,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        createdAt: serverTimestamp() as any,
      };
      const docRef = await addDoc(collection(db, PURCHASES_COL), purchaseData);
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, PURCHASES_COL);
      throw error;
    }
  },

  async confirmPurchase(purchaseId: string, ideaId: string) {
    try {
      const pDoc = await getDoc(doc(db, PURCHASES_COL, purchaseId));
      if (!pDoc.exists()) return;
      const data = pDoc.data();
      const userId = data.userId;

      await runTransaction(db, async (transaction) => {
        const ideaRef = doc(db, IDEAS_COL, ideaId);
        const purchaseRef = doc(db, PURCHASES_COL, purchaseId);
        const markerRef = doc(db, PURCHASES_COL, `${userId}_${ideaId}`);
        
        transaction.update(purchaseRef, {
          status: 'confirmed'
        });
        
        transaction.set(markerRef, {
          userId,
          ideaId,
          status: 'confirmed',
          createdAt: serverTimestamp(),
          isMarker: true
        });
        
        transaction.update(ideaRef, {
          purchaseCount: increment(1)
        });
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, PURCHASES_COL);
    }
  },

  async getPurchases(adminMode = false, userId?: string) {
    try {
      let q;
      if (adminMode) {
        q = query(collection(db, PURCHASES_COL), where('status', '==', 'pending'));
      } else if (userId) {
        q = query(collection(db, PURCHASES_COL), where('userId', '==', userId));
      } else {
        return [];
      }
      const snapshot = await getDocs(q);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const list = snapshot.docs.map(d => ({ id: d.id, ...(d.data() as Record<string, any>) } as Purchase));

      // Sort by createdAt desc in memory
      list.sort((a, b) => {
        const dateA = a.createdAt ? toDate(a.createdAt) : new Date(0);
        const dateB = b.createdAt ? toDate(b.createdAt) : new Date(0);
        return dateB.getTime() - dateA.getTime();
      });

      // Filter out markers
      const filtered = list.filter(p => !p.isMarker);

      if (adminMode) {
        return filtered;
      } else {
        // Students can see both pending and confirmed purchases now (for Vault segregation)
        return filtered;
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, PURCHASES_COL);
      return [];
    }
  },

  async checkOwnership(userId: string, ideaId: string) {
    try {
      const q = query(collection(db, PURCHASES_COL), where('userId', '==', userId), where('ideaId', '==', ideaId), where('status', '==', 'confirmed'));
      const snapshot = await getDocs(q);
      return !snapshot.empty;
    } catch {
      return false;
    }
  }
};
