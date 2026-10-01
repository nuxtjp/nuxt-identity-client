import { addComponent, createResolver, defineNuxtModule } from '@nuxt/kit'
import type { NuxtModule } from '@nuxt/schema'

export interface ModuleOptions {
  componentPrefix: string
}

const componentFiles = [
  'IdentityLoginCard',
  'IdentityCallbackStatus',
  'IdentityAccountPanel',
  'IdentitySecurityPanel',
  'IdentityDeviceList',
  'IdentityLogoutPanel'
] as const

const identityClientModule: NuxtModule<ModuleOptions> = defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@nuxtjp/identity-client',
    configKey: 'nuxtJpIdentityClient',
    compatibility: { nuxt: '^4.5.0' }
  },
  defaults: { componentPrefix: 'NuxtJp' },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)
    for (const file of componentFiles) {
      addComponent({
        name: `${options.componentPrefix}${file}`,
        filePath: resolver.resolve(`./runtime/app/components/${file}.vue`)
      })
    }
    const stylesheet = resolver.resolve('./runtime/app/assets/identity.css')
    if (!nuxt.options.css.includes(stylesheet)) nuxt.options.css.push(stylesheet)
  }
})

export default identityClientModule
export * from './runtime/core'
