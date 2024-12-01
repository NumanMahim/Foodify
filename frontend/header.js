// Listen for Authentication State Changes
auth.onAuthStateChanged((user) => {
    if (user) {
        console.log("User is logged in with UID:", user.uid);
        fetchUserData(user.uid);
    } else {
        console.error("No user is logged in.");
    }
});

// Fetch User Data
function fetchUserData(uid) {
    console.log("Fetching user data for UID:", uid);
    db.collection("users").doc(uid).get()
        .then((doc) => {
            if (doc.exists) {
                console.log("Document data:", doc.data());
                const data = doc.data();
                updateHeader(data.firstName, data.address);
            } else {
                console.error("No document found for UID:", uid);
            }
        })
        .catch((error) => {
            console.error("Error fetching user data:", error);
        });
}

// Update Header
function updateHeader(username, location) {
    const userIcon = document.querySelector('.icon-user span');
    const locationText = document.querySelector('.location-text');

    if (userIcon) {
        console.log("Updating username in header:", username);
        userIcon.innerText = username;
    } else {
        console.error("User button span element not found.");
    }

    if (locationText) {
        console.log("Updating location in header:", location);
        locationText.innerText = location;
    } else {
        console.error("Location text span element not found.");
    }
}



