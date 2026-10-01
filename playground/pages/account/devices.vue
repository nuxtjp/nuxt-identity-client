<script setup lang="ts">
import { sampleDevices } from '../../sample-data'

const locale = useDemoLocale()
const action = ref('')
</script>

<template>
  <NuxtJpIdentityDeviceList
    :locale="locale"
    :devices="sampleDevices"
    @rename="id => action = `rename:${id}`"
    @revoke="id => action = `revoke:${id}`"
  />
  <p v-if="action" class="demo-notice" role="status">Intent: {{ action }} (not sent)</p>
</template>
