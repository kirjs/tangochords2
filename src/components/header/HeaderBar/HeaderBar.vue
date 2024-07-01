<template>
    <div class="bar">
        <div class="title">
            <a href="/" style="text-decoration: none" class="home">🏡</a>
            <SongSelect client:only="vue"></SongSelect>
        </div>

    </div>
</template>

<script setup lang="ts">
import SongSelect from '../SelectSong/SelectSong.vue';



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
    gap: 8px;
    margin-bottom: 16px;
    position: sticky;
    top: 0;
    background: linear-gradient(to top, white, rgb(241, 245, 254));
    box-shadow: 0px 0px 10px #a5a5a5;
}
</style>