'use client';
import { useEffect, useState } from 'react';
import { createSupabaseBrowser } from '@/lib/supabase';

type Draft = { id: string; body: string; status: string; topic_id: string; variant_name: string };
type Topic = { id: string; title: string };

export default function DraftsPage() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [topicId, setTopicId] = useState('');
  const [drafts, setDrafts] = useState<Draft[]>([]);

  const load = async () => {
    const supabase = createSupabaseBrowser();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const [{ data: t }, { data: d }] = await Promise.all([
      supabase.from('topics').select('id,title').eq('user_id', user.id),
      supabase.from('drafts').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
    ]);
    setTopics(t ?? []);
    setDrafts(d ?? []);
  };
  useEffect(() => { load(); }, []);

  const generate = async () => {
    const supabase = createSupabaseBrowser();
    const { data: { user } } = await supabase.auth.getUser();
    if (!topicId || !user) return;
    await fetch('/api/generate-drafts', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ topic_id: topicId, user_id: user.id }) });
    load();
  };

  const updateStatus = async (id: string, status: string) => {
    if (status === 'approved' && !confirm('このdraftを承認しますか？')) return;
    await fetch(`/api/drafts/${id}`, { method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ status, confirmed: status === 'approved' }) });
    load();
  };

  const post = async (id: string) => {
    if (!confirm('Xに投稿します。よろしいですか？')) return;
    const supabase = createSupabaseBrowser();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await fetch('/api/post-to-x', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ draft_id: id, user_id: user.id }) });
    load();
  };

  return <div className="space-y-4"><div className="flex gap-2"><select className="border p-2" value={topicId} onChange={(e)=>setTopicId(e.target.value)}><option value="">topic選択</option>{topics.map(t=><option key={t.id} value={t.id}>{t.title}</option>)}</select><button onClick={generate} className="bg-black text-white px-3">3案生成</button></div><div className="space-y-3">{drafts.map(d=><div key={d.id} className="bg-white border p-3 rounded"><div className="text-xs text-slate-500">{d.variant_name} / {d.status}</div><p className="my-2 whitespace-pre-wrap">{d.body}</p><div className="flex gap-2"><button className="border px-2" onClick={()=>updateStatus(d.id,'approved')}>承認</button><button className="border px-2" onClick={()=>updateStatus(d.id,'rejected')}>却下</button><button className="border px-2" onClick={()=>post(d.id)}>投稿</button></div></div>)}</div></div>;
}
