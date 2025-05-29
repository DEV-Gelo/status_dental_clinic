/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || "https://status-gzla.vercel.app",
  generateRobotsTxt: true, // Generate robots.txt
  changefreq: "daily",
  priority: 0.7,
  sitemapSize: 7000,
  exclude: [
    "/server-sitemap.xml", // Disable server-generated files
    "/admin", // Disable admin panel
    "/admin/*",
    "/api/*", // Disable API route
    "/404", // Disable page 404
    "/500", // Disable page 500
  ],
  // Additional settings for transforming each record into sitemap
  transform: async (config, path) => {
    return {
      loc: path, // URL pages
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: new Date().toISOString(),
    };
  },
  // Additional options for robots.txt
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api", "/404", "/500"],
      },
    ],
    additionalSitemaps: [
      `${process.env.SITE_URL || "https://status-gzla.vercel.app"}/sitemap.xml`,
      `${
        process.env.SITE_URL || "https://status-gzla.vercel.app"
      }/server-sitemap.xml`,
    ],
  },
};
