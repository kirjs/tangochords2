<template>
  <div class="song-list">
    <table>
      <thead>
        <tr>
          <th>Title</th>
          <th>Complexity</th>
          <th>Key</th>
          <th>Score</th>
          <th>Worst Key Score</th>
          <th>Worst Key</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="song in analyzedSongs" :key="song.slug">
          <td>
            <a :href="'songs/' + song.slug">{{ song.title }}</a>
          </td>
          <td>{{ song.complexityScore }}</td>
          <td>{{ song.key }}</td>
          <td>{{ song.sumScore }}</td>
          <td>{{ song.worstKey.sumScore }}</td>
          <td>{{ song.worstKey.score }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import type { CollectionEntry } from "astro:content"
import { analyzeSong, type SongAnalysis } from "../chords/analysis"
import { parseChords } from "../chords/chords"
import { computed } from "vue"

const props = defineProps<{
  songs: CollectionEntry<"songs_ru">[]
}>()

function getSongStats(song: CollectionEntry<"songs_ru">): SongAnalysis {
  const analysis = analyzeSong(parseChords({ text: song.body }), song.data.key)
  const bestKey = analysis.bestKey!
  const worstKey = analysis.worstKey!

  return {
    body: song.body,
    title: song.data.title,
    slug: song.slug,
    key: song.data.key,
    complexityScore: bestKey.score ? bestKey.score.toString().slice(0, 4) : 0,
    sumScore: bestKey.sumScore,
    worstKey,
    bestKey,
    allKeys: analysis.allKeys,
  }
}

const analyzedSongs = computed(() => props.songs.map(getSongStats))
</script>

<style scoped lang="scss">
.song-list {
  margin: 20px;
  overflow-x: auto;
  
  table {
    width: 100%;
    border-collapse: collapse;
    font-family: system-ui, -apple-system, sans-serif;
    
    th, td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #e2e8f0;
    }
    
    th {
      background-color: #f8fafc;
      font-weight: 600;
      color: #475569;
    }
    
    tr:hover {
      background-color: #f1f5f9;
    }
    
    a {
      color: #0b518a;
      text-decoration: none;
      font-weight: 500;
      
      &:hover {
        text-decoration: underline;
      }
    }
  }
}
</style> 