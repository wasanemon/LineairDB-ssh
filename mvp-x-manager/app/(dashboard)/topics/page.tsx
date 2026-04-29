'use client';
import { useEffect, useState } from 'react';
import { createSupabaseBrowser } from '@/lib/supabase';

type Topic = { id: string; title: string; target_audience?: string; angle?: string };

export default function TopicsPage() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [title, setTitle] = useState('');

  const load = async () => {
    const supabase = createSupabaseBrowser();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase.from('topics').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
    setTopics(data ?? []);
  };
  useEffect(() => { load(); }, []);

  const add = async () => {
    const supabase = createSupabaseBrowser();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !title) return;
    await fetch('/api/topics', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ user_id: user.id, title }) });
    setTitle('');
    load();
  };

  return <div className="space-y-4"><div className="flex gap-2"><input className="border p-2 flex-1" value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="投稿ネタタイトル"/><button onClick={add} className="bg-black text-white px-4">追加</button></div><ul className="bg-white border rounded">{topics.map(t=><li key={t.id} className="p-3 border-b">{t.title}</li>)}</ul></div>;
}
