# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 Todo application built with TypeScript, Tailwind CSS, and the App Router. The app features client-side state management with LocalStorage persistence.

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run ESLint
npm run lint
```

## Architecture

### Core Pattern: Custom Hook for State Management

The application uses a centralized state management pattern through the `useTodos` custom hook (`hooks/useTodos.ts`). This hook:
- Manages all Todo CRUD operations (add, delete, update, toggle)
- Handles filtering logic (all/active/completed)
- Syncs state with LocalStorage automatically via useEffect
- Provides computed stats (total, active, completed counts)
- Returns filtered todos based on current filter state

### Client-Side Only Architecture

All components use `'use client'` directive because:
- LocalStorage is only available in the browser
- The app has no server-side data fetching requirements

### Hydration Strategy

The main page (`app/page.tsx`) implements a mount check pattern to prevent React hydration errors:
- Uses `isMounted` state to defer rendering until client-side
- Shows loading state during SSR/initial render
- This prevents mismatches between server and client renders when LocalStorage is involved

The layout (`app/layout.tsx`) uses `suppressHydrationWarning` on `<html>` and `<body>` tags to handle browser extensions that inject attributes.

### Component Structure

```
app/
  layout.tsx       # Root layout with suppressHydrationWarning
  page.tsx         # Main page with hydration-safe mounting
  globals.css      # Tailwind directives

components/
  TodoInput.tsx    # Input form with Enter key support
  TodoItem.tsx     # Individual todo with inline editing
  TodoFilter.tsx   # Filter buttons with counts
  TodoList.tsx     # List container with empty state

hooks/
  useTodos.ts      # Centralized state management

types/
  todo.ts          # Todo and FilterType definitions

utils/
  localStorage.ts  # Browser storage operations
```

### Data Flow

1. `useTodos` hook loads initial data from LocalStorage on mount
2. Hook maintains `todos` array in state
3. Any state change triggers LocalStorage save via useEffect
4. Components receive filtered todos and callback functions via hook return
5. User interactions call callbacks → state updates → auto-save to LocalStorage

### TypeScript Types

```typescript
interface Todo {
  id: string;           // crypto.randomUUID()
  text: string;
  completed: boolean;
  createdAt: number;    // Date.now()
}

type FilterType = 'all' | 'active' | 'completed';
```

## Key Implementation Details

### Preventing Hydration Errors

When working with LocalStorage or any browser-only APIs:
1. Use the mount check pattern in page components
2. Add `suppressHydrationWarning` to layout elements that might be modified by browser extensions
3. Ensure client components are marked with `'use client'`

### Editing Pattern

TodoItem implements inline editing:
- Click on todo text or "編集" button enters edit mode
- Enter key saves, Escape key cancels
- onBlur also saves changes
- Edit state is local to each TodoItem component

### Storage Key

LocalStorage uses the key `"todos"` (defined in `utils/localStorage.ts`). All todos are stored as a JSON array.

## Path Aliases

The project uses `@/*` alias pointing to the project root (configured in `tsconfig.json`):
```typescript
import { Todo } from '@/types/todo';
import { useTodos } from '@/hooks/useTodos';
```
