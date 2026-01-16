'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function BrochureDetail() {
    const { id } = useParams();
    const [brochure, setBrochure] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetch(`/api/brochures/${id}`)
                .then(res => res.json())
                .then(data => {
                    setBrochure(data);
                    setLoading(false);
                })
                .catch(() => setLoading(false));
        }
    }, [id]);

    if (loading) return <div className="text-center py-20 text-xl font-bold">Loading Brochure Details...</div>;
    if (!brochure || brochure.error) return <div className="text-center py-20 text-red-500">Brochure not found.</div>;

    return (
        <div className="container mx-auto py-12 px-4 md:px-12">
             <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
                 <div className="grid grid-cols-1 md:grid-cols-2">
                     <div className="h-[400px] md:h-auto relative">
                         {brochure.image && (
                             // eslint-disable-next-line @next/next/no-img-element
                             <img src={brochure.image} alt={brochure.title} className="absolute inset-0 w-full h-full object-cover" />
                         )}
                     </div>
                     <div className="p-8 md:p-12 flex flex-col justify-center">
                         <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold mb-2">Brochure</div>
                         <h1 className="text-4xl font-bold text-gray-900 mb-4">{brochure.title}</h1>
                         
                         <div className="prose max-w-none text-gray-600 mb-8 text-lg">
                             <p className="whitespace-pre-wrap">{brochure.description}</p>
                         </div>

                         <div className="mt-4">
                             <Link 
                                 href={{
                                     pathname: '/contact',
                                     query: { brochureId: brochure.id, brochureTitle: brochure.title }
                                 }} 
                                 className="inline-block w-full sm:w-auto bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 px-8 rounded-lg shadow-md transition transform hover:-translate-y-1 text-center"
                             >
                                 Get Inquiry
                             </Link>
                         </div>
                     </div>
                 </div>
             </div>
        </div>
    );
}
