import type { CheckItem, Session } from '../../shared/types';
import { isSameLocalDay, makeId, nowIso } from '../../shared/lib/utils';

export const createSession = (items: CheckItem[], at = nowIso()): Session => {
  const snapshot = items.filter(i => i.enabled).sort((a, b) => a.order - b.order).map(i => ({ ...i }));
  if (!snapshot.length) throw new Error('有効なチェック項目がありません');
  if (!snapshot.some(i => i.isCritical)) throw new Error('重要項目を1件以上設定してください');
  return { id: makeId(), startedAt: at, completedAt: null, abandonedAt: null, status: 'in_progress', itemsSnapshot: snapshot,
    results: snapshot.map(item => ({ itemId: item.id, checkedAt: null, finalVerifiedAt: null })) };
};
export const closeStaleSessions = (sessions: Session[], at = nowIso()): Session[] => {
  let changed = false;
  const next = sessions.map(session => {
    if (session.status !== 'in_progress' || isSameLocalDay(session.startedAt, at)) return session;
    changed = true;
    return { ...session, status: 'abandoned' as const, abandonedAt: at };
  });
  return changed ? next : sessions;
};
export const allChecked = (session: Session) => session.results.every(r => r.checkedAt !== null);
export const criticalResults = (session: Session) => session.results.filter(r => session.itemsSnapshot.find(i => i.id === r.itemId)?.isCritical);
export const allFinalVerified = (session: Session) => criticalResults(session).length > 0 && criticalResults(session).every(r => r.finalVerifiedAt !== null);
export const toggleCheck = (session: Session, itemId: string, at = nowIso()): Session => {
  if (session.status !== 'in_progress') return session;
  const results = session.results.map(r => r.itemId === itemId ? { ...r, checkedAt: r.checkedAt ? null : at } : r);
  return { ...session, results: results.some(r => !r.checkedAt) ? results.map(r => ({ ...r, finalVerifiedAt: null })) : results };
};
export const toggleFinal = (session: Session, itemId: string, at = nowIso()): Session => {
  if (!allChecked(session) || session.status !== 'in_progress') return session;
  return { ...session, results: session.results.map(r => r.itemId === itemId ? { ...r, finalVerifiedAt: r.finalVerifiedAt ? null : at } : r) };
};
export const completeSession = (session: Session, at = nowIso()): Session => allChecked(session) && allFinalVerified(session) && session.status === 'in_progress'
  ? { ...session, status: 'completed', completedAt: at } : session;
