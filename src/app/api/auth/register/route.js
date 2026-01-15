import { NextResponse } from 'next/server';
import { createUser } from '@/lib/db';

export async function POST(request) {
  const body = await request.json();
  const res = await createUser(body);
  if (res.error) {
    return NextResponse.json({ error: res.error }, { status: 400 });
  }
  return NextResponse.json(res);
}
