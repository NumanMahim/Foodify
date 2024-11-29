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

// Fetch Restaurants Function
function fetchRestaurants() {
    const restaurantList = document.getElementById('restaurant-list');
    restaurantList.innerHTML = 'Loading...';

    db.collection('restaurants')
        .get()
        .then((querySnapshot) => {
            restaurantList.innerHTML = ''; // Clear loading text

            querySnapshot.forEach((doc) => {
                const restaurant = doc.data();

                // Create Restaurant Card
                const restaurantCard = document.createElement('div');
                restaurantCard.className = 'restaurant-card';
                restaurantCard.innerHTML = `
                    <img src="${restaurant.image}" alt="${restaurant.name}" />
                    <h3>${restaurant.name}</h3>
                    <p>Rating: ${restaurant.rating || 'N/A'}</p>
                `;

                restaurantCard.addEventListener('click', () => {
                    // Navigate to menu page with restaurant ID in query params
                    window.location.href = `menu.html?restaurantId=${doc.id}`;
                });

                restaurantList.appendChild(restaurantCard);
            });

            // If no restaurants found
            if (restaurantList.innerHTML === '') {
                restaurantList.innerHTML = 'No restaurants found.';
            }
        })
        .catch((error) => {
            console.error('Error fetching restaurants:', error);
            restaurantList.innerHTML = 'Error loading restaurants.';
        });
}

// Fetch restaurants on page load
fetchRestaurants();
