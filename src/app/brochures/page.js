'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Brochures() {
  const [brochures, setBrochures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/brochures')
      .then(res => res.json())
      .then(data => {
        setBrochures(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="container mx-auto py-16 px-4">
      <h1 className="text-4xl font-bold text-center mb-10">Our Brochures</h1>
      
      {loading ? (
        <p className="text-center text-black font-medium text-xl">Loading Best Brochures...</p>
      ) : brochures.length === 0 ? (
        <p className="text-center text-gray-500">No brochures available at the moment.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {brochures.map(b => (
                <div key={b.id} className="card bg-white flex flex-col h-full shadow-lg rounded-lg overflow-hidden">
                    {b.image && (
                         // eslint-disable-next-line @next/next/no-img-element
                        <img src={b.image} alt={b.title} className="w-full h-48 object-cover" />
                    )}
                    <div className="p-5 flex flex-col flex-grow">
                        <h3 className="text-xl font-bold mb-2">{b.title}</h3>
                        <p className="text-sm text-gray-600 mb-4 flex-grow line-clamp-3">{b.description}</p>
                        <div className="mt-auto border-t pt-4">
                            <Link href={`/brochures/${b.id}`} className="block w-full bg-gray-900 text-white text-center py-2 rounded hover:bg-gray-800 transition-colors">
                                View Details
                            </Link>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      )}
    </div>
  );
}
