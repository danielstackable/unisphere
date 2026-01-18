
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { University, UniversityDetails } from '../types';

/**
 * Use environment variables if available, otherwise fall back to the 
 * project-specific credentials provided by the user.
 */
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

/**
 * Initialize the Supabase client.
 * The fallback values ensure that createClient is never called with undefined strings,
 * which resolves the "supabaseUrl is required" error.
 */
export const supabase: SupabaseClient | null = (SUPABASE_URL && SUPABASE_ANON_KEY)
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

export class SupabaseService {
  /**
   * Checks if the Supabase client has been successfully initialized.
   */
  static isConfigured(): boolean {
    return !!supabase;
  }

  /**
   * Persists a university's details to the Supabase 'universities' table.
   */
  static async saveUniversity(u: UniversityDetails) {
    if (!supabase) {
      console.warn("Supabase is not configured. University not saved.");
      return null;
    }

    const { data, error } = await supabase
      .from('universities')
      .upsert({
        name: u.name,
        location: u.location,
        country: u.country,
        type: u.type,
        classification: u.classification,
        description: u.description,
        website: u.website,
        world_ranking: u.worldRanking,
        programs: u.programs,
        sources: u.sources,
        last_synced_at: new Date().toISOString()
      }, { onConflict: 'name' })
      .select();

    if (error) {
      console.error("Supabase Save Error:", error.message);
      throw error;
    }
    return data;
  }

  /**
   * Retrieves all universities currently stored in the user's repository.
   */
  static async getSavedUniversities(): Promise<University[]> {
    if (!supabase) return [];

    try {
      const { data, error } = await supabase
        .from('universities')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Supabase Fetch Error:", error.message);
        return [];
      }

      return (data || []).map((u: any) => ({
        ...u,
        id: u.id.toString(),
        worldRanking: u.world_ranking,
        programs: u.programs || [],
        sources: u.sources || []
      }));
    } catch (err) {
      console.error("Critical Repository Fetch Error:", err);
      return [];
    }
  }

  /**
   * Determines if a specific university is already saved in the repository.
   */
  static async isSaved(name: string): Promise<boolean> {
    if (!supabase) return false;

    try {
      // maybeSingle() prevents error throwing when no record is found
      const { data } = await supabase
        .from('universities')
        .select('id')
        .eq('name', name)
        .maybeSingle();

      return !!data;
    } catch (e) {
      return false;
    }
  }

  /**
   * Removes a university from the repository by name.
   */
  static async removeUniversity(name: string) {
    if (!supabase) return;

    const { error } = await supabase
      .from('universities')
      .delete()
      .eq('name', name);

    if (error) {
      console.error("Supabase Deletion Error:", error.message);
      throw error;
    }
  }
}
