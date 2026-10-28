import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  return <div className="app-shell">
    <header><Link to="/" className="brand" aria-label="ホームへ"><b>〆</b><span>チェッカー</span></Link></header>
    <main>{children}</main>
    {!pathname.startsWith('/check') && !pathname.startsWith('/final') && <nav aria-label="メインナビゲーション">
      <Link className={pathname === '/' ? 'active' : ''} to="/"><span>ホーム</span></Link>
      <Link className={pathname === '/history' ? 'active' : ''} to="/history"><span>履歴</span></Link>
      <Link className={pathname === '/settings' ? 'active' : ''} to="/settings"><span>設定</span></Link>
    </nav>}
  </div>;
}
