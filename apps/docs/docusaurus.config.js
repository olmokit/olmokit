// @ts-check

/** @type {import("@docusaurus/types").Config} */
module.exports = {
  title: "Olmo",
  tagline:
    "A set of multi-language packages to develop, deploy and mantain Olmo based frontend applications.",
  url: "https://olmokit.github.io",
  baseUrl: "/olmokit",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },
  favicon: "img/favicon.ico",
  organizationName: "olmokit", // Usually your GitHub org/user name.
  projectName: "olmokit", // Usually your repo name.
  // deploymentBranch: "main",
  themeConfig:
    /** @type {import("@docusaurus/preset-classic").ThemeConfig} */
    ({
      algolia: {
        appId: "2FJHDUOHZY",
        apiKey: "081e509af9fb2b6ea364c142df45282a",
        indexName: "olmokit",
      },
      colorMode: {
        defaultMode: "dark",
        disableSwitch: false,
        respectPrefersColorScheme: false,
      },
      // FIXME: these do not work anymore with `prism-react-renderer@^2`
      // prism: {
      //   theme: require("prism-react-renderer/themes/github"),
      //   darkTheme: require("prism-react-renderer/themes/dracula"),
      // },
      navbar: {
        // style: "dark",
        title: "OLMO kit",
        // logo: {
        //   alt: "Olmo Logo",
        //   src: "img/logo.svg",
        //   srcDark: "img/logo--white.svg",
        // },
        items: [
          {
            href: "https://github.com/olmokit/olmokit",
            label: "Source",
            position: "right",
          },
        ],
      },
      footer: {
        style: "light",
        links: [
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
        copyright: `Copyright © ${new Date().getFullYear()}`,
      },
    }),
  presets: [
    [
      "classic",
      /** @type {import("@docusaurus/preset-classic").Options} */
      ({
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          routeBasePath: "/",
          editUrl:
            "https://github.com/olmokit/olmokit/tree/main/apps/docs/docs/",
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
  ],
  plugins: [
    // @see https://www.npmjs.com/package/docusaurus-plugin-typedoc
    [
      "docusaurus-plugin-typedoc",
      /** @type {Partial<import("typedoc").TypeDocOptions> & Partial<import("docusaurus-plugin-typedoc").PluginOptions>} */
      ({
        id: "browser",
        entryPoints: ["../../packages/browser/index.ts"],
        tsconfig: "../../packages/browser/tsconfig.lib.json",
        out: "./libs/browser",
        excludeExternals: true,
        // watch: true,
        // @see https://docusaurus.io/docs/api/plugins/@docusaurus/plugin-content-docs#markdown-front-matter
        frontmatter: {
          // hide_title: true,
        },
      }),
    ],
    [
      "docusaurus-plugin-typedoc",
      /** @type {Partial<import("typedoc").TypeDocOptions> & Partial<import("docusaurus-plugin-typedoc").PluginOptions>} */
      ({
        id: "dom",
        entryPoints: ["../../packages/dom/index.ts"],
        tsconfig: "../../packages/dom/tsconfig.lib.json",
        out: "./libs/dom",
        excludeExternals: true,
        // watch: true,
        frontmatter: {
          // hide_title: true,
        },
      }),
    ],
    [
      "docusaurus-plugin-typedoc",
      /** @type {Partial<import("typedoc").TypeDocOptions> & Partial<import("docusaurus-plugin-typedoc").PluginOptions>} */
      ({
        id: "utils",
        entryPoints: ["../../packages/utils/index.ts"],
        tsconfig: "../../packages/utils/tsconfig.lib.json",
        out: "./libs/utils",
        excludeExternals: true,
        // watch: true,
        frontmatter: {
          // hide_title: true,
        },
      }),
    ],
  ],
};
