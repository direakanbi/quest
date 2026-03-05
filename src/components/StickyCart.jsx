import React, { useEffect, useState } from 'react';

function StickyCart({ productTitle, productPrice, onAddToCart }) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Show after scrolling past 400px (hero section)
            if (window.scrollY > 400) {
                setVisible(true);
            } else {
                setVisible(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className={`sticky-bar ${visible ? 'visible' : ''}`}>
            <div className="sticky-thumb">
                <img
                    src="https://cdn.shopify.com/s/files/1/0663/7528/6999/products/AtomicWorldQuestT-ShirtWhite_1024x1024.png?v=1665672000"
                    alt="Thumb"
                    onError={(e) => e.target.src = 'https://placehold.co/100x100/111/FFF?text=T'}
                />
            </div>
            <div className="sticky-info">
                <span className="sticky-title">{productTitle}</span>
                <span className="sticky-price">{productPrice}</span>
            </div>
            <button className="sticky-btn" onClick={onAddToCart}>
                ADD TO CART
            </button>
        </div>
    );
}

export default StickyCart;
