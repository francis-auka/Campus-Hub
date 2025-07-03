
import { supabase } from "@/integrations/supabase/client";

export interface ProfileData {
  id: string;
  name: string;
  profile_pic_url?: string;
  trust_score?: number;
}

/**
 * Fetches profile data for multiple user IDs with detailed logging
 */
export const fetchProfilesData = async (userIds: string[]): Promise<Map<string, ProfileData>> => {
  if (!userIds || !userIds.length) return new Map();

  // Remove any null or undefined values and validate UUIDs
  const validUserIds = userIds.filter(id => id && typeof id === 'string' && id.length === 36);

  if (validUserIds.length === 0) return new Map();

  try {
    console.log("Fetching profiles for user IDs:", validUserIds);
    
    // Make the query
    const { data, error } = await supabase
      .from('profiles')
      .select('id, name, profile_pic_url, trust_score')
      .in('id', validUserIds);

    if (error) {
      console.error("Error fetching profiles:", error);
      throw error;
    }

    // Log what we received
    console.log("Profiles data received:", data);
    
    // Create profile map
    const profileMap = new Map<string, ProfileData>();
    
    // Add all profiles to the map
    data?.forEach(profile => {
      // Use empty string fallback for null or undefined names
      profileMap.set(profile.id, {
        id: profile.id,
        name: profile.name || 'Anonymous User',
        profile_pic_url: profile.profile_pic_url,
        trust_score: profile.trust_score || 3
      });
    });

    // Check if we're missing any profiles and create fallback profiles
    validUserIds.forEach(id => {
      if (!profileMap.has(id)) {
        console.warn(`Creating fallback profile for user ID: ${id}`);
        
        // Add a placeholder profile as fallback with more descriptive name
        profileMap.set(id, {
          id: id,
          name: 'Community Member',
          profile_pic_url: undefined,
          trust_score: 3
        });
      }
    });

    return profileMap;
  } catch (error) {
    console.error("Error fetching profiles data:", error);
    
    // Create a fallback map with placeholder profiles
    const fallbackMap = new Map<string, ProfileData>();
    validUserIds.forEach(id => {
      fallbackMap.set(id, {
        id: id,
        name: 'Community Member',
        profile_pic_url: undefined,
        trust_score: 3
      });
    });
    
    return fallbackMap;
  }
};

/**
 * Fetches a single profile by user ID
 */
export const fetchProfileData = async (userId: string): Promise<ProfileData | null> => {
  if (!userId || typeof userId !== 'string' || userId.length !== 36) return null;

  try {
    console.log("Fetching profile for user ID:", userId);
    
    const { data, error } = await supabase
      .from('profiles')
      .select('id, name, profile_pic_url, trust_score')
      .eq('id', userId)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
      
      // Return a fallback profile
      return {
        id: userId,
        name: 'Community Member',
        profile_pic_url: undefined,
        trust_score: 3
      };
    }

    console.log("Profile data received:", data);
    
    return {
      id: data.id,
      name: data.name || 'Anonymous User',
      profile_pic_url: data.profile_pic_url,
      trust_score: data.trust_score || 3
    };
  } catch (error) {
    console.error("Error fetching profile data:", error);
    
    // Return a fallback profile
    return {
      id: userId,
      name: 'Community Member',
      profile_pic_url: undefined,
      trust_score: 3
    };
  }
};
