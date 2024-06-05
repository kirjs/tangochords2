<script setup lang="ts">
import { computed } from 'vue';

const { chord } = defineProps({
  chord: String,
});

const hasChord = computed(() => {
  return chord?.trim() !== '';
});
</script>

<template>
  <span v-if="hasChord" class="chord">{{ chord }}</span>
  <span v-if="!hasChord">{{ chord }}</span>
</template>

<style scoped>
.chord {
  color: #0b518a;
  font-weight: 600;
}
</style>
