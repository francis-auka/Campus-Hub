
import { supabase } from "@/integrations/supabase/client";
import { fetchProfilesData } from "./profileDataFetcher";
import { safelyHandleData, checkTableExists } from "./supabaseUtils";
import { Bid } from "@/types/auth";

// Fetch bids for a specific hustle
export const fetchBidsData = async (hustleId: string): Promise<{
  bids: Bid[];
  error: string | null;
}> => {
  try {
    // Check if bids table exists
    const hasBidsTable = await checkTableExists('bids');
    if (!hasBidsTable) {
      return {
        bids: [],
        error: "The bidding system is not set up yet."
      };
    }

    // Type assertion to safely query the 'bids' table
    const { data: bidsData, error } = await supabase
      .from('bids' as any)
      .select('*')
      .eq('hustle_id', hustleId)
      .order('created_at', { ascending: false });
      
    if (error) {
      if (error.message && error.message.includes("relation \"bids\" does not exist")) {
        return {
          bids: [],
          error: "No bids available yet for this hustle."
        };
      }
      throw error;
    }
    
    if (!bidsData || !Array.isArray(bidsData) || bidsData.length === 0) {
      return {
        bids: [],
        error: null
      };
    }
    
    // Ensure we're working with an array
    const safeBidsData = safelyHandleData(bidsData);
    
    // Filter valid bidder IDs to fetch profiles
    const bidderIds = safeBidsData
      .filter((bid: any) => bid.bidder_id && !bid.bidder_name)
      .map((bid: any) => bid.bidder_id);
      
    const profileMap = bidderIds.length ? await fetchProfilesData(bidderIds) : new Map();
    
    // Transform the bids data into the expected format
    const formattedBids: Bid[] = safeBidsData.map((bid: any) => {
      const bidderName = bid.bidder_name || 
                         (bid.bidder_id ? profileMap.get(bid.bidder_id)?.name : null) || 
                         'Anonymous User';
      return {
        id: bid.id,
        hustle_id: bid.hustle_id,
        bidder_id: bid.bidder_id,
        bid_amount: bid.bid_amount,
        message: bid.message,
        created_at: bid.created_at,
        bidder_name: bidderName,
        bidder_profile_pic: bid.bidder_id ? profileMap.get(bid.bidder_id)?.profile_pic_url : undefined
      };
    });
    
    return {
      bids: formattedBids,
      error: null
    };
  } catch (error) {
    console.error("Error fetching bids:", error);
    return {
      bids: [],
      error: "Failed to load bids"
    };
  }
};

// Submit a bid with maximum amount validation
export const submitBid = async (
  hustleId: string, 
  userId: string, 
  bidAmount: string, 
  bidMessage: string, 
  userName: string
): Promise<{
  success: boolean;
  error: string | null;
}> => {
  try {
    // Validate bid amount (max 50)
    const numericAmount = parseInt(bidAmount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return {
        success: false,
        error: "Please enter a valid bid amount"
      };
    }
    
    if (numericAmount > 50) {
      return {
        success: false,
        error: "Maximum bid amount is KSh 50"
      };
    }
    
    // Check if bids table exists
    const hasBidsTable = await checkTableExists('bids');
    if (!hasBidsTable) {
      return {
        success: false,
        error: "The bidding system is not fully set up yet. Please try again later."
      };
    }

    // Use type assertion to safely insert into the 'bids' table
    const { error } = await supabase
      .from('bids' as any)
      .insert({
        hustle_id: hustleId,
        bidder_id: userId,
        bid_amount: `KSh ${bidAmount}`,
        message: bidMessage,
        bidder_name: userName || 'Anonymous User'
      });

    if (error) {
      if (error.message && (
        error.message.includes("relation \"bids\" does not exist") || 
        error.message.includes("column \"bidder_id\" of relation \"bids\" does not exist") ||
        error.message.includes("column \"bidder_name\" of relation \"bids\" does not exist")
      )) {
        return {
          success: false,
          error: "The bidding system is not fully set up yet. Please try again later."
        };
      }
      throw error;
    }

    return {
      success: true,
      error: null
    };
  } catch (error) {
    console.error("Error submitting bid:", error);
    return {
      success: false,
      error: "Failed to submit bid. Please try again."
    };
  }
};
