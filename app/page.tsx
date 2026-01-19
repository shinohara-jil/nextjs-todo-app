'use client';

import { useState, useEffect } from 'react';
import { useTodos } from '@/hooks/useTodos';
import TodoInput from '@/components/TodoInput';
import TodoFilter from '@/components/TodoFilter';
import TodoList from '@/components/TodoList';

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  const {
    todos,
    filter,
    setFilter,
    addTodo,
    deleteTodo,
    updateTodo,
    toggleTodo,
    stats,
  } = useTodos();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
            Todo アプリ
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            シンプルで使いやすいタスク管理
          </p>
        </div>

        {/* メインコンテンツ */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8">
          {isMounted ? (
            <>
              {/* 入力フォーム */}
              <TodoInput onAdd={addTodo} />

              {/* フィルター */}
              <TodoFilter
                currentFilter={filter}
                onFilterChange={setFilter}
                stats={stats}
              />

              {/* Todoリスト */}
              <TodoList
                todos={todos}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
                onUpdate={updateTodo}
              />
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400 dark:text-gray-500 text-lg">
                読み込み中...
              </p>
            </div>
          )}
        </div>

        {/* フッター */}
        <div className="text-center mt-6 text-sm text-gray-600 dark:text-gray-400">
          <p>作成日時でソートされています</p>
        </div>
      </div>
    </main>
  );
}
