<script setup lang="ts">
import BaseSelect from "@/components/base/select/BaseSelect.vue";

interface Option {
  value: string;
  label: string;
}

interface Props {
  label: string;
  modelValue: string;
  options: Option[];
  hint?: string;
  error?: string;
}

withDefaults(defineProps<Props>(), {
  hint: "",
  error: "",
});

defineEmits<{
  (e: "update:modelValue", v: string): void;
}>();
</script>

<template>
  <BaseSelect
    :label="label"
    :model-value="modelValue"
    :options="options"
    :hint="hint"
    :error="error"
    @update:model-value="$emit('update:modelValue', $event)"
  />
</template>
