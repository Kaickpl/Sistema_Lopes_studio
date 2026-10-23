"use client";

import { createBrowserClient } from "@supabase/ssr";
import { SUPABASE_KEY, SUPABASE_URL } from "../config";

let client: ReturnType<typeof createBrowserClient> | null = null;

/** Cliente do Supabase usado no navegador (painel admin). */
export function supabaseNavegador() {
  if (!client) client = createBrowserClient(SUPABASE_URL, SUPABASE_KEY);
  return client;
}
