# SimpleEmptyState

A tier-3 presentational block that renders a single small, muted line of text for lightweight empty-state placeholders inside a tab or panel body.

## When to use

- **Use** for a minimal "nothing here yet" message inside a small area (e.g. a tab body, a section with little vertical room).
- **Do not use** when the empty state needs an icon, title/description split, or a call-to-action — use `EmptyState` instead.
- **Do not use** when the data is still loading — show a skeleton or spinner instead.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — *(required)* | Translated copy explaining why the area is empty. |
| `className` | `string` | `undefined` | Additional Tailwind classes merged onto the root `p` via `cn`. Inherited from `WithClassNames`. |

## Usage

```tsx
import React from "react"
import { useTranslations } from "next-intl"
import { SimpleEmptyState } from "@/components/blocks/feedback/SimpleEmptyState"

export const CodeExplainingEmpty = () => {
    const t = useTranslations()
    return <SimpleEmptyState>{t("content.codeExplainings.empty")}</SimpleEmptyState>
}
```

## Composes

- `cn` from `@heroui/react` — class merging utility.
- No other HeroUI components, reusable blocks, or sub-blocks. This is a leaf block.

## Notes

- **No translation logic** — copy is passed as `ReactNode` (`children`) so the caller controls i18n.
- **Not the same as `EmptyState`** — this block is a plain `<p>` with no icon/title/description/action slots or centered layout. Prefer `EmptyState` once a placeholder needs more than one line.
