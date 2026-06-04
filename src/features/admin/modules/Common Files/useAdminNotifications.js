import { useState, useRef } from "react";

/**
 * Reusable hook for Admin notifications (Success & Error toasts)
 * Handles message state, animations (fadeOut), and automatic cleanup.
 */
export const useAdminNotifications = () => {
    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [fadeOut, setFadeOut] = useState(false);
    const successRef = useRef(null);

    // Show a success toast with auto-hide logic
    const showSuccess = (msg) => {
        setErrorMsg(""); // Clear errors
        setSuccessMsg(msg);
        setFadeOut(false);

        // Start fade out animation before removing
        const fadeTimer = setTimeout(() => {
            setFadeOut(true);
        }, 2600);

        // Completely remove message
        const clearTimer = setTimeout(() => {
            setSuccessMsg("");
            setFadeOut(false);
        }, 3000);

        return () => {
            clearTimeout(fadeTimer);
            clearTimeout(clearTimer);
        };
    };

    // Show an error toast with auto-hide logic
    const showError = (msg) => {
        setSuccessMsg(""); // Clear success
        setErrorMsg(msg);
        setFadeOut(false);

        // Start fade out animation
        const fadeTimer = setTimeout(() => {
            setFadeOut(true);
        }, 2600);

        // Completely remove message
        const clearTimer = setTimeout(() => {
            setErrorMsg("");
            setFadeOut(false);
        }, 3000);

        return () => {
            clearTimeout(fadeTimer);
            clearTimeout(clearTimer);
        };
    };

    return {
        successMsg,
        errorMsg,
        fadeOut,
        successRef,
        showSuccess,
        showError
    };
};
