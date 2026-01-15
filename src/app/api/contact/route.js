import { NextResponse } from 'next/server';
import { addContact, getContacts } from '@/lib/db';

export async function POST(request) {
  const body = await request.json();
  await addContact(body);
  return NextResponse.json({ success: true });
}

export async function GET() {
    const contacts = await getContacts();
    return NextResponse.json(contacts);
}
