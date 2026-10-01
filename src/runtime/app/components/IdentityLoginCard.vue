<script setup lang="ts">
import { useId } from 'vue'
import { identityMessage } from '../../core/i18n'
import type { IdentityLocale } from '../../core/types'

const props = withDefaults(defineProps<{
  locale?: IdentityLocale
  busy?: boolean
  error?: boolean
}>(), { locale: 'ja', busy: false, error: false })
const emit = defineEmits<{ login: [] }>()
const titleId = useId()
const t = (key: Parameters<typeof identityMessage>[0]) => identityMessage(key, props.locale)
</script>

<template>
  <section class="identity-card" :aria-labelledby="titleId" aria-live="polite">
    <h1 :id="titleId">{{ t('loginTitle') }}</h1>
    <p>{{ t('loginDescription') }}</p>
    <p v-if="error" class="identity-error" role="alert">
      {{ t('callbackFailed') }}
    </p>
    <button type="button" :disabled="busy" @click="emit('login')">
      {{ t('loginAction') }}
    </button>
  </section>
</template>
