<script setup lang="ts">
import BaseIcon from '@/components/base/icon/BaseIcon.vue'

interface Props {
  sectionTitle?: string
  title: string
  description?: string
  withModal?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  withModal: true,
})

const emit = defineEmits<{
  (e: 'open-modal'): void
}>()
</script>

<template>
  <div class="step">
    <div class="step__header">
      <div v-if="props.sectionTitle" class="step__section-title">
        {{ props.sectionTitle }}
      </div>

      <div class="step__row">
        <h3 class="step__title">{{ props.title }}</h3>

        <BaseIcon
          v-if="props.withModal"
          icon="icon-info"
          class="step__icon"
          @click="emit('open-modal')"
        />
      </div>
    </div>

    <div
      v-if="props.description"
      v-html="props.description"
      class="step__description"
    ></div>

    <slot />

    <div v-if="$slots['seo-content']" class="sr-only">
      <slot name="seo-content" />
    </div>
  </div>
</template>

<style scoped lang="scss">
@use 'Step';
</style>
