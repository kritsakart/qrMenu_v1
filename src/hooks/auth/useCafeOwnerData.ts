import { AppUser } from "@/types/auth";
import { supabaseAdmin } from "@/integrations/supabase/admin-client";
import { setStoredUser } from "./useStoredUser";

/**
 * Function to fetch full cafe owner data
 */
export const fetchCafeOwnerData = async (ownerId: string): Promise<AppUser> => {
  try {
    console.log(`🔍 fetchCafeOwnerData: Fetching complete data for cafe owner with ID: ${ownerId}`);
    
    const { data: cafeOwner, error: fetchError } = await supabaseAdmin
      .from("cafe_owners")
      .select("*")
      .eq("id", ownerId)
      .maybeSingle();

    console.log(`🔍 fetchCafeOwnerData: Raw response from database:`, {
      data: cafeOwner,
      error: fetchError,
      ownerId: ownerId
    });

    if (fetchError) {
      console.error("❌ fetchCafeOwnerData: Error fetching owner data:", fetchError);
      throw new Error(`Error retrieving user data: ${fetchError.message}`);
    }

    if (!cafeOwner) {
      console.error("❌ fetchCafeOwnerData: No owner data found for ID:", ownerId);
      throw new Error("Owner data not found");
    }

    console.log("✅ fetchCafeOwnerData: Successfully fetched cafe owner data:", cafeOwner);
    console.log("🔍 fetchCafeOwnerData: Setting cafeId to user ID:", cafeOwner.id);

    const cafeOwnerData: AppUser = {
      id: cafeOwner.id,
      username: cafeOwner.username,
      role: "cafe_owner",
      cafeId: cafeOwner.id,
      email: cafeOwner.email,
    };

    console.log("🎯 fetchCafeOwnerData: Final user object:", cafeOwnerData);

    setStoredUser(cafeOwnerData);
    return cafeOwnerData;
  } catch (error) {
    console.error("❌ fetchCafeOwnerData: Error in fetchCafeOwnerData:", error);
    throw error;
  }
};
