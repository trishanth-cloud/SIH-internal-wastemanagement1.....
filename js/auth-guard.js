import { auth } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";

// Only protect actual dashboard pages.
// Delay the redirect to avoid fighting the initial Firebase auth restoration callback.
onAuthStateChanged(auth, (user) => {
    const currentPath = window.location.pathname;
    const pageName = currentPath.split('/').pop();

    if (!user) {
        if (pageName === "dashboard.html" || pageName === "admin.html") {
            console.warn("Security Alert: No active session detected yet. Waiting briefly for auth restoration.");
            setTimeout(() => {
                if (!auth.currentUser && (window.location.pathname.endsWith("dashboard.html") || window.location.pathname.endsWith("admin.html"))) {
                    window.location.href = "index.html";
                }
            }, 1200);
        }
        return;
    }

    // Allow signed-in users to stay on the login page until they choose to log out manually.
    if (pageName === "index.html" || pageName === "user-login.html" || pageName === "admin-login.html") {
        return;
    }
});
