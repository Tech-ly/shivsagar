import { NextResponse } from 'next/server';
import { getBrochureById } from '@/lib/db';

export async function GET(request, { params }) {
  const brochure = await getBrochureById(params.id);
  if (brochure) {
    return NextResponse.json(brochure);
  } else {
    return NextResponse.json({ error: 'Brochure not found' }, { status: 404 });
  }
}
