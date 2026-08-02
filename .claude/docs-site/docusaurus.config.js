// @ts-check
// StarCi Claude docs — renders the .claude/ canon IN PLACE via docs.path.
// The source of truth is .claude/{design,rules,skills}/**; this site NEVER copies —
// it points `docs.path` one level up at `.claude/` and serves those files directly.
// (This is exactly what Nextra lacks natively and why we chose Docusaurus — thầy 2026-08-03.)

const { themes } = require("prism-react-renderer")

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "StarCi · Claude Canon",
  tagline: "Storybook design-system, rules & skills — the source an AI reads to build safely.",
  favicon: "img/favicon.ico",
  url: "https://starci.local",
  baseUrl: "/",

  // Existing canon uses plain relative `.md` links (e.g. `[gap](principles/gap.md)`) —
  // warn, don't fail the build, so docs render even before every link is Docusaurus-shaped.
  onBrokenLinks: "warn",
  onBrokenMarkdownLinks: "warn",

  markdown: { format: "detect" },

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          // ⭐ THE KEY LINE — read docs straight from `.claude/` (parent of docs-site/),
          // no sync/copy. Skills land here automatically once `.claude/skills/**` exists.
          path: "..",
          routeBasePath: "/docs",
          sidebarPath: require.resolve("./sidebars.js"),
          include: ["**/*.md", "**/*.mdx"],
          exclude: [
            "docs-site/**", // this site itself
            "worktrees/**", // throwaway git worktrees
            "**/node_modules/**",
            "README.md", // the .claude root readme is meta, not a doc page
          ],
        },
        blog: false,
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: "StarCi · Claude Canon",
        items: [
          { type: "docSidebar", sidebarId: "canon", position: "left", label: "Canon" },
        ],
      },
      footer: {
        style: "dark",
        copyright: "StarCi design-system canon — read by AI, refined by thầy.",
      },
      prism: {
        theme: themes.github,
        darkTheme: themes.dracula,
      },
    }),
}

module.exports = config
