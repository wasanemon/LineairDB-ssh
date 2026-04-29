'use client';
import { useEffect, useState } from 'react';
import { createSupabaseBrowser } from '@/lib/supabase';

export default function DashboardPage() {
  const [stats, setStats] = useState({ topics: 0, drafts: 0, approved: 0, posted: 0 });

  useEffect(() => {
    (async () => {
      const supabase = createSupabaseBrowser();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const [{ count: topics }, { count: drafts }, { count: approved }, { count: posted }] = await Promise.all([
        supabase.from('topics').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('drafts').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('drafts').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('status', 'approved'),
        supabase.from('drafts').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('status', 'posted')
      ]);
      setStats({ topics: topics ?? 0, drafts: drafts ?? 0, approved: approved ?? 0, posted: posted ?? 0 });
    })();
  }, []);

  return <div className="grid grid-cols-2 gap-4">{Object.entries(stats).map(([k,v]) => <div key={k} className="bg-white border p-4 rounded"><div className="text-sm text-slate-500">{k}</div><div className="text-2xl font-bold">{v}</div></div>)}</div>;
}
