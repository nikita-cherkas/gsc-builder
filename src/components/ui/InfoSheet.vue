<script setup lang="ts">
import type { OptionInfo } from '@/types'
import { ArrowLeft } from 'lucide-vue-next'

interface Props {
  title: string
  subtitle?: string
  info: OptionInfo
}

defineProps<Props>()

const emit = defineEmits<{
  (e: 'back'): void
}>()
</script>

<template>
  <div class="info-sheet">
    <div class="info-sheet__head">
      <button
        type="button"
        class="info-sheet__back"
        aria-label="Back"
        @click="emit('back')"
      >
        <ArrowLeft />
      </button>
      <div class="info-sheet__head-text">
        <div v-if="subtitle" class="info-sheet__subtitle">{{ subtitle }}</div>
        <h3 class="info-sheet__title">{{ title }}</h3>
      </div>
    </div>

    <div class="info-sheet__paragraphs">
      <p v-for="(p, i) in info.paragraphs" :key="i" class="info-sheet__paragraph">
        {{ p }}
      </p>
    </div>

    <div v-if="info.facts && info.facts.length > 0" class="info-sheet__facts">
      <div class="info-sheet__facts-title">Key facts</div>
      <dl class="info-sheet__facts-grid">
        <div v-for="f in info.facts" :key="f.label" class="info-sheet__fact">
          <dt class="info-sheet__fact-label">{{ f.label }}</dt>
          <dd class="info-sheet__fact-value">{{ f.value }}</dd>
        </div>
      </dl>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/colors' as colors;
@use '@/styles/base' as base;

.info-sheet {
  display: flex;
  flex-direction: column;
  gap: 14px;

  &__head {
    display: flex;
    align-items: flex-start;
    gap: 8px;
  }

  &__back {
    flex-shrink: 0;
    width: 32px;
    height: 32px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: none;
    background: transparent;
    color: colors.$gray;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.2s ease, color 0.2s ease;

    svg {
      width: 16px;
      height: 16px;
    }

    @media (hover: hover) {
      &:hover {
        background: colors.$gray-10;
        color: colors.$black;
      }
    }
  }

  &__head-text {
    flex: 1;
    min-width: 0;
  }

  &__subtitle {
    color: colors.$gray;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__title {
    color: colors.$black;
    font-size: 17px;
    font-weight: 600;
    line-height: 1.2;
    @include base.font-secondary;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__paragraphs {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  &__paragraph {
    color: colors.$gray-900;
    font-size: 13px;
    line-height: 1.55;
  }

  &__facts {
    padding-top: 4px;
  }

  &__facts-title {
    color: colors.$gray;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    margin-bottom: 8px;
  }

  &__facts-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    margin: 0;
  }

  &__fact {
    padding: 10px 12px;
    border: 1px solid colors.$gray-300;
    background: colors.$white;
    border-radius: 8px;
  }

  &__fact-label {
    color: colors.$gray;
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  &__fact-value {
    margin-top: 4px;
    color: colors.$black;
    font-size: 13px;
    font-weight: 600;
  }
}
</style>
