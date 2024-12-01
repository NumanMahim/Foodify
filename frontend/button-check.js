document.addEventListener("DOMContentLoaded", () => {
    // Add a click event listener to the entire document
    document.body.addEventListener("click", (event) => {
        const clickedElement = event.target;

        // Check if the clicked element is one of the buttons
        if (clickedElement.id === "search-button") {
            alert("Search button clicked!");
        } else if (clickedElement.id === "wallet-button") {
            alert("Wallet button clicked!");
        } else if (clickedElement.id === "cart-button") {
            const cartPopup = document.getElementById("cart-popup");
            if (cartPopup) {
                cartPopup.style.display = "block"; // Show the cart
            }
            alert("Cart button clicked!");
        } else if (clickedElement.id === "user-button") {
            alert("User button clicked!");
        } else if (clickedElement.classList.contains("close-btn")) {
            // Check if the clicked element is the close button inside the cart
            const cartPopup = document.getElementById("cart-popup");
            if (cartPopup) {
                cartPopup.style.display = "none"; // Hide the cart
            }
        }
    });
});
