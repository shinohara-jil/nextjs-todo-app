-- Todosテーブルの作成
CREATE TABLE IF NOT EXISTS todos (
  id TEXT PRIMARY KEY,
  text TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_at BIGINT NOT NULL
);

-- パフォーマンス向上のためのインデックス
CREATE INDEX IF NOT EXISTS idx_todos_created_at ON todos(created_at);
CREATE INDEX IF NOT EXISTS idx_todos_completed ON todos(completed);
