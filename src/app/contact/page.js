'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';

function ContactContent() {
    const [form, setForm] = useState({ name: '', email: '', mobile: '', message: '' });
    const [cart, setCart] = useState([]);
    const router = useRouter();
    const searchParams = useSearchParams();
    const brochureTitle = searchParams.get('brochureTitle');
    const brochureId = searchParams.get('brochureId');

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (!user) {
            router.push('/login');
            return;
        }
        const cartKey = `cart_${user}`;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCart(JSON.parse(localStorage.getItem(cartKey) || '[]'));
    }, [router]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const user = localStorage.getItem('user');
        const cartKey = `cart_${user}`;
        
        let finalMessage = form.message;
        if (cart.length > 0) {
            finalMessage += "\n\nBOOKING REQUEST FOR PACKAGES:\n" + cart.map(i => `- ${i.name} (₹${i.price})`).join('\n');
        }
        if (brochureTitle) {
            finalMessage += `\n\nINQUIRY FOR BROCHURE: ${brochureTitle}`;
        }

        const payload = { ...form, message: finalMessage };
        if (brochureId) {
            payload.brochureId = brochureId;
            payload.brochureTitle = brochureTitle;
        }

        const res = await fetch('/api/contact', {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            toast.success('Inquiry sent successfully! We will contact you shortly.');
            if (cart.length > 0) {
                localStorage.removeItem(cartKey);
                window.dispatchEvent(new Event('cart-updated'));
            }
            setTimeout(() => router.push('/'), 2000);
        } else {
            toast.error('Failed to send inquiry. Please try again.');
        }
    };

    return (
        <div className="container mx-auto py-10 px-4 max-w-2xl">
            <h1 className="text-3xl font-bold text-center mb-8">Contact Us / Booking</h1>
            
            <div className="card p-8 bg-white">
                {cart.length > 0 && (
                    <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
                        <h3 className="font-bold text-yellow-800">Booking for packages:</h3>
                        <ul className="text-sm mt-2 ml-4 list-disc">
                            {cart.map(c => <li key={c.id}>{c.name} - ₹{c.price}</li>)}
                        </ul>
                    </div>
                )}

                {brochureTitle && (
                    <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded">
                        <h3 className="font-bold text-blue-800">Inquiry for Brochure:</h3>
                        <p className="text-sm mt-2 ml-4 font-semibold">{brochureTitle}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block font-bold mb-1">Full Name</label>
                        <input type="text" required className="w-full p-2 border rounded" 
                               value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                    </div>
                    <div>
                        <label className="block font-bold mb-1">Email</label>
                        <input type="email" required className="w-full p-2 border rounded" 
                               value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                    </div>
                    <div>
                        <label className="block font-bold mb-1">Mobile Number</label>
                        <input type="tel" required className="w-full p-2 border rounded" 
                               value={form.mobile} onChange={e => setForm({...form, mobile: e.target.value})} />
                    </div>
                    <div>
                        <label className="block font-bold mb-1">Message (Optional)</label>
                        <textarea rows="4" className="w-full p-2 border rounded" 
                               value={form.message} onChange={e => setForm({...form, message: e.target.value})}></textarea>
                    </div>
                    <button type="submit" className="btn-primary w-full">Send Inquiry</button>
                </form>
            </div>
        </div>
    );
}

export default function Contact() {
    return (
        <Suspense fallback={<div className="text-center py-10">Loading...</div>}>
            <ContactContent />
        </Suspense>
    );
}
