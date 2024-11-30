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
