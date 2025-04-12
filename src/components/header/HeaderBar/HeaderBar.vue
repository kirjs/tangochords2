<template>
    <div class="bar">
        <div class="title">
            <a href="/" style="text-decoration: none" class="home">🏡</a>
            <SongSelect client:only="vue"></SongSelect>
        </div>
        
        <div class="auth-section">
            <span v-if="isAuthLoading">Loading...</span>
            <template v-else-if="isAuthenticated">
                <span class="user-email">{{ currentUser?.email }}</span>
                <button @click="handleLogout" class="logout-btn">Logout</button>
            </template>
            <button v-else @click="handleGoogleLogin" class="login-btn">
                Login with Google
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import SongSelect from '../SelectSong/SelectSong.vue';
import { currentUser, isAuthenticated, isAuthLoading, firebaseAuth } from '../../../services/firebase';

const handleGoogleLogin = async () => {
    await firebaseAuth.loginWithGoogle();
};

const handleLogout = async () => {
    await firebaseAuth.logout();
};
</script>

<style scoped lang="scss">
.title {
    display: flex;
    align-items: center;
    gap: 8px;
}

.bar {
    padding: 8px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;
    position: sticky;
    top: 0;
    background: linear-gradient(to top, white, rgb(241, 245, 254));
    box-shadow: 0px 0px 10px #a5a5a5;
}

.auth-section {
    display: flex;
    align-items: center;
    gap: 10px;
}

.user-email {
    font-size: 0.9rem;
    color: #6c757d;
}

.login-btn {
    background-color: #4285f4;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
}

.login-btn:hover {
    background-color: #357ae8;
}

.logout-btn {
    background-color: transparent;
    border: 1px solid #dc3545;
    color: #dc3545;
    padding: 5px 10px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
}

.logout-btn:hover {
    background-color: #dc3545;
    color: white;
}
</style>