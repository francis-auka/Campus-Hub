
export interface Notification {
  id: string;
  type: 'message' | 'bid';
  created_at: string;
  read: boolean;
  sender_id: string;
  sender_name?: string;
  sender_profile_pic?: string;
  hustle_id: string;
  hustle_title?: string;
  message?: string;
}
