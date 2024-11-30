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
                    <div class="menu-plus-icon">
                        <i class="fas fa-plus"></i>
                    </div>
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
                `;
                menuList.appendChild(menuCard);
            });
        })
        .catch(error => {
            console.error('Error fetching menu:', error);
            menuList.innerHTML = '<p>Error loading menu.</p>';
        });
}

// Fetch menu items on page load
fetchMenu();
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
