<script setup lang="ts">
import { useId } from 'vue'
import { identityMessage } from '../../core/i18n'
import type { IdentityLocale } from '../../core/types'

const props = withDefaults(defineProps<{
  locale?: IdentityLocale
  status: 'pending' | 'success' | 'error'
}>(), { locale: 'ja' })
const emit = defineEmits<{ retry: [] }>()
const titleId = useId()
const t = (key: Parameters<typeof identityMessage>[0]) => identityMessage(key, props.locale)
</script>

<template>
  <section class="identity-card" :aria-labelledby="titleId" aria-live="polite">
    <h1 :id="titleId">{{ t('callbackTitle') }}</h1>
    <p v-if="status === 'pending'" role="status">{{ t('callbackPending') }}</p>
    <p v-else-if="status === 'success'" role="status">{{ t('callbackSuccess') }}</p>
    <template v-else>
      <p class="identity-error" role="alert">{{ t('callbackFailed') }}</p>
      <button type="button" @click="emit('retry')">{{ t('retry') }}</button>
    </template>
  </section>
</template>
