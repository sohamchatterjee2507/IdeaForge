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

  async createPurchase(userId: string, idea: Idea) {
    const purchaseId = `${userId}_${idea.id}`;
    try {
      const purchaseData = {
        userId,
        ideaId: idea.id,
        ideaTitle: idea.title,
        status: 'pending',
        createdAt: serverTimestamp(),
        priceAtPurchase: idea.price
      };
      await setDoc(doc(db, PURCHASES_COL, purchaseId), purchaseData);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, PURCHASES_COL);
    }
  },

  async confirmPurchase(purchaseId: string, ideaId: string) {
    try {
      await runTransaction(db, async (transaction) => {
        const ideaRef = doc(db, IDEAS_COL, ideaId);
        const purchaseRef = doc(db, PURCHASES_COL, purchaseId);
        
        transaction.update(purchaseRef, {
          status: 'confirmed'
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
        q = query(collection(db, PURCHASES_COL), orderBy('createdAt', 'desc'));
      } else if (userId) {
        q = query(collection(db, PURCHASES_COL), where('userId', '==', userId), orderBy('createdAt', 'desc'));
      } else {
        return [];
      }
      const snapshot = await getDocs(q);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return snapshot.docs.map(d => ({ id: d.id, ...(d.data() as Record<string, any>) } as Purchase));
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
