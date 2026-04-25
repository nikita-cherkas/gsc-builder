<script setup lang="ts">
import { computed, ref, watch, onMounted, onUnmounted } from 'vue'
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-vue-next'
import type { EquipmentItem } from '@/types'

const props = defineProps<{ selectedEquipment: EquipmentItem }>()

const activeImageIndex = ref(0)
const isFullscreen = ref(false)

const galleryImages = computed<string[]>(() => {
  const main = props.selectedEquipment.main_image_for_3d_builder
  const img = props.selectedEquipment.image
  const additional = props.selectedEquipment.additional_image_for_3d_builder
  const out: string[] = []
  if (main) out.push(main)
  if (img && img !== main) out.push(img)
  if (additional && typeof additional === 'string') out.push(additional)
  return out
})

const hasMultipleImages = computed(() => galleryImages.value.length > 1)

watch(
  () => props.selectedEquipment?.id,
  () => {
    activeImageIndex.value = 0
  },
)

function openFullscreen() {
  isFullscreen.value = true
}

function closeFullscreen() {
  isFullscreen.value = false
}

function prev() {
  if (!hasMultipleImages.value) return
  activeImageIndex.value =
    (activeImageIndex.value - 1 + galleryImages.value.length) %
    galleryImages.value.length
}

function next() {
  if (!hasMultipleImages.value) return
  activeImageIndex.value =
    (activeImageIndex.value + 1) % galleryImages.value.length
}

function handleKeydown(e: KeyboardEvent) {
  if (!isFullscreen.value) return
  if (e.key === 'Escape') {
    e.preventDefault()
    e.stopPropagation()
    e.stopImmediatePropagation()
    closeFullscreen()
    return
  }
  if (e.key === 'ArrowLeft') prev()
  if (e.key === 'ArrowRight') next()
}

onMounted(() =>
  window.addEventListener('keydown', handleKeydown, { capture: true }),
)
onUnmounted(() =>
  window.removeEventListener('keydown', handleKeydown, {
    capture: true,
  } as EventListenerOptions),
)
</script>

<template>
  <button
    type="button"
    class="gallery-expand-btn"
    aria-label="Expand image"
    @click="openFullscreen"
  >
    <Expand class="h-4 w-4" />
  </button>

  <div class="gallery-slide" @click="openFullscreen">
    <img
      v-if="galleryImages[activeImageIndex]"
      :src="galleryImages[activeImageIndex]"
      :alt="selectedEquipment.name"
      class="main-img"
    />
  </div>

  <template v-if="hasMultipleImages">
    <button type="button" class="nav-btn nav-prev" aria-label="Previous" @click.stop="prev">
      <ChevronLeft />
    </button>
    <button type="button" class="nav-btn nav-next" aria-label="Next" @click.stop="next">
      <ChevronRight />
    </button>

    <div class="equipment-popup__gallery-thumbs-overlay">
      <button
        v-for="(img, idx) in galleryImages"
        :key="idx"
        type="button"
        class="gallery-thumb"
        :class="{ 'is-active': activeImageIndex === idx }"
        @click.stop="activeImageIndex = idx"
      >
        <img :src="img" alt="thumb" />
      </button>
    </div>
  </template>

  <Teleport to="body">
    <div
      v-if="isFullscreen"
      class="gsc-fullscreen-overlay"
      @pointerdown.stop
      @mousedown.stop
      @click="closeFullscreen"
    >
      <button
        type="button"
        class="gsc-fullscreen-close-btn"
        @pointerdown.stop
        @mousedown.stop
        @click.stop="closeFullscreen"
      >
        <X />
      </button>
      <div class="gsc-fullscreen-content" @click.stop>
        <button
          v-if="hasMultipleImages"
          type="button"
          class="gsc-fullscreen-nav gsc-fullscreen-nav--prev"
          @click="prev"
        >
          <ChevronLeft />
        </button>
        <img
          v-if="galleryImages[activeImageIndex]"
          :src="galleryImages[activeImageIndex]"
          :alt="selectedEquipment.name"
          class="gsc-fullscreen-img"
        />
        <button
          v-if="hasMultipleImages"
          type="button"
          class="gsc-fullscreen-nav gsc-fullscreen-nav--next"
          @click="next"
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  </Teleport>
</template>

<style scoped lang="scss">
.gallery-slide {
  width: 100%;
  height: 100%;
  padding: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: zoom-in;
}

.main-img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.gallery-expand-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #fff;
  border: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 20;
  color: #6b7280;
  pointer-events: auto;

  svg {
    width: 16px;
    height: 16px;
  }
}

.nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  pointer-events: auto;
  color: #111827;

  svg {
    width: 20px;
    height: 20px;
  }
}

.nav-prev {
  left: 16px;
}

.nav-next {
  right: 16px;
}

.equipment-popup__gallery-thumbs-overlay {
  position: absolute;
  bottom: 16px;
  left: 16px;
  display: flex;
  gap: 8px;
  z-index: 20;
  background: rgba(255, 255, 255, 0.6);
  padding: 4px;
  border-radius: 8px;
  backdrop-filter: blur(2px);
}

.gallery-thumb {
  width: 48px;
  height: 48px;
  border: 2px solid transparent;
  border-radius: 6px;
  padding: 0;
  background: #fff;
  cursor: pointer;
  overflow: hidden;

  &.is-active {
    border-color: #f97316;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>

<style lang="scss">
.gsc-fullscreen-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.92);
  z-index: 2147483646;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: auto;
}

.gsc-fullscreen-close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.12);
  border: none;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2147483647;
  color: #fff;
  pointer-events: auto;

  svg {
    width: 20px;
    height: 20px;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
}

.gsc-fullscreen-content,
.gsc-fullscreen-nav,
.gsc-fullscreen-img {
  pointer-events: auto;
}

.gsc-fullscreen-content {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  gap: 16px;
  padding: 40px 60px;
}

.gsc-fullscreen-img {
  max-width: 90vw;
  max-height: 80vh;
  object-fit: contain;
}

.gsc-fullscreen-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.12);
  border: none;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2147483647;

  &:hover {
    background: rgba(255, 255, 255, 0.22);
  }

  svg {
    width: 22px;
    height: 22px;
  }

  &--prev {
    left: 20px;
  }
  &--next {
    right: 20px;
  }
}
</style>
