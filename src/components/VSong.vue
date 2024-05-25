<template>
  <div>
    <button @click="transposeUp">👆</button>
    <button @click="transposeDown">👇</button>
    <div class="song">
      <div v-for="line in transposedSong">
        <template v-if="line.type === 'chordsLine'">
          <div class="chords-line line">
            <Chord v-for="chord in line.value" :chord="chord.chord"></Chord>
          </div>
        </template>
        <template v-if="line.type === 'lyricsLine'"
        >
          <div class="line">{{ line.value }}</div>
        </template>
        <template v-if="line.type === 'chordsAndLyricsLine'">
          <div class="chords-and-lyrics-line line">
            <div v-for="item in line.value">
              <div class="chord-or-spacer">
                <Chord v-if="item.chord" :chord="item.chord">

                </Chord>{{ ' '.repeat(Math.max(0, item.length - item.chord.length)) }}
              </div>
              <div>{{ item.lyrics }}</div>
            </div>
          </div>
        </template>

        <div v-if="line.type === 'emptyLine'" class="line empty-line"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {parseChords, transpose} from "../chords/chords.ts";
import {computed, ref} from "vue";
import Chord from "./Chord.vue";

const {song} = defineProps(['song'])

const transposeTones = ref(0);


const parsedSong = computed(() => {
  return parseChords({text: song.body});
});

const transposedSong = computed(() => {
  return transpose(parsedSong.value, transposeTones.value);
});


const transposeUp = () => {
  transposeTones.value += 1;
};

const transposeDown = () => {
  transposeTones.value -= 1;
};
</script>

<style scoped>
.song {
  font-family: monospace;
}

.line {
  margin-bottom: 12px;
  display: flex;
}


.empty-line {
  margin-top: 24px;
  border-bottom: 1px #ddd solid;
  margin-bottom: 24px;
}

button {
  background: #fff;
  border: 1px #dddddd solid;
  padding: 20px;
  border-radius: 50%;
}

.chords-and-lyrics-line {
  display: flex;
  flex-wrap: wrap;
  white-space: pre;
}


.chord-or-spacer {
  white-space: pre;
}
</style>

