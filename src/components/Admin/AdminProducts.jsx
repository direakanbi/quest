import React, { useState, useEffect, useCallback } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Upload, Trash2, RefreshCw } from 'lucide-react';
import { supabase } from '../../supabaseClient';

const AdminProducts = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 10;

    // Form state
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [sizes, setSizes] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [description, setDescription] = useState('');
    const [stock, setStock] = useState(0);
    const [saving, setSaving] = useState(false);

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        setError(null);
        const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });

        if (error) {
            if (error.code === '42P01') {
                setError('Table "products" does not exist in Supabase. Please create it via the SQL editor with columns: id (uuid, default gen_random_uuid()), title (text), price (numeric), image_url (text), sizes (text), description (text), handle (text), created_at (timestampz, default now()), stock (integer, default 0).');
            } else {
                setError(error.message);
            }
        } else {
            setProducts(data || []);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchProducts();
    }, [fetchProducts]);

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);

        let finalImageUrl = imageUrl;

        // If an image file was selected, upload it to Supabase Storage
        if (imageFile) {
            const fileExt = imageFile.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('product-images')
                .upload(filePath, imageFile);

            if (uploadError) {
                alert('Error uploading image: ' + uploadError.message + '\nMake sure the "product-images" bucket exists and is public.');
                setSaving(false);
                return;
            }

            // Get the public URL for the uploaded image
            const { data: publicUrlData } = supabase.storage
                .from('product-images')
                .getPublicUrl(filePath);

            finalImageUrl = publicUrlData.publicUrl;
        }

        const handle = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

        const { error } = await supabase.from('products').insert([
            { title, price: parseFloat(price), image_url: finalImageUrl, sizes, description, handle, stock: parseInt(stock) }
        ]);

        if (error) {
            alert('Error saving: ' + error.message);
        } else {
            setIsModalOpen(false);
            setTitle('');
            setPrice('');
            setSizes('');
            setImageUrl('');
            setImageFile(null);
            setDescription('');
            setStock(0);
            fetchProducts();
        }
        setSaving(false);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this product?')) return;
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) alert(error.message);
        else fetchProducts();
    };

    const handleStockUpdate = async (id, currentStock, change) => {
        const newStock = Math.max(0, currentStock + change);

        // Optimistically update the UI to prevent reloading flashes
        setProducts(prevProducts => prevProducts.map(p =>
            p.id === id ? { ...p, stock: newStock } : p
        ));

        const { error } = await supabase.from('products').update({ stock: newStock }).eq('id', id);
        if (error) {
            alert('Error updating stock: ' + error.message);
            fetchProducts(); // Revert on error
        }
    };

    // Pagination calculations
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(products.length / productsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <div>
                    <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--accent-color)', fontSize: '2.5rem', margin: 0 }}>PRODUCTS</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Manage your catalog</p>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        onClick={fetchProducts}
                        style={{ padding: '12px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'var(--text-primary)', borderRadius: '8px', cursor: 'pointer' }}
                    >
                        <RefreshCw size={20} className={loading ? "spin" : ""} />
                    </button>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--accent-color)', color: '#000', border: 'none', padding: '12px 24px', borderRadius: '8px', fontFamily: 'var(--font-heading)', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 0 20px rgba(0, 240, 255, 0.3)', transition: 'all 0.3s'
                        }}
                    >
                        <Plus size={20} /> UPLOAD PRODUCT
                    </button>
                </div>
            </header>

            {error ? (
                <div style={{ padding: '20px', background: 'rgba(255,0,0,0.1)', border: '1px solid red', borderRadius: '8px', color: '#ff4444' }}>
                    {error}
                </div>
            ) : (
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead style={{ background: 'rgba(0,0,0,0.5)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                            <tr>
                                <th style={{ padding: '20px', color: 'var(--text-secondary)', fontWeight: 'bold', fontSize: '0.9rem' }}>Image</th>
                                <th style={{ padding: '20px', color: 'var(--text-secondary)', fontWeight: 'bold', fontSize: '0.9rem' }}>Product Name</th>
                                <th style={{ padding: '20px', color: 'var(--text-secondary)', fontWeight: 'bold', fontSize: '0.9rem' }}>Price</th>
                                <th style={{ padding: '20px', color: 'var(--text-secondary)', fontWeight: 'bold', fontSize: '0.9rem' }}>Sizes</th>
                                <th style={{ padding: '20px', color: 'var(--text-secondary)', fontWeight: 'bold', fontSize: '0.9rem', textAlign: 'center' }}>Stock</th>
                                <th style={{ padding: '20px', color: 'var(--text-secondary)', fontWeight: 'bold', fontSize: '0.9rem', textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading...</td></tr>
                            ) : currentProducts.length === 0 ? (
                                <tr><td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>No products found. Upload one to get started.</td></tr>
                            ) : (
                                currentProducts.map(product => (
                                    <tr key={product.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <td style={{ padding: '15px 20px' }}>
                                            <img src={product.image_url || product.image || 'https://via.placeholder.com/50'} alt={product.title} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px', background: '#fff' }} />
                                        </td>
                                        <td style={{ padding: '15px 20px', color: 'var(--text-primary)', fontWeight: 'bold' }}>{product.title}</td>
                                        <td style={{ padding: '15px 20px', color: 'var(--accent-color)' }}>${product.price}</td>
                                        <td style={{ padding: '15px 20px', color: 'var(--text-secondary)' }}>{product.sizes || 'N/A'}</td>
                                        <td style={{ padding: '15px 20px', textAlign: 'center' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                                <button onClick={() => handleStockUpdate(product.id, (product.stock || 0), -1)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}>-</button>
                                                <span style={{ minWidth: '30px', fontWeight: 'bold' }}>{product.stock || 0}</span>
                                                <button onClick={() => handleStockUpdate(product.id, (product.stock || 0), 1)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}>+</button>
                                            </div>
                                        </td>
                                        <td style={{ padding: '15px 20px', textAlign: 'right' }}>
                                            <button onClick={() => handleDelete(product.id)} style={{ background: 'transparent', border: 'none', color: '#ff4444', cursor: 'pointer', padding: '8px' }}>
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.2)' }}>
                            <button
                                disabled={currentPage === 1}
                                onClick={() => paginate(currentPage - 1)}
                                style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-primary)', borderRadius: '6px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', opacity: currentPage === 1 ? 0.5 : 1, transition: 'all 0.2s' }}
                            >
                                Previous
                            </button>
                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                Page <strong style={{ color: 'var(--text-primary)' }}>{currentPage}</strong> of <strong style={{ color: 'var(--text-primary)' }}>{totalPages}</strong>
                            </span>
                            <button
                                disabled={currentPage === totalPages}
                                onClick={() => paginate(currentPage + 1)}
                                style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-primary)', borderRadius: '6px', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', opacity: currentPage === totalPages ? 0.5 : 1, transition: 'all 0.2s' }}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            )}

            <AnimatePresence>
                {isModalOpen && (
                    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)' }}
                            onClick={() => setIsModalOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            style={{ position: 'relative', width: '100%', maxWidth: '600px', background: '#111', border: '1px solid var(--accent-color)', borderRadius: '16px', padding: '40px', boxShadow: '0 0 50px rgba(0, 240, 255, 0.15)', maxHeight: '90vh', overflowY: 'auto' }}
                        >
                            <button onClick={() => setIsModalOpen(false)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                                <X size={24} />
                            </button>

                            <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--accent-color)', marginBottom: '30px' }}>UPLOAD NEW PRODUCT</h2>

                            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Product Name</label>
                                    <input type="text" value={title} onChange={e => setTitle(e.target.value)} required className="input-field" style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.2)', padding: '12px', color: 'white', borderRadius: '8px', outline: 'none' }} />
                                </div>

                                <div style={{ display: 'flex', gap: '20px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                                        <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Price ($)</label>
                                        <input type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} required className="input-field" style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.2)', padding: '12px', color: 'white', borderRadius: '8px', outline: 'none' }} />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                                        <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Sizes (e.g. S,M,L)</label>
                                        <input type="text" value={sizes} onChange={e => setSizes(e.target.value)} className="input-field" placeholder="S, M, L, XL" style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.2)', padding: '12px', color: 'white', borderRadius: '8px', outline: 'none' }} />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                                        <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Initial Stock</label>
                                        <input type="number" min="0" value={stock} onChange={e => setStock(e.target.value)} required className="input-field" style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.2)', padding: '12px', color: 'white', borderRadius: '8px', outline: 'none' }} />
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Product Image</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={e => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                setImageFile(file);
                                                // Create a local preview URL
                                                const objectUrl = URL.createObjectURL(file);
                                                setImageUrl(objectUrl);
                                            }
                                        }}
                                        className="input-field"
                                        style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.2)', padding: '12px', color: 'white', borderRadius: '8px', outline: 'none' }}
                                    />
                                    {imageUrl && <img src={imageUrl} alt="Preview" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', marginTop: '10px' }} />}
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Description</label>
                                    <textarea value={description} onChange={e => setDescription(e.target.value)} rows="3" className="input-field" style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.2)', padding: '12px', color: 'white', borderRadius: '8px', outline: 'none', resize: 'vertical' }}></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    style={{ padding: '15px', background: 'var(--accent-color)', color: '#000', border: 'none', borderRadius: '8px', fontFamily: 'var(--font-heading)', fontWeight: 'bold', cursor: saving ? 'not-allowed' : 'pointer', marginTop: '10px', opacity: saving ? 0.7 : 1 }}
                                >
                                    {saving ? 'SAVING...' : 'SAVE PRODUCT'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default AdminProducts;
