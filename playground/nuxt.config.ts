import identityClient from '../src/module'

export default defineNuxtConfig({
  devtools: { enabled: false },
  modules: [[identityClient, { componentPrefix: 'NuxtJp' }]]
})
