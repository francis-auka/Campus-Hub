
import { supabase } from "@/integrations/supabase/client";

// Send an initial message
export const sendInitialMessage = async (hustleId: string, senderId: string, recipientId: string, message: string): Promise<{
  success: boolean;
  error: string | null;
}> => {
  try {
    const { error } = await supabase
      .from('chat_messages')
      .insert({
        hustle_id: hustleId,
        sender_id: senderId,
        recipient_id: recipientId,
        message: message.trim(),
        read: false
      });

    if (error) throw error;

    return {
      success: true,
      error: null
    };
  } catch (error) {
    console.error("Error sending message:", error);
    return {
      success: false,
      error: "Failed to send message. Please try again."
    };
  }
};
