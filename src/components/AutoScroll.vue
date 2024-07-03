<template>
  <div>
    <button @click="toggleScroll" :disabled="isScrolling && scrollProgress >= 1">
      {{ isScrolling ? 'Stop' : 'Start' }}
    </button>
    <button @click="togglePause" :disabled="!isScrolling">
      {{ isPaused ? 'Resume' : 'Pause' }}
    </button>
    <span class="speed">{{ Math.round(scrollProgress * 100) }}%</span>
    <input type="number" v-model="totalDuration" class="length">
    <div v-if="isScrolling" class="scroll-indicator" :style="indicatorStyle" @click="togglePause">
      <div class="inner-dot"></div>
    </div>
    <div class="scroll-line"></div>
  </div>
</template>

<script setup lang="ts">
import { useLocalStorage } from '@vueuse/core';
import { ref, computed, onMounted, onUnmounted, inject } from 'vue'
import { castExists } from '../chords/asserts';
import type { useSongStore } from '../store/song.store';
const { song } = castExists(inject<ReturnType<typeof useSongStore>>('song-store'));

const isScrolling = ref(false)
const isPaused = ref(false)
const indicatorPosition = ref(0)
const scrollProgress = ref(0)
const windowHeight = ref(0)
const documentHeight = ref(0)
const totalDuration = useLocalStorage(`song.${song.value.slug}.length`, 90)
let startTime: number | null = null
let pauseStartTime: number | null = null
let totalPausedTime = 0

const midScreenPosition = computed(() => (windowHeight.value - 110) / 2)

const indicatorStyle = computed(() => ({
  top: `${indicatorPosition.value + 60}px`, // Add 60px offset to align with scroll line
}))

let animationFrame: number | null = null

const toggleScroll = () => {
  if (isScrolling.value) {
    stopScrolling()
    resetScroll()
  } else {
    startScrolling()
  }
}

const togglePause = () => {
  isPaused.value = !isPaused.value
  if (isPaused.value) {
    pauseScroll()
  } else {
    resumeScroll()
  }
}

const startScrolling = () => {
  isScrolling.value = true
  isPaused.value = false
  indicatorPosition.value = 0
  scrollProgress.value = 0
  window.scrollTo(0, 0)
  startTime = performance.now()
  totalPausedTime = 0
  animationFrame = requestAnimationFrame(scrollStep)
}

const stopScrolling = () => {
  isScrolling.value = false
  if (animationFrame !== null) {
    cancelAnimationFrame(animationFrame)
    animationFrame = null
  }
}

const resetScroll = () => {
  indicatorPosition.value = 0
  scrollProgress.value = 0
  window.scrollTo(0, 0)
  startTime = null
  pauseStartTime = null
  totalPausedTime = 0
}

const pauseScroll = () => {
  if (animationFrame !== null) {
    cancelAnimationFrame(animationFrame)
    animationFrame = null
  }
  pauseStartTime = performance.now()
}

const resumeScroll = () => {
  if (pauseStartTime !== null) {
    totalPausedTime += performance.now() - pauseStartTime
    pauseStartTime = null
  }
  if (isScrolling.value) {
    animationFrame = requestAnimationFrame(scrollStep)
  }
}

const scrollStep = (timestamp: number) => {
  if (!startTime) startTime = timestamp
  const elapsed = timestamp - startTime - totalPausedTime

  if (!isPaused.value && scrollProgress.value < 1) {
    scrollProgress.value = Math.min(elapsed / (totalDuration.value * 1000), 1)

    // Calculate indicator position consistently
    const totalDistance = midScreenPosition.value + (documentHeight.value - windowHeight.value)
    const currentDistance = scrollProgress.value * totalDistance

    if (currentDistance <= midScreenPosition.value) {
      // Moving to middle of the screen
      indicatorPosition.value = currentDistance
    } else {
      // Keep indicator at middle while scrolling
      indicatorPosition.value = midScreenPosition.value
      // Scroll the page
      window.scrollTo(0, currentDistance - midScreenPosition.value)
    }

    animationFrame = requestAnimationFrame(scrollStep)
  } else if (scrollProgress.value >= 1) {
    stopScrolling()
  }
}

onMounted(() => {
  updateDimensions()
  window.addEventListener('resize', updateDimensions)
})

onUnmounted(() => {
  stopScrolling()
  window.removeEventListener('resize', updateDimensions)
})

const updateDimensions = () => {
  windowHeight.value = window.innerHeight
  documentHeight.value = document.documentElement.scrollHeight
}
</script>

<style scoped>
button {
  background: transparent;
  border: 1px solid #ccc;
  padding: 5px 10px;
  cursor: pointer;
  margin-right: 5px;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.speed {
  margin: 0 10px;
  min-width: 30px;
  text-align: center;
  display: inline-block;
}

.scroll-indicator {
  position: fixed;
  left: 10px;
  width: 25px;
  height: 25px;
  background-color: rgba(200, 200, 200, 0.5);
  border-radius: 50%;
  z-index: 9999;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.inner-dot {
  width: 11px;
  height: 11px;
  background-color: #999;
  border-radius: 50%;
}

.scroll-line {
  position: fixed;
  left: 10px;
  top: 60px;
  width: 2px;
  height: calc(100vh - 60px);
  background-color: #ddd;
}

.length {
  width: 40px;
}
</style>