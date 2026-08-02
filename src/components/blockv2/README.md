# `blockv2/` — block tier, rebuilt v2 (story-driven)

The original blocks stay in `blocks/`. A block rebuilt story-driven lands here as ONE
folder with the presentational / connected split (see
`design/storybook/architecture/split.md`):

| File | Export | Is |
|---|---|---|
| `component.tsx` | `_Name` | **presentational** — typed props, already resolved; no fetch/store/i18n |
| `index.tsx` | `Name` | **connected** — owns the block's data + i18n, renders `<_Name {...resolved} />` |

The app imports `Name`; Storybook renders `_Name`. A block owns domain data and its
async switch (error → loading → empty → content), split across the two files.

Empty for now — blocks move here as they are rebuilt.
