import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { AppData, CheckItem, Session } from '../shared/types';
import { LocalStorageRepository } from '../storage/repository';
import { sampleItems } from '../storage/defaultData';
import { completeSession, createSession, toggleCheck, toggleFinal } from '../features/sessions/rules';

type AppContextValue = {
  data: AppData; active: Session | undefined; start: () => Session; updateSession: (session: Session) => void;
  check: (itemId: string) => void; verify: (itemId: string) => void; complete: () => Session | undefined;
  abandon: () => void; saveItems: (items: CheckItem[]) => void; importData: (data: AppData) => void;
};
const Context = createContext<AppContextValue | null>(null);
const repository = new LocalStorageRepository();
const initialData = (): AppData => {
  try { const loaded = repository.load(); return validateData(loaded); }
  catch { return { version: 1, items: sampleItems, sessions: [] }; }
};
export const validateData = (value: unknown): AppData => {
  if (!value || typeof value !== 'object') throw new Error('JSONの形式が正しくありません');
  const data = value as Partial<AppData>;
  if (data.version !== 1 || !Array.isArray(data.items) || !Array.isArray(data.sessions)) throw new Error('対応していないデータ形式です');
  if (data.items.some(i => !i || typeof i.id !== 'string' || typeof i.title !== 'string' || typeof i.category !== 'string')) throw new Error('項目データが壊れています');
  return data as AppData;
};
export function AppProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(initialData);
  const startingSession = useRef<Session | undefined>(undefined);
  useEffect(() => { repository.save(data); }, [data]);
  const active = data.sessions.find(s => s.status === 'in_progress');
  useEffect(() => { if (!active) startingSession.current = undefined; }, [active]);
  const updateSession = (session: Session) => setData(d => ({ ...d, sessions: d.sessions.map(s => s.id === session.id ? session : s) }));
  const value = useMemo<AppContextValue>(() => ({ data, active,
    start: () => { if (active) return active; if (startingSession.current) return startingSession.current; const session = createSession(data.items); startingSession.current = session; setData(d => ({ ...d, sessions: d.sessions.some(s => s.id === session.id) ? d.sessions : [session, ...d.sessions] })); return session; },
    updateSession,
    check: id => active && updateSession(toggleCheck(active, id)),
    verify: id => active && updateSession(toggleFinal(active, id)),
    complete: () => { if (!active) return; const done = completeSession(active); updateSession(done); return done; },
    abandon: () => active && updateSession({ ...active, status: 'abandoned' }),
    saveItems: items => setData(d => ({ ...d, items: items.map((i, order) => ({ ...i, order })) })),
    importData: imported => setData(validateData(imported))
  }), [data, active]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export const useApp = () => { const value = useContext(Context); if (!value) throw new Error('AppProvider is missing'); return value; };
