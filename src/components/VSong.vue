<template>
  <div class="wrapper">
    <TransposeBar
      :songKey="key"
      v-model:shift="shift"
      :transposedSong="transposedSong"
    />
    <div class="song">
      <div
        :class="[
          'line',
          line.type,
          line.tag,
          line.sectionEnd ? 'section-end' : '',
        ]"
        v-for="line in transposedSong"
        :key="line"
      >
        <template v-if="line.type === 'chordsLine'">
          <Chord
            v-for="chord in line.value"
            :key="chord"
            :chord="chord.chord"
          ></Chord>
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
              <Chord v-if="item.chord" :chord="item.chord"> </Chord
              >{{ ' '.repeat(Math.max(0, item.length - item.chord.length)) }}
            </div>
            <div class="lyrics">{{ item.lyrics }}</div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  parseChords,
  transpose,
  transposeChord,
  calcKeyDifference,
  isMajorKey,
} from '../chords/chords.ts';
import { computed, ref } from 'vue';
import Chord from './Chord.vue';
import { tagLines } from '../chords/tag_lines.ts';
import TransposeBar from './TransposeBar.vue';

const { song } = defineProps(['song']);

const shift = ref(0);

const parsedSong = computed(() => {
  return parseChords({ text: song.body });
});

const transposedSong = computed(() => {
  return transpose(tagLines(parsedSong.value), shift.value);
});

const key = computed(() => {
  if (song.data?.key) {
    return transposeChord(song.data.key, shift.value);
  } else {
    return undefined;
  }
});
</script>

<style scoped lang="scss">
.wrapper {
  margin: auto;

  .song {
    font-family: monospace;
    display: table;
    width: auto;
  }
}

.line {
  padding: 4px 24px;
  display: flex;
  white-space: nowrap;

  .lyrics {
    white-space: pre;
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

  $tag-backgrounds: (
    'verse': rgb(255, 248, 154),
    'chorus': rgb(215, 255, 155),
    'bridge': rgb(255, 232, 232),
    'intro': rgb(240, 240, 240),
  );

  @each $tag, $color in $tag-backgrounds {
    &.tag-#{$tag} {
      background: $color;
    }
  }
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
