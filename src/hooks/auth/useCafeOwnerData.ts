
import { AppUser } from "@/types/auth";
import { supabaseAdmin } from "@/integrations/supabase/admin-client";
import { saveUserToStorage } from "./useStoredUser";

/**
 * Function to fetch full cafe owner data
 */
export const fetchCafeOwnerData = async (ownerId: string): Promise<AppUser> => {
  try {
    console.log(`Fetching complete data for cafe owner with ID: ${ownerId}`);
    
    const { data: cafeOwner, error: fetchError } = await supabaseAdmin
      .from("cafe_owners")
      .select("*")
      .eq("id", ownerId)
      .maybeSingle();

    if (fetchError) {
      console.error("Error fetching owner data:", fetchError);
      throw new Error(`Error retrieving user data: ${fetchError.message}`);
    }

    if (!cafeOwner) {
      console.error("No owner data found for ID:", ownerId);
      throw new Error("Owner data not found");
    }

    console.log("Successfully fetched cafe owner data:", cafeOwner);

    const cafeOwnerData: AppUser = {
      id: cafeOwner.id,
      username: cafeOwner.username,
      role: "cafe_owner",
      cafeId: cafeOwner.id,
    };

    saveUserToStorage(cafeOwnerData);
    return cafeOwnerData;
  } catch (error) {
    console.error("Error in fetchCafeOwnerData:", error);
    throw error;
  }
};
