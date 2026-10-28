import { describe, expect, it, vi } from 'vitest';
import { allChecked, allFinalVerified, completeSession, createSession, toggleCheck, toggleFinal } from './rules';
import type { CheckItem } from '../../shared/types';

vi.stubGlobal('crypto', { randomUUID: () => 'session-id' });
const items: CheckItem[] = [
  { id:'a', title:'通常', category:'清掃', isCritical:false, order:0, enabled:true },
  { id:'b', title:'重要', category:'安全', isCritical:true, order:1, enabled:true }
];
describe('セッション業務ルール', () => {
  it('開始時の定義をスナップショットとしてコピーする', () => { const session=createSession(items,'2026-01-01T00:00:00Z'); items[0].title='変更'; expect(session.itemsSnapshot[0].title).toBe('通常'); });
  it('重要項目がなければ開始できない', () => expect(() => createSession(items.map(i=>({...i,isCritical:false})))).toThrow('重要項目'));
  it('全項目チェック前は最終確認できない', () => { const s=createSession(items); expect(toggleFinal(s,'b')).toEqual(s); expect(allChecked(s)).toBe(false); });
  it('通常チェックと最終確認は独立している', () => { let s=createSession(items); s=toggleCheck(s,'a','t1'); s=toggleCheck(s,'b','t2'); expect(allFinalVerified(s)).toBe(false); s=toggleFinal(s,'b','t3'); expect(s.results[1]).toMatchObject({checkedAt:'t2',finalVerifiedAt:'t3'}); });
  it('通常チェックを取り消すと最終確認をすべてリセットする', () => { let s=createSession(items); s=toggleCheck(s,'a'); s=toggleCheck(s,'b'); s=toggleFinal(s,'b'); s=toggleCheck(s,'a'); expect(s.results.every(r=>r.finalVerifiedAt===null)).toBe(true); });
  it('全重要項目の再確認後だけ完了する', () => { let s=createSession(items); s=toggleCheck(s,'a'); s=toggleCheck(s,'b'); expect(completeSession(s).status).toBe('in_progress'); s=toggleFinal(s,'b'); expect(completeSession(s,'done')).toMatchObject({status:'completed',completedAt:'done'}); });
  it('完了済みセッションは変更できない', () => { let s=createSession(items); s=toggleCheck(s,'a'); s=toggleCheck(s,'b'); s=toggleFinal(s,'b'); s=completeSession(s); expect(toggleCheck(s,'a')).toEqual(s); });
});
