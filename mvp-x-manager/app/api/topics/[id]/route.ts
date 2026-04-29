import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { badRequest, safeServerError } from '@/lib/guards';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { data, error } = await supabaseAdmin.from('topics').update(body).eq('id', params.id).select().single();
    if (error) return badRequest('failed to update topic');
    return NextResponse.json(data);
  } catch { return safeServerError(); }
}
