import { NextResponse } from 'next/server';
import { deleteBrochure, updateBrochure } from '@/lib/db';

export async function DELETE(req, { params }) {
    const { id } = await params;
    await deleteBrochure(id);
    return NextResponse.json({ success: true });
}

export async function PUT(req, { params }) {
    const { id } = await params;
    const body = await req.json();
    await updateBrochure(id, body);
    return NextResponse.json({ success: true });
}
