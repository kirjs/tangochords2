<template>
    <div>
      <button @click="accelerate" :disabled="scrollSpeed > 2.5">        
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16"><path fill="currentColor" fillRule="evenodd" d="M10 14a2 2 0 1 1-4 0a2 2 0 0 1 4 0m1.78-8.841a.75.75 0 0 0-1.06 0l-1.97 1.97V.75a.75.75 0 0 0-1.5 0v6.379l-1.97-1.97a.75.75 0 0 0-1.06 1.06l3.25 3.25L8 10l.53-.53l3.25-3.25a.75.75 0 0 0 0-1.061" clipRule="evenodd"></path></svg>
      </button>
      <span class="speed">{{ scrollSpeed }}</span>
      <button @click="decelerate" :disabled="scrollSpeed === 0">
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16"><path fill="currentColor" fillRule="evenodd" d="M10 2a2 2 0 1 0-4 0a2 2 0 0 0 4 0m1.78 8.841a.75.75 0 0 1-1.06 0l-1.97-1.97v6.379a.75.75 0 0 1-1.5 0V8.871l-1.97 1.97a.75.75 0 1 1-1.06-1.06l3.25-3.25L8 6l.53.53l3.25 3.25a.75.75 0 0 1 0 1.061" clipRule="evenodd"></path></svg>
      </button>
    </div>
  </template>
  
  <script setup>
  import { ref, onUnmounted } from 'vue'

  const scrollSpeedDiff = 0.5;
  
  const scrollSpeed = ref(0)
  let scrollInterval = null
  
  const accelerate = () => {
    scrollSpeed.value += scrollSpeedDiff
    updateScrolling()
  }
  
  const decelerate = () => {
    scrollSpeed.value = Math.max(0, scrollSpeed.value - scrollSpeedDiff)
    updateScrolling()
  }
  
  const updateScrolling = () => {
    if (scrollInterval) {
      clearInterval(scrollInterval)
    }
    
    if (scrollSpeed.value > 0) {
      scrollInterval = setInterval(() => {
        window.scrollBy(0, scrollSpeed.value)
      }, 16) 
    }
  }
  
  onUnmounted(() => {
    if (scrollInterval) {
      clearInterval(scrollInterval)
    }
  })
  </script>
  
  <style>
  button {
    background: transparent;
    border: 0 solid;
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
  </style>