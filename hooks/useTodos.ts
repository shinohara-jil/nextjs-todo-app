'use client';

import { useState, useEffect, useCallback } from 'react';
import { Todo, FilterType } from '@/types/todo';
import { loadTodos, saveTodos } from '@/utils/localStorage';

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [isLoaded, setIsLoaded] = useState(false);

  // LocalStorageからTodoを読み込む
  useEffect(() => {
    const loaded = loadTodos();
    setTodos(loaded);
    setIsLoaded(true);
  }, []);

  // TodosをLocalStorageに保存
  useEffect(() => {
    if (isLoaded) {
      saveTodos(todos);
    }
  }, [todos, isLoaded]);

  // 新しいTodoを追加
  const addTodo = useCallback((text: string) => {
    if (!text.trim()) return;

    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text: text.trim(),
      completed: false,
      createdAt: Date.now(),
    };

    setTodos((prev) => [...prev, newTodo]);
  }, []);

  // Todoを削除
  const deleteTodo = useCallback((id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  }, []);

  // Todoを更新
  const updateTodo = useCallback((id: string, text: string) => {
    if (!text.trim()) return;

    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, text: text.trim() } : todo
      )
    );
  }, []);

  // Todoの完了状態をトグル
  const toggleTodo = useCallback((id: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }, []);

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
  };
};
