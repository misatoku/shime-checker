# 〆チェッカー

焼肉店の締め作業で、実施漏れと確認漏れを減らすためのiPhone向けPWAです。通常チェック完了後、重要項目を実物と照合する独立した最終確認を行います。

> 同梱の項目は架空のサンプルです。実店舗の正式手順ではありません。運用前に責任者と内容を確認し、設定画面から編集してください。

## セットアップ

Node.js 22（LTS）とnpmを用意し、次を実行します。

```bash
npm install
npm run dev
```

表示されたLocal URLをPCで開きます。同じWi-Fi上のiPhoneでは、ターミナルに表示されるNetwork URL（例: `http://172.17.231.7:5173/`）をSafariで開きます。データはブラウザの`localStorage`に保存され、リロード後も進捗を再開できます。

Network URLが表示されない場合は`ipconfig`でWi-FiのIPv4アドレスを確認し、`http://そのアドレス:5173/`を開いてください。Windowsの確認画面が出た場合は、Node.jsの「プライベートネットワーク」を許可します。VPN、ゲストWi-Fi、モバイル回線では端末間通信できない場合があります。

## コマンド

```bash
npm run dev       # 開発サーバー
npm run build     # 型チェックと本番ビルド
npm run preview   # 本番ビルドの確認
npm run test      # Vitest単体テスト
npm run test:e2e  # Playwright E2E（初回は npx playwright install）
```

## Vercelへのデプロイ

1. このフォルダをGitリポジトリにしてGitHub等へpushします。
2. VercelでリポジトリをImportします。
3. Framework PresetはVite、Build Commandは`npm run build`、Output Directoryは`dist`を指定します。
4. HTTPSのデプロイURLで動作を確認します。SPAの画面URLを直接開く運用では、必要に応じてVercelのリライト設定を追加してください。

## iPhoneのホーム画面に追加

1. iPhoneのSafariでHTTPSのデプロイURLを開きます。
2. 共有ボタンから「ホーム画面に追加」を選びます。
3. 追加した「〆チェッカー」のアイコンから起動します。

## バックアップ

設定画面の「JSONをエクスポート」で項目と履歴を保存できます。「JSONをインポート」は現在の全データを置き換えるため、先にバックアップしてください。

## 既知の制約

- 1人・1端末向けで、ログイン、端末間同期、サーバーDBはありません。
- ブラウザデータを削除すると履歴も消えます。定期的にJSONをエクスポートしてください。
- アプリは作業の実施自体を検知・保証しません。チェックは実際の作業・目視確認後に行ってください。
- 通知、カレンダー・USEN連携、複数人同期は対象外です。
- SVGアイコンを使用しています。iOSの世代によって表示要件が異なる場合は、本番前にPNGの192px/512pxアイコンを追加してください。
