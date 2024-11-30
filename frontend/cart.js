document.addEventListener('DOMContentLoaded', () => {
    const cartButton = document.getElementById('cart-button');
    const cartOverlay = document.getElementById('cart-overlay');
    const closeCartButton = document.getElementById('close-cart');

    // Open the cart overlay
    cartButton.addEventListener('click', () => {
        cartOverlay.classList.add('open');
    });

    // Close the cart overlay
    closeCartButton.addEventListener('click', () => {
        cartOverlay.classList.remove('open');
    });

    // Optional: Close the cart when clicking outside the overlay
    window.addEventListener('click', (event) => {
        if (event.target === cartOverlay) {
            cartOverlay.classList.remove('open');
        }
    });
});
