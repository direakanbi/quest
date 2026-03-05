import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import { products } from '../data/products';

function CollectionPage() {

    const [currentPage, setCurrentPage] = React.useState(1);
    const itemsPerPage = 9;

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(products.length / itemsPerPage);

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    }

    const handlePrev = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    }

    useEffect(() => {
        window.scrollTo(0, 0); // Scroll to top on page change
    }, [currentPage]);


    return (
        <>
            <Navbar />
            <div className="collection-container">
                <h1 className="collection-title">CATALOG</h1>
                <div className="product-grid">
                    {currentProducts.map(product => (
                        <Link to={`/products/${product.handle}`} key={product.id} className="product-card">
                            <div className="card-image">
                                <img src={product.image} alt={product.title} />
                            </div>
                            <div className="card-info">
                                <h3 className="card-title">{product.title}</h3>
                                <span className="card-price">${product.price.toFixed(2)} USD</span>
                                <span className="card-btn">CHOOSE OPTIONS</span>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Pagination Controls */}
                <div className="pagination-controls" style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '20px',
                    margin: '60px 0',
                    position: 'relative',
                    zIndex: 10
                }}>
                    <button
                        onClick={handlePrev}
                        disabled={currentPage === 1}
                        style={{
                            padding: '12px 30px',
                            background: currentPage === 1 ? 'transparent' : 'black',
                            color: currentPage === 1 ? '#444' : 'var(--accent-color)',
                            border: currentPage === 1 ? '1px solid #333' : '1px solid var(--accent-color)',
                            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                            fontFamily: 'var(--font-heading)',
                            fontSize: '1rem',
                            letterSpacing: '2px',
                            transition: 'all 0.3s',
                            opacity: currentPage === 1 ? 0.5 : 1,
                            boxShadow: currentPage === 1 ? 'none' : '0 0 10px rgba(0, 240, 255, 0.2)'
                        }}
                    >
                        &lt; PREV
                    </button>

                    <span style={{
                        color: 'white',
                        alignSelf: 'center',
                        fontFamily: 'var(--font-heading)',
                        fontSize: '1.2rem',
                        letterSpacing: '2px'
                    }}>
                        PAGE {currentPage} / {totalPages}
                    </span>

                    <button
                        onClick={handleNext}
                        disabled={currentPage === totalPages}
                        style={{
                            padding: '12px 30px',
                            background: currentPage === totalPages ? 'transparent' : 'var(--accent-color)',
                            color: currentPage === totalPages ? '#444' : 'black',
                            border: currentPage === totalPages ? '1px solid #333' : '1px solid var(--accent-color)',
                            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                            fontFamily: 'var(--font-heading)',
                            fontSize: '1rem',
                            letterSpacing: '2px',
                            transition: 'all 0.3s',
                            opacity: currentPage === totalPages ? 0.5 : 1,
                            boxShadow: currentPage === totalPages ? 'none' : '0 0 15px rgba(0, 240, 255, 0.5)'
                        }}
                    >
                        NEXT &gt;
                    </button>
                </div>
            </div>
        </>
    );
}

export default CollectionPage;
