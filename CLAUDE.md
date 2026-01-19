# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 Todo application built with TypeScript, Tailwind CSS, and Vercel Postgres. The app features a RESTful API backend with optimistic UI updates on the frontend.

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

### Core Pattern: API-Based State Management

The application uses a three-tier architecture:

1. **Database Layer**: Vercel Postgres stores all todos
2. **API Layer**: Next.js Route Handlers provide RESTful endpoints
3. **Client Layer**: React custom hook (`useTodos`) manages client state with API calls

The `useTodos` custom hook (`hooks/useTodos.ts`):
- Fetches todos from API on mount
- Implements optimistic UI updates for better UX
- Handles error states with rollback on API failures
- Manages loading states
- Provides filtering logic (all/active/completed)
- Returns computed stats (total, active, completed counts)

### API Endpoints

All endpoints are in `app/api/todos/`:

- `GET /api/todos` - Fetch all todos
- `POST /api/todos` - Create a new todo
- `PATCH /api/todos/[id]` - Update todo (text or completed)
- `DELETE /api/todos/[id]` - Delete a todo

### Client-Side Components

All UI components use `'use client'` directive because:
- They need React hooks (useState, useEffect)
- They handle user interactions
- API calls are made from the client

### Hydration Strategy

The main page (`app/page.tsx`) implements a mount check pattern to prevent React hydration errors:
- Uses `isMounted` state to defer rendering until client-side
- Shows loading state during SSR/initial render
- This prevents mismatches between server and client renders when LocalStorage is involved

The layout (`app/layout.tsx`) uses `suppressHydrationWarning` on `<html>` and `<body>` tags to handle browser extensions that inject attributes.

### Component Structure

```
app/
  api/
    todos/
      route.ts        # GET /api/todos, POST /api/todos
      [id]/
        route.ts      # PATCH /api/todos/[id], DELETE /api/todos/[id]
  layout.tsx          # Root layout with suppressHydrationWarning
  page.tsx            # Main page with loading/error states
  globals.css         # Tailwind directives

components/
  TodoInput.tsx       # Input form with Enter key support
  TodoItem.tsx        # Individual todo with inline editing
  TodoFilter.tsx      # Filter buttons with counts
  TodoList.tsx        # List container with empty state

hooks/
  useTodos.ts         # API-based state management

types/
  todo.ts             # Todo and FilterType definitions

scripts/
  setup-db.sql        # Database table creation script

.env.example          # Environment variable template
```

### Data Flow

1. **Initial Load**:
   - `useTodos` hook calls `GET /api/todos` on mount
   - API queries Postgres database
   - Todos are stored in React state

2. **Optimistic Updates**:
   - User action (add/update/delete) immediately updates local state
   - API request is sent in background
   - On error, local state is rolled back to previous value

3. **API Request Flow**:
   ```
   Client (useTodos) → API Route → Vercel Postgres → Response → Update State
   ```

4. **Error Handling**:
   - Each operation saves previous state before mutation
   - API errors trigger rollback and error message display
   - User sees inline error notifications

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

### Database Schema

Postgres table structure:
```sql
CREATE TABLE todos (
  id TEXT PRIMARY KEY,              -- UUID
  text TEXT NOT NULL,               -- Task description
  completed BOOLEAN DEFAULT FALSE,  -- Completion status
  created_at BIGINT NOT NULL        -- Unix timestamp
);

CREATE INDEX idx_todos_created_at ON todos(created_at);
CREATE INDEX idx_todos_completed ON todos(completed);
```

### Environment Variables

Required for database connection (auto-configured by Vercel):
- `POSTGRES_URL` - Full connection string
- `POSTGRES_PRISMA_URL` - Prisma-compatible URL
- `POSTGRES_URL_NON_POOLING` - Direct connection URL
- `POSTGRES_USER`, `POSTGRES_HOST`, `POSTGRES_PASSWORD`, `POSTGRES_DATABASE`

### Optimistic UI Pattern

The app implements optimistic updates for better UX:

1. **Add Todo**: Immediately shows in UI, API call happens in background
2. **Update Todo**: Text/status changes instantly, syncs with DB
3. **Delete Todo**: Removes from UI immediately, confirms with API
4. **Error Rollback**: On API failure, reverts to previous state and shows error

Example from `useTodos.ts`:
```typescript
const deleteTodo = async (id: string) => {
  const previousTodos = todos; // Save current state

  setTodos(prev => prev.filter(todo => todo.id !== id)); // Optimistic update

  const response = await fetch(`/api/todos/${id}`, { method: 'DELETE' });

  if (!response.ok) {
    setTodos(previousTodos); // Rollback on error
    setError('Failed to delete todo');
  }
};
```

## Path Aliases

The project uses `@/*` alias pointing to the project root (configured in `tsconfig.json`):
```typescript
import { Todo } from '@/types/todo';
import { useTodos } from '@/hooks/useTodos';
```
