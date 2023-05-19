import { defineConfig } from 'vitepress'
import { nav, sidebar, rewrites, rewritesReverseMap } from './util'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "vitepress-blog-template",
  description: "",
  cleanUrls: true,
  // lastUpdated: true,
  lang: 'zh-CN',
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
  ],
  rewrites,
  markdown: {},
  srcExclude: ['**/_*.md'],
  ignoreDeadLinks: 'localhostLinks',
  vite: {
    define: {
      VITE_REWRITE_REVERSE_MAP: JSON.stringify(rewritesReverseMap),
    },
  },
  themeConfig: {
    aside: true,
    outline: [2, 5],
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      ...nav,
    ],

    sidebar,

    socialLinks: [
      { icon: 'github', link: 'https://github.com/zuixinwang/vitepress-blog-template' }
    ]
  },
})
