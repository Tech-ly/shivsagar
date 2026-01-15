import { NextResponse } from 'next/server';
import { verifyUser } from '@/lib/db';

export async function POST(request) {
  const { username, password } = await request.json();
  const res = await verifyUser(username, password);
  
  if (res.success) {
    // In a real app, set an HTTP-only cookie here.
    // For this demo, valid response allows client to set localStorage
    return NextResponse.json(res);
  }
  return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
}
