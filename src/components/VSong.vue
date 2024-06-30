<template>
  <div class="wrapper">

    <TransposeBar />
    <div class="song">
      <div :class="[
        'line',
        line.type,
        'tag' in line && line.tag,
        'sectionEnd' in line && line.sectionEnd ? 'section-end' : '',
      ]" v-for="(line, i) in transposedSong" :key="i">
        <template v-if="line.type === 'chordsLine'">
          <template v-for="(chord, chordIndex) in line.value" :key="chordIndex">
            <SongChord v-if="chord.chord" :chord="chord.chord"></SongChord>
          </template>
        </template>
        <template v-if="line.type === 'lyricsLine'">
          {{ line.value }}
        </template>
        <template v-if="line.type === 'tagLine'">
          <div class="tag">{{ line.value }}</div>
        </template>
        <template v-if="line.type === 'chordsAndLyricsLine'">
          <div v-for="(item, index) in line.value" :key="index">
            <div class="chord-or-spacer">
              <SongChord v-if="item.chord" :chord="item.chord"> </SongChord>{{ " ".repeat(Math.max(0, item.length -
                (item.chord ? item.chord.length : 0))) }}
            </div>
            <div class="lyrics">{{ item.lyrics }}</div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject } from "vue";

import SongChord from "./SongChord.vue";
import TransposeBar from "./header/TransposeBar/TransposeBar.vue";

import { castExists } from "../chords/asserts.ts";
import type { useSongStore } from "../store/song.store.ts";
import type { useTransposeStore } from "./header/TransposeBar/transpose.store.ts";

const { song } = castExists(inject<ReturnType<typeof useSongStore>>("song-store"));
const { transposedSong } = castExists(inject<ReturnType<typeof useTransposeStore>>("transpose-store"));
</script>
<style scoped lang="scss">
.wrapper {
  margin: auto;

  .song {
    padding: 0 24px;
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
    "verse": rgb(255, 248, 154),
    "chorus": rgb(215, 255, 155),
    "bridge": rgb(255, 232, 232),
    "intro": rgb(240, 240, 240),
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
