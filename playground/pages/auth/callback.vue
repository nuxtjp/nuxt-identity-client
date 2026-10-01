<script setup lang="ts">
const locale = useDemoLocale()
</script>

<template>
  <NuxtJpIdentityCallbackStatus :locale="locale" status="pending" />
  <p class="demo-notice">Demo only: no authorization code is accepted or exchanged.</p>
</template>
