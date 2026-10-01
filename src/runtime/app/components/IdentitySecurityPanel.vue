<script setup lang="ts">
import { useId } from 'vue'
import { authenticatorKindMessage, identityMessage } from '../../core/i18n'
import type { AuthenticatorProjection, IdentityLocale } from '../../core/types'

const props = withDefaults(defineProps<{
  locale?: IdentityLocale
  authenticators: readonly AuthenticatorProjection[]
}>(), { locale: 'ja' })
const emit = defineEmits<{
  addPasskey: []
  addAuthenticator: []
  remove: [authenticatorId: string]
}>()
const titleId = useId()
const t = (key: Parameters<typeof identityMessage>[0]) => identityMessage(key, props.locale)
const kind = (value: AuthenticatorProjection) => authenticatorKindMessage(value.kind, props.locale)
</script>

<template>
  <section class="identity-card" :aria-labelledby="titleId" aria-live="polite">
    <h1 :id="titleId">{{ t('securityTitle') }}</h1>
    <ul v-if="authenticators.length" class="identity-list identity-list--divided">
      <li v-for="authenticator in authenticators" :key="authenticator.id">
        <span><strong>{{ authenticator.label }}</strong><small>{{ kind(authenticator) }}</small></span>
        <button
          type="button"
          :aria-label="`${t('remove')}: ${authenticator.label}`"
          @click="emit('remove', authenticator.id)"
        >{{ t('remove') }}</button>
      </li>
    </ul>
    <p v-else>{{ t('noAuthenticators') }}</p>
    <div class="identity-actions">
      <button type="button" @click="emit('addPasskey')">{{ t('addPasskey') }}</button>
      <button type="button" class="secondary" @click="emit('addAuthenticator')">
        {{ t('addAuthenticator') }}
      </button>
    </div>
  </section>
</template>
