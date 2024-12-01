// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyAIMi_uFxjXgcFtSpcx3QJjtWFHVGmOlHw",
    authDomain: "foodify-f0dc3.firebaseapp.com",
    projectId: "foodify-f0dc3",
    storageBucket: "foodify-f0dc3.appspot.com",
    messagingSenderId: "58325112653",
    appId: "1:58325112653:web:29db036a4ab62bb0188904",
    measurementId: "G-GL3MD09KR8"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Cart Array (Used for Display)
const cart = [];

// Get Restaurant ID from URL
const params = new URLSearchParams(window.location.search);
const restaurantId = params.get('restaurantId');

// Variable to Store Authenticated User ID
let authenticatedUserId = null;

// Listen for Authentication State Changes
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        authenticatedUserId = user.uid;
        console.log("User is logged in:", user.uid);

        // Fetch User Data and Initialize Cart
        fetchUserData(user.uid);
        fetchCartFromFirebase(user.uid); // Load the cart from Firebase
    } else {
        console.error("No user is logged in.");
    }
});

// Fetch User Data (Optional Header Update)
function fetchUserData(uid) {
    console.log("Fetching data for user:", uid);
    db.collection("users").doc(uid).get()
        .then((doc) => {
            if (doc.exists) {
                const data = doc.data();
                const headerName = document.getElementById('user-name');
                const headerLocation = document.getElementById('location-text');
                if (headerName) headerName.innerText = data.firstName || 'Guest';
                if (headerLocation) headerLocation.innerText = data.address || 'Unknown Location';
            } else {
                console.error("No such user document!");
            }
        })
        .catch((error) => {
            console.error("Error fetching user data:", error);
        });
}

// Fetch Menu Items
function fetchMenu() {
    const menuList = document.getElementById('menu-list');
    if (!menuList) {
        console.error("Menu list element not found.");
        return;
    }

    db.collection('restaurants').doc(restaurantId).collection('menu').get()
        .then(querySnapshot => {
            menuList.innerHTML = ''; // Clear loading text
            if (querySnapshot.empty) {
                menuList.innerHTML = '<p>No menu items found.</p>';
                return;
            }

            querySnapshot.forEach(doc => {
                const menuItem = doc.data();
                const menuCard = document.createElement('div');
                menuCard.className = 'menu-card';
                menuCard.innerHTML = `
                    <img src="${menuItem.image || 'placeholder.jpg'}" alt="${menuItem.name}" class="menu-image">
                    <div class="menu-info">
                        <h3>${menuItem.name}</h3>
                        <p class="price">£${menuItem.price}</p>
                        <p class="rating">
                            <i class="fas fa-thumbs-up"></i>
                            ${menuItem.rating ? `${menuItem.rating}% (${menuItem.reviews || '0'})` : 'No reviews'}
                        </p>
                        <p class="description">${menuItem.description || 'No description available.'}</p>
                    </div>
                    <div class="button-container">
                        <button 
                            class="add-to-cart-button" 
                            data-id="${doc.id}" 
                            data-name="${menuItem.name}" 
                            data-price="${menuItem.price}">
                            Add To Cart
                        </button>
                    </div>
                `;
                menuList.appendChild(menuCard);
            });
        })
        .catch(error => {
            console.error('Error fetching menu:', error);
            menuList.innerHTML = '<p>Error loading menu.</p>';
        });
}

// Add event listener for "Add to Cart" button clicks
document.addEventListener("click", (event) => {
    if (event.target.classList.contains("add-to-cart-button") && authenticatedUserId) {
        const button = event.target;
        const menuItemId = button.dataset.id;
        const menuItemName = button.dataset.name;
        const menuItemPrice = parseFloat(button.dataset.price);

        // Show loading spinner on button
        button.innerHTML = `<div class="spinner"></div>`;
        button.disabled = true;

        // Add item to the user's cart in Firebase
        const userCartRef = db.collection('carts').doc(authenticatedUserId);

        userCartRef.get().then(doc => {
            let cartItems = [];
            if (doc.exists) {
                cartItems = doc.data().items || [];
            }

            // Check if item already exists in the cart
            const existingItem = cartItems.find(item => item.id === menuItemId);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cartItems.push({
                    id: menuItemId,
                    name: menuItemName,
                    price: menuItemPrice,
                    quantity: 1
                });
            }

            // Update cart in Firebase
            userCartRef.set({ items: cartItems })
                .then(() => {
                    console.log("Cart updated successfully");

                    // Show green tick after spinner
                    setTimeout(() => {
                        button.innerHTML = `<i class="fas fa-check green-check"></i>`;
                        
                        // Restore button after showing green tick
                        setTimeout(() => {
                            button.innerHTML = "Add To Cart";
                            button.disabled = false;

                            // Refresh cart display
                            fetchCartFromFirebase(authenticatedUserId);
                        }, 500); // 0.5 second for green tick
                    }, 500); // 0.5 second for spinner
                })
                .catch(error => {
                    console.error("Error updating cart:", error);

                    // Reset button on error
                    button.innerHTML = "Add To Cart";
                    button.disabled = false;
                });
        }).catch(error => {
            console.error("Error fetching cart:", error);

            // Reset button on error
            button.innerHTML = "Add To Cart";
            button.disabled = false;
        });
    } else if (!authenticatedUserId) {
        console.error("User is not authenticated. Cannot add to cart.");
    }
});


// Fetch Cart from Firebase
function fetchCartFromFirebase(uid) {
    const cartItemsContainer = document.querySelector(".cart-items");
    const cartFooter = document.querySelector(".cart-footer");

    if (!cartItemsContainer || !cartFooter) {
        console.error("Cart display elements not found.");
        return;
    }

    const userCartRef = db.collection('carts').doc(uid);

    userCartRef.get().then(doc => {
        if (doc.exists) {
            const cartItems = doc.data().items || [];
            cartItemsContainer.innerHTML = ''; // Clear existing cart items

            let total = 0;
            cartItems.forEach(item => {
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.innerHTML = `
                    <p>${item.name} x ${item.quantity}</p>
                    <p>£${(item.price * item.quantity).toFixed(2)}</p>
                `;
                cartItemsContainer.appendChild(cartItem);
                total += item.price * item.quantity;
            });

            // Update total in cart footer
            cartFooter.querySelector('p').textContent = `Total: £${total.toFixed(2)}`;
        } else {
            console.log("No cart data found for user.");
        }
    }).catch(error => console.error("Error fetching cart:", error));
}

// Fetch menu items on page load
fetchMenu();

// Load Header and Footer
fetch('header.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('header').innerHTML = data;
    });

fetch('footer.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('footer').innerHTML = data;
    });
