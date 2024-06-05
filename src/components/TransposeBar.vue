<template>
  <div class="bar">
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
    <span class="key">{{ props.songKey ?? '?' }}</span>
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
    |
    <button
      v-for="k of simpleKeys" 
      :key="k"
      @click="() => transposeTo(k)"
      :disabled="props.songKey === k"
    >
      {{ k }}
    </button>
    <button
      v-if="magicKey"
      @click="() => transposeByNTones(magicKey.shift)"
      :disabled="magicKey.shift === 0"
    >
      {{ magicKey.chordName }}
    </button>
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

const simpleKeys = computed(() => {
  if (!props.songKey) {
    return [];
  }

  if (isMajorKey(props.songKey)) {
    return ['C', 'G'];
  }

  if (isMinorKey(props.songKey)) {
    return ['Am', 'Em'];
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
  emit('update:shift', calcKeyDifference(props.songKey, newKey));
};

const transposeDown = () => {
  emit('update:shift', props.shift - 1);
};

const magicKey = computed(() => {
  const { bestKey } = analyzeSong(props.transposedSong);

  return {
    chordName: props.songKey
      ? transposeChord(props.songKey, bestKey.shift)
      : undefined,
    ...bestKey,
  };
});
</script>

<style scoped lang="scss">
.bar {
  padding: 8px;
  border-radius: 8px;

  display: flex;
  align-items: center;
  background: rgb(225, 235, 255);
  font-size: 13px;

  button {
    background: transparent;
    padding: 8px;
    cursor: pointer;
    border: 0 solid;

    &:hover {
      background-color: aliceblue;
    }
  }

  .key {
    font-size: 13px;
    padding: 8px 0px;
    display: block;
    border-radius: 4px;

    cursor: pointer;
  }
}
</style>
