import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useApp } from '../../app/AppContext';
import { formatDateTime } from '../../shared/lib/utils';

export function HomePage() {
  const { active, data, start } = useApp(); const navigate = useNavigate(); const [error, setError] = useState('');
  const last = data.sessions.find(s => s.status === 'completed');
  const completedToday = last && new Date(last.completedAt!).toDateString() === new Date().toDateString() ? last : undefined;
  const begin = () => { try { start(); navigate('/check'); } catch (e) { setError(e instanceof Error ? e.message : '開始できません'); } };
  return <section className="page home-page">
    <div className="hero"><h1>締め作業を<br />はじめましょう</h1><p>ひとつずつ確認すれば大丈夫です。</p></div>
    {completedToday && !active && <Link className="today-complete" to={`/complete/${completedToday.id}`}>
      <span className="today-check">✓</span><span><small>本日の締め作業</small><strong>完了しました</strong><time>{formatDateTime(completedToday.completedAt)}</time></span><b>›</b>
    </Link>}
    <div className="notice sample"><strong>サンプル項目を使用中</strong><span>実店舗の正式な手順ではありません。運用前に設定から編集してください。</span></div>
    {error && <p className="error" role="alert">{error} <Link to="/settings">設定を開く</Link></p>}
    {active ? <Link className="button primary large start-button" to="/check">続きから再開 <span>→</span></Link> : <button className="button primary large start-button" onClick={begin}>{completedToday ? '新しい締め作業を開始' : '締め作業を開始'} <span>→</span></button>}
    <div className="home-links">
      <Link to="/history"><div><strong>前回の結果</strong><small>{last ? formatDateTime(last.completedAt) : 'まだ完了履歴はありません'}</small></div><b>›</b></Link>
      <Link to="/settings"><div><strong>チェック項目の設定</strong><small>{data.items.filter(i => i.enabled).length}件の項目</small></div><b>›</b></Link>
    </div>
    <p className="disclaimer">チェックは「実際に作業・目視確認した」印です。アプリ自体が作業の実施を検知・保証するものではありません。</p>
  </section>;
}
