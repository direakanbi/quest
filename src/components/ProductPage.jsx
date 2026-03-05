import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Ruler, ShoppingCart, ArrowLeft } from 'lucide-react';
import Navbar from './Navbar';
import SizeGuideModal from './SizeGuideModal';
import StickyCart from './StickyCart';
import { useCart } from '../context/CartContext';
import { products } from '../data/products';

function ProductPage() {
    const { handle } = useParams();
    const navigate = useNavigate();
    const product = products.find(p => p.handle === handle);
    const [selectedSize, setSelectedSize] = useState('M');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeThumb, setActiveThumb] = useState(0);
    const { addToCart } = useCart();

    if (!product) return <div style={{ color: 'white', textAlign: 'center', marginTop: '100px' }}>Product not found</div>;

    const sizes = ['S', 'M', 'L', 'XL', 'XXL'];

    const handleAddToCart = () => {
        addToCart(product, selectedSize);
    };

    return (
        <>
            <Navbar />

            <main className="product-container">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    style={{
                        position: 'absolute',
                        top: '100px',
                        left: '40px',
                        background: 'transparent',
                        border: '1px solid var(--accent-color)',
                        color: 'var(--accent-color)',
                        padding: '10px 20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        cursor: 'pointer',
                        fontFamily: 'var(--font-heading)',
                        fontSize: '1rem',
                        zIndex: 200,
                        boxShadow: '0 0 10px rgba(0, 240, 255, 0.3)'
                    }}
                    className="back-btn"
                >
                    <ArrowLeft size={20} /> BACK
                </button>
                {/* Gallery */}
                <section className="product-gallery">
                    <div className="main-image-container">
                        <img
                            src={product.image}
                            alt={product.title}
                            className="main-image"
                            onError={(e) => e.target.src = 'https://placehold.co/600x800/111/FFF?text=Space+Item'}
                        />
                    </div>
                    <div className="thumbnail-grid">
                        {[0, 1, 2].map((i) => (
                            <div
                                key={i}
                                className={`thumb ${activeThumb === i ? 'active' : ''}`}
                                onClick={() => setActiveThumb(i)}
                            />
                        ))}
                    </div>
                </section>

                {/* Info */}
                <section className="product-info">
                    <h1 className="product-title">{product.title}</h1>
                    <div className="price-container">
                        <span className="price">${product.price.toFixed(2)} USD</span>
                        <span className="installments">Pay in 4 interest-free payments of $20.00.</span>
                    </div>

                    {/* Size Selector */}
                    <div className="selector-group">
                        <div className="label-row">
                            <label>SIZE: <span id="selected-size">{selectedSize}</span></label>
                            <button className="size-guide-btn" onClick={() => setIsModalOpen(true)}>
                                <Ruler size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                                Size Guide
                            </button>
                        </div>
                        <div className="size-options">
                            {sizes.map((size) => (
                                <button
                                    key={size}
                                    className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                                    onClick={() => setSelectedSize(size)}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button className="add-to-cart-btn" onClick={handleAddToCart}>
                        ADD TO CART
                    </button>

                    {/* Details */}
                    <div className="details-accordion">
                        <div className="detail-item">
                            <h3>DESCRIPTION</h3>
                            <p>{product.description}</p>
                        </div>
                        <div className="detail-item">
                            <h3>SPECS & FIT</h3>
                            <ul>
                                {product.specs && product.specs.map((spec, index) => (
                                    <li key={index}>{spec}</li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Trust */}
                    <div className="trust-signals">
                        <div className="trust-item">
                            <span>🚀</span> FREE SHIPPING &gt; $150
                        </div>
                        <div className="trust-item">
                            <span>🛡️</span> SECURE CHECKOUT
                        </div>
                    </div>
                </section>
            </main>

            {/* Components */}
            <SizeGuideModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            <StickyCart
                productTitle={product.title}
                productPrice={`$${product.price.toFixed(2)}`}
                onAddToCart={handleAddToCart}
            />
        </>
    );
}

export default ProductPage;
