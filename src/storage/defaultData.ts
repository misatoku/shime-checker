import type { CheckItem } from '../shared/types';

export const sampleItems: CheckItem[] = [
  { id: 'sample-1', title: 'ガスの元栓を閉める', description: 'すべての元栓を指差し確認', category: '火元・安全', isCritical: true, order: 0, enabled: true },
  { id: 'sample-2', title: '厨房機器の電源を切る', category: '火元・安全', isCritical: true, order: 1, enabled: true },
  { id: 'sample-3', title: '冷蔵庫の扉を確認する', description: '半開きになっていないか確認', category: '火元・安全', isCritical: true, order: 2, enabled: true },
  { id: 'sample-4', title: 'テーブルを清掃する', category: '清掃', isCritical: false, order: 3, enabled: true },
  { id: 'sample-5', title: '床を清掃する', category: '清掃', isCritical: false, order: 4, enabled: true },
  { id: 'sample-6', title: 'ゴミを所定の場所へ出す', category: '清掃', isCritical: false, order: 5, enabled: true },
  { id: 'sample-7', title: 'レジ締めを確認する', category: '事務', isCritical: false, order: 6, enabled: true },
  { id: 'sample-8', title: '入口を施錠する', description: '扉を引いて施錠を確認', category: '戸締まり', isCritical: true, order: 7, enabled: true }
];
