'use client';
import { useEffect, useState } from 'react';
import { createSupabaseBrowser } from '@/lib/supabase';

type Post = { id: string; x_post_url: string; posted_at: string };

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  useEffect(() => {
    (async () => {
      const supabase = createSupabaseBrowser();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const res = await fetch(`/api/posts?user_id=${user.id}`);
      const data = await res.json();
      setPosts(data);
    })();
  }, []);

  return <ul className="bg-white border rounded">{posts.map((p)=><li key={p.id} className="p-3 border-b"><a className="text-blue-600 underline" href={p.x_post_url} target="_blank">{p.x_post_url}</a><div className="text-xs">{p.posted_at}</div></li>)}</ul>;
}
