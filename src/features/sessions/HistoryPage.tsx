import { useState } from 'react';
import { useApp } from '../../app/AppContext';
import { formatDateTime, formatDuration } from '../../shared/lib/utils';
import type { Session } from '../../shared/types';

export function HistoryPage() {
  const { data } = useApp(); const [selected, setSelected] = useState<Session>();
  return <section className="page"><div className="page-title"><span className="eyebrow">ACTIVITY</span><h1>作業履歴</h1><p>この端末に保存された記録です。</p></div>
    {!data.sessions.length ? <div className="empty-card"><strong>履歴はまだありません</strong><p>締め作業を始めると、結果がここに残ります。</p></div> : <div className="history-list">{data.sessions.map(s => <button key={s.id} onClick={() => setSelected(s)}>
      <span className={`status ${s.status}`}>{s.status === 'completed' ? '完了' : s.status === 'abandoned' ? '中断' : '進行中'}</span><span><strong>{formatDateTime(s.completedAt ?? s.abandonedAt ?? s.startedAt)}</strong><small>{s.results.filter(r => r.checkedAt).length}/{s.results.length}件 ・ {formatDuration(s.startedAt, s.completedAt ?? s.abandonedAt ?? null)}</small></span><b>›</b>
    </button>)}</div>}
    {selected && <div className="modal-backdrop" onClick={() => setSelected(undefined)}><div className="modal" role="dialog" aria-modal="true" aria-label="履歴詳細" onClick={e => e.stopPropagation()}><button className="modal-close" onClick={() => setSelected(undefined)}>×</button><h2>作業の詳細</h2><p>{formatDateTime(selected.startedAt)} 開始</p>
      {selected.itemsSnapshot.map(item => { const r = selected.results.find(x => x.itemId === item.id)!; return <div className="detail-row" key={item.id}><span>{r.checkedAt ? '✓' : '—'}</span><div><strong>{item.title}</strong><small>{r.checkedAt ? `確認 ${formatDateTime(r.checkedAt)}` : '未確認'}{r.finalVerifiedAt ? ` ／ 最終 ${formatDateTime(r.finalVerifiedAt)}` : ''}</small></div></div>; })}
    </div></div>}
  </section>;
}
