import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('user_id');
  const query = supabaseAdmin.from('posts').select('*').order('created_at', { ascending: false });
  if (userId) query.eq('user_id', userId);
  const { data } = await query;
  return NextResponse.json(data ?? []);
}
