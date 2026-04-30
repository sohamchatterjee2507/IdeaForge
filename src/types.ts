import { Timestamp } from 'firebase/firestore';

export type Role = 'admin' | 'user';

export interface UserProfile {
  uid: string;
  email: string;
  role: Role;
  displayName: string;
  photoURL: string;
  createdAt: Timestamp | { seconds: number; nanoseconds: number } | null;
}

export interface Idea {
  id: string;
  title: string;
  domain: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | string;
  price: number;
  description: string;
  visible: boolean;
  media: string[]; // URLs
  createdBy: string;
  createdAt: Timestamp | { seconds: number; nanoseconds: number } | null;
  purchaseCount: number;
}

export interface IdeaContent {
  implementationSteps: string;
  resources: string;
}

export type PurchaseStatus = 'pending' | 'confirmed';

export interface Purchase {
  id: string;
  userId: string;
  ideaId: string;
  status: PurchaseStatus;
  createdAt: Timestamp | { seconds: number; nanoseconds: number } | null;
  ideaTitle?: string;
  priceAtPurchase?: number;
}
