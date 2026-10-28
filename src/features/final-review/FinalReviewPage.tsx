import { Navigate, useNavigate } from 'react-router-dom';
import { useApp } from '../../app/AppContext';
import { allChecked, allFinalVerified, criticalResults } from '../sessions/rules';

export function FinalReviewPage() {
  const { active, verify, complete } = useApp(); const navigate = useNavigate();
  if (!active) return <Navigate to="/" replace />;
  if (!allChecked(active)) return <Navigate to="/check" replace />;
  const critical = active.itemsSnapshot.filter(i => i.isCritical); const verified = criticalResults(active).filter(r => r.finalVerifiedAt).length;
  return <section className="page workflow-page final-page">
    <div className="workflow-head"><button className="text-button" onClick={() => navigate('/check')}>← チェックへ</button><span>最終確認</span></div>
    <div className="final-intro"><span>FINAL CHECK</span><h1>もう一度、<br />実物を確認してください</h1><p>通常チェックとは別の確認です。項目ごとに現場を見てから押してください。</p></div>
    <div className="counter">重要項目 <strong>{verified} / {critical.length}</strong></div>
    {critical.map(item => { const result = active.results.find(r => r.itemId === item.id)!; return <button className={`verify-row ${result.finalVerifiedAt ? 'done' : ''}`} key={item.id} onClick={() => verify(item.id)} aria-pressed={!!result.finalVerifiedAt}>
      <span className="number">{result.finalVerifiedAt ? '✓' : critical.indexOf(item) + 1}</span><span><small>{item.category}</small><strong>{item.title}</strong>{item.description && <p>{item.description}</p>}</span><b>{result.finalVerifiedAt ? '再確認済み' : '実物を確認'}</b>
    </button>; })}
    <button className="button primary sticky" disabled={!allFinalVerified(active)} onClick={() => { const done = complete(); if (done?.status === 'completed') navigate(`/complete/${done.id}`); }}>{allFinalVerified(active) ? '締め作業を完了する' : `あと${critical.length - verified}件を再確認`}</button>
  </section>;
}
