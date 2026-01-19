import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

// GET /api/todos - 全Todo取得
export async function GET() {
  try {
    const { rows } = await sql`
      SELECT id, text, completed, created_at as "createdAt"
      FROM todos
      ORDER BY created_at ASC
    `;

    return NextResponse.json(rows);
  } catch (error) {
    console.error('Failed to fetch todos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch todos' },
      { status: 500 }
    );
  }
}

// POST /api/todos - Todo作成
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, text, completed, createdAt } = body;

    if (!id || !text || typeof completed !== 'boolean' || !createdAt) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await sql`
      INSERT INTO todos (id, text, completed, created_at)
      VALUES (${id}, ${text}, ${completed}, ${createdAt})
    `;

    return NextResponse.json({ id, text, completed, createdAt }, { status: 201 });
  } catch (error) {
    console.error('Failed to create todo:', error);
    return NextResponse.json(
      { error: 'Failed to create todo' },
      { status: 500 }
    );
  }
}
