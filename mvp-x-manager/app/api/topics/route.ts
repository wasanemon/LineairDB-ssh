import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { badRequest, safeServerError } from '@/lib/guards';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.user_id || !body.title) return badRequest('user_id and title are required');
    const { data, error } = await supabaseAdmin.from('topics').insert(body).select().single();
    if (error) return badRequest('failed to create topic');
    return NextResponse.json(data);
  } catch { return safeServerError(); }
}
