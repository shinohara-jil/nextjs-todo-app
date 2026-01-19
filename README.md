# Next.js Todo App

シンプルで使いやすいTodoアプリケーション。Next.js 15、TypeScript、Tailwind CSSで構築されています。

## 🚀 デモ

デプロイされたアプリケーション: [Coming Soon]

## ✨ 機能

- ✅ タスクの追加、編集、削除
- ✅ 完了チェック機能
- ✅ フィルター機能（全て/進行中/完了済み）
- ✅ LocalStorageによるデータ永続化
- ✅ レスポンシブデザイン
- ✅ ダークモード対応
- ✅ インライン編集機能

## 🛠️ 技術スタック

- **フレームワーク**: Next.js 15 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **状態管理**: React Hooks (カスタムフック)
- **データ永続化**: LocalStorage

## 📦 セットアップ

### 依存パッケージのインストール

```bash
npm install
```

### 開発サーバーの起動

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
