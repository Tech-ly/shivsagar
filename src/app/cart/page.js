'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Cart() {
    const [cart, setCart] = useState([]);
    const [total, setTotal] = useState(0);
    const router = useRouter();

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (!user) {
            router.push('/login');
            return;
        }
        
        const cartKey = `cart_${user}`;
        const stored = JSON.parse(localStorage.getItem(cartKey) || '[]');
        setCart(stored);
        calculateTotal(stored);
    }, []);

    const calculateTotal = (items) => {
        const t = items.reduce((sum, item) => sum + Number(item.price), 0);
        setTotal(t);
    };

    const removeFromCart = (id) => {
        const user = localStorage.getItem('user');
        if(!user) return;

        const cartKey = `cart_${user}`;
        const newCart = cart.filter(item => item.id !== id);
        setCart(newCart);
        localStorage.setItem(cartKey, JSON.stringify(newCart));
        calculateTotal(newCart);
        window.dispatchEvent(new Event('cart-updated'));
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
                        <div key={item.id} className="flex flex-col md:flex-row items-center border p-4 mb-4 rounded shadow-sm bg-white">
                            <img src={item.image} className="w-24 h-24 object-cover rounded mr-4" alt={item.name} />
                            <div className="grow">
                                <h3 className="font-bold text-lg">{item.name}</h3>
                                <p className="text-sm text-black font-semibold">{item.duration}</p>
                            </div>
                            <div className="text-right mt-4 md:mt-0">
                                <p className="text-xl font-bold text-yellow-600">₹{item.price}</p>
                                <button onClick={() => removeFromCart(item.id)} className="text-red-500 text-sm underline mt-2">Remove</button>
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
