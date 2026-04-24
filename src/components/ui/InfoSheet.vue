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
  <div class="space-y-3">
    <div class="flex items-start gap-2 -mt-1">
      <button
        type="button"
        class="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition"
        aria-label="Back"
        @click="emit('back')"
      >
        <ArrowLeft class="h-4 w-4" />
      </button>
      <div class="min-w-0 flex-1">
        <div v-if="subtitle" class="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold truncate">
          {{ subtitle }}
        </div>
        <h3 class="font-semibold text-[16px] text-foreground leading-tight truncate">
          {{ title }}
        </h3>
      </div>
    </div>

    <div class="space-y-3">
      <p
        v-for="(p, i) in info.paragraphs"
        :key="i"
        class="text-[13px] text-sub leading-relaxed"
      >
        {{ p }}
      </p>
    </div>

    <div v-if="info.facts && info.facts.length > 0" class="pt-2">
      <div class="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">
        Key facts
      </div>
      <dl class="grid grid-cols-2 gap-2">
        <div
          v-for="f in info.facts"
          :key="f.label"
          class="rounded-md border border-border bg-card p-2.5"
        >
          <dt class="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
            {{ f.label }}
          </dt>
          <dd class="text-[13px] font-semibold text-foreground mt-1">{{ f.value }}</dd>
        </div>
      </dl>
    </div>
  </div>
</template>
