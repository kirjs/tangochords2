<template>
  <div class="bar">
    <div class="up-down panel">
      <button @click="transposeUp">
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 4L4 12H8V20H16V12H20L12 4Z" fill="currentColor" />
        </svg>
      </button>
      <span class="key">{{
        props.songKey ?? (props.shift > 0 ? '+' : '') + props.shift
      }}</span>
      <button @click="transposeDown">
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 20L20 12H16V4H8V12H4L12 20Z" fill="currentColor" />
        </svg>
      </button>
    </div>
    <div class="tones panel" v-if="simpleKeys.length || magicKey">
      <button
        v-for="k of simpleKeys"
        :key="k"
        @click="() => transposeTo(k)"
        :disabled="props.songKey === k"
      >
        {{ k }}
      </button>
      <button        
        @click="() => transposeByNTones(magicKey.shift)"
        :disabled="magicKey.shift === 0"
      >
        {{ magicKey.chordName }} 🪄
      </button>
    </div>
  </div>
</template>

<script setup>
import { defineEmits, defineProps, computed } from 'vue';
import { analyzeSong } from '../chords/analysis.ts';
import {
  transposeChord,
  isMajorKey,
  isMinorKey,
  calcKeyDifference,
} from '../chords/chords.ts';

const props = defineProps({
  songKey: String,
  shift: {
    type: Number,
    required: true,
  },
  transposedSong: Array,
});

const emit = defineEmits(['update:shift']);

const magicKey = computed(() => {
  const {bestKey} = analyzeSong(props.transposedSong, 'Am');

  return {
    chordName: props.songKey
      ? transposeChord(props.songKey, bestKey.shift)
      : undefined,
    ...bestKey,
  };
});

const simpleKeys = computed(() => {
  if (!props.songKey) {
    return [];
  }

  if (isMajorKey(props.songKey)) {
    return ['C', 'G'].filter((c) => c !== magicKey.value.chordName);
  }

  if (isMinorKey(props.songKey)) {
    return ['Am', 'Em'].filter((c) => c !== magicKey.value.chordName);
  }

  return [];
});

const transposeUp = () => {
  emit('update:shift', props.shift + 1);
};

const transposeByNTones = (n) => {
  emit('update:shift', props.shift + n);
};

const transposeTo = (newKey) => {
  transposeByNTones(calcKeyDifference(props.songKey, newKey));
};

const transposeDown = () => {
  emit('update:shift', props.shift - 1);
};
</script>

<style scoped lang="scss">
.bar {
  display: flex;
  gap: 8px;

  .panel {
    padding: 4px;
    display: flex;
    border-radius: 8px;
    background: rgb(225, 235, 255);
    display: flex;
    align-items: center;
    font-size: 13px;
  }

  button {
    background: transparent;
    padding: 8px;
    border-radius: 8px;
    cursor: pointer;
    border: 0 solid;

    &:hover {
      background-color: aliceblue;
    }
  }

  .key {
    font-size: 13px;
    padding: 8px;
    display: block;
    border-radius: 4px;
    min-width: 24px;
    text-align: center;

    cursor: pointer;
  }
}
</style>
