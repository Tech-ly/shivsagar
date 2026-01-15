'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import toast from 'react-hot-toast';

export default function Admin() {
    const [tab, setTab] = useState('add-package');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [packages, setPackages] = useState([]);
    const [inquiries, setInquiries] = useState([]);
    const [users, setUsers] = useState([]);
    const router = useRouter();

    const [newPkg, setNewPkg] = useState({ name: '', state: '', price: '', duration: '', category: '', features: '', imageType: 'url', image: '' });
    
    // Brochure State
    const [brochures, setBrochures] = useState([]);
    const [newBrochure, setNewBrochure] = useState({ title: '', description: '', imageType: 'url', image: '' });
    const [editingBrochure, setEditingBrochure] = useState(null);

    const fetchData = async () => {
        try {
            const resPkg = await fetch('/api/packages');
            if (resPkg.ok) setPackages(await resPkg.json());

            const resInq = await fetch('/api/contact');
            if (resInq.ok) setInquiries(await resInq.json());

            const resUsers = await fetch('/api/users');
            if (resUsers.ok) setUsers(await resUsers.json());

            const resBrochures = await fetch('/api/brochures');
            if (resBrochures.ok) setBrochures(await resBrochures.json());
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Failed to load data');
        }
    };

    useEffect(() => {
        const role = localStorage.getItem('role');
        if (role !== 'admin') {
            toast.error('Access Denied. Admins Only.');
            router.push('/login');
        } else {
            fetchData();
        }
    }, [router]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewPkg({ ...newPkg, image: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const addPackage = async (e) => {
        e.preventDefault();
        
        let finalImage = newPkg.image;
        if (!finalImage) {
             finalImage = '/banner.png'; // Fallback
        }

        const pkgData = { 
            ...newPkg, 
            price: Number(newPkg.price), 
            features: newPkg.features.split(',').map(s=>s.trim()),
            image: finalImage
        };
        // Remove helper field before sending
        delete pkgData.imageType; 

        await fetch('/api/packages', { method: 'POST', body: JSON.stringify(pkgData) });
        setNewPkg({ name: '', state: '', price: '', duration: '', category: '', features: '', imageType: 'url', image: '' });
        toast.success('Package Added Successfully');
        fetchData();
    };

    const deletePackage = async (id) => {
        if (!confirm('Are you sure you want to delete this package?')) return;
        
        try {
            const res = await fetch(`/api/packages/${id}`, { method: 'DELETE' });
            if (res.ok) {
                toast.success('Package Deleted Successfully');
                fetchData();
            } else {
                toast.error('Failed to delete package');
            }
        } catch (error) {
            console.error('Error deleting package:', error);
            toast.error('Error creating request');
        }
    };

    // Brochure Handlers
    const handleBrochureFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (editingBrochure) {
                    setEditingBrochure({ ...editingBrochure, image: reader.result });
                } else {
                    setNewBrochure({ ...newBrochure, image: reader.result });
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const addBrochure = async (e) => {
        e.preventDefault();
        let finalImage = newBrochure.image;
        if (!finalImage) finalImage = '/banner.png';
        const data = { ...newBrochure, image: finalImage };
        delete data.imageType;
        
        await fetch('/api/brochures', { method: 'POST', body: JSON.stringify(data) });
        setNewBrochure({ title: '', description: '', imageType: 'url', image: '' });
        toast.success('Brochure Added');
        fetchData();
    };

    const updateBrochure = async (e) => {
        e.preventDefault();
        const data = { ...editingBrochure };
        delete data.imageType;

        await fetch(`/api/brochures/${editingBrochure.id}`, { method: 'PUT', body: JSON.stringify(data) });
        setEditingBrochure(null);
        toast.success('Brochure Updated');
        fetchData();
    };

    const deleteBrochure = async (id) => {
        if(!confirm('Delete this brochure?')) return;
        await fetch(`/api/brochures/${id}`, { method: 'DELETE' });
        toast.success('Brochure Deleted');
        fetchData();
    };

    return (
        <div className="flex h-screen bg-gray-100 relative">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-gray-900 text-white p-5 transition-transform duration-300 transform md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-xl font-bold text-yellow-500">Admin Panel</h2>
                    <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-gray-300 hover:text-white">✖</button>
                </div>
                <nav className="space-y-4">
                    <button onClick={() => { setTab('add-package'); setIsSidebarOpen(false); }} className={`block w-full text-left p-2 rounded ${tab === 'add-package' ? 'bg-yellow-600' : ''}`}>Add Package</button>
                    <button onClick={() => { setTab('manage-packages'); setIsSidebarOpen(false); }} className={`block w-full text-left p-2 rounded ${tab === 'manage-packages' ? 'bg-yellow-600' : ''}`}>Manage Packages</button>
                    <button onClick={() => { setTab('add-brochures'); setIsSidebarOpen(false); }} className={`block w-full text-left p-2 rounded ${tab === 'add-brochures' ? 'bg-yellow-600' : ''}`}>Manage Brochures</button>
                    <button onClick={() => { setTab('inquiries'); setIsSidebarOpen(false); }} className={`block w-full text-left p-2 rounded ${tab === 'inquiries' ? 'bg-yellow-600' : ''}`}>Inquiries</button>
                    <button onClick={() => { setTab('users'); setIsSidebarOpen(false); }} className={`block w-full text-left p-2 rounded ${tab === 'users' ? 'bg-yellow-600' : ''}`}>Users</button>
                </nav>
            </div>
            
            <div className="flex-1 flex flex-col h-full overflow-hidden bg-gray-100">
                {/* Mobile Header */}
                <div className="md:hidden bg-white shadow p-4 flex items-center justify-between z-10">
                    <h2 className="font-bold text-lg text-gray-800">ShivSagar Admin</h2>
                    <button onClick={() => setIsSidebarOpen(true)} className="text-2xl text-gray-700">☰</button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 md:p-10">
                {tab === 'add-package' && (
                    <div>
                        <h2 className="text-2xl font-bold mb-6">Add New Package</h2>
                        
                        <div className="card p-6 bg-white mb-8">
                            <form onSubmit={addPackage} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input placeholder="Name" required className="p-2 border rounded" onChange={e => setNewPkg({...newPkg, name: e.target.value})} value={newPkg.name} />
                                <input placeholder="State" required className="p-2 border rounded" onChange={e => setNewPkg({...newPkg, state: e.target.value})} value={newPkg.state} />
                                <input placeholder="Price" type="number" required className="p-2 border rounded" onChange={e => setNewPkg({...newPkg, price: e.target.value})} value={newPkg.price} />
                                <input placeholder="Duration" required className="p-2 border rounded" onChange={e => setNewPkg({...newPkg, duration: e.target.value})} value={newPkg.duration} />
                                <input placeholder="Category (Silver/Gold)" required className="p-2 border rounded" onChange={e => setNewPkg({...newPkg, category: e.target.value})} value={newPkg.category} />
                                <input placeholder="Features (comma sep)" required className="p-2 border rounded" onChange={e => setNewPkg({...newPkg, features: e.target.value})} value={newPkg.features} />
                                
                                <div className="col-span-1 md:col-span-2 border p-3 rounded">
                                    <label className="font-bold mr-4">Image Source:</label>
                                    <label className="mr-4">
                                        <input type="radio" name="imgType" value="url" checked={newPkg.imageType === 'url'} onChange={() => setNewPkg({...newPkg, imageType: 'url', image: ''})} /> URL
                                    </label>
                                    <label>
                                        <input type="radio" name="imgType" value="local" checked={newPkg.imageType === 'local'} onChange={() => setNewPkg({...newPkg, imageType: 'local', image: ''})} /> Upload Local
                                    </label>

                                    <div className="mt-2">
                                        {newPkg.imageType === 'url' ? (
                                            <input placeholder="Image URL (http://...)" className="w-full p-2 border rounded" value={newPkg.image} onChange={e => setNewPkg({...newPkg, image: e.target.value})} />
                                        ) : (
                                            <input type="file" accept="image/*" className="w-full p-2" onChange={handleFileChange} />
                                        )}
                                    </div>
                                </div>

                                <button className="btn-primary col-span-1 md:col-span-2">Add Package</button>
                            </form>
                        </div>
                    </div>
                )}

                {tab === 'manage-packages' && (
                    <div>
                        <h2 className="text-2xl font-bold mb-6">Manage Existing Packages</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {packages.map(p => (
                                <div key={p.id} className="card p-4 bg-white flex justify-between items-center">
                                    <div>
                                        <h4 className="font-bold">{p.name}</h4>
                                        <p className="text-sm">{p.state} - ₹{p.price}</p>
                                    </div>
                                    <button onClick={() => deletePackage(p.id)} className="text-red-500 font-bold">Delete</button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {tab === 'add-brochures' && (
                    <div>
                        <h2 className="text-2xl font-bold mb-6">Manage Brochures</h2>
                        
                        {/* Add/Edit Form */}
                        <div className="card p-6 bg-white mb-8">
                            <h3 className="font-bold mb-4">{editingBrochure ? 'Edit Brochure' : 'Add New Brochure'}</h3>
                            <form onSubmit={editingBrochure ? updateBrochure : addBrochure} className="grid grid-cols-1 gap-4">
                                <input 
                                    placeholder="Title" 
                                    required 
                                    className="p-2 border rounded" 
                                    value={editingBrochure ? editingBrochure.title : newBrochure.title}
                                    onChange={e => editingBrochure ? setEditingBrochure({...editingBrochure, title: e.target.value}) : setNewBrochure({...newBrochure, title: e.target.value})}
                                />
                                <textarea 
                                    placeholder="Description" 
                                    className="p-2 border rounded" 
                                    value={editingBrochure ? editingBrochure.description : newBrochure.description}
                                    onChange={e => editingBrochure ? setEditingBrochure({...editingBrochure, description: e.target.value}) : setNewBrochure({...newBrochure, description: e.target.value})}
                                />
                                
                                <div className="border p-3 rounded">
                                    <label className="font-bold mr-4">Image Source:</label>
                                    <label className="mr-4">
                                        <input type="radio" 
                                            name="bImgType" 
                                            value="url" 
                                            checked={(editingBrochure ? editingBrochure.imageType : newBrochure.imageType) === 'url'} 
                                            onChange={() => editingBrochure ? setEditingBrochure({...editingBrochure, imageType: 'url', image: ''}) : setNewBrochure({...newBrochure, imageType: 'url', image: ''})} 
                                        /> URL
                                    </label>
                                    <label>
                                        <input type="radio" 
                                            name="bImgType" 
                                            value="local" 
                                            checked={(editingBrochure ? editingBrochure.imageType : newBrochure.imageType) === 'local'} 
                                            onChange={() => editingBrochure ? setEditingBrochure({...editingBrochure, imageType: 'local', image: ''}) : setNewBrochure({...newBrochure, imageType: 'local', image: ''})} 
                                        /> Upload Local
                                    </label>

                                    <div className="mt-2">
                                        {(editingBrochure ? editingBrochure.imageType : newBrochure.imageType) === 'url' ? (
                                            <input 
                                                placeholder="Image URL" 
                                                className="w-full p-2 border rounded" 
                                                value={editingBrochure ? editingBrochure.image : newBrochure.image} 
                                                onChange={e => editingBrochure ? setEditingBrochure({...editingBrochure, image: e.target.value}) : setNewBrochure({...newBrochure, image: e.target.value})} 
                                            />
                                        ) : (
                                            <input type="file" accept="image/*" className="w-full p-2" onChange={handleBrochureFileChange} />
                                        )}
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <button className="btn-primary flex-1">{editingBrochure ? 'Update Brochure' : 'Add Brochure'}</button>
                                    {editingBrochure && (
                                        <button type="button" onClick={() => setEditingBrochure(null)} className="bg-gray-500 text-white p-2 rounded">Cancel</button>
                                    )}
                                </div>
                            </form>
                        </div>

                        {/* List */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {brochures.map(b => (
                                <div key={b.id} className="card bg-white p-4 shadow flex flex-col justify-between">
                                    <div>
                                        {b.image && <img src={b.image} alt={b.name} className="w-full h-32 object-cover mb-2 rounded" />}
                                        <h4 className="font-bold text-lg">{b.title}</h4>
                                        <p className="text-gray-600 text-sm">{b.description}</p>
                                    </div>
                                    <div className="mt-4 flex justify-end gap-2">
                                        <button onClick={() => setEditingBrochure({...b, imageType: 'url'})} className="text-blue-600 font-bold">Edit</button>
                                        <button onClick={() => deleteBrochure(b.id)} className="text-red-500 font-bold">Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {tab === 'inquiries' && (
                    <div>
                        <h2 className="text-2xl font-bold mb-6">Inquiries</h2>
                        <div className="bg-white rounded shadow overflow-hidden overflow-x-auto">
                            <table className="w-full min-w-[600px]">
                                <thead className="bg-gray-200">
                                    <tr>
                                        <th className="p-3 text-left">Name</th>
                                        <th className="p-3 text-left">Mobile</th>
                                        <th className="p-3 text-left">Message</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {inquiries.map((i, idx) => (
                                        <tr key={idx} className="border-t">
                                            <td className="p-3">{i.name}</td>
                                            <td className="p-3">{i.mobile}</td>
                                            <td className="p-3 whitespace-pre-wrap">{i.message}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
                
                {tab === 'users' && (
                    <div>
                        <h2 className="text-2xl font-bold mb-6">Registered Users</h2>
                        <div className="bg-white rounded shadow overflow-hidden overflow-x-auto">
                            <table className="w-full min-w-[600px]">
                                <thead className="bg-gray-200">
                                    <tr>
                                        <th className="p-3 text-left">Username</th>
                                        <th className="p-3 text-left">Mobile</th>
                                        <th className="p-3 text-left">Role</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((u, idx) => (
                                        <tr key={idx} className="border-t">
                                            <td className="p-3">{u.username}</td>
                                            <td className="p-3">{u.mobile}</td>
                                            <td className="p-3">{u.role}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    </div>
    );
}
