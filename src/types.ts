export type Role = 'admin' | 'student';

export interface UserProfile {
  uid: string;
  email: string;
  role: Role;
  displayName: string;
  photoURL: string;
  createdAt: any;
}

export interface Idea {
  id: string;
  title: string;
  description: string;
  domain: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  price: number;
  createdBy: string;
  createdAt: any;
  purchaseCount: number;
  rating: number;
}

export interface IdeaContent {
  resources: string;
  implementationSteps: string;
}

export interface Purchase {
  id: string;
  studentUid: string;
  ideaId: string;
  purchasedAt: any;
  priceAtPurchase: number;
}
