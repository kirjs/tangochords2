import { initializeApp } from "firebase/app";
import { 
    getAuth, 
    signInWithPopup, 
    GoogleAuthProvider, 
    signOut, 
    onAuthStateChanged, 
    type User 
} from "firebase/auth";
import { ref } from "vue";

const firebaseConfig = {
    apiKey: "AIzaSyCfY1kGu6IuEu2UD2NSQ2l1RKqDfpsaK-A",
    authDomain: "tango-chords.firebaseapp.com",
    projectId: "tango-chords",
    storageBucket: "tango-chords.firebasestorage.app",
    messagingSenderId: "153539945404",
    appId: "1:153539945404:web:2f68d9761c27391f3f41b9",
    measurementId: "G-E8BEF2XH4S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// User authentication state
export const currentUser = ref<User | null>(null);
export const isAuthenticated = ref(false);
export const authError = ref<string | null>(null);
export const isAuthLoading = ref(true);

// Setup auth state listener
onAuthStateChanged(auth, (user) => {
    currentUser.value = user;
    isAuthenticated.value = !!user;
    isAuthLoading.value = false;
});

// Firebase authentication service
export const firebaseAuth = {
    async loginWithGoogle(): Promise<boolean> {
        try {
            authError.value = null;
            isAuthLoading.value = true;
            await signInWithPopup(auth, googleProvider);
            return true;
        } catch (error) {
            authError.value = getAuthErrorMessage(error);
            return false;
        } finally {
            isAuthLoading.value = false;
        }
    },

    async logout(): Promise<void> {
        try {
            isAuthLoading.value = true;
            await signOut(auth);
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            isAuthLoading.value = false;
        }
    },

    getCurrentUser(): User | null {
        return currentUser.value;
    }
};

// Helper function to get readable error messages
function getAuthErrorMessage(error: unknown): string {
    if (error instanceof Error) {
        const errorCode = (error as FirebaseError)?.code || "";
        
        switch (errorCode) {
            case 'auth/popup-closed-by-user':
                return 'Login popup was closed before completion.';
            case 'auth/cancelled-popup-request':
                return 'Login cancelled.';
            case 'auth/popup-blocked':
                return 'Login popup was blocked by the browser.';
            case 'auth/account-exists-with-different-credential':
                return 'An account already exists with the same email address but different sign-in credentials.';
            default:
                return error.message || 'An unknown error occurred.';
        }
    }
    return 'An unknown error occurred.';
}

interface FirebaseError extends Error {
    code?: string;
} 