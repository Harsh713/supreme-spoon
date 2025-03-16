import supabase from "./supabaseClient";

export const logout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) console.error("Logout failed:", error.message);
};
