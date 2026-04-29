import './globals.css';
import Link from 'next/link';

const nav = ['dashboard', 'topics', 'drafts', 'posts', 'settings'];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <div className="min-h-screen flex">
          <aside className="w-56 p-4 border-r bg-white">
            <h1 className="font-bold mb-4">X投稿管理</h1>
            <nav className="space-y-2">
              {nav.map((n) => (
                <Link key={n} href={`/${n}`} className="block capitalize text-sm hover:underline">
                  {n}
                </Link>
              ))}
            </nav>
          </aside>
          <main className="flex-1 p-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
