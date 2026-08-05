# `page/` — page tier (v2 story-driven)

Each page is ONE folder with the presentational / connected split (see
`design/storybook/architecture/split.md`):

| File | Export | Is |
|---|---|---|
| `component.tsx` | `_Name` | **presentational** — typed props, already resolved; no fetch/store/i18n |
| `index.tsx` | `Name` | **connected** — owns page data + i18n, renders `<_Name {...resolved} />` |

The app imports `Name`; Storybook renders `_Name`. A page names blocks, arranges
them in frames, and passes typed data — it draws no shape of its own.

Migrated here from `features/<domain>/` as each page is rebuilt v2. First: `CourseContents/`.
