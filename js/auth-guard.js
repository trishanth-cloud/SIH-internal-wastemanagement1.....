import { auth } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";

// Only redirect when there is truly no active authenticated user on a protected page.
onAuthStateChanged(auth, (user) => {
    const currentPath = window.location.pathname;

    if (!user) {
        if (currentPath.includes("dashboard.html") || currentPath.includes("admin.html")) {
            console.warn("Security Alert: No active session. Redirecting to portal.");
            window.location.href = "index.html";
        }
        return;
    }

    if (currentPath.includes("user-login.html") || currentPath.includes("admin-login.html")) {
        if (currentPath.includes("user-login.html")) {
            window.location.href = "dashboard.html";
        } else if (currentPath.includes("admin-login.html")) {
            window.location.href = "admin.html";
        }
    }
});
