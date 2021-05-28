import type { App } from 'vue'

// if you encountered problems alike "Can't resolve './version'"
// please run `yarn bootstrap` first
import { version as version_ } from './version'
import { setConfig } from '@vue3-framework/utils/config'
import type { InstallOptions } from '@vue3-framework/utils/config'

const version = version_ // version_ to fix tsc issue

console.log(version);
const defaultInstallOpt: InstallOptions =  {
  size: '' as ComponentSize,
  zIndex: 2000,
}

const components = [
]

const plugins = [
]

const install = (app: App, opt: InstallOptions): void => {
  const option = Object.assign(defaultInstallOpt, opt)

  app.config.globalProperties.$ELEMENT = option
  setConfig(option)

  components.forEach(component => {
    app.component(component.name, component)
  })

  plugins.forEach(plugin => {
    app.use(plugin as any)
  })
}

export {
  version,
  install,
}

export default {
  version,
  install,
}
