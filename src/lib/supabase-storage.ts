import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export const BUCKET = "documents";

let _client: SupabaseClient | null = null;

function getClient(): SupabaseClient {
  if (_client) return _client;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY sont requis");
  }
  _client = createClient(url, key, { auth: { persistSession: false } });
  return _client;
}

export async function uploadFichier(
  path: string,
  fichier: Uint8Array,
  contentType: string,
): Promise<string> {
  const { error } = await getClient().storage.from(BUCKET).upload(path, fichier, {
    contentType,
    upsert: false,
  });
  if (error) throw new Error(`Upload Supabase échoué : ${error.message}`);
  return path;
}

export async function genererUrlSignee(path: string, expiresIn = 3600): Promise<string> {
  const { data, error } = await getClient().storage.from(BUCKET).createSignedUrl(path, expiresIn);
  if (error || !data) throw new Error(`URL signée Supabase échouée : ${error?.message}`);
  return data.signedUrl;
}

export async function supprimerFichier(path: string): Promise<void> {
  const { error } = await getClient().storage.from(BUCKET).remove([path]);
  if (error) throw new Error(`Suppression Supabase échouée : ${error.message}`);
}
