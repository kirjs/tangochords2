<template>
  <div class="wrapper">
    <div class="bar">
      <button @click="transposeUp">🔺</button>
      <span class="key">{{key ?? '?'}}</span>
      <button @click="transposeDown">🔻</button>

      <button v-for="k of simpleKeys" @click="() => transposeTo(k)"
        :disabled="key===k"
        >{{k}}</button>
    </div>
    <div class="song">
      <div v-for="line in transposedSong" :key="line">
        <template v-if="line.type === 'chordsLine'">
          <div class="chords-line line">
            <Chord v-for="chord in line.value" :key="chord" :chord="chord.chord"></Chord>
          </div>
        </template>
        <template v-if="line.type === 'lyricsLine'">
          <div class="line">{{ line.value }}</div>
        </template>
        <template v-if="line.type === 'tagLine'">
          <div :class="[line.value.toLowerCase(), 'tag-line']" >
            <div class="tag" >{{ line.value }}</div></div>
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
import { parseChords, transpose, transposeChord, isMinorKey,calcKeyDifference, isMajorKey } from "../chords/chords.ts";
import { computed, ref } from "vue";
import Chord from "./Chord.vue";

const { song } = defineProps(['song'])

const transposeTones = ref(0);

const parsedSong = computed(() => {
  return parseChords({ text: song.body });
});

const key = computed(() => {
  if (song.data?.key) {
    return transposeChord(song.data.key, transposeTones.value);
  } else {
    return undefined;
  }
});

const simpleKeys = computed(() => {
  if(!key.value){
    return [];
  }
  
  if(isMajorKey(key.value)){
    return ['C', 'G']
  }

  if(isMinorKey(key.value)){
    return ['Am', 'Em']
  }
});

const transposedSong = computed(() => {  
  return transpose(parsedSong.value, transposeTones.value);
});


const transposeUp = () => {
  transposeTones.value += 1;
};

const transposeTo = (newKey) => {
  transposeTones.value += calcKeyDifference(key.value, newKey);  
};

const transposeDown = () => {
  transposeTones.value -= 1;
};
</script>

<style scoped>
.wrapper {
  margin: auto;
}

.song {
  font-family: monospace;
}

.line {
  margin-bottom: 12px;
  display: flex;
}


.empty-line {
  margin-top: 24px;
  /* border-bottom: 1px #ddd solid; */
  margin-bottom: 24px;
}

.bar {
  margin-bottom: 24px;
  display: flex;
  align-items: center;
}

button {
  background: #eee;
  border: 1px #dddddd solid;
  padding: 8px;
  border-radius: 4px;
  margin-right: 4px;
  cursor: pointer;
}

.tag-line.chorus {
  border-top: 1px  rgb(215, 255, 155) solid;
}

.tag-line.chorus .tag {
  background: rgb(215, 255, 155);
}
.tag-line {
  border-top: 1px rgb(255, 248, 154) solid;
  margin-bottom: 24px;
}

.tag {
  background:rgb(255, 248, 154);
  width: 100px;
  padding: 8px;
  border-radius: 0  0 8px 8px;
}

.key {
  background: #fff;  
  padding: 8px 16px;
  display: block;
  border-radius: 4px;
  margin-right: 4px;
  cursor: pointer;
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
