// Firebase Initialization (if not already initialized)
if (!firebase.apps.length) {
    const firebaseConfig = {
        apiKey: "AIzaSyAIMi_uFxjXgcFtSpcx3QJjtWFHVGmOlHw",
        authDomain: "foodify-f0dc3.firebaseapp.com",
        projectId: "foodify-f0dc3",
        storageBucket: "foodify-f0dc3.appspot.com",
        messagingSenderId: "58325112653",
        appId: "1:58325112653:web:29db036a4ab62bb0188904",
        measurementId: "G-GL3MD09KR8"
    };

    firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();

// Fetch and Display Cart
function fetchCartFromFirebase(uid) {
    const cartItemsContainer = document.querySelector(".cart-items");
    const cartFooter = document.querySelector(".cart-footer");

    if (!cartItemsContainer || !cartFooter) {
        console.error("Cart display elements not found.");
        return;
    }

    const userCartRef = db.collection('carts').doc(uid);

    userCartRef.get().then((doc) => {
        if (doc.exists) {
            const cartItems = doc.data().items || [];
            cartItemsContainer.innerHTML = ''; // Clear existing cart items

            let total = 0;
            cartItems.forEach((item) => {
                const cartItem = document.createElement("div");
                cartItem.className = "cart-item";
                cartItem.innerHTML = `
                    <p>${item.name}</p>
                    <p>Quantity: ${item.quantity}</p>
                    <p>£${(item.price * item.quantity).toFixed(2)}</p>
                `;
                cartItemsContainer.appendChild(cartItem);
                total += item.price * item.quantity;
            });

            // Update total in cart footer
            cartFooter.querySelector("p").textContent = `Total: £${total.toFixed(2)}`;
        } else {
            console.log("No cart data found for user.");
            cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
            cartFooter.querySelector("p").textContent = "Total: £0.00";
        }
    }).catch((error) => {
        console.error("Error fetching cart:", error);
        cartItemsContainer.innerHTML = "<p>Error loading cart.</p>";
        cartFooter.querySelector("p").textContent = "Total: £0.00";
    });
}

// Attach Event Listener to Cart Button
document.addEventListener("click", (event) => {
    if (event.target.id === "cart-button") {
        const cartPopup = document.getElementById("cart-popup");
        cartPopup.style.display = (cartPopup.style.display === "none" || cartPopup.style.display === "") ? "block" : "none";

        if (firebase.auth().currentUser) {
            fetchCartFromFirebase(firebase.auth().currentUser.uid);
        } else {
            console.error("No user is logged in. Cannot fetch cart.");
        }
    }
});
