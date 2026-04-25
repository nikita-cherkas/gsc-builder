<script setup lang="ts">
import { computed } from 'vue'
import { useConfiguratorStore } from '@/stores/configurator'
import { validateCustomer } from '@/lib/validation'
import type { CustomerInfo } from '@/types'
import BaseInput from '@/components/base/input/BaseInput.vue'
import BaseSelect from '@/components/base/select/BaseSelect.vue'
import BaseTextarea from '@/components/base/textarea/BaseTextarea.vue'
import BaseCheckRadio from '@/components/base/check-radio/BaseCheckRadio.vue'
import BaseButton from '@/components/base/button/BaseButton.vue'

const store = useConfiguratorStore()

const errors = computed(() => validateCustomer(store.config.customer).errors)

function showError(k: keyof CustomerInfo): string {
  return store.attemptedSubmit ? (errors.value[k] ?? '') : ''
}

function update<K extends keyof CustomerInfo>(
  key: K,
  value: CustomerInfo[K],
) {
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

const confirmed = computed({
  get: () => !!store.config.customer.confirmed,
  set: (v: boolean) => update('confirmed' as keyof CustomerInfo, v as never),
})

function submit() {
  store.submit()
}
</script>

<template>
  <form class="summary-form" @submit.prevent="submit">
    <div class="summary-form__title">Your info</div>

    <div class="summary-form__values">
      <BaseInput
        label="First name"
        placeholder="John"
        required
        :model-value="store.config.customer.name"
        :error="showError('name')"
        autocomplete="name"
        class="summary-form__value summary-form__value_full"
        @update:model-value="update('name', String($event ?? ''))"
      />

      <BaseInput
        label="Email"
        type="email"
        placeholder="name@example.com"
        required
        :model-value="store.config.customer.email"
        :error="showError('email')"
        autocomplete="email"
        class="summary-form__value summary-form__value_full"
        @update:model-value="update('email', String($event ?? ''))"
      />

      <BaseInput
        label="Phone"
        type="tel"
        placeholder="+1 800 852 9001"
        required
        :model-value="store.config.customer.phone"
        :error="showError('phone')"
        autocomplete="tel"
        class="summary-form__value summary-form__value_full"
        @update:model-value="update('phone', String($event ?? ''))"
      />

      <BaseInput
        label="Company"
        placeholder="Your business"
        :model-value="store.config.customer.company"
        autocomplete="organization"
        class="summary-form__value summary-form__value_full"
        @update:model-value="update('company', String($event ?? ''))"
      />

      <BaseInput
        label="City"
        placeholder="Sacramento"
        required
        :model-value="store.config.customer.city"
        :error="showError('city')"
        autocomplete="address-level2"
        class="summary-form__value"
        @update:model-value="update('city', String($event ?? ''))"
      />

      <BaseInput
        label="State"
        placeholder="CA"
        required
        :model-value="store.config.customer.state"
        :error="showError('state')"
        autocomplete="address-level1"
        class="summary-form__value"
        @update:model-value="update('state', String($event ?? ''))"
      />
    </div>

    <div class="summary-form__subtitle">Use case</div>

    <BaseSelect
      label="Use case"
      :model-value="store.config.customer.useCase"
      :options="USE_CASES"
      @update:model-value="
        update('useCase', $event as CustomerInfo['useCase'])
      "
    />

    <div class="summary-form__subtitle">Daily volume &amp; timeline</div>

    <div class="summary-form__values">
      <BaseSelect
        label="Daily volume"
        :model-value="store.config.customer.dailyVolume"
        :options="DAILY_VOLUMES"
        class="summary-form__value"
        @update:model-value="
          update('dailyVolume', $event as CustomerInfo['dailyVolume'])
        "
      />

      <BaseInput
        label="Needed by"
        type="date"
        :model-value="store.config.customer.neededBy"
        class="summary-form__value"
        @update:model-value="update('neededBy', String($event ?? ''))"
      />
    </div>

    <div class="summary-form__subtitle">Additional comments</div>

    <BaseTextarea
      placeholder="Special requests, branding ideas, freight constraints…"
      :model-value="store.config.customer.notes"
      class="summary-form__description"
      @update:model-value="update('notes', $event)"
    />

    <div class="summary-form__confirm">
      <BaseCheckRadio v-model="confirmed" />

      <div class="summary-form__confirm-content">
        <div class="summary-form__confirm-title">
          <span>I agree to the</span>
          <a
            href="https://goldenstatecoffeecarts.com/terms-and-conditions/"
            target="_blank"
            rel="noopener noreferrer"
            class="summary-form__confirm-link"
          >
            Terms &amp; Conditions
          </a>
          <span>and</span>
          <a
            href="https://goldenstatecoffeecarts.com/privacy-policy/"
            target="_blank"
            rel="noopener noreferrer"
            class="summary-form__confirm-link"
          >
            Privacy policy
          </a>
        </div>

        <span class="summary-form__confirm-text">
          We'll review your build and reply within one business day.
          We don't share your info with anyone outside Golden State Coffee Carts.
        </span>
      </div>
    </div>

    <div class="summary-form__buttons">
      <BaseButton type="submit" class="summary-form__button" variant="orange">
        Submit request
      </BaseButton>
    </div>
  </form>
</template>

<style scoped lang="scss">
@use 'SummaryForm';
</style>
