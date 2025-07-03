
import { supabase } from "@/integrations/supabase/client";
import { Notification } from "@/types/notifications";
import { fetchProfilesData } from "@/utils/profileDataFetcher";

export async function fetchUserNotifications(userId: string): Promise<Notification[]> {
  try {
    // Fetch messages
    const { data: messagesData, error: messagesError } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('recipient_id', userId)
      .order('created_at', { ascending: false });
      
    if (messagesError) throw messagesError;
    
    if (!messagesData || messagesData.length === 0) {
      return [];
    }
    
    // Get unique sender IDs and hustle IDs
    const senderIds = [...new Set(messagesData.map(msg => msg.sender_id))];
    const hustleIds = [...new Set(messagesData.map(msg => msg.hustle_id))];
    
    console.log("Fetching notifications for senders:", senderIds);
    
    // Fetch profiles with retry and detailed logging
    const profileMap = await fetchProfilesData(senderIds);
    
    // Check what profiles we got back
    console.log("Profile map for notifications:", 
      Array.from(profileMap.entries()).map(([id, profile]) => ({ 
        id, 
        name: profile.name 
      }))
    );
    
    // Fetch hustle details
    const { data: hustlesData, error: hustlesError } = await supabase
      .from('hustles')
      .select('id, title')
      .in('id', hustleIds);
        
    if (hustlesError) throw hustlesError;
    
    // Create a map of hustle IDs to titles for easy lookup
    const hustleMap = new Map();
    hustlesData?.forEach(hustle => {
      hustleMap.set(hustle.id, hustle.title || 'Unknown hustle');
    });
    
    // Transform messages to notifications format
    const messageNotifications = messagesData.map(message => {
      const profile = profileMap.get(message.sender_id);
      
      const notification: Notification = {
        id: message.id,
        type: 'message',
        created_at: message.created_at,
        read: message.read || false,
        sender_id: message.sender_id,
        sender_name: profile?.name || 'Unknown User',
        sender_profile_pic: profile?.profile_pic_url,
        hustle_id: message.hustle_id,
        hustle_title: hustleMap.get(message.hustle_id) || 'Unknown hustle',
        message: message.message
      };
      
      return notification;
    });
    
    return messageNotifications;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
}

export async function markNotificationAsRead(notificationId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('chat_messages')
      .update({ read: true })
      .eq('id', notificationId);
      
    if (error) throw error;
  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw error;
  }
}

export async function markAllNotificationsAsRead(userId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('chat_messages')
      .update({ read: true })
      .eq('recipient_id', userId)
      .eq('read', false);
      
    if (error) throw error;
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    throw error;
  }
}
