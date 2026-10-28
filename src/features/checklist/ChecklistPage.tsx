import { Navigate, useNavigate } from 'react-router-dom';
import { useApp } from '../../app/AppContext';
import { allChecked } from '../sessions/rules';
import { formatDateTime } from '../../shared/lib/utils';

export function ChecklistPage() {
  const { active, check, abandon } = useApp(); const navigate = useNavigate();
  if (!active) return <Navigate to="/" replace />;
  const checked = active.results.filter(r => r.checkedAt).length; const total = active.results.length; const percent = Math.round(checked / total * 100);
  const categories = [...new Set(active.itemsSnapshot.map(i => i.category))];
  return <section className="page workflow-page">
    <div className="workflow-head"><button className="text-button" onClick={() => navigate('/')}>← ホーム</button><span>通常チェック</span></div>
    <div className="progress-card"><div><strong>{checked}<small> / {total} 完了</small></strong><b>{percent}%</b></div><div className="progress"><i style={{ width: `${percent}%` }} /></div></div>
    <div className="meaning">タップする前に、実際に作業・目視確認してください。</div>
    {categories.map(category => <div className="category" key={category}><h2>{category}</h2>
      {active.itemsSnapshot.filter(i => i.category === category).map(item => { const result = active.results.find(r => r.itemId === item.id)!; return <button className={`check-row ${result.checkedAt ? 'done' : ''}`} key={item.id} onClick={() => check(item.id)} aria-pressed={!!result.checkedAt}>
        <i aria-hidden="true">{result.checkedAt ? '✓' : ''}</i><span><strong>{item.title}{item.isCritical && <em>重要</em>}</strong>{item.description && <small>{item.description}</small>}{result.checkedAt && <time>確認 {formatDateTime(result.checkedAt)}</time>}</span>
      </button>; })}</div>)}
    <button className="button primary sticky" disabled={!allChecked(active)} onClick={() => navigate('/final')}>{allChecked(active) ? '最終確認へ進む →' : `あと${total - checked}件です`}</button>
    <button className="text-button danger" onClick={() => { if (confirm('このセッションを中断しますか？進捗は履歴に残ります。')) { abandon(); navigate('/'); } }}>この作業を中断する</button>
  </section>;
}
