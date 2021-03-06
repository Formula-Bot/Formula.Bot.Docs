const { description, repository } = require('../../package');

module.exports = {
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#title
   */
  title: 'Formula.Bot',
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#description
   */
  description: description,

  base: '/Formula.Bot.Docs/',

  /**
   * Extra tags to be injected to the page HTML `<head>`
   *
   * ref：https://v1.vuepress.vuejs.org/config/#head
   */
  head: [
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
  ],

  /**
   * Theme configuration, here is the default theme configuration for VuePress.
   *
   * ref：https://v1.vuepress.vuejs.org/theme/default-theme-config.html
   */
  themeConfig: {
    repo: repository,
    editLinks: true,
    docsDir: 'docs',
    docsBranch: 'main',
    editLinkText: '',
    lastUpdated: true,
    displayAllHeaders: true,
    nav: [],
    sidebar: [
      {
        link: '/',
        text: 'Get Started',
      },
      {
        isGroup: true,
        link: '/plugins/',
        text: 'Plugins',
        children: ['/plugins/index.md', '/plugins/development.md', '/plugins/configuration.md'],
      },
    ],
  },

  /**
   * Apply plugins，ref：https://v1.vuepress.vuejs.org/zh/plugin/
   */
  plugins: [
    [
      '@vuepress/plugin-docsearch',
      {
        apiKey: '3661d0e852436807f87140543209a474',
        indexName: 'formula-bot',
      },
    ],
  ],
};
