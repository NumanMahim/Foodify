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

// Fetch User Data
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

// Listen for Authentication State Changes
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        console.log("User is logged in:", user.uid);
        fetchUserData(user.uid);
    } else {
        console.error("No user is logged in.");
    }
});

// Load Header and Footer
fetch('header.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('header').innerHTML = data;

        // Fetch user data after header is loaded
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                fetchUserData(user.uid);
            }
        });
    });

fetch('footer.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('footer').innerHTML = data;
    });

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

// Call the function to load restaurants
loadRestaurants();
