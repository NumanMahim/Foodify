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

// Function to Fetch User Data
function fetchUserData(uid) {
    db.collection("users").doc(uid).get()
        .then((doc) => {
            if (doc.exists) {
                const userData = doc.data();
                updateHeader(userData.firstName, userData.address);
            } else {
                console.error("User document not found.");
            }
        })
        .catch((error) => {
            console.error("Error fetching user data:", error);
        });
}

// Function to Update Header with User Data
function updateHeader(username, location) {
    // Update username in the "User" button
    const userIcon = document.querySelector('.icon-user span');
    if (userIcon) {
        userIcon.innerText = username;
    }

    // Update the location in "Your Location"
    const locationText = document.querySelector('.location-text');
    if (locationText) {
        locationText.innerText = location;
    }
}
