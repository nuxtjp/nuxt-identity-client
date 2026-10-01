<script setup lang="ts">
import { useId } from 'vue'
import { identityMessage } from '../../core/i18n'
import type { AccountProjection, IdentityLocale } from '../../core/types'

const props = withDefaults(defineProps<{
  locale?: IdentityLocale
  account: AccountProjection | null
}>(), { locale: 'ja' })
const titleId = useId()
const t = (key: Parameters<typeof identityMessage>[0]) => identityMessage(key, props.locale)
</script>

<template>
  <section class="identity-card" :aria-labelledby="titleId">
    <h1 :id="titleId">{{ t('accountTitle') }}</h1>
    <template v-if="account">
      <h2>{{ account.displayName }}</h2>
      <dl v-if="account.email" class="identity-details">
        <dt>{{ t('email') }}</dt>
        <dd>{{ account.email }}</dd>
      </dl>
      <h2>{{ t('services') }}</h2>
      <ul v-if="account.services.length" class="identity-list">
        <li v-for="service in account.services" :key="service.id">{{ service.name }}</li>
      </ul>
      <p v-else>{{ t('noServices') }}</p>
    </template>
    <p v-else>{{ t('callbackFailed') }}</p>
  </section>
</template>
