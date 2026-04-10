'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function Login() {
  const [data, setData] = useState({ username: '', password: '' });
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Admin Check
    if (data.username === 'admin@123.com' && data.password === 'admin@123') {
        localStorage.setItem('role', 'admin');
        localStorage.setItem('user', 'Admin');
        toast.success('Welcome Admin!');
        window.location.href = '/admin'; 
        return;
    }

    const res = await fetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(data)
    });
    const result = await res.json();
    
    if (result.success) {
        localStorage.setItem('user', result.user.username);
        localStorage.setItem('role', result.user.role);
        toast.success('Login Successful!');
        window.location.href = '/';
    } else {
        toast.error(result.error || 'Login Failed');
    }
  };

  return (
    <div className="flex justify-center items-center h-[80vh] bg-gray-100">
        <div className="card w-full max-w-md p-8 bg-white">
            <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" placeholder="Username" className="w-full p-3 border rounded" required
                       onChange={e => setData({...data, username: e.target.value})} />
                <input type="password" placeholder="Password" className="w-full p-3 border rounded" required
                       onChange={e => setData({...data, password: e.target.value})} />
                <button className="btn-primary w-full">Login</button>
            </form>
            <p className="text-center mt-4">
                Don&apos;t have an account? <a href="/register" className="text-yellow-600 font-bold">Register</a>
            </p>
        </div>
    </div>
  );
}
