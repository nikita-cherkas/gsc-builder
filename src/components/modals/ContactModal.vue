<script setup lang="ts">
import { computed } from "vue";
import { useConfiguratorStore } from "@/stores/configurator";
import ModalWindow from "@/components/base/modal/window/ModalWindow.vue";
import { Phone, Mail, MapPin, Clock } from "lucide-vue-next";

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
  <ModalWindow v-model:open="open" size="sm">
    <template #header>
      <span>Golden State Coffee Carts</span>
    </template>

    <p class="contact-modal__lead">
      Talk to a specialist about your cart, equipment, or timeline.
    </p>

    <div class="contact-modal__list">
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
          <component :is="item.icon" />
        </span>
        <span class="contact-row__text">
          <span class="contact-row__label">{{ item.label }}</span>
          <span class="contact-row__value">{{ item.value }}</span>
        </span>
      </component>
    </div>
  </ModalWindow>
</template>

<style lang="scss" scoped>
@use "@/styles/colors" as colors;

.contact-modal__lead {
  color: colors.$gray-900;
  font-size: 13px;
  line-height: 1.5;
  margin-bottom: 16px;
}

.contact-modal__list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.contact-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border: 1px solid colors.$gray-300;
  border-radius: 12px;
  background: colors.$white;
  text-decoration: none;
  color: inherit;
  transition:
    border-color 0.15s ease,
    background 0.15s ease;
}

a.contact-row {
  @media (hover: hover) {
    &:hover {
      border-color: colors.$orange-medium;
      background: colors.$orange-10;
    }
  }
}

.contact-row__icon {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: colors.$gray-10;
  color: colors.$black;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 16px;
    height: 16px;
  }
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
  color: colors.$gray;
  margin-bottom: 2px;
}

.contact-row__value {
  font-size: 14px;
  font-weight: 600;
  color: colors.$black;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
