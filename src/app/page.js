'use client';
import { useState, useEffect } from 'react';
import Fuse from 'fuse.js';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [packages, setPackages] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchState, setSearchState] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetch('/api/packages')
      .then(res => res.json())
      .then(data => {
        setPackages(data);
        setFiltered(data);
      });
  }, []);

  const handleSearch = () => {
    let res = packages;
    if (searchState) {
        const fuse = new Fuse(res, {
            keys: ['state'],
            threshold: 0.4, // Adjust for sensitivity (0.0 = exact, 1.0 = match anything)
            ignoreLocation: true
        });
        const results = fuse.search(searchState);
        res = results.map(result => result.item);
    }
    if (priceRange) {
        const [min, max] = priceRange.split('-').map(Number);
        if (max) {
             res = res.filter(p => p.price >= min && p.price <= max);
        } else {
             // 50000+ case if needed, but logic above handles '20000-50000'
        }
    }
    setFiltered(res);
  };

  const addToCart = (pkg) => {
    const user = localStorage.getItem('user');
    if (!user) {
        toast.error('Please Login to add items to cart');
        router.push('/login');
        return;
    }

    const cartKey = `cart_${user}`;
    const cart = JSON.parse(localStorage.getItem(cartKey) || '[]');
    
    if (cart.find(item => item.id === pkg.id)) {
        toast.error('Item already in cart');
        return;
    }
    cart.push(pkg);
    localStorage.setItem(cartKey, JSON.stringify(cart));
    window.dispatchEvent(new Event('cart-updated')); // Update Navbar
    toast.success(`${pkg.name} added to cart!`);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center text-center text-white bg-black">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/banner.png" alt="Travel Banner" className="absolute inset-0 w-full h-full object-cover opacity-60" />
        <div className="relative z-10 p-5">
            <h1 className="text-5xl md:text-7xl font-bold mb-4">Discover India&apos;s Beauty</h1>
            <p className="text-xl mb-8">Premium packages for Goa, Rajasthan, Kerala & more.</p>
            <a href="#packages" className="btn-primary text-lg px-8 py-3">Explore Now</a>
        </div>
      </section>

      {/* Search Filter */}
      <div className="container mx-auto -mt-10 relative z-20 bg-white p-6 rounded-lg shadow-xl flex flex-wrap gap-4 justify-center items-center max-w-4xl">
         <input 
            type="text"
            className="p-3 border rounded w-full md:w-auto flex-1"
            placeholder="Search State (e.g. Goa)"
            value={searchState}
            onChange={(e) => setSearchState(e.target.value)}
         />
         
         <select
            className="p-3 border rounded w-full md:w-auto flex-1"
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
         >
             <option value="">Any Price</option>
             <option value="0-10000">Under ₹10,000</option>
             <option value="10000-20000">₹10,000 - ₹20,000</option>
             <option value="20000-50000">₹20,000 - ₹50,000</option>
         </select>
         
         <button onClick={handleSearch} className="btn-primary w-full md:w-auto">Search Packages</button>
      </div>

      {/* Packages Grid */}
      <section id="packages" className="container mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-10">Our Best Selling Packages</h2>
        
        {filtered.length === 0 ? (
            <p className="text-center text-black font-medium">No packages found.</p>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filtered.map(pkg => (
                    <div key={pkg.id} className="card bg-white">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={pkg.image} alt={pkg.name} className="w-full h-48 object-cover" />
                        <div className="p-5">
                            <div className="flex justify-between items-center mb-2">
                                <span className="bg-yellow-200 text-yellow-800 text-xs px-2 py-1 rounded-full uppercase font-bold">{pkg.state}</span>
                                <span className="text-black font-semibold text-sm">{pkg.duration}</span>
                            </div>
                            <h3 className="text-xl font-bold mb-2">{pkg.name}</h3>
                            <ul className="text-sm text-black font-medium mb-4 list-disc list-inside">
                                {pkg.features && pkg.features.map((f, i) => <li key={i}>{f}</li>)}
                            </ul>
                            <div className="flex justify-between items-center mt-4 border-t pt-4">
                                <span className="text-2xl font-bold text-yellow-600">₹{pkg.price}</span>
                                <button onClick={() => addToCart(pkg)} className="btn-primary text-sm">Add to Cart</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </section>
    </div>
  );
}
