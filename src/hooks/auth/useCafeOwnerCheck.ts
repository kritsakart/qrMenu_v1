import { supabaseAdmin } from "@/integrations/supabase/admin-client";

/**
 * Function to check if cafe owner exists in database
 */
export const checkCafeOwnerExists = async (username: string) => {
  try {
    console.log("Attempting to connect to database for user check with username:", username);
    
    // Check basic connection
    const { data: connectionCheck, error: connectionError } = await supabaseAdmin
      .from("cafe_owners")
      .select("count")
      .limit(1);
    
    if (connectionError) {
      console.error("Database connection error:", connectionError);
      throw new Error(`Database connection problem: ${connectionError.message}`);
    }
    
    console.log("Database connection check succeeded:", connectionCheck);
    
    // Fetch all cafe owners for diagnostics
    const { data: allCafeOwners, error: allError } = await supabaseAdmin
      .from("cafe_owners")
      .select("*");

    if (allError) {
      console.error("Error fetching all cafe owners:", allError);
      throw new Error(`Error retrieving cafe owners: ${allError.message}`);
    }

    console.log(`Found ${allCafeOwners?.length || 0} total cafe owners in database:`, allCafeOwners);
    
    // Store all owners for debugging in UI
    (window as any).loginDebugInfo = {
      ...(window as any).loginDebugInfo || {},
      allCafeOwners: allCafeOwners || []
    };

    // Search for exact username match
    console.log(`Checking if cafe owner exists with username: '${username}'`);
    
    // Try exact match first
    const { data: exactMatch, error: exactMatchError } = await supabaseAdmin
      .from("cafe_owners")
      .select("id, username, status, name, email")
      .eq("username", username)
      .maybeSingle();

    if (exactMatchError) {
      console.error("Error in exact match search:", exactMatchError);
    } else if (exactMatch) {
      console.log("Exact match found:", exactMatch);
      
      if (exactMatch.status !== "active") {
        throw new Error(`Account is deactivated. Status: ${exactMatch.status}`);
      }

      return exactMatch;
    }

    // Try case-insensitive match if exact match fails
    console.log("No exact match found, trying case-insensitive search");
    
    const { data: caseInsensitiveMatch, error: caseInsensitiveError } = await supabaseAdmin
      .from("cafe_owners")
      .select("id, username, status, name, email")
      .ilike("username", username)
      .maybeSingle();
    
    if (caseInsensitiveError) {
      console.error("Error in case-insensitive search:", caseInsensitiveError);
    } else if (caseInsensitiveMatch) {
      console.log("Case-insensitive match found:", caseInsensitiveMatch);
      
      if (caseInsensitiveMatch.status !== "active") {
        throw new Error(`Account is deactivated. Status: ${caseInsensitiveMatch.status}`);
      }

      return caseInsensitiveMatch;
    }

    // No user found
    console.log(`User not found in database: ${username}`);
    return null;
  } catch (error) {
    console.error("Error checking cafe owner existence:", error);
    
    // Store debug info about error
    (window as any).loginDebugInfo = {
      ...(window as any).loginDebugInfo || {},
      userExistsCheck: {
        query: `SELECT * FROM cafe_owners WHERE username = '${username}' OR username ILIKE '${username}'`,
        result: {
          found: false,
          error: error instanceof Error ? error.message : "Unknown error",
        }
      }
    };
    throw error; // Re-throw the error to be handled by the caller
  }
};
