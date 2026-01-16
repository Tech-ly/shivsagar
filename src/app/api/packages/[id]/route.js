import { NextResponse } from 'next/server';
import { deletePackage, getPackageById } from '@/lib/db';

export async function GET(request, { params }) {
    const { id } = await params;
    console.log(`API: Fetching package with id: ${id}`);
    const pkg = await getPackageById(id);
    console.log(`API: Result for ${id}:`, pkg ? 'Found' : 'Not Found');
    if (!pkg) {
        return NextResponse.json({ error: 'Package not found'}, { status: 404 });
    }
    return NextResponse.json(pkg);
}

export async function DELETE(request, { params }) {
    const { id } = await params;
    await deletePackage(id);
    return NextResponse.json({ success: true });
}
