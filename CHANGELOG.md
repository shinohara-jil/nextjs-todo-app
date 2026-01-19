# 変更履歴

このプロジェクトの主要な変更をすべて記録します。

## [Unreleased]

### 追加予定
- ユーザー認証機能
- Todo の優先順位設定
- 期限設定機能

---

## [2.0.0] - 2026-01-19

### 🎉 主要な変更: データベース化

LocalStorageからVercel Postgres / Neonへの移行

### 追加
- **データベース統合**
  - Vercel Postgres サポート
  - Neon サポート（推奨）
  - データベーススキーマ (`scripts/setup-db.sql`)
  - 環境変数テンプレート (`.env.example`)

- **RESTful API**
  - `GET /api/todos` - 全Todo取得
  - `POST /api/todos` - Todo作成
  - `PATCH /api/todos/[id]` - Todo更新
  - `DELETE /api/todos/[id]` - Todo削除

- **フロントエンド機能**
  - 楽観的UI更新
  - エラーハンドリングとロールバック
  - ローディング状態表示
  - エラーメッセージ表示

- **ドキュメント**
  - データベース設定手順（Vercel Postgres / Neon）
  - API エンドポイント仕様
  - デプロイチェックリスト
  - トラブルシューティングガイド

### 変更
- `hooks/useTodos.ts` - LocalStorage から API ベースに書き換え
- `app/page.tsx` - エラー・ローディング表示を追加
- README.md - データベース設定手順を追加
- CLAUDE.md - 新アーキテクチャを反映

### 削除
- LocalStorage への直接的な依存（`utils/localStorage.ts`は非推奨化）

### 破壊的変更
- LocalStorage のデータは自動移行されません
- データベース設定が必須になりました
- 環境変数 `POSTGRES_URL` が必要です

---

## [1.0.0] - 2026-01-19

### 🚀 初回リリース

### 追加
- **基本機能**
  - Todoの追加、編集、削除
  - 完了チェック機能
  - フィルター機能（全て/進行中/完了済み）
  - LocalStorageによるデータ永続化

- **UI/UX**
  - レスポンシブデザイン
  - ダークモード対応
  - インライン編集機能
  - Tailwind CSS スタイリング

- **技術実装**
  - Next.js 15 (App Router)
  - TypeScript
  - カスタムフック (`useTodos`)
  - Hydration エラー対策

- **CI/CD**
  - GitHub Actions - Vercel 自動デプロイ
  - Claude AI 自動実装ワークフロー

- **ドキュメント**
  - README.md - プロジェクト概要とセットアップ
  - CLAUDE.md - アーキテクチャガイド
  - GitHub Issue テンプレート

### インフラ
- Vercel ホスティング
- GitHub リポジトリ
- GitHub Actions ワークフロー

---

## コミット履歴

主要なコミット:

- `7143407` - Add Neon database support to README
- `de7aa3d` - Implement Vercel Postgres database integration
- `3f501c1` - Add Claude Auto Implementation workflow
- `b3a0c32` - Update README with deployed app URL
- `e5b6329` - Add GitHub Actions workflow and documentation
- `2d2bfdc` - Initial commit: Next.js Todo App

---

## 今後の予定

### v2.1.0 (計画中)
- [ ] リアルタイム同期（複数タブ間）
- [ ] Todo の並び替え（ドラッグ&ドロップ）
- [ ] カテゴリ/タグ機能

### v3.0.0 (構想中)
- [ ] ユーザー認証（NextAuth.js）
- [ ] ユーザーごとのTodo管理
- [ ] 共有機能

### 検討中
- [ ] モバイルアプリ（React Native）
- [ ] デスクトップアプリ（Electron）
- [ ] PWA対応

---

プロジェクトの詳細は [README.md](./README.md) を参照してください。
