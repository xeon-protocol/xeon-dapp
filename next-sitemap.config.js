module.exports = {
  siteUrl: 'https://app.xeon-protocol.io',
  generateRobotsTxt: true,
  sitemapSize: 5000,
  changefreq: 'daily',
  priority: 0.7,
  exclude: ['/private-page', '/admin'], // update with private pages
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
      { userAgent: '*', crawlDelay: 10 },
      { userAgent: '*', disallow: '/api' },
    ],
  },
};
