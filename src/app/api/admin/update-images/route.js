import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Package from '@/models/Package';
import fs from 'fs';
import path from 'path';

export async function GET() {
    await dbConnect();
    
    const updates = [
        { id: 'pkg_1', image: '/package-images/goa-silver.png' },
        { id: 'pkg_2', image: '/package-images/goa-gold.png' },
        { id: 'pkg_3', image: '/package-images/rajasthan.png' },
        { id: 'pkg_4', image: '/package-images/kerala.png' },
        { id: 'pkg_5', image: '/package-images/kutch.png' }
    ];

    let results = [];
    for (const update of updates) {
        const res = await Package.updateOne({ id: update.id }, { $set: { image: update.image } });
        results.push({ id: update.id, result: res });
    }
    
    // Update db.json as well for consistency
    try {
        const dbPath = path.join(process.cwd(), 'data', 'db.json');
        if (fs.existsSync(dbPath)) {
            const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
            if (data.packages) {
                data.packages.forEach(p => {
                    const up = updates.find(u => u.id === p.id);
                    if (up) p.image = up.image;
                });
                fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
                results.push({ db_json: 'updated' });
            }
        }
    } catch (e) {
        results.push({ db_json_error: e.message });
    }

    return NextResponse.json({ message: 'Images updated', details: results });
}
