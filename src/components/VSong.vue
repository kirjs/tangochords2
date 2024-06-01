<template>
  <div class="wrapper">
    <div class="bar">
      <button @click="transposeUp">🔺</button>
      <span class="key">{{ key ?? '?' }}</span>
      <button @click="transposeDown">🔻</button>

      <button v-for="k of simpleKeys" @click="() => transposeTo(k)" :disabled="key === k">{{ k }}</button>
      <button v-if="magicKey"  @click="() => transposeTonesNTones(magicKey.shift)" :disabled="magicKey.shift === 0">{{ magicKey.chordName }}</button>
    </div>
    <div class="song">
      <div :class="['line', line.type, line.tag, line.sectionEnd ? 'section-end' : '']" v-for="line in transposedSong"
        :key="line">
        <template v-if="line.type === 'chordsLine'">
          <Chord v-for="chord in line.value" :key="chord" :chord="chord.chord"></Chord>
        </template>
        <template v-if="line.type === 'lyricsLine'">
          {{ line.value }}
        </template>
        <template v-if="line.type === 'tagLine'">
          <div class="tag">{{ line.value }}</div>
        </template>
        <template v-if="line.type === 'chordsAndLyricsLine'">
          <div v-for="item in line.value">
            <div class="chord-or-spacer">
              <Chord v-if="item.chord" :chord="item.chord">
              </Chord>{{ ' '.repeat(Math.max(0, item.length - item.chord.length)) }}
            </div>
            <div class="lyrics">{{ item.lyrics }}</div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { parseChords, transpose, transposeChord, isMinorKey, calcKeyDifference, isMajorKey } from "../chords/chords.ts";
import { computed, ref } from "vue";
import Chord from "./Chord.vue";
import { tagLines } from "../chords/tag_lines.ts";
import { calculateBestKey } from "../chords/analysis.ts";



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
  if (!key.value) {
    return [];    
  }

  if (isMajorKey(key.value)) {
    return ['C', 'G']
  }

  if (isMinorKey(key.value)) {
    return ['Am', 'Em']
  }
});

const taggedSong = computed(() => {
  return tagLines(parsedSong.value);
});

const transposedSong = computed(() => {
  return transpose(taggedSong.value, transposeTones.value);
});


const magicKey = computed(() => {
  
  
  const bestKey = calculateBestKey(transposedSong.value);
  console.log(bestKey);

  return {
    chordName: key.value ? transposeChord(key.value, bestKey.shift) : undefined,
    ...bestKey
  };
});


const transposeUp = () => {
  transposeTones.value += 1;
};


const transposeTonesNTones = (n) => {
  transposeTones.value += n;
}

const transposeTo = (newKey) => {
  transposeTones.value += calcKeyDifference(key.value, newKey);
};

const transposeDown = () => {
  transposeTones.value -= 1;
};
</script>

<style scoped lang="scss">
.wrapper {
  margin: auto;
}


.song {
  font-family: monospace;
}

.line {
  padding: 4px 24px;
  display: flex;
}




.bar {
  margin-bottom: 24px;
  display: flex;
  align-items: center;

  button {
    background: #eee;
    border: 1px #dddddd solid;
    padding: 8px;
    border-radius: 4px;
    margin-right: 4px;
    cursor: pointer;
  }

  .key {
    background: #fff;
    padding: 8px 16px;
    display: block;
    border-radius: 4px;
    margin-right: 4px;
    cursor: pointer;
  }
}

.song {
  display: table;
  width: auto;
}

.line {
  display: table-row;

  $tag-backgrounds: (
    'verse': rgb(255, 248, 154),
    'chorus': rgb(215, 255, 155),
    'bridge': rgb(255, 232, 232),
    'intro': rgb(240, 240, 240)
  );

  @each $tag, $color in $tag-backgrounds {
    &.tag-#{$tag} {
      background: $color;
    }
  }


  &.emptyLine {
    padding: 12px 0;
  }

  &.section-end {
    border-radius: 0 0 16px 16px;
    padding-bottom: 16px;
  }

  &.tagLine {
    margin-top: 24px;
    border-radius: 16px 16px 0 0;
    padding-top: 8px;

    .tag {
      background: rgba(0, 0, 0, 0.1);
      margin-top: -8px;
      border-radius: 16px;
      padding: 4px 24px;
      margin-left: -24px;
    }
  }
}







/* 
.tag {
  background:rgb(255, 248, 154);
  width: 100px;
  padding: 8px;
  border-radius: 0  0 8px 8px;
} */



.chords-and-lyrics-line {
  display: flex;
  flex-wrap: wrap;
  white-space: pre;
}


.chord-or-spacer {
  white-space: pre;
}

.line {
  display: flex;
  white-space: nowrap;
}

.lyrics {
  white-space: pre;
}
</style>
