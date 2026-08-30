import { auth } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";

// Monitor active user sessions to block unauthorized access
onAuthStateChanged(auth, (user) => {
    if (!user) {
        // No session found: Send user back to login screen
        console.warn("Security Alert: Access denied. Redirecting to login portal.");
        window.location.href = "index.html";
    } else {
        // Active session found: Protect admin views from normal users
        const emailPrefix = user.email ? user.email.toLowerCase() : "";
        const currentPath = window.location.pathname;

        if (currentPath.includes("admin.html") && !emailPrefix.startsWith("admin")) {
            console.warn("Security Alert: Access restricted. Redirecting to user hub.");
            window.location.href = "dashboard.html";
        }
    }
});
