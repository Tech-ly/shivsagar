'use client';
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function PackageDetail({ params }) {
    const { id } = use(params);
    const [pkg, setPkg] = useState(null);
    const [members, setMembers] = useState(1);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (!id) return;
        fetch(`/api/packages/${id}`)
            .then(res => {
                if(!res.ok) throw new Error("Not found");
                return res.json();
            })
            .then(data => {
                setPkg(data);
                setLoading(false);
            })
            .catch((err) => {
                 console.error(err);
                 toast.error("Package not found");
                 // router.push('/'); // Optional: redirect on fail
            });
    }, [id, router]);

    const addToCart = (redirect = false) => {
         const user = localStorage.getItem('user');
         if (!user) {
             toast.error('Please Login to add items to cart');
             router.push('/login');
             return;
         }
     
         const cartKey = `cart_${user}`;
         const cart = JSON.parse(localStorage.getItem(cartKey) || '[]');
         
         const existingItemIndex = cart.findIndex(item => item.id === pkg.id);
         if (existingItemIndex > -1) {
            cart[existingItemIndex].persons = members; // Update members if already exists
            toast.success(`Updated ${pkg.name} with ${members} members`);
         } else {
            cart.push({ ...pkg, persons: members });
            toast.success(`${pkg.name} added to cart!`);
         }
         
         localStorage.setItem(cartKey, JSON.stringify(cart));
         window.dispatchEvent(new Event('cart-updated')); 
         
         if (redirect) {
             router.push('/cart');
         }
    };

    const buyNow = () => {
        addToCart(true);
    };

    if (loading) return <div className="p-10 text-center text-xl min-h-[50vh] flex items-center justify-center">Loading Package Details...</div>;
    if (!pkg) return <div className="p-10 text-center">Package not found.</div>;

    return (
        <div className="container mx-auto py-12 px-4 md:px-12">
             <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
                 <div className="grid grid-cols-1 md:grid-cols-2">
                     <div className="h-[400px] md:h-auto relative">
                         {/* eslint-disable-next-line @next/next/no-img-element */}
                         <img src={pkg.image} alt={pkg.name} className="absolute inset-0 w-full h-full object-cover" />
                     </div>
                     <div className="p-8 md:p-12 flex flex-col justify-center">
                         <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold mb-2">{pkg.state} Tour</div>
                         <h1 className="text-4xl font-bold text-gray-900 mb-4">{pkg.name}</h1>
                         <p className="text-gray-600 mb-6 text-lg">{pkg.duration}</p>
                         
                         <div className="mb-8">
                            <span className="text-5xl font-bold text-gray-900">₹{pkg.price * members}</span>
                            <span className="text-gray-500 ml-2 text-lg">/ {members} person{members > 1 ? 's' : ''}</span>
                         </div>
                         
                         <div className="mb-8">
                            <h3 className="font-bold text-lg mb-3">Package Highlights:</h3>
                            <ul className="space-y-2">
                                {pkg.features && pkg.features.map((f, i) => (
                                    <li key={i} className="flex items-center text-gray-700">
                                        <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                        {f}
                                    </li>
                                ))}
                            </ul>
                         </div>

                         <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Number of Members:</label>
                            <div className="flex items-center border rounded w-fit">
                                <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200" onClick={() => setMembers(Math.max(1, members - 1))}>-</button>
                                <span className="px-4 py-2 font-bold">{members}</span>
                                <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200" onClick={() => setMembers(members + 1)}>+</button>
                            </div>
                         </div>

                         <div className="flex flex-col sm:flex-row gap-4">
                             <button onClick={() => addToCart(false)} className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-4 px-8 rounded-lg shadow-md transition transform hover:-translate-y-1">
                                 Add to Cart
                             </button>
                             <button onClick={buyNow} className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 px-8 rounded-lg shadow-md transition transform hover:-translate-y-1">
                                 Buy Now
                             </button>
                         </div>
                     </div>
                 </div>
             </div>
        </div>
    );
}
