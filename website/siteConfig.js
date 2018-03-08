/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* List of projects/orgs using your project for the users page */
const users = [
  {
    caption: 'User1',
    image: '/test-site/img/docusaurus.svg',
    infoLink: 'https://www.facebook.com',
    pinned: true,
  },
];

const siteConfig = {
  title: 'React Virtual Scroller' /* title for your website */,
  tagline: 'Using virtual scroller with infinite list',
  url: 'https://liximomo.github.io' /* your website url */,
  baseUrl: '/react-virtual-scroller/' /* base url for your project */,
  projectName: 'react-virtual-scroller',
  headerLinks: [
    {doc: 'VirtualScroller', label: 'API'},
    { href: 'https://github.com/liximomo/react-virtual-scroller', label: 'GitHub' },
    // {blog: true, label: 'Blog'},
  ],
  users,
  /* path to images for header/footer */
  headerIcon: 'img/docusaurus.svg',
  footerIcon: 'img/docusaurus.svg',
  favicon: 'img/favicon.png',
  /* colors for website */
  colors: {
    primaryColor: '#009688',
    secondaryColor: '#6e7891',
  },
  /* custom fonts for website */
  /*fonts: {
    myFont: [
      "Times New Roman",
      "Serif"
    ],
    myOtherFont: [
      "-apple-system",
      "system-ui"
    ]
  },*/
  // This copyright info is used in /core/Footer.js and blog rss/atom feeds.
  copyright:
    'Copyright © ' +
    new Date().getFullYear() +
    ' liximomo',
  organizationName: 'liximomo', // or set an env variable ORGANIZATION_NAME
  highlight: {
    // Highlight.js theme to use for syntax highlighting in code blocks
    theme: 'default',
  },
  scripts: ['https://buttons.github.io/buttons.js'],
  // You may provide arbitrary config keys to be used as needed by your template.
  repoUrl: 'https://github.com/liximomo/react-virtual-scroller',
};

module.exports = siteConfig;
