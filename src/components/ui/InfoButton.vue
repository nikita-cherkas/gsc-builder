<script setup lang="ts">
import { Info } from 'lucide-vue-next'

interface Props {
  ariaLabel?: string
}

withDefaults(defineProps<Props>(), {
  ariaLabel: 'More info',
})

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

function handleClick(event: MouseEvent) {
  event.stopPropagation()
  event.preventDefault()
  emit('click', event)
}
</script>

<template>
  <button
    type="button"
    class="info-button"
    :aria-label="ariaLabel"
    title="More info"
    @click="handleClick"
  >
    <Info />
  </button>
</template>

<style lang="scss" scoped>
@use '@/styles/colors' as colors;

.info-button {
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid colors.$gray-300;
  background: rgba(255, 255, 255, 0.8);
  color: colors.$gray;
  border-radius: 8px;
  cursor: pointer;
  transition: color 0.2s ease, border-color 0.2s ease, background 0.2s ease;

  svg {
    width: 14px;
    height: 14px;
  }

  @media (hover: hover) {
    &:hover {
      color: colors.$orange-medium;
      border-color: colors.$orange-medium;
    }
  }
}
</style>
