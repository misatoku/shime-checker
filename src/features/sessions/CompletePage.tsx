import { Link, useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { useApp } from '../../app/AppContext';
import { formatDateTime, formatDuration } from '../../shared/lib/utils';

export function CompletePage() {
  const { id } = useParams(); const { data, start } = useApp(); const navigate = useNavigate(); const [error, setError] = useState('');
  const session = data.sessions.find(s => s.id === id && s.status === 'completed');
  if (!session) return <section className="page empty"><h1>完了記録が見つかりません</h1><Link to="/">ホームへ戻る</Link></section>;
  const critical = session.itemsSnapshot.filter(i => i.isCritical).length;
  return <section className="page complete-page"><div className="celebration" aria-hidden="true"><i /><i /><i /><i /><i /><div className="success-mark">✓</div></div><span className="eyebrow">ALL COMPLETE</span><h1>おつかれさまでした</h1><p className="complete-lead">本日の締め作業は<br /><strong>すべて完了しました。</strong></p>
    <div className="result-card"><div><small>完了日時</small><strong>{formatDateTime(session.completedAt)}</strong></div><div><small>確認項目</small><strong>{session.results.length}件 ＋ 最終{critical}件</strong></div><div><small>所要時間</small><strong>{formatDuration(session.startedAt, session.completedAt)}</strong></div></div>
    <p className="complete-note">確認した内容は、この端末の履歴に保存されています。</p>{error && <p className="error">{error}</p>}<Link className="button primary large complete-home" to="/">ホームへ戻る</Link><button className="text-button new-session" onClick={() => { try { start(); navigate('/check'); } catch(e) { setError(e instanceof Error ? e.message : '開始できません'); } }}>続けて新しいセッションを開始</button>
  </section>;
}
