<template>
  <div class="wrapper">
    <div class="header">
      <h1>
        <a href="/" style="text-decoration: none">🏡</a>
        {{ song.data.title }}
      </h1>

      <div>
        <TransposeBar
          :songKey="key"
          v-model:shift="shift"
          :transposedSong="transposedSong"
        />
      </div>
    </div>

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
          <SongChord
            v-for="chord in line.value"
            :key="chord"
            :chord="chord.chord"
          ></SongChord>
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
              <SongChord v-if="item.chord" :chord="item.chord"> </SongChord
              >{{ " ".repeat(Math.max(0, item.length - item.chord.length)) }}
            </div>
            <div class="lyrics">{{ item.lyrics }}</div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { parseChords, transpose, transposeChord } from "../chords/chords.ts";
import { computed, ref, inject } from "vue";
import Select from "./Select.svelte";
import SongChord from "./SongChord.vue";
import { tagLines } from "../chords/tag_lines.ts";
import TransposeBar from "./TransposeBar.vue";

const store = inject("song-store");
const song = store.song;
const parsedSong = store.parsedSong;
const shift = store.shift;
const transposedSong = store.transposedSong;
const key = store.key;
</script>

<style scoped lang="scss">
.wrapper {
  margin: auto;

  .header {
    display: flex;
    align-items: center;
    gap: 16px;
    position: sticky;
    top: 0;
    background-color: white;
    box-shadow: 0px 5px 5px #eee;

    h1 {
      margin: 8px;
    }
  }

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
