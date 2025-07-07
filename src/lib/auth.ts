import { createSupabaseServerClient } from "./supabase/server";

export type UserRole = "admin" | "editor" | "viewer";

export async function getUserRole(): Promise<UserRole> {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return "viewer"; // Default to the most restrictive role if no user
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (error || !data) {
    // This might happen if the trigger failed or for an existing user before the trigger was added.
    // Default to 'viewer' for security.
    return "viewer";
  }

  return data.role as UserRole;
}