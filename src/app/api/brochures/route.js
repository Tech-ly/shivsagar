import { NextResponse } from 'next/server';
import { getBrochures, addBrochure } from '@/lib/db';

export async function GET() {
    const brochures = await getBrochures();
    return NextResponse.json(brochures);
}

export async function POST(req) {
    const body = await req.json();
    const newBrochure = await addBrochure(body);
    return NextResponse.json(newBrochure, { status: 201 });
}
