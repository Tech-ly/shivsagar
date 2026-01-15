'use client';
import { useState, useEffect } from 'react';

export default function Brochures() {
  const [brochures, setBrochures] = useState([]);

  useEffect(() => {
    fetch('/api/brochures')
      .then(res => res.json())
      .then(data => setBrochures(data));
  }, []);

  return (
    <div className="container mx-auto py-16 px-4">
      <h1 className="text-4xl font-bold text-center mb-10">Our Brochures</h1>
      
      {brochures.length === 0 ? (
        <p className="text-center text-gray-500">No brochures available at the moment.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {brochures.map(b => (
                <div key={b.id} className="card bg-white p-4 shadow-lg rounded-lg">
                    {b.image && (
                        <div className="mb-4">
                             <img src={b.image} alt={b.title} className="w-full h-64 object-cover rounded" />
                        </div>
                    )}
                    <h3 className="text-2xl font-bold mb-2">{b.title}</h3>
                    <p className="text-gray-600 mb-4">{b.description}</p>
                    {/* If we had a download link/pdf, we could add it here */}
                </div>
            ))}
        </div>
      )}
    </div>
  );
}
