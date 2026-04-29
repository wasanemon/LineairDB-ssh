import { NextRequest, NextResponse } from 'next/server';
import { TwitterApi } from 'twitter-api-v2';
import { supabaseAdmin } from '@/lib/supabase';
import { env } from '@/lib/env';
import { badRequest, safeServerError } from '@/lib/guards';

const xClient = new TwitterApi({ appKey: env.xApiKey, appSecret: env.xApiSecret, accessToken: env.xAccessToken, accessSecret: env.xAccessTokenSecret });

export async function POST(req: NextRequest) {
  try {
    const { draft_id, user_id } = await req.json();
    if (!draft_id) return badRequest('draft_id is required');
    const { data: draft } = await supabaseAdmin.from('drafts').select('*').eq('id', draft_id).single();
    if (!draft) return badRequest('draft not found');
    if (draft.status === 'posted') return badRequest('already posted');
    if (draft.status !== 'approved') return badRequest('only approved drafts can be posted');

    try {
      const res = await xClient.v2.tweet(draft.body);
      const xPostId = res.data.id;
      const url = `https://x.com/i/web/status/${xPostId}`;
      await supabaseAdmin.from('posts').insert({ user_id, draft_id, x_post_id: xPostId, x_post_url: url, posted_at: new Date().toISOString() });
      await supabaseAdmin.from('drafts').update({ status: 'posted' }).eq('id', draft_id);
      return NextResponse.json({ x_post_id: xPostId, x_post_url: url });
    } catch {
      await supabaseAdmin.from('drafts').update({ status: 'failed', error_summary: 'Post to X failed' }).eq('id', draft_id);
      return NextResponse.json({ error: 'failed to post to X' }, { status: 502 });
    }
  } catch {
    return safeServerError();
  }
}
