'use client';

import { FormEvent, useState } from 'react';
import { createSupabaseBrowser } from '@/lib/supabase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const supabase = createSupabaseBrowser();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return setError('ログインに失敗しました');
    window.location.href = '/dashboard';
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded border">
      <h2 className="font-bold mb-4">ログイン</h2>
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="w-full border p-2" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="w-full border p-2" type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button className="bg-black text-white px-4 py-2 rounded">ログイン</button>
      </form>
    </div>
  );
}
