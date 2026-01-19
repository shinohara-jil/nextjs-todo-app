'use client';

import { useState, useEffect, useCallback } from 'react';
import { Todo, FilterType } from '@/types/todo';

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // API呼び出し: 全Todoを取得
  const fetchTodos = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/todos');

      if (!response.ok) {
        throw new Error('Failed to fetch todos');
      }

      const data = await response.json();
      setTodos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching todos:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 初回ロード時にTodoを取得
  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  // 新しいTodoを追加
  const addTodo = useCallback(async (text: string) => {
    if (!text.trim()) return;

    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text: text.trim(),
      completed: false,
      createdAt: Date.now(),
    };

    try {
      // 楽観的UI更新
      setTodos((prev) => [...prev, newTodo]);

      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTodo),
      });

      if (!response.ok) {
        throw new Error('Failed to add todo');
      }
    } catch (err) {
      // エラー時は元に戻す
      setTodos((prev) => prev.filter((todo) => todo.id !== newTodo.id));
      setError(err instanceof Error ? err.message : 'Failed to add todo');
      console.error('Error adding todo:', err);
    }
  }, []);

  // Todoを削除
  const deleteTodo = useCallback(async (id: string) => {
    // 削除前の状態を保存（ロールバック用）
    const previousTodos = todos;

    try {
      // 楽観的UI更新
      setTodos((prev) => prev.filter((todo) => todo.id !== id));

      const response = await fetch(`/api/todos/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete todo');
      }
    } catch (err) {
      // エラー時は元に戻す
      setTodos(previousTodos);
      setError(err instanceof Error ? err.message : 'Failed to delete todo');
      console.error('Error deleting todo:', err);
    }
  }, [todos]);

  // Todoを更新
  const updateTodo = useCallback(async (id: string, text: string) => {
    if (!text.trim()) return;

    // 更新前の状態を保存（ロールバック用）
    const previousTodos = todos;

    try {
      // 楽観的UI更新
      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === id ? { ...todo, text: text.trim() } : todo
        )
      );

      const response = await fetch(`/api/todos/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: text.trim() }),
      });

      if (!response.ok) {
        throw new Error('Failed to update todo');
      }
    } catch (err) {
      // エラー時は元に戻す
      setTodos(previousTodos);
      setError(err instanceof Error ? err.message : 'Failed to update todo');
      console.error('Error updating todo:', err);
    }
  }, [todos]);

  // Todoの完了状態をトグル
  const toggleTodo = useCallback(async (id: string) => {
    // 更新前の状態を保存（ロールバック用）
    const previousTodos = todos;
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    try {
      // 楽観的UI更新
      setTodos((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, completed: !t.completed } : t
        )
      );

      const response = await fetch(`/api/todos/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: !todo.completed }),
      });

      if (!response.ok) {
        throw new Error('Failed to toggle todo');
      }
    } catch (err) {
      // エラー時は元に戻す
      setTodos(previousTodos);
      setError(err instanceof Error ? err.message : 'Failed to toggle todo');
      console.error('Error toggling todo:', err);
    }
  }, [todos]);

  // フィルタリングされたTodoリスト
  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  // 統計情報
  const stats = {
    total: todos.length,
    active: todos.filter((t) => !t.completed).length,
    completed: todos.filter((t) => t.completed).length,
  };

  return {
    todos: filteredTodos,
    filter,
    setFilter,
    addTodo,
    deleteTodo,
    updateTodo,
    toggleTodo,
    stats,
    isLoading,
    error,
  };
};
