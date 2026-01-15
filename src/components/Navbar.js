'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [role, setRole] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check auth
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRole(localStorage.getItem('role'));
    
    // Check cart
    const updateCount = () => {
        const user = localStorage.getItem('user');
        if (!user) {
            setCartCount(0);
            return;
        }
        const cartKey = `cart_${user}`;
        const cart = JSON.parse(localStorage.getItem(cartKey) || '[]');
        setCartCount(cart.length);
    };
    
    updateCount();
    window.addEventListener('storage', updateCount);
    // Custom event for same-window updates
    window.addEventListener('cart-updated', updateCount);
    
    return () => {
        window.removeEventListener('storage', updateCount);
        window.removeEventListener('cart-updated', updateCount);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    setRole(null);
    router.push('/login');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-yellow-500">
          ShivSagar <span className="text-black">Tours</span>
        </Link>
        
        {/* Mobile Menu Button */}
        <button className="md:hidden text-2xl focus:outline-none" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? '✖' : '☰'}
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 items-center">
          <Link href="/" className="hover:text-yellow-600">Home</Link>
          <Link href="/#packages" className="hover:text-yellow-600">Packages</Link>
          <Link href="/brochures" className="hover:text-yellow-600">Brochures</Link>
          <Link href="/contact" className="hover:text-yellow-600">Contact Us</Link>
          
          {role === 'admin' && (
            <Link href="/admin" className="text-red-600 font-bold">Admin Panel</Link>
          )}
          
          <Link href="/cart" className="relative">
            <span className="text-xl">🛒</span>
            {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                    {cartCount}
                </span>
            )}
          </Link>

          {role ? (
            <button onClick={handleLogout} className="px-4 py-2 border rounded hover:bg-gray-100">Logout</button>
          ) : (
            <Link href="/login" className="px-4 py-2 bg-yellow-400 rounded hover:bg-yellow-500 font-bold">Login</Link>
          )}
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 bg-white border-t pt-4 pb-4 space-y-4 flex flex-col">
          <Link href="/" className="px-4 hover:text-yellow-600" onClick={() => setIsMenuOpen(false)}>Home</Link>
          <Link href="/#packages" className="px-4 hover:text-yellow-600" onClick={() => setIsMenuOpen(false)}>Packages</Link>
          <Link href="/brochures" className="px-4 hover:text-yellow-600" onClick={() => setIsMenuOpen(false)}>Brochures</Link>
          <Link href="/contact" className="px-4 hover:text-yellow-600" onClick={() => setIsMenuOpen(false)}>Contact Us</Link>
          
          {role === 'admin' && (
            <Link href="/admin" className="px-4 text-red-600 font-bold" onClick={() => setIsMenuOpen(false)}>Admin Panel</Link>
          )}
          
          <Link href="/cart" className="px-4 relative flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
            <span className="text-xl">🛒</span> Cart ({cartCount})
          </Link>

          <div className="px-4 pt-2">
            {role ? (
                <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="w-full text-left px-4 py-2 border rounded hover:bg-gray-100">Logout</button>
            ) : (
                <Link href="/login" className="block w-full text-center px-4 py-2 bg-yellow-400 rounded hover:bg-yellow-500 font-bold" onClick={() => setIsMenuOpen(false)}>Login</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
