function loadCart() {
    fetch('cart.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('cart-container').innerHTML = html;

            // Add event listener to the Cart button in the header
            const cartButton = document.getElementById('cart-button');
            const cartPopup = document.getElementById('cart-popup');

            if (cartButton && cartPopup) {
                cartButton.addEventListener('click', () => {
                    cartPopup.style.display = 'block';
                });
            }
        })
        .catch(err => console.error('Failed to load cart:', err));
}

// Load the cart on page load
window.onload = function () {
    loadCart();
};