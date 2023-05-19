import DefaultTheme from 'vitepress/theme'
// @ts-ignore
import AutoSubLink from '../components/AutoSubLink.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('AutoSubLink', AutoSubLink)
  }
}
