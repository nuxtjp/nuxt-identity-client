<script setup lang="ts">
import { useId } from 'vue'
import { identityMessage } from '../../core/i18n'
import type { IdentityLocale } from '../../core/types'

const props = withDefaults(defineProps<{ locale?: IdentityLocale; busy?: boolean }>(), {
  locale: 'ja', busy: false
})
const emit = defineEmits<{ confirm: []; cancel: [] }>()
const titleId = useId()
const t = (key: Parameters<typeof identityMessage>[0]) => identityMessage(key, props.locale)
</script>

<template>
  <section class="identity-card" :aria-labelledby="titleId" aria-live="assertive">
    <h1 :id="titleId">{{ t('logoutTitle') }}</h1>
    <p>{{ t('logoutDescription') }}</p>
    <div class="identity-actions">
      <button type="button" :disabled="busy" @click="emit('confirm')">
        {{ t('logoutAction') }}
      </button>
      <button type="button" class="secondary" :disabled="busy" @click="emit('cancel')">
        {{ t('cancel') }}
      </button>
    </div>
  </section>
</template>
