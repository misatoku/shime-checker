export const makeId = () => crypto.randomUUID();
export const nowIso = () => new Date().toISOString();
export const formatDateTime = (iso: string | null) => iso ? new Intl.DateTimeFormat('ja-JP', {
  year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit'
}).format(new Date(iso)) : '—';
export const formatDuration = (start: string, end: string | null) => {
  const minutes = Math.max(0, Math.round((new Date(end ?? Date.now()).getTime() - new Date(start).getTime()) / 60000));
  return minutes < 60 ? `${minutes}分` : `${Math.floor(minutes / 60)}時間${minutes % 60}分`;
};
