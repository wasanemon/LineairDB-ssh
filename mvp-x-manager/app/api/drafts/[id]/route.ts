import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { badRequest, safeServerError } from '@/lib/guards';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    if (body.status === 'approved' && !body.confirmed) return badRequest('approval confirmation required');
    const payload = { ...body }; delete payload.confirmed;
    const { data, error } = await supabaseAdmin.from('drafts').update(payload).eq('id', params.id).select().single();
    if (error) return badRequest('failed to update draft');
    return NextResponse.json(data);
  } catch { return safeServerError(); }
}
