import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";

/**
 * Upload a file to Supabase storage
 * @param file The file to upload
 * @param path The storage path (default: 'logos')
 * @returns The URL of the uploaded file
 */
export const uploadFile = async (
  file: File,
  path: string = "logos"
): Promise<string | null> => {
  try {
    // Get current user
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      throw new Error("Not authenticated");
    }

    // Generate a unique filename
    const fileExt = file.name.split(".").pop();
    const fileName = `${userData.user.id}_${uuidv4()}.${fileExt}`;
    const filePath = `${path}/${fileName}`;

    // Upload the file
    const { error: uploadError } = await supabase.storage
      .from("public")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) {
      console.error("Error uploading file:", uploadError);
      return null;
    }

    // Get the public URL
    const { data } = supabase.storage.from("public").getPublicUrl(filePath);
    return data.publicUrl;
  } catch (error) {
    console.error("Error in file upload:", error);
    return null;
  }
};

/**
 * Delete a file from Supabase storage
 * @param url The URL of the file to delete
 * @returns True if the file was deleted successfully
 */
export const deleteFile = async (url: string): Promise<boolean> => {
  try {
    // Extract the path from the URL
    const path = url.split("/").pop();
    if (!path) return false;

    // Delete the file
    const { error } = await supabase.storage.from("public").remove([path]);
    if (error) {
      console.error("Error deleting file:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in file deletion:", error);
    return false;
  }
};
