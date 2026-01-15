import { NextResponse } from 'next/server';
import { getPackages, addPackage } from '@/lib/db';

export async function GET() {
  const packages = await getPackages();
  return NextResponse.json(packages);
}

export async function POST(request) {
  const body = await request.json();
  const newPkg = await addPackage(body);
  return NextResponse.json(newPkg);
}
