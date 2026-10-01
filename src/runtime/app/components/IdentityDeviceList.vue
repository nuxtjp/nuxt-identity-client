<script setup lang="ts">
import { useId } from 'vue'
import { identityMessage } from '../../core/i18n'
import type { DeviceProjection, IdentityLocale } from '../../core/types'

const props = withDefaults(defineProps<{
  locale?: IdentityLocale
  devices: readonly DeviceProjection[]
}>(), { locale: 'ja' })
const emit = defineEmits<{
  rename: [deviceId: string]
  revoke: [deviceId: string]
}>()
const titleId = useId()
const t = (key: Parameters<typeof identityMessage>[0]) => identityMessage(key, props.locale)
</script>

<template>
  <section class="identity-card" :aria-labelledby="titleId" aria-live="polite">
    <h1 :id="titleId">{{ t('devicesTitle') }}</h1>
    <ul v-if="devices.length" class="identity-list identity-list--divided">
      <li v-for="device in devices" :key="device.id">
        <span>
          <strong>{{ device.name }}</strong>
          <small>{{ device.platform }} · {{ t('lastUsed') }}: {{ device.lastUsedAt }}</small>
          <em v-if="device.current">{{ t('currentDevice') }}</em>
        </span>
        <span class="identity-actions">
          <button type="button" class="secondary" @click="emit('rename', device.id)">
            {{ t('rename') }}
          </button>
          <button type="button" @click="emit('revoke', device.id)">{{ t('revoke') }}</button>
        </span>
      </li>
    </ul>
    <p v-else>{{ t('noDevices') }}</p>
  </section>
</template>
