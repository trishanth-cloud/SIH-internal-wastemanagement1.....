import { auth, db, doc, getDoc } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";

// Monitor active user sessions and verify their role
onAuthStateChanged(auth, async (user) => {
    const currentPath = window.location.pathname;

    if (!user) {
        if (!currentPath.includes("index.html") && !currentPath.includes("user-login.html") && !currentPath.includes("admin-login.html")) {
            console.warn("Security Alert: No active session. Redirecting to portal.");
            window.location.href = "index.html";
        }
        return;
    }

    if (!(currentPath.includes("dashboard.html") || currentPath.includes("admin.html"))) {
        return;
    }

    try {
        const uid = user.uid;
        const userDocRef = doc(db, "users", uid);
        const adminDocRef = doc(db, "admins", uid);

        const [userDoc, adminDoc] = await Promise.all([
            getDoc(userDocRef),
            getDoc(adminDocRef)
        ]);

        const userRole = userDoc.exists() ? userDoc.data().role : null;
        const adminRole = adminDoc.exists() ? adminDoc.data().role : null;

        if (currentPath.includes("admin.html")) {
            if (adminRole !== "admin") {
                console.warn("Security Alert: Non-admin user trying to access admin panel. Redirecting to user dashboard.");
                window.location.href = "dashboard.html";
            }
        } else if (currentPath.includes("dashboard.html")) {
            if (userRole !== "user") {
                console.warn("Security Alert: Non-user trying to access user dashboard. Redirecting to admin panel.");
                window.location.href = "admin.html";
            }
        }
    } catch (error) {
        console.error("Auth guard error:", error);
        window.location.href = "index.html";
    }
});
