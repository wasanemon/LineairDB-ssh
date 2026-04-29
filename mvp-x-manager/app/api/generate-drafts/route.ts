import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { z } from 'zod';
import { supabaseAdmin } from '@/lib/supabase';
import { env } from '@/lib/env';
import { badRequest, safeServerError } from '@/lib/guards';

const client = new OpenAI({ apiKey: env.openaiApiKey });
const variants = ['concise', 'insightful', 'thread_hook'] as const;
const schema = z.object({ topic_id: z.string().uuid(), user_id: z.string().uuid() });

export async function POST(req: NextRequest) {
  try {
    const parse = schema.safeParse(await req.json());
    if (!parse.success) return badRequest('topic_id and user_id are required');
    const { topic_id, user_id } = parse.data;

    const { data: topic } = await supabaseAdmin.from('topics').select('*').eq('id', topic_id).eq('user_id', user_id).single();
    if (!topic) return badRequest('topic not found');

    const drafts = [];
    for (const variant of variants) {
      const completion = await client.responses.create({
        model: 'gpt-4.1-mini',
        input: `X投稿案を1つ生成。variant=${variant}。280字以内。ビジネス寄り。煽らない。必要ならハッシュタグ最大2。題材: ${JSON.stringify(topic)}`
      });
      drafts.push({ user_id, topic_id, body: completion.output_text.trim().slice(0, 280), variant_name: variant, status: 'draft' });
    }

    const { data, error } = await supabaseAdmin.from('drafts').insert(drafts).select();
    if (error) return badRequest('failed to save drafts');
    return NextResponse.json(data);
  } catch {
    return safeServerError();
  }
}
