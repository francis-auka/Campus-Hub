
import { supabase } from "@/integrations/supabase/client";
import { checkColumnExists } from "./supabaseUtils";

// Assign a bid
export const assignBid = async (hustleId: string, bidderId: string): Promise<{
  success: boolean;
  error: string | null;
}> => {
  try {
    const hasAssignedToColumn = await checkColumnExists('hustles', 'assigned_to');
    if (!hasAssignedToColumn) {
      return {
        success: false,
        error: "The assignment feature is not fully set up yet. Please try again later."
      };
    }

    const { error } = await supabase
      .from('hustles')
      .update({
        status: 'in progress',
        assigned_to: bidderId,
        updated_at: new Date().toISOString()
      })
      .eq('id', hustleId);
    
    if (error) throw error;
    
    return {
      success: true,
      error: null
    };
  } catch (error) {
    console.error("Error assigning bid:", error);
    return {
      success: false,
      error: "Failed to assign bid. Please try again."
    };
  }
};

// Mark task as complete
export const completeTask = async (hustleId: string): Promise<{
  success: boolean;
  error: string | null;
}> => {
  try {
    const { error } = await supabase
      .from('hustles')
      .update({
        status: 'finished',
        updated_at: new Date().toISOString()
      })
      .eq('id', hustleId);
    
    if (error) throw error;
    
    return {
      success: true,
      error: null
    };
  } catch (error) {
    console.error("Error completing task:", error);
    return {
      success: false,
      error: "Failed to complete task. Please try again."
    };
  }
};
