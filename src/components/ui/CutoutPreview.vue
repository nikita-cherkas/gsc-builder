<script setup lang="ts">
import { computed } from 'vue'
import { CUTOUT_OPTIONS } from '@/data/cutout'
import type { CutoutOption } from '@/types'

interface Props {
  option: CutoutOption
  selected?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  selected: false,
})

const W = 48
const D = 24
const SW = 56
const SH = 29

const sx = SW / W
const sy = SH / D

const cuts = computed(() => CUTOUT_OPTIONS.find((c) => c.id === props.option)?.layout ?? [])

const COLORS = {
  default: '#b8a890',
  selected: '#b86820',
  bg: 'rgba(0,0,0,0.03)',
  bgSelected: 'rgba(184,104,32,0.05)',
  stroke: '#c4b49e',
  strokeSelected: '#b86820',
}

const fill = computed(() => (props.selected ? COLORS.selected : COLORS.default))
</script>

<template>
  <svg :width="SW" :height="SH" class="shrink-0">
    <rect
      x="0.5"
      y="0.5"
      :width="SW - 1"
      :height="SH - 1"
      rx="2.5"
      :fill="props.selected ? COLORS.bgSelected : COLORS.bg"
      :stroke="props.selected ? COLORS.strokeSelected : COLORS.stroke"
      stroke-width="0.8"
    />
    <template v-for="(c, i) in cuts" :key="i">
      <rect
        v-if="c.kind === 'rect'"
        :x="c.x * sx"
        :y="c.y * sy"
        :width="c.w * sx"
        :height="c.h * sy"
        :fill="fill"
        opacity="0.72"
        rx="0.6"
      />
      <circle
        v-else
        :cx="c.x * sx"
        :cy="c.y * sy"
        :r="c.r * Math.min(sx, sy)"
        :fill="fill"
        opacity="0.72"
      />
    </template>
  </svg>
</template>
