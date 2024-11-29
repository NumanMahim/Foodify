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

// Fetch User Data
function fetchUserData(uid) {
    db.collection("users").doc(uid).get()
        .then((doc) => {
            if (doc.exists) {
                const data = doc.data();
                const headerName = document.getElementById('user-name');
                const headerLocation = document.getElementById('location-text');
                if (headerName) headerName.innerText = data.firstName;
                if (headerLocation) headerLocation.innerText = data.address;
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
    });

fetch('footer.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('footer').innerHTML = data;
    });

// Load Restaurants
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

// Call the function to load restaurants
loadRestaurants();
