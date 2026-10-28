import type { AppData } from '../shared/types';

export interface AppRepository { load(): AppData; save(data: AppData): void; }

export class LocalStorageRepository implements AppRepository {
  constructor(private readonly key = 'shime-checker-data-v1') {}
  load(): AppData {
    const raw = localStorage.getItem(this.key);
    if (!raw) throw new Error('NO_DATA');
    return JSON.parse(raw) as AppData;
  }
  save(data: AppData) { localStorage.setItem(this.key, JSON.stringify(data)); }
}
