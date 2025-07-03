
export interface RegistrationFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  age: string;
  phone: string;
  school: string;
  course: string;
  year: string;
  sex: string;
}

export interface HustleFormData {
  title: string;
  description: string;
  category: string;
  offerType: string;
  offerAmount?: string;
  tradeDeal?: string;
  deadline: Date;
}

export interface Hustle {
  id: string;
  title: string;
  description: string;
  category: string;
  offer_type: string;
  offer_amount?: string;
  trade_deal?: string;
  deadline: string;
  status: string;
  created_at: string;
  user_id: string;
  assigned_to?: string;
}

export interface Bid {
  id: string;
  hustle_id: string;
  bidder_id: string;
  bid_amount: string;
  message: string;
  created_at: string;
  bidder_name: string;
  bidder_profile_pic?: string;
}

// Interface for chat messages
export interface ChatMessage {
  id: string;
  hustle_id: string;
  sender_id: string;
  recipient_id: string;
  message: string;
  read: boolean;
  created_at: string;
}

// Storage bucket names
export interface StorageBuckets {
  PRIVATE_DOCUMENTS: string;
  PUBLIC_MEDIA: string;
}

// Storage bucket constants
export const STORAGE_BUCKETS: StorageBuckets = {
  PRIVATE_DOCUMENTS: 'private_documents',
  PUBLIC_MEDIA: 'public_media'
};

// Function to get public URL for a file in the public bucket
export const getPublicUrl = (bucketName: string, path: string): string => {
  if (!path) return '';
  return `https://quivfsigmqgnwuzceslr.supabase.co/storage/v1/object/public/${bucketName}/${path}`;
};
