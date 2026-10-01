<script setup lang="ts">
import { sampleAuthenticators } from '../../sample-data'

const locale = useDemoLocale()
const action = ref('')
</script>

<template>
  <NuxtJpIdentitySecurityPanel
    :locale="locale"
    :authenticators="sampleAuthenticators"
    @add-passkey="action = 'add_passkey'"
    @add-authenticator="action = 'add_authenticator_app'"
    @remove="id => action = `remove:${id}`"
  />
  <p v-if="action" class="demo-notice" role="status">Intent: {{ action }} (not sent)</p>
</template>
