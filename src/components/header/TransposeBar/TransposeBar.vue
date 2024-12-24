<template>
  <div class="bar">
    <div class="title">
      <a href="/" style="text-decoration: none" class="home">🏡</a>
      <SongSelect client:only="vue"></SongSelect>
    </div>

    <div class="notation panel" v-if="key">
      <select v-model="notation">
        <option value="A">A</option>
        <option value="i">i</option>
      </select>
    </div>

    <div class="up-down panel" v-if="notation === 'A'">
      <button @click="() => transposeTones(1)">
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 4L4 12H8V20H16V12H20L12 4Z" fill="currentColor" />
        </svg>
      </button>
      <span class="key">{{ key ?? (shift > 0 ? "+" : "") + shift }}</span>
      <button @click="() => transposeTones(-1)">
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 20L20 12H16V4H8V12H4L12 20Z" fill="currentColor" />
        </svg>
      </button>
    </div>
    <template v-if="notation === 'A'">
      <div class="tones panel" v-if="simpleKeys.length || magicKey">
        <button
          v-for="k of simpleKeys"
          :key="k"
          @click="() => transposeToKey(k)"
          :disabled="key === k"
        >
          {{ k }}
        </button>
        <button
          @click="() => transposeTones(magicKey.shift)"
          :disabled="magicKey.shift === 0"
        >
          {{ magicKey.chordName }} 🪄
        </button>
      </div>
    </template>
    <div class="autoscroll panel" v-if="simpleKeys.length || magicKey">
      <AutoScroll />
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject } from "vue";
import SongSelect from "../SelectSong/SelectSong.vue";
import { castExists } from "../../../chords/asserts";
import { useTransposeStore } from "./transpose.store";
import AutoScroll from "../../AutoScroll.vue";

const {
  shift,
  key,
  magicKey,
  simpleKeys,
  transposeTones,
  transposeToKey,
  notation,
} = castExists(inject<ReturnType<typeof useTransposeStore>>("transpose-store"));
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
  background: rgb(241, 245, 254);
  box-shadow: 0px 0px 10px #a5a5a5;
  .panel {
    padding: 4px;
    display: flex;
    border-radius: 8px;
    background: rgb(225, 235, 255);
    display: flex;
    align-items: center;
    font-size: 13px;
  }

  button {
    background: transparent;
    padding: 8px;
    border-radius: 8px;
    cursor: pointer;
    border: 0 solid;

    &:hover {
      background-color: aliceblue;
    }
  }

  .key {
    font-size: 13px;
    padding: 8px;
    display: block;
    border-radius: 4px;
    min-width: 24px;
    text-align: center;

    cursor: pointer;
  }
}
</style>
