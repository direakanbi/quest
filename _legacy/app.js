document.addEventListener('DOMContentLoaded', () => {
    
    // --- Size Selection Logic ---
    const sizeBtns = document.querySelectorAll('.size-btn');
    const selectedSizeLabel = document.getElementById('selected-size');

    sizeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active from all
            sizeBtns.forEach(b => b.classList.remove('active'));
            // Add to clicked
            btn.classList.add('active');
            // Update label
            selectedSizeLabel.textContent = btn.textContent;
        });
    });

    // --- Size Guide Modal ---
    const modal = document.getElementById('size-modal');
    const openBtn = document.getElementById('open-size-guide');
    const closeBtn = document.querySelector('.close-modal');

    openBtn.addEventListener('click', () => {
        modal.classList.add('open');
    });

    closeBtn.addEventListener('click', () => {
        modal.classList.remove('open');
    });

    // Close on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('open');
        }
    });

    // --- Sticky Mobile Bar ---
    const stickyBar = document.getElementById('sticky-bar');
    const addToCartBtn = document.querySelector('.add-to-cart-btn');

    // Only enable on small screens potentially, or just by scroll
    window.addEventListener('scroll', () => {
        const btnPosition = addToCartBtn.getBoundingClientRect().bottom;
        
        // If main button is scrolled out of view (negative top usually implies it's above viewport)
        // A simple heuristic: if we've scrolled past the first 400px
        if (window.scrollY > 400) {
            stickyBar.classList.add('visible');
        } else {
            stickyBar.classList.remove('visible');
        }
    });

    // Sync sticky button with main button (simulate add to cart)
    const stickyBtn = document.querySelector('.sticky-btn');
    stickyBtn.addEventListener('click', () => {
        alert('Added to cart!');
        // Here you would typically trigger the form submit or AJAX cart add
    });

    addToCartBtn.addEventListener('click', () => {
        alert('Added to cart!');
    });
});
