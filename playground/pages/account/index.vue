<script setup lang="ts">
import { sampleAccount } from '../../sample-data'

const locale = useDemoLocale()
</script>

<template>
  <NuxtJpIdentityAccountPanel :locale="locale" :account="sampleAccount" />
</template>
