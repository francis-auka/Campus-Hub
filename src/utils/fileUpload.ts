
import { supabase } from "@/integrations/supabase/client";

export interface UploadResult {
  success: boolean;
  filePath?: string;
  error?: string;
}

/**
 * Uploads a profile picture to Supabase storage
 */
export const uploadProfilePicture = async (
  file: File,
  userId: string
): Promise<UploadResult> => {
  try {
    console.log("Starting profile picture upload for user:", userId);
    
    if (!file || !userId) {
      return {
        success: false,
        error: "File and user ID are required"
      };
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      console.error("Invalid file type:", file.type);
      return {
        success: false,
        error: "Only JPG and PNG images are allowed"
      };
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      console.error("File too large:", file.size);
      return {
        success: false,
        error: "File size must be less than 5MB"
      };
    }

    // Create file path: userId/profile-pics/filename
    // This matches the RLS policy expectation where userId is the first folder
    const fileExtension = file.name.split('.').pop();
    const fileName = `profile-pic-${Date.now()}.${fileExtension}`;
    const filePath = `${userId}/profile-pics/${fileName}`;

    console.log("Uploading file to path:", filePath);

    // Upload file to storage
    const { data, error } = await supabase.storage
      .from('public_media')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) {
      console.error("Upload error:", error);
      return {
        success: false,
        error: error.message
      };
    }

    console.log("Upload successful:", data);
    
    return {
      success: true,
      filePath: data.path
    };
  } catch (error: any) {
    console.error("Upload error:", error);
    return {
      success: false,
      error: error.message || "Upload failed"
    };
  }
};

/**
 * Gets the public URL for an image in storage
 */
export const getPublicImageUrl = (filePath: string): string => {
  if (!filePath) return "";
  
  const { data } = supabase.storage
    .from('public_media')
    .getPublicUrl(filePath);
    
  return data.publicUrl;
};

/**
 * Deletes a file from storage
 */
export const deleteFile = async (filePath: string): Promise<boolean> => {
  try {
    const { error } = await supabase.storage
      .from('public_media')
      .remove([filePath]);
      
    if (error) {
      console.error("Delete error:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Delete error:", error);
    return false;
  }
};
