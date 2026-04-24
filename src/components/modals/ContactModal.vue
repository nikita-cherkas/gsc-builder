<script setup lang="ts">
import { computed } from "vue";
import { useConfiguratorStore } from "@/stores/configurator";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Phone, Mail, MapPin, Clock, X } from "lucide-vue-next";

const store = useConfiguratorStore();

const open = computed({
  get: () => store.contactOpen,
  set: (v) => (v ? store.openContact() : store.closeContact()),
});

const items = [
  {
    icon: Phone,
    label: "Phone",
    value: "(916) 258-2055",
    href: "tel:+19162582055",
  },
  {
    icon: Mail,
    label: "Email",
    value: "sales@goldenstatecoffeecarts.com",
    href: "mailto:sales@goldenstatecoffeecarts.com",
  },
  {
    icon: MapPin,
    label: "Address",
    value: "4577 Skyway Dr., Olivehurst, CA 95961",
    href: "https://maps.google.com/?q=4577+Skyway+Dr.,+Olivehurst,+CA+95961",
  },
  {
    icon: Clock,
    label: "Hours",
    value: "Mon-Fri: 8am-4pm PST",
    href: null,
  },
] as const;
</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent
      hide-close
      class="contact-modal gap-0 rounded-2xl border-0 bg-white p-6 shadow-xl max-w-[460px]"
    >
      <DialogClose
        class="contact-modal__close"
        aria-label="Close"
      >
        <X class="h-4 w-4" />
      </DialogClose>

      <DialogTitle class="text-[20px] font-semibold text-[#0e1a2b] leading-tight">
        Golden State Coffee Carts
      </DialogTitle>
      <DialogDescription class="mt-1.5 text-[13px] text-[#6b7280]">
        Talk to a specialist about your cart, equipment, or timeline.
      </DialogDescription>

      <div class="mt-5 flex flex-col gap-2.5">
        <component
          :is="item.href ? 'a' : 'div'"
          v-for="item in items"
          :key="item.label"
          :href="item.href ?? undefined"
          :target="item.href?.startsWith('http') ? '_blank' : undefined"
          :rel="item.href?.startsWith('http') ? 'noopener noreferrer' : undefined"
          class="contact-row"
        >
          <span class="contact-row__icon">
            <component :is="item.icon" class="h-4 w-4" />
          </span>
          <span class="contact-row__text">
            <span class="contact-row__label">{{ item.label }}</span>
            <span class="contact-row__value">{{ item.value }}</span>
          </span>
        </component>
      </div>
    </DialogContent>
  </Dialog>
</template>

<style scoped lang="scss">
$c-border: #e5e7eb;
$c-ink: #0e1a2b;
$c-muted: #6b7280;
$c-label: #8b94a3;
$c-bg-row: #ffffff;
$c-bg-icon: #f3f0ea;
$c-orange: #f97316;

.contact-modal {
  box-shadow: 0 20px 50px -12px rgba(14, 26, 43, 0.18);
}

.contact-modal__close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  border: 1px solid $c-border;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: $c-muted;
  background: transparent;
  cursor: pointer;
  transition:
    background 0.15s,
    color 0.15s,
    border-color 0.15s;

  &:hover {
    border-color: $c-orange;
    color: $c-orange;
    background: rgba($c-orange, 0.08);
  }

  &:focus-visible {
    outline: 2px solid $c-orange;
    outline-offset: 2px;
  }
}

.contact-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border: 1px solid $c-border;
  border-radius: 12px;
  background: $c-bg-row;
  text-decoration: none;
  color: inherit;
  transition:
    border-color 0.15s,
    background 0.15s;
}

a.contact-row:hover {
  border-color: #d6dae0;
  background: #fafafa;
}

.contact-row__icon {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: $c-bg-icon;
  color: $c-ink;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.contact-row__text {
  display: flex;
  flex-direction: column;
  min-width: 0;
  line-height: 1.25;
}

.contact-row__label {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: $c-label;
  margin-bottom: 2px;
}

.contact-row__value {
  font-size: 14px;
  font-weight: 600;
  color: $c-ink;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
