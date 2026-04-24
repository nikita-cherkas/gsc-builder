<script setup lang="ts">
import { computed } from 'vue'
import { useConfiguratorStore } from '@/stores/configurator'
import { validateCustomer } from '@/lib/validation'
import type { CustomerInfo } from '@/types'
import Field from '@/components/ui/Field.vue'
import TextArea from '@/components/ui/TextArea.vue'
import SimpleSelect from '@/components/ui/SimpleSelect.vue'

const store = useConfiguratorStore()

const errors = computed(() => validateCustomer(store.config.customer).errors)

function showError(k: keyof CustomerInfo): string {
  return store.attemptedSubmit ? errors.value[k] ?? '' : ''
}

function update<K extends keyof CustomerInfo>(key: K, value: CustomerInfo[K]) {
  store.updateCustomer({ [key]: value } as Partial<CustomerInfo>)
}

const USE_CASES = [
  { value: '', label: 'Select…' },
  { value: 'cafe', label: 'Permanent café' },
  { value: 'catering', label: 'Catering company' },
  { value: 'events', label: 'Events / weddings' },
  { value: 'office', label: 'Office service' },
  { value: 'campus', label: 'University / campus' },
  { value: 'wholesale', label: 'Resale / wholesale' },
  { value: 'other', label: 'Other' },
]

const DAILY_VOLUMES = [
  { value: '', label: 'Select…' },
  { value: '<50', label: 'Under 50 drinks' },
  { value: '50-100', label: '50–100 drinks' },
  { value: '100-200', label: '100–200 drinks' },
  { value: '200+', label: '200+ drinks' },
]
</script>

<template>
  <div class="space-y-4">
    <section class="space-y-3">
      <div>
        <h3 class="font-semibold text-[14px] text-foreground">You</h3>
        <p class="text-[11.5px] text-muted-foreground mt-0.5">Required — so we can follow up</p>
      </div>
      <Field
        label="Full name *"
        :model-value="store.config.customer.name"
        :error="showError('name')"
        autocomplete="name"
        @update:model-value="update('name', $event)"
      />
      <Field
        label="Email *"
        type="email"
        :model-value="store.config.customer.email"
        :error="showError('email')"
        autocomplete="email"
        @update:model-value="update('email', $event)"
      />
      <Field
        label="Phone *"
        type="tel"
        :model-value="store.config.customer.phone"
        :error="showError('phone')"
        autocomplete="tel"
        @update:model-value="update('phone', $event)"
      />
      <Field
        label="Company"
        :model-value="store.config.customer.company"
        autocomplete="organization"
        @update:model-value="update('company', $event)"
      />
    </section>

    <section class="space-y-3">
      <div>
        <h3 class="font-semibold text-[14px] text-foreground">Where</h3>
        <p class="text-[11.5px] text-muted-foreground mt-0.5">Helps us ballpark freight</p>
      </div>
      <div class="grid grid-cols-[1fr_120px] gap-3">
        <Field
          label="City *"
          :model-value="store.config.customer.city"
          :error="showError('city')"
          autocomplete="address-level2"
          @update:model-value="update('city', $event)"
        />
        <Field
          label="State *"
          :model-value="store.config.customer.state"
          :error="showError('state')"
          autocomplete="address-level1"
          placeholder="CA"
          @update:model-value="update('state', $event)"
        />
      </div>
    </section>

    <section class="space-y-3">
      <div>
        <h3 class="font-semibold text-[14px] text-foreground">The project</h3>
      </div>
      <SimpleSelect
        label="Use case"
        :model-value="store.config.customer.useCase"
        :options="USE_CASES"
        @update:model-value="update('useCase', $event as CustomerInfo['useCase'])"
      />
      <div class="grid grid-cols-2 gap-3">
        <SimpleSelect
          label="Daily volume"
          :model-value="store.config.customer.dailyVolume"
          :options="DAILY_VOLUMES"
          @update:model-value="update('dailyVolume', $event as CustomerInfo['dailyVolume'])"
        />
        <Field
          label="Needed by"
          type="date"
          :model-value="store.config.customer.neededBy"
          @update:model-value="update('neededBy', $event)"
        />
      </div>
    </section>

    <TextArea
      label="Notes for our team"
      :model-value="store.config.customer.notes"
      placeholder="Special requests, branding ideas, freight constraints…"
      @update:model-value="update('notes', $event)"
    />

    <p class="text-[11.5px] text-muted-foreground leading-snug">
      We'll review your build and reply within one business day. We don't share your info with
      anyone outside Golden State Coffee Carts.
    </p>
  </div>
</template>
