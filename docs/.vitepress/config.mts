import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Hull',
  description: 'Window system and Layout Orchestrator for OCEAN UI',
  base: '/hull-documentation/',

  themeConfig: {
    logo: '/logo.svg',

    nav: [
      { text: 'Guide',     link: '/guide/getting-started' },
      { text: 'Reference', link: '/reference/api' },
    ],

    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Getting Started',      link: '/guide/getting-started' },
          { text: 'Windows',              link: '/guide/windows' },
          { text: 'Layout Operations',    link: '/guide/layout-operations' },
          { text: 'Popups',               link: '/guide/popups' },
          { text: 'Declarative Layout',   link: '/guide/declarative-layout' },
        ],
      },
      {
        text: 'Reference',
        items: [
          { text: 'API',        link: '/reference/api' },
          { text: 'Animations', link: '/reference/animations' },
        ],
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/filipefthomaz-gd/Hull' },
    ],

    footer: {
      message: 'Hull — HUD and UI Layout Library for the OCEAN framework.',
    },

    search: {
      provider: 'local',
    },
  },
})
