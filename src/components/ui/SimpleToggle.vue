<script setup lang="ts">
import { formatPrice } from '@/lib/formatters'
import { cn } from '@/lib/utils'
import InfoButton from './InfoButton.vue'

interface Props {
  active: boolean
  title: string
  description?: string
  price?: number
  withInfo?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  description: '',
  withInfo: false,
})

const emit = defineEmits<{
  (e: 'toggle'): void
  (e: 'info'): void
}>()
</script>

<template>
  <div
    :class="cn(
      'flex items-start gap-3 rounded-lg border bg-card p-4 transition',
      active ? 'border-primary' : 'border-border hover:border-foreground/30',
    )"
  >
    <button
      type="button"
      :aria-pressed="active"
      class="flex-1 min-w-0 text-left"
      @click="emit('toggle')"
    >
      <div class="flex items-center justify-between gap-3 mb-1.5">
        <span class="font-medium text-[15px] text-foreground">{{ title }}</span>
        <span class="flex items-center gap-3 shrink-0">
          <span
            v-if="props.price !== undefined"
            :class="cn(
              'text-[11px] font-semibold uppercase tracking-wider',
              active ? 'text-primary' : 'text-muted-foreground',
            )"
          >
            +{{ formatPrice(props.price) }}
          </span>
          <span
            :class="cn(
              'relative h-5 w-9 rounded-full transition-colors',
              active ? 'bg-primary' : 'bg-black/15',
            )"
          >
            <span
              :class="cn(
                'absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-[left] duration-200',
                active ? 'left-[18px]' : 'left-0.5',
              )"
            />
          </span>
        </span>
      </div>
      <p v-if="description" class="text-[12.5px] text-muted-foreground leading-snug">
        {{ description }}
      </p>
    </button>
    <InfoButton
      v-if="withInfo"
      :aria-label="`More about ${title}`"
      @click="emit('info')"
    />
  </div>
</template>
