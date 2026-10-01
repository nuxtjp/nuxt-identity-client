<script setup lang="ts">
const locale = useDemoLocale()
const requested = ref(false)
</script>

<template>
  <NuxtJpIdentityLoginCard :locale="locale" @login="requested = true" />
  <p v-if="requested" class="demo-notice" role="status">
    Demo only: no authorization request was sent.
  </p>
</template>
