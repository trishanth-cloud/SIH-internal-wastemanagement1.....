import { auth, db, doc, collection, getDoc } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";

// Monitor active user sessions and verify their role
onAuthStateChanged(auth, async (user) => {
    if (!user) {
        // No session found: Send user back to login screen
        console.warn("Security Alert: No active session. Redirecting to portal.");
        window.location.href = "index.html";
    } else {
        const currentPath = window.location.pathname;
        const uid = user.uid;

        try {
            // Check if user is in users collection
            const userDocRef = doc(collection(db, "users"), uid);
            const userDoc = await getDoc(userDocRef);

            // Check if user is in admins collection
            const adminDocRef = doc(collection(db, "admins"), uid);
            const adminDoc = await getDoc(adminDocRef);

            // Route based on role and current page
            if (currentPath.includes("admin.html")) {
                // Accessing admin page
                if (!adminDoc.exists()) {
                    console.warn("Security Alert: User role mismatch. Redirecting to user dashboard.");
                    window.location.href = "dashboard.html";
                }
            } else if (currentPath.includes("dashboard.html")) {
                // Accessing user dashboard
                if (!userDoc.exists()) {
                    console.warn("Security Alert: Admin accessing user page. Redirecting to admin panel.");
                    window.location.href = "admin.html";
                }
            }
        } catch (error) {
            console.error("Auth guard error:", error);
        }
    }
});
