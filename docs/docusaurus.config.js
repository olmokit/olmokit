module.exports = {
  title: "Acanto Framework",
  tagline:
    "A set of multi-language packages (js, scss, php) to develop, deploy and mantain Acanto Frontend applications.",
  url: "https://olmokit.gitlab.io/olmokit/",
  baseUrl: "/olmokit/",
  onBrokenLinks: "throw",
  favicon: "img/favicon.ico",
  organizationName: "olmokit", // Usually your GitHub org/user name.
  projectName: "framework", // Usually your repo name.
  themeConfig: {
    algolia: {
      apiKey: "609b68baa2bff49faafc4417a569256f",
      indexName: "olmokit",
      // contextualSearch: true,
      // searchParameters: {},
      // inputSelector: "### REPLACE ME ####",
      // algoliaOptions: { 'facetFilters': ["type:content"] },
      // debug: false,
    },
    navbar: {
      style: "dark",
      title: "Acanto Framework",
      logo: {
        alt: "Acanto Framework Logo",
        src: "img/logo--white.svg",
        srcDark: "img/logo--white.svg",
      },
      items: [
        {
          href: "https://gitlab.com/olmokit/olmokit",
          className: "pipeline",
          position: "right",
        },
        {
          href: "https://gitlab.com/olmokit/olmokit",
          label: "Source code",
          position: "right",
        },
        {
          to: "showcase",
          label: "Showcase",
          position: "right",
        },
      ],
    },
    footer: {
      style: "light",
      links: [
        {
          title: "Git accounts",
          items: [
            {
              label: "Acanto Git",
              href: "https://git.acanto.net",
            },
            {
              label: "GitLab",
              href: "https://gitlab.com/acanto",
            },
            {
              label: "GitHub",
              href: "https://github.com/AcantoAgency",
            },
          ],
        },
        {
          title: "Source code",
          items: [
            {
              label: "GitHub",
              href: "https://github.com/olmokit/olmokit",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Acanto`,
    },
  },
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          routeBasePath: "/",
          editUrl: "https://gitlab.com/olmokit/olmokit/edit/main/docs/",
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      },
    ],
  ],
  plugins: ["docusaurus-plugin-fontloader"],
};
