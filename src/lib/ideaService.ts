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
  async getAllIdeas() {
    try {
      const q = query(collection(db, IDEAS_COL), orderBy('createdAt', 'desc'));
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

  async createIdea(ideaMeta: Omit<Idea, 'id' | 'createdAt' | 'purchaseCount' | 'rating'>, content: IdeaContent) {
    try {
      const ideaData = {
        ...ideaMeta,
        createdAt: serverTimestamp(),
        purchaseCount: 0,
        rating: 0
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

  async deleteIdea(id: string) {
    try {
      await deleteDoc(doc(db, IDEAS_COL, id));
      await deleteDoc(doc(db, CONTENT_COL, id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `${IDEAS_COL}/${id}`);
    }
  },

  async purchaseIdea(studentUid: string, ideaId: string, price: number) {
    const purchaseId = `${studentUid}_${ideaId}`;
    try {
      await runTransaction(db, async (transaction) => {
        const ideaRef = doc(db, IDEAS_COL, ideaId);
        const purchaseRef = doc(db, PURCHASES_COL, purchaseId);
        
        transaction.set(purchaseRef, {
          studentUid,
          ideaId,
          purchasedAt: serverTimestamp(),
          priceAtPurchase: price
        });
        
        transaction.update(ideaRef, {
          purchaseCount: increment(1)
        });
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, PURCHASES_COL);
    }
  },

  async getPurchasedIdeas(studentUid: string) {
    try {
      const q = query(collection(db, PURCHASES_COL), where('studentUid', '==', studentUid));
      const snapshot = await getDocs(q);
      const purchaseData = snapshot.docs.map(d => d.data() as Purchase);
      
      const ideaPromises = purchaseData.map(p => this.getIdeaById(p.ideaId));
      const ideas = await Promise.all(ideaPromises);
      return ideas.filter((i): i is Idea => i !== null);
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, PURCHASES_COL);
      return [];
    }
  },

  async checkOwnership(studentUid: string, ideaId: string) {
    try {
      const d = await getDoc(doc(db, PURCHASES_COL, `${studentUid}_${ideaId}`));
      return d.exists();
    } catch (error) {
      return false;
    }
  }
};
