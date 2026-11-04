import {
  useLayoutEffect,
  useRef,
  useState,
  type ChangeEvent,
  type PointerEvent,
} from "react";
import { useApp } from "../../app/AppContext";
import { makeId } from "../../shared/lib/utils";
import type { CheckItem } from "../../shared/types";

const blank = (): CheckItem => ({
  id: makeId(),
  title: "",
  description: "",
  category: "その他",
  isCritical: false,
  enabled: true,
  order: 0,
});
export function SettingsPage() {
  const { data, saveItems, importData } = useApp();
  const [items, setItems] = useState(data.items.map((i) => ({ ...i })));
  const [editing, setEditing] = useState<CheckItem>();
  const [message, setMessage] = useState("");
  const [draggingId, setDraggingId] = useState<string>();
  const [dragOverId, setDragOverId] = useState<string>();
  const fileRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const dragItemsRef = useRef(items);
  const dragChangedRef = useRef(false);
  const previousPositionsRef = useRef<Map<string, number> | null>(null);
  useLayoutEffect(() => {
    const previous = previousPositionsRef.current;
    if (!previous || !listRef.current) return;
    listRef.current
      .querySelectorAll<HTMLElement>("[data-item-id]")
      .forEach((row) => {
        const oldTop = previous.get(row.dataset.itemId ?? "");
        if (oldTop === undefined) return;
        const delta = oldTop - row.getBoundingClientRect().top;
        if (!delta) return;
        const tilt = delta > 0 ? -1.2 : 1.2;
        row.getAnimations().forEach((animation) => animation.cancel());
        row.animate(
          [
            { transform: `translateY(${delta}px) rotate(${tilt}deg)` },
            { transform: "translateY(0) rotate(0)" },
          ],
          { duration: 280, easing: "cubic-bezier(.2,.8,.2,1)" },
        );
      });
    previousPositionsRef.current = null;
  }, [items]);
  const persist = (next = items) => {
    if (!next.some((i) => i.enabled && i.isCritical)) {
      setMessage("有効な重要項目を1件以上設定してください。");
      return;
    }
    saveItems(next);
    setItems(next);
    setMessage("設定を保存しました。進行中の作業には影響しません。");
  };
  const startDrag = (e: PointerEvent<HTMLButtonElement>, id: string) => {
    if (!e.isPrimary) return;
    e.preventDefault();
    dragItemsRef.current = items;
    dragChangedRef.current = false;
    e.currentTarget.setPointerCapture(e.pointerId);
    setDraggingId(id);
  };
  const dragItem = (e: PointerEvent<HTMLButtonElement>) => {
    if (!draggingId) return;
    const row = document
      .elementFromPoint(e.clientX, e.clientY)
      ?.closest<HTMLElement>("[data-item-id]");
    const targetId = row?.dataset.itemId;
    if (!targetId || targetId === draggingId || targetId === dragOverId) return;
    const next = [...dragItemsRef.current];
    const from = next.findIndex((item) => item.id === draggingId);
    const to = next.findIndex((item) => item.id === targetId);
    if (from < 0 || to < 0) return;
    if (listRef.current)
      previousPositionsRef.current = new Map(
        Array.from(
          listRef.current.querySelectorAll<HTMLElement>("[data-item-id]"),
          (itemRow) => [
            itemRow.dataset.itemId ?? "",
            itemRow.getBoundingClientRect().top,
          ],
        ),
      );
    const [dragged] = next.splice(from, 1);
    next.splice(to, 0, dragged);
    dragItemsRef.current = next;
    dragChangedRef.current = true;
    setItems(next);
    setDragOverId(targetId);
  };
  const endDrag = () => {
    if (dragChangedRef.current) persist(dragItemsRef.current);
    dragChangedRef.current = false;
    setDraggingId(undefined);
    setDragOverId(undefined);
  };
  const saveEdit = () => {
    if (!editing?.title.trim() || !editing.category.trim()) {
      setMessage("項目名とカテゴリを入力してください。");
      return;
    }
    const exists = items.some((i) => i.id === editing.id);
    const next = exists
      ? items.map((i) => (i.id === editing.id ? editing : i))
      : [...items, editing];
    setEditing(undefined);
    setItems(next);
    persist(next);
  };
  const download = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `shime-checker-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };
  const upload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text());
      if (!confirm("現在の設定と履歴を、読み込んだデータで置き換えますか？"))
        return;
      importData(parsed);
      setItems(parsed.items);
      setMessage("データを読み込みました。");
    } catch (err) {
      setMessage(
        err instanceof Error ? err.message : "読み込みに失敗しました。",
      );
    }
    e.target.value = "";
  };
  return (
    <section className="page settings-page">
      <div className="page-title">
        <span className="eyebrow">SETTINGS</span>
        <h1>チェック項目</h1>
        <p>店舗の正式な手順に合わせて編集してください。</p>
      </div>
      <div className="notice sample">
        <strong>現在の初期項目はサンプルです</strong>
        <span>実運用前に責任者と内容・順番・重要項目を確認してください。</span>
      </div>
      {message && (
        <p className="message" role="status">
          {message}
        </p>
      )}
      <div className="settings-head">
        <strong>{items.length}項目</strong>
        <button className="button compact" onClick={() => setEditing(blank())}>
          ＋ 項目を追加
        </button>
      </div>
      <div className="item-editor-list" ref={listRef}>
        {items.map((item) => (
          <div
            data-item-id={item.id}
            className={`${!item.enabled ? "disabled " : ""}${draggingId === item.id ? "dragging " : ""}${dragOverId === item.id && draggingId !== item.id ? "drag-over" : ""}`.trim()}
            key={item.id}
          >
            <button
              type="button"
              className="drag-handle"
              aria-label={`${item.title}を並べ替え`}
              onPointerDown={(e) => startDrag(e, item.id)}
              onPointerMove={dragItem}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
            >
              ⋮⋮
            </button>
            <span>
              <small>{item.category}</small>
              <strong>{item.title}</strong>
              {item.isCritical && <em>重要</em>}
            </span>
            <button onClick={() => setEditing({ ...item })}>編集</button>
          </div>
        ))}
      </div>
      <section className="data-section">
        <h2>データ管理</h2>
        <p>
          履歴はこの端末だけに保存されます。定期的なバックアップをおすすめします。
        </p>
        <button className="button secondary" onClick={download}>
          JSONをエクスポート
        </button>
        <button
          className="button secondary"
          onClick={() => fileRef.current?.click()}
        >
          JSONをインポート
        </button>
        <input
          ref={fileRef}
          hidden
          type="file"
          accept="application/json,.json"
          onChange={upload}
        />
      </section>
      {editing && (
        <div className="modal-backdrop">
          <form
            className="modal edit-form"
            onSubmit={(e) => {
              e.preventDefault();
              saveEdit();
            }}
          >
            <h2>
              {items.some((i) => i.id === editing.id)
                ? "項目を編集"
                : "項目を追加"}
            </h2>
            <label>
              項目名
              <input
                value={editing.title}
                onChange={(e) =>
                  setEditing({ ...editing, title: e.target.value })
                }
              />
            </label>
            <label>
              説明（任意）
              <textarea
                value={editing.description ?? ""}
                onChange={(e) =>
                  setEditing({ ...editing, description: e.target.value })
                }
              />
            </label>
            <label>
              カテゴリ
              <input
                value={editing.category}
                onChange={(e) =>
                  setEditing({ ...editing, category: e.target.value })
                }
              />
            </label>
            <label className="switch">
              <input
                type="checkbox"
                checked={editing.isCritical}
                onChange={(e) =>
                  setEditing({ ...editing, isCritical: e.target.checked })
                }
              />{" "}
              最終確認が必要な重要項目
            </label>
            <label className="switch">
              <input
                type="checkbox"
                checked={editing.enabled}
                onChange={(e) =>
                  setEditing({ ...editing, enabled: e.target.checked })
                }
              />{" "}
              この項目を使用する
            </label>
            <div className="form-actions">
              <button
                type="button"
                className="button secondary"
                onClick={() => setEditing(undefined)}
              >
                キャンセル
              </button>
              <button className="button primary">保存</button>
            </div>
            {items.some((i) => i.id === editing.id) && (
              <button
                type="button"
                className="text-button danger"
                onClick={() => {
                  if (confirm("この項目を削除しますか？")) {
                    const next = items.filter((i) => i.id !== editing.id);
                    setEditing(undefined);
                    setItems(next);
                    persist(next);
                  }
                }}
              >
                項目を削除
              </button>
            )}
          </form>
        </div>
      )}
    </section>
  );
}
