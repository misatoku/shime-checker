export type CheckItem = {
  id: string; title: string; description?: string; category: string;
  isCritical: boolean; order: number; enabled: boolean;
};
export type ItemResult = { itemId: string; checkedAt: string | null; finalVerifiedAt: string | null };
export type SessionStatus = 'in_progress' | 'completed' | 'abandoned';
export type Session = {
  id: string; startedAt: string; completedAt: string | null; abandonedAt?: string | null; status: SessionStatus;
  itemsSnapshot: CheckItem[]; results: ItemResult[];
};
export type AppData = { version: 1; items: CheckItem[]; sessions: Session[] };
