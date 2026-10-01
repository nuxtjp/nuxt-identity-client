<script setup lang="ts">
const locale = useDemoLocale()
const action = ref('')
</script>

<template>
  <NuxtJpIdentityLogoutPanel
    :locale="locale"
    @confirm="action = 'confirm_logout'"
    @cancel="action = 'cancel_logout'"
  />
  <p v-if="action" class="demo-notice" role="status">Intent: {{ action }} (not sent)</p>
</template>
