export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  role: 'owner' | 'admin' | 'superadmin';
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  type: 'buy' | 'rent';
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  squareMeters: number;
  amenities: string[];
  status: 'pending' | 'approved' | 'rejected';
  ownerId: string;
  approvedByAdminId?: string;
  image: string;
  personalOwnerInfo: {
    name: string;
    email: string;
    phone: string;
  };
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}
