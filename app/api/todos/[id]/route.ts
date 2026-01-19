import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

// PATCH /api/todos/[id] - Todo更新
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { text, completed } = body;

    // どちらかのフィールドは必須
    if (text === undefined && completed === undefined) {
      return NextResponse.json(
        { error: 'At least one field (text or completed) is required' },
        { status: 400 }
      );
    }

    // 更新フィールドを動的に構築
    let query;
    if (text !== undefined && completed !== undefined) {
      query = sql`
        UPDATE todos
        SET text = ${text}, completed = ${completed}
        WHERE id = ${id}
        RETURNING id, text, completed, created_at as "createdAt"
      `;
    } else if (text !== undefined) {
      query = sql`
        UPDATE todos
        SET text = ${text}
        WHERE id = ${id}
        RETURNING id, text, completed, created_at as "createdAt"
      `;
    } else {
      query = sql`
        UPDATE todos
        SET completed = ${completed}
        WHERE id = ${id}
        RETURNING id, text, completed, created_at as "createdAt"
      `;
    }

    const { rows } = await query;

    if (rows.length === 0) {
      return NextResponse.json(
        { error: 'Todo not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('Failed to update todo:', error);
    return NextResponse.json(
      { error: 'Failed to update todo' },
      { status: 500 }
    );
  }
}

// DELETE /api/todos/[id] - Todo削除
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { rows } = await sql`
      DELETE FROM todos
      WHERE id = ${id}
      RETURNING id
    `;

    if (rows.length === 0) {
      return NextResponse.json(
        { error: 'Todo not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete todo:', error);
    return NextResponse.json(
      { error: 'Failed to delete todo' },
      { status: 500 }
    );
  }
}
