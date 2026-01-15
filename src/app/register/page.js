'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function Register() {
  const [data, setData] = useState({ username: '', mobile: '', password: '', confirm: '' });
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (data.password !== data.confirm) {
        toast.error("Passwords do not match");
        return;
    }

    const res = await fetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(data)
    });
    const result = await res.json();
    
    if (result.success) {
        toast.success("Registration Successful!");
        router.push('/login');
    } else {
        toast.error(result.error || 'Registration Failed');
    }
  };

  return (
    <div className="flex justify-center items-center h-[80vh] bg-gray-100">
        <div className="card w-full max-w-md p-8 bg-white">
            <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" placeholder="Username" className="w-full p-3 border rounded" required
                       onChange={e => setData({...data, username: e.target.value})} />
                <input type="tel" placeholder="Mobile" className="w-full p-3 border rounded" required
                       onChange={e => setData({...data, mobile: e.target.value})} />
                <input type="password" placeholder="Password" className="w-full p-3 border rounded" required
                       onChange={e => setData({...data, password: e.target.value})} />
                <input type="password" placeholder="Confirm Password" className="w-full p-3 border rounded" required
                       onChange={e => setData({...data, confirm: e.target.value})} />
                <button className="btn-primary w-full">Register</button>
            </form>
            <p className="text-center mt-4">
                Already have an account? <a href="/login" className="text-yellow-600 font-bold">Login</a>
            </p>
        </div>
    </div>
  );
}
