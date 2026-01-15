import { NextResponse } from 'next/server';
import { deletePackage } from '@/lib/db';

export async function DELETE(request, { params }) {
    const { id } = await params; // Next.js 15+ params are promises? Or standard object. 
    // Wait, in Next 15 `params` is async in some contexts, but usually simple param.
    // The previous code used `const params = await context.params`.
    // I'll stick to robust `await` if needed or standard access.
    // In App Router `route.js`: `export async function DELETE(request, { params })`
    // Next.js versions change. Safe bet is `await params` if it's a promise, which newer next versions might enforcement.
    // Actually, `params` is just an object in current stable Next 14. But let's check my previous pattern which was accepted.
    // I'll use standard access.
    
    await deletePackage(id);
    return NextResponse.json({ success: true });
}
