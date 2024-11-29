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

// Get Restaurant ID from URL
const params = new URLSearchParams(window.location.search);
const restaurantId = params.get('restaurantId');

console.log('Restaurant ID from URL:', restaurantId);

// Fetch Menu Items for the Restaurant
function fetchMenu() {
    const menuList = document.getElementById('menu-list');
    menuList.innerHTML = 'Loading menu...';

    // Validate restaurantId
    if (!restaurantId) {
        menuList.innerHTML = 'Invalid restaurant ID.';
        console.error('Invalid restaurant ID.');
        return;
    }

    // Fetch menu items
    db.collection('restaurants')
        .doc(restaurantId)
        .collection('menu')
        .get()
        .then((querySnapshot) => {
            menuList.innerHTML = ''; // Clear loading text

            if (querySnapshot.empty) {
                menuList.innerHTML = 'No menu items found.';
                return;
            }

            querySnapshot.forEach((doc) => {
                const menuItem = doc.data();

                // Create Menu Item Card
                const menuCard = document.createElement('div');
                menuCard.className = 'menu-card';
                menuCard.innerHTML = `
                    <h3>${menuItem.name}</h3>
                    <p>${menuItem.description}</p>
                    <p>Price: $${menuItem.price}</p>
                `;

                menuList.appendChild(menuCard);
            });
        })
        .catch((error) => {
            console.error('Error fetching menu:', error);
            menuList.innerHTML = 'Error loading menu.';
        });
}

// Fetch menu on page load
fetchMenu();
