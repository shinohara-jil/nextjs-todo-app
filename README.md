# Next.js Todo App

シンプルで使いやすいTodoアプリケーション。Next.js 15、TypeScript、Tailwind CSSで構築されています。

## 🚀 デモ

デプロイされたアプリケーション: [https://260119claude.vercel.app](https://260119claude.vercel.app)

## ✨ 機能

- ✅ タスクの追加、編集、削除
- ✅ 完了チェック機能
- ✅ フィルター機能（全て/進行中/完了済み）
- ✅ **Vercel Postgresによるデータ永続化**
- ✅ 複数デバイス・ブラウザ間でのデータ同期
- ✅ RESTful API (Next.js Route Handlers)
- ✅ 楽観的UI更新
- ✅ エラーハンドリング
- ✅ レスポンシブデザイン
- ✅ ダークモード対応
- ✅ インライン編集機能

## 🛠️ 技術スタック

- **フレームワーク**: Next.js 15 (App Router)
- **言語**: TypeScript
- **データベース**: Vercel Postgres
- **スタイリング**: Tailwind CSS
- **状態管理**: React Hooks (カスタムフック)
- **API**: Next.js Route Handlers (RESTful)

## 📦 セットアップ

### 1. 依存パッケージのインストール

```bash
npm install
```

### 2. データベースの設定

このアプリは**Vercel Postgres**または**Neon**のどちらでも動作します。

#### オプションA: Vercel Postgres（Vercelにデプロイする場合）

1. [Vercel Dashboard](https://vercel.com/dashboard) にアクセス
2. プロジェクトを選択
3. "Storage" タブから "Create Database" をクリック
4. "Postgres" を選択
5. データベース名を入力して作成

Vercelが自動的に環境変数を設定します。

**ローカル開発用**:
```bash
# Vercel CLIで環境変数を取得
vercel env pull .env.local
```

#### オプションB: Neon（推奨・無料枠が大きい）

1. [Neon Console](https://console.neon.tech/) でプロジェクト作成
2. データベースを作成
3. Connection String をコピー
4. 環境変数を設定:

**ローカル開発用**:
```bash
# .env.localファイルを作成
cp .env.example .env.local

# .env.localを編集して接続文字列を設定
POSTGRES_URL="postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/dbname?sslmode=require"
```

**Vercelデプロイ用**:
- Vercel Dashboard > Settings > Environment Variables
- `POSTGRES_URL` に Neon の接続文字列を設定

### 3. データベーステーブルの作成

データベースのSQL Editorで以下を実行:

- **Vercel Postgres**: Dashboard > Query タブ
- **Neon**: Console > SQL Editor

```sql
CREATE TABLE IF NOT EXISTS todos (
  id TEXT PRIMARY KEY,
  text TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_at BIGINT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_todos_created_at ON todos(created_at);
CREATE INDEX IF NOT EXISTS idx_todos_completed ON todos(completed);
```

または、`scripts/setup-db.sql`ファイルの内容をコピーして実行してください。

### 4. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開きます。

### ビルド

```bash
npm run build
```

### プロダクションサーバーの起動

```bash
npm start
```

## 🚢 Vercelへのデプロイ

### 手動デプロイ

1. Vercelアカウントにログイン
2. 新しいプロジェクトをインポート
3. GitHubリポジトリを選択
4. デプロイ

### 自動デプロイ（GitHub Actions）

このプロジェクトはGitHub Actionsを使用した自動デプロイが設定されています。

#### 必要なSecretsの設定

GitHubリポジトリの Settings > Secrets and variables > Actions で以下のシークレットを設定してください。

1. **VERCEL_TOKEN**
   - Vercel Settings > Tokens から生成
   - スコープ: Full Account

2. **VERCEL_ORG_ID**
   - Vercel CLIを使用して取得: `vercel link`
   - または、`.vercel/project.json`の`orgId`

3. **VERCEL_PROJECT_ID**
   - Vercel CLIを使用して取得: `vercel link`
   - または、`.vercel/project.json`の`projectId`

#### トークン取得手順

```bash
# Vercel CLIのインストール
npm install -g vercel

# プロジェクトをリンク
vercel link

# .vercel/project.jsonファイルが作成されます
# このファイルからORG_IDとPROJECT_IDを取得できます
```

`.vercel/project.json`の例:
```json
{
  "orgId": "team_xxxxxxxxxxxxxxxxxxxx",
  "projectId": "prj_xxxxxxxxxxxxxxxxxxxx"
}
```

#### デプロイの流れ

1. `master`ブランチへのpush時に自動デプロイが実行されます
2. Pull Request作成時にはプレビューデプロイが実行されます
3. ワークフローは以下を実行します:
   - コードのチェックアウト
   - 依存関係のインストール
   - ESLintチェック
   - ビルド
   - Vercelへのデプロイ

## 🤖 AI自動実装（Claude Auto Implementation）

このプロジェクトはGitHub Issue上で `/implement` とコメントすることで、Claudeが自動的に実装を行うワークフローを搭載しています。

### 使い方

1. **Issueを作成**
   - 実装したい機能の詳細をIssueに記載

2. **自動実装を開始**
   - Issueのコメント欄に `/implement` または `@claude implement` と入力
   - GitHub Actionsが自動的に起動

3. **Pull Requestが自動作成される**
   - Claudeが実装を生成
   - 新しいブランチとPull Requestが自動作成されます
   - レビュー後にマージ

### 必要な設定

GitHubリポジトリの Settings > Secrets and variables > Actions で以下のシークレットを設定:

- **ANTHROPIC_API_KEY**
  - https://console.anthropic.com/ でAPIキーを生成
  - Claude APIへのアクセスに必要

### ワークフローの流れ

1. Issueコメントで `/implement` をトリガー
2. GitHub Actionsが起動し、Claude APIを呼び出し
3. Issueの内容を解析して実装コードを生成
4. 新しいブランチを作成してコードをコミット
5. Pull Requestを自動作成
6. レビュー・テスト後にマージ

### 制限事項

- 複雑な実装の場合は手動調整が必要な場合があります
- APIトークンの使用量に注意してください
- 生成されたコードは必ずレビューしてください

## 📝 アーキテクチャ

詳細なアーキテクチャ情報は [CLAUDE.md](./CLAUDE.md) を参照してください。

### ディレクトリ構造

```
├── app/                 # Next.js App Router
│   ├── layout.tsx      # ルートレイアウト
│   ├── page.tsx        # メインページ
│   └── globals.css     # グローバルスタイル
├── components/         # Reactコンポーネント
│   ├── TodoInput.tsx   # タスク入力フォーム
│   ├── TodoItem.tsx    # 個別タスクアイテム
│   ├── TodoFilter.tsx  # フィルターボタン
│   └── TodoList.tsx    # タスクリスト
├── hooks/              # カスタムフック
│   └── useTodos.ts     # Todo状態管理
├── types/              # TypeScript型定義
│   └── todo.ts         # Todo型
└── utils/              # ユーティリティ
    └── localStorage.ts # LocalStorage操作
```

## 🤝 コントリビューション

Pull Requestを歓迎します。大きな変更の場合は、まずIssueを開いて変更内容を議論してください。

## 📄 ライセンス

MIT
