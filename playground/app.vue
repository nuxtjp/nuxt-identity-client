<script setup lang="ts">
const locale = useDemoLocale()
</script>

<template>
  <div class="demo-shell">
    <header>
      <strong>@nuxtjp/identity-client</strong>
      <label>
        Language
        <select v-model="locale">
          <option value="ja">日本語</option>
          <option value="en">English</option>
        </select>
      </label>
      <nav aria-label="Identity demo">
        <NuxtLink to="/login">Login</NuxtLink>
        <NuxtLink to="/account">Account</NuxtLink>
        <NuxtLink to="/account/security">Security</NuxtLink>
        <NuxtLink to="/account/devices">Devices</NuxtLink>
        <NuxtLink to="/logout">Logout</NuxtLink>
      </nav>
    </header>
    <main><NuxtPage /></main>
  </div>
</template>

<style>
body { margin: 0; background: #f5f7fa; }
.demo-shell > header {
  display: flex; flex-wrap: wrap; align-items: center; gap: 1rem;
  padding: 1rem; color: white; background: #17212b; font-family: system-ui, sans-serif;
}
.demo-shell nav { display: flex; flex-wrap: wrap; gap: 0.75rem; }
.demo-shell a { color: #b9ddff; }
.demo-shell label { margin-left: auto; }
.demo-shell select { margin-left: 0.4rem; }
.demo-notice { max-width: 44rem; margin: -1rem auto 2rem; font: 1rem system-ui, sans-serif; }
</style>
