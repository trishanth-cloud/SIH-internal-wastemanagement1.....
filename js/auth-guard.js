import { auth, db, doc, getDoc } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";

// Monitor active user sessions and verify their role
onAuthStateChanged(auth, async (user) => {
    if (!user) {
        // No session found: Send user back to login screen
        const currentPath = window.location.pathname;
        if (!currentPath.includes("index.html") && !currentPath.includes("user-login.html") && !currentPath.includes("admin-login.html")) {
            console.warn("Security Alert: No active session. Redirecting to portal.");
            window.location.href = "index.html";
        }
    } else {
        const currentPath = window.location.pathname;
        const uid = user.uid;

        // Only check role routing on dashboard and admin pages
        if (currentPath.includes("dashboard.html") || currentPath.includes("admin.html")) {
            try {
                // Check if user is in users collection (regular user)
                const userDocRef = doc(db, "users", uid);
                const userDoc = await getDoc(userDocRef);
                const isUser = userDoc.exists();

                // Check if user is in admins collection (admin)
                const adminDocRef = doc(db, "admins", uid);
                const adminDoc = await getDoc(adminDocRef);
                const isAdmin = adminDoc.exists();

                // Route based on role and current page
                if (currentPath.includes("admin.html")) {
                    // User trying to access admin page
                    if (!isAdmin) {
                        console.warn("Security Alert: Non-admin user trying to access admin panel. Redirecting to user dashboard.");
                        window.location.href = "dashboard.html";
                    }
                } else if (currentPath.includes("dashboard.html")) {
                    // User trying to access dashboard
                    if (!isUser) {
                        console.warn("Security Alert: Non-user trying to access user dashboard. Redirecting to admin panel.");
                        window.location.href = "admin.html";
                    }
                }
            } catch (error) {
                console.error("Auth guard error:", error);
            }
        }
    }
});
