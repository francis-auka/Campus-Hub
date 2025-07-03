
import { supabase } from "@/integrations/supabase/client";
import { checkTableExists, checkColumnExists } from "./supabaseUtils";
import { fetchProfilesData } from "./profileDataFetcher";

export interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  offer_type: "cash" | "trade";
  offer_amount?: string;
  trade_deal?: string;
  deadline: string;
  status: "open" | "in progress" | "finished";
  user_id: string;
  assigned_to?: string;
  created_at: string;
  updated_at: string;
  user: {
    id: string;
    name: string;
    profile_pic_url?: string;
  };
  bids: number;
  offer: string;
}

export interface HustlesDataResult {
  tasks: Task[];
  error?: string;
  hasBidsTable: boolean;
  hasAssignedToColumn: boolean;
}

export const fetchHustlesData = async (): Promise<HustlesDataResult> => {
  try {
    // Check if tables exist
    const hasBidsTable = await checkTableExists('bids');
    const hasAssignedToColumn = await checkColumnExists('hustles', 'assigned_to');
    
    // Fetch hustles without trying to join profiles (since there's no FK relationship)
    const { data: hustlesData, error: hustlesError } = await supabase
      .from('hustles')
      .select('*')
      .order('created_at', { ascending: false });

    if (hustlesError) {
      console.error("Error fetching hustles:", hustlesError);
      return {
        tasks: [],
        error: "Failed to fetch hustles data",
        hasBidsTable,
        hasAssignedToColumn
      };
    }

    if (!hustlesData || hustlesData.length === 0) {
      return {
        tasks: [],
        hasBidsTable,
        hasAssignedToColumn
      };
    }

    // Get unique user IDs from hustles
    const userIds = [...new Set(hustlesData.map(hustle => hustle.user_id))];
    
    // Fetch profile data separately
    const profilesMap = await fetchProfilesData(userIds);

    // Get bid counts if bids table exists
    let bidCounts: { [key: string]: number } = {};
    if (hasBidsTable) {
      const { data: bidsData, error: bidsError } = await supabase
        .from('bids')
        .select('hustle_id');
      
      if (!bidsError && bidsData) {
        bidCounts = bidsData.reduce((acc, bid) => {
          acc[bid.hustle_id] = (acc[bid.hustle_id] || 0) + 1;
          return acc;
        }, {} as { [key: string]: number });
      }
    }

    // Transform the data to match the Task interface
    const tasks: Task[] = hustlesData.map((hustle) => {
      const profileData = profilesMap.get(hustle.user_id);

      return {
        id: hustle.id,
        title: hustle.title,
        description: hustle.description,
        category: hustle.category,
        offer_type: hustle.offer_type as "cash" | "trade",
        offer_amount: hustle.offer_amount,
        trade_deal: hustle.trade_deal,
        deadline: hustle.deadline,
        status: hustle.status as "open" | "in progress" | "finished",
        user_id: hustle.user_id,
        assigned_to: hustle.assigned_to,
        created_at: hustle.created_at,
        updated_at: hustle.updated_at,
        user: {
          id: profileData?.id || hustle.user_id,
          name: profileData?.name || 'Community Member',
          profile_pic_url: profileData?.profile_pic_url
        },
        bids: bidCounts[hustle.id] || 0,
        offer: hustle.offer_type === 'cash' && hustle.offer_amount 
          ? `KSh ${hustle.offer_amount}` 
          : hustle.trade_deal || 'Trade offer'
      };
    });

    return {
      tasks,
      hasBidsTable,
      hasAssignedToColumn
    };
  } catch (error) {
    console.error("Error in fetchHustlesData:", error);
    return {
      tasks: [],
      error: "Failed to fetch hustles data",
      hasBidsTable: false,
      hasAssignedToColumn: false
    };
  }
};
