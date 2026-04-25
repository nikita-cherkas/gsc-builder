<script lang="ts" setup>
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { X } from 'lucide-vue-next'

interface Props {
  open: boolean
  size?: 'sm' | 'md' | 'lg'
  title?: string
  closeOnBackdrop?: boolean
  closeOnEsc?: boolean
  hideClose?: boolean
  containerClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  closeOnBackdrop: true,
  closeOnEsc: true,
})

const emit = defineEmits<{
  (e: 'update:open', v: boolean): void
  (e: 'close'): void
}>()

const wrapperRef = ref<HTMLDivElement | null>(null)
const dialogRef = ref<HTMLElement | null>(null)
const previousFocus = ref<HTMLElement | null>(null)
const downOnBackdrop = ref(false)

const isOpen = computed(() => props.open)

function close() {
  emit('update:open', false)
  emit('close')
}

function onBackdropPointerDown(e: PointerEvent) {
  if (e.target === wrapperRef.value) downOnBackdrop.value = true
}

function onBackdropClick(e: MouseEvent) {
  if (
    props.closeOnBackdrop &&
    e.target === wrapperRef.value &&
    downOnBackdrop.value
  ) {
    close()
  }
  downOnBackdrop.value = false
}

function onDialogPointerDown() {
  downOnBackdrop.value = false
}

function onKeydown(e: KeyboardEvent) {
  if (!isOpen.value) return
  if (e.key === 'Escape' && props.closeOnEsc) {
    e.stopPropagation()
    close()
  }
}

function attachKeyHandler() {
  window.addEventListener('keydown', onKeydown, { capture: true })
}

function detachKeyHandler() {
  window.removeEventListener(
    'keydown',
    onKeydown,
    { capture: true } as EventListenerOptions,
  )
}

watch(
  () => props.open,
  async (open) => {
    if (open) {
      previousFocus.value = (document.activeElement as HTMLElement) ?? null
      attachKeyHandler()
      document.body.style.overflow = 'hidden'
      await nextTick()
      dialogRef.value?.focus()
    } else {
      detachKeyHandler()
      document.body.style.overflow = ''
      previousFocus.value?.focus?.()
      previousFocus.value = null
    }
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  detachKeyHandler()
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modals">
      <div
        v-if="isOpen"
        :class="[
          'base-modal',
          `base-modal_size-${size}`,
          containerClass,
        ]"
      >
        <div
          ref="wrapperRef"
          class="base-modal__wrapper"
          @pointerdown="onBackdropPointerDown"
          @click="onBackdropClick"
        >
          <div
            ref="dialogRef"
            class="base-modal__container"
            role="dialog"
            aria-modal="true"
            tabindex="-1"
            @pointerdown="onDialogPointerDown"
          >
            <div v-if="$slots.header || title" class="base-modal__header">
              <div class="base-modal__title">
                <slot name="header">
                  <span v-if="title">{{ title }}</span>
                </slot>
              </div>

              <button
                v-if="!hideClose"
                type="button"
                class="base-modal__close"
                aria-label="Close"
                @click="close"
              >
                <X class="base-modal__close-icon" />
              </button>
            </div>

            <div class="base-modal__content">
              <slot name="content">
                <slot />
              </slot>
            </div>

            <div v-if="$slots.footer" class="base-modal__controls">
              <slot name="footer" />
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="scss" scoped>
@use 'ModalWindow';
</style>
