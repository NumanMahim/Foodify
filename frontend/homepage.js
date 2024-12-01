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
const auth = firebase.auth();
const db = firebase.firestore();

// Wyre Data API Integration (Optional)
const wyreApiKey = 'b0cb75d626msh4cbf53b562aaf77p1c14f1jsnc94670909afd';
const wyreApiUrl = 'https://wyre-data.p.rapidapi.com/get/6399f64671c0238ae6e76eed';

// Load Header and Footer


// Fetch Restaurants from Firebase
function loadRestaurants() {
    const restaurantList = document.getElementById('restaurant-list');
    if (!restaurantList) {
        console.error("Restaurant list element not found.");
        return;
    }

    db.collection('restaurants').get()
        .then(querySnapshot => {
            restaurantList.innerHTML = ''; // Clear loading text
            if (querySnapshot.empty) {
                restaurantList.innerHTML = '<p>No restaurants available.</p>';
                return;
            }

            querySnapshot.forEach(doc => {
                const restaurant = doc.data();
                const restaurantId = doc.id; // Get the restaurant's ID
                const restaurantCard = document.createElement('div');
                restaurantCard.className = 'restaurant-card';
                restaurantCard.innerHTML = `
                    <img src="${restaurant.image || 'placeholder.jpg'}" alt="${restaurant.name}" class="restaurant-image">
                    <h3>${restaurant.name}</h3>
                    <p>Rating: ${restaurant.rating || 'N/A'}</p>
                `;

                // Add click functionality to navigate to menu.html
                restaurantCard.addEventListener('click', () => {
                    window.location.href = `menu.html?restaurantId=${restaurantId}`;
                });

                restaurantList.appendChild(restaurantCard);
            });
        })
        .catch(error => {
            console.error('Error fetching restaurants:', error);
            restaurantList.innerHTML = '<p>Error loading restaurants.</p>';
        });
}

// Optional: Fetch Restaurants using Wyre API
function fetchRestaurantsFromAPI() {
    fetch(wyreApiUrl, {
        method: 'GET',
        headers: {
            'x-rapidapi-host': 'wyre-data.p.rapidapi.com',
            'x-rapidapi-key': wyreApiKey,
        },
    })
        .then(response => response.json())
        .then(data => {
            const restaurantList = document.getElementById('restaurant-list');
            restaurantList.innerHTML = '';

            if (data && data.length > 0) {
                data.forEach(restaurant => {
                    const restaurantDiv = document.createElement('div');
                    restaurantDiv.className = 'restaurant-card';
                    restaurantDiv.innerHTML = `
                        <h3>${restaurant.name}</h3>
                        <p>${restaurant.address}</p>
                        <p>Rating: ${restaurant.rating || 'N/A'}</p>
                    `;
                    restaurantList.appendChild(restaurantDiv);
                });
            } else {
                restaurantList.innerHTML = 'No restaurants found.';
            }
        })
        .catch(error => {
            console.error('Error fetching restaurants:', error);
            document.getElementById('restaurant-list').innerText = 'Error loading restaurants.';
        });
}

// Cart Functionality

let authenticatedUserId = null;

// Authentication State Listener
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        authenticatedUserId = user.uid;
        console.log("User is logged in:", user.uid);

        // Fetch cart for the authenticated user
        fetchCartFromFirebase(user.uid);
    } else {
        console.error("No user is logged in.");
    }
});

// Function to Fetch Cart from Firebase
function fetchCartFromFirebase(uid) {
    const cartItemsContainer = document.querySelector(".cart-items");
    const cartFooter = document.querySelector(".cart-footer");

    if (!cartItemsContainer || !cartFooter) {
        console.error("Cart elements not found.");
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

// Toggle Cart Popup
function toggleCart() {
    const cartPopup = document.getElementById('cart-popup');
    cartPopup.style.display = (cartPopup.style.display === 'none' || cartPopup.style.display === '') ? 'block' : 'none';

    if (firebase.auth().currentUser) {
        fetchCartFromFirebase(firebase.auth().currentUser.uid);
    } else {
        console.error("No user is logged in. Cannot fetch cart.");
    }
}

// Call the function to load restaurants
loadRestaurants();
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