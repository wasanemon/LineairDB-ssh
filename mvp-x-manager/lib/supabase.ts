import { createBrowserClient, createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { env } from './env';

export const supabaseAdmin = createClient(env.supabaseUrl, env.supabaseService, { auth: { persistSession: false } });

export function createSupabaseBrowser() {
  return createBrowserClient(env.supabaseUrl, env.supabaseAnon);
}

export function createSupabaseServer() {
  const cookieStore = cookies();
  return createServerClient(env.supabaseUrl, env.supabaseAnon, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
      }
    }
  });
}
