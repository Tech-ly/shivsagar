'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import toast from 'react-hot-toast';

export default function Cart() {
    const [cart, setCart] = useState([]);
    const [total, setTotal] = useState(0);
    const router = useRouter();

    const calculateTotal = (items) => {
        const t = items.reduce((sum, item) => sum + (Number(item.price) * (item.persons || 1)), 0);
        setTotal(t);
    };

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (!user) {
            router.push('/login');
            return;
        }
        
        const cartKey = `cart_${user}`;
        let stored = JSON.parse(localStorage.getItem(cartKey) || '[]');
        
        // Initialize persons if missing
        stored = stored.map(item => ({ ...item, persons: item.persons || 1 }));

        setCart(stored);
        calculateTotal(stored);
    }, [router]);

    const updatePersons = (id, count) => {
        if (count < 1) return;
        const user = localStorage.getItem('user');
        if (!user) return;
        const cartKey = `cart_${user}`;
        
        const newCart = cart.map(item => 
            item.id === id ? { ...item, persons: count } : item
        );
        
        setCart(newCart);
        localStorage.setItem(cartKey, JSON.stringify(newCart));
        calculateTotal(newCart);
        window.dispatchEvent(new Event('cart-updated'));
    };

    const executeRemove = (id) => {
        const user = localStorage.getItem('user');
        if(!user) return;

        const cartKey = `cart_${user}`;
        const newCart = cart.filter(item => item.id !== id);
        setCart(newCart);
        localStorage.setItem(cartKey, JSON.stringify(newCart));
        calculateTotal(newCart);
        window.dispatchEvent(new Event('cart-updated'));
        toast.dismiss(id); // Dismiss the specific toast
        toast.success("Package removed successfully");
    };

    const confirmRemove = (id) => {
        toast.custom((t) => (
            <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-sm w-full bg-white shadow-lg rounded-xl pointer-events-auto flex ring-1 ring-black ring-opacity-5 p-4 border border-gray-100`}>
                <div className="flex-1 w-0">
                    <div className="flex items-start">
                        <div className="flex-shrink-0 pt-0.5">
                            <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </div>
                        </div>
                        <div className="ml-3 flex-1">
                            <p className="text-sm font-medium text-gray-900">
                                Remove Package?
                            </p>
                            <p className="mt-1 text-sm text-gray-500">
                                Are you sure you want to remove this item from your cart?
                            </p>
                            <div className="mt-3 flex space-x-3">
                                <button
                                    onClick={() => executeRemove(id)}
                                    className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold py-1.5 px-3 rounded shadow-sm transition-colors"
                                >
                                    Remove
                                </button>
                                <button
                                    onClick={() => toast.dismiss(t.id)}
                                    className="bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold py-1.5 px-3 border border-gray-300 rounded shadow-sm transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex border-l border-gray-200 ml-4 pl-4">
                     <button
                        onClick={() => toast.dismiss(t.id)}
                        className="w-full border border-transparent rounded-none rounded-r-lg p-2 flex items-center justify-center text-sm font-medium text-gray-400 hover:text-gray-500 focus:outline-none"
                    >
                        <span className="sr-only">Close</span>
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>
        ), { id: id, duration: Infinity });
    };

    if (cart.length === 0) {
        return (
            <div className="container mx-auto py-20 text-center">
                <h2 className="text-3xl font-bold mb-4">Your Cart is Empty</h2>
                <Link href="/" className="btn-primary">Browse Packages</Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
            <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                    {cart.map(item => (
                        <div key={item.id} className="flex flex-col md:flex-row items-center border p-4 mb-4 rounded-xl shadow-sm bg-white hover:shadow-md transition-shadow">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={item.image} className="w-24 h-24 object-cover rounded-lg mr-4" alt={item.name} />
                            <div className="grow">
                                <h3 className="font-bold text-lg">{item.name}</h3>
                                <p className="text-sm text-gray-600 font-medium">{item.duration}</p>
                            </div>
                            <div className="text-right mt-4 md:mt-0 flex flex-col items-end gap-2">
                                <p className="text-xl font-bold text-yellow-600">₹{item.price * (item.persons || 1)}</p>
                                <div className="flex items-center gap-4">
                                     <div className="flex items-center bg-gray-50 rounded-full border border-gray-200 shadow-sm p-1">
                                        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-gray-600 hover:bg-gray-100 font-bold shadow-sm transition-colors" onClick={() => updatePersons(item.id, (item.persons || 1) - 1)}>-</button>
                                        <span className="w-10 text-center text-sm font-semibold text-gray-700">{item.persons || 1}</span>
                                        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-gray-600 hover:bg-gray-100 font-bold shadow-sm transition-colors" onClick={() => updatePersons(item.id, (item.persons || 1) + 1)}>+</button>
                                     </div>
                                     <button onClick={() => confirmRemove(item.id)} className="text-red-500 hover:text-red-700 transition-colors text-sm font-semibold underline decoration-transparent hover:decoration-red-500">Remove</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="card h-fit p-6 bg-gray-50">
                    <h3 className="text-xl font-bold mb-4">Cart Summary</h3>
                    <div className="flex justify-between mb-2">
                        <span>Total Packages:</span>
                        <span>{cart.length}</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold border-t pt-4 mt-4">
                        <span>Total:</span>
                        <span>₹{total}</span>
                    </div>
                    <Link href="/contact" className="btn-primary w-full block text-center mt-6">Proceed to Book</Link>
                </div>
            </div>
        </div>
    );
}
