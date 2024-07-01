<template>
    <SongsStoreProvider :songs="songs">
        <SongStoreProvider>
            <HeaderBar />
        </SongStoreProvider>
    </SongsStoreProvider>
</template>

<script setup lang="ts">
const { songs } = defineProps(["songs"]);
import HeaderBar from '../HeaderBar/HeaderBar.vue';
import SongsStoreProvider from '../../../store/SongsStoreProvider.vue';
import SongStoreProvider from '../../../store/SongStoreProvider.vue';

</script>