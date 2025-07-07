import { createSupabaseServerClient } from "@/lib/supabase/server";
import { cache } from "react";

export type UserRole = "admin" | "editor" | "viewer";

export const getUserWithProfile = cache(async () => {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { user: null, profile: null };
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  // Se o perfil não for encontrado (pode acontecer se o trigger falhar),
  // trata o usuário como 'viewer' por segurança.
  if (error || !profile) {
    console.error("Error fetching user profile, defaulting to 'viewer'.", error);
    return { user, profile: { role: "viewer" as UserRole } };
  }

  return { user, profile: profile as { role: UserRole } };
});