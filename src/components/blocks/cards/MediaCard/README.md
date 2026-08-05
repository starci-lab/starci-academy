# MediaCard

A consolidated, presentational content card for course / lesson / challenge / blog grids — a **composite**
(despite living under `blocks/cards/`: it takes no domain entity, only shapes/slots — `cover`, `title`, `meta`,
`description`, `footer`, `onPress`, `href` — so per canon `BLOCK-7` it is a composite in a block-shaped folder,
not a data-owning block. The folder/export name stayed put on purpose — see the note at the bottom).

## When to use

- Use when you need a uniform card shape across any content-grid page (courses, lessons, challenges, blog posts).
- Use when the card may or may not be interactive — `href` and `onPress` are both optional, so the same block works for static displays and clickable grids.
- Prefer `href` over `onPress` for pure navigation so the browser renders a real anchor (right-click, open in tab, SEO).
- Do NOT use for profile/user cards — reach for `ProfileCard` or a similar identity-focused block instead.
- Do NOT use when you need a pressable card with HeroUI's built-in press animation — this block intentionally wraps `<a>` / `<button>` around a static `<Card>` (HeroUI v3 `Card` is not pressable).

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | `React.ReactNode` | — (required) | Primary heading rendered as `text-base font-medium text-foreground`. |
| `cover` | `React.ReactNode` | `undefined` | Optional media node (e.g. `<img>`, gradient banner) rendered flush at the top of the card, outside the padded body. |
| `meta` | `React.ReactNode` | `undefined` | Optional metadata row under the title — typically HeroUI `Chip`s or muted text (category, difficulty, duration). |
| `description` | `React.ReactNode` | `undefined` | Optional excerpt clamped to two lines (`line-clamp-2 text-sm text-muted`) to keep grid rows uniform. |
| `footer` | `React.ReactNode` | `undefined` | Optional footer pinned at the bottom of the body — CTA button, price, or progress indicator. |
| `href` | `string` | `undefined` | When set, the whole card becomes a native `<a>` anchor. Takes priority over `onPress`. |
| `onPress` | `() => void` | `undefined` | When set (and `href` is absent), the whole card becomes a pressable `<button>` (ripple + press-scale, via `SurfaceCard`). |
| `classNames` | `Array<AllowedClassName>` | `undefined` | Positioning-only classes on the outermost element. Composite tier takes a closed union, not a raw `className` string. |

## Usage

```tsx
import React from "react"
import { Chip } from "@/components/atoms/chips/Chip"
import { Cluster } from "@/components/frames/Cluster"
import { MediaCard } from "@/components/blocks/cards/MediaCard"

export const CourseCardExample = () => (
    <MediaCard
        href="/courses/fullstack-mastery"
        cover={
            <img
                src="/thumbnails/fullstack.webp"
                alt=""
                className="size-full object-cover"
            />
        }
        title="Fullstack Mastery"
        meta={
            <Cluster
                gap={3}
                items={[
                    () => <Chip tone="default" text="20 modules" />,
                    () => <Chip tone="success" text="Intermediate" />,
                ]}
            />
        }
        description="Build production-grade fullstack apps with TypeScript, React, and NestJS — from zero to deployed."
        footer={<span className="text-sm font-medium text-foreground">Free</span>}
    />
)
```

## Composes

- **`SurfaceCard`** (`@/components/composites/cards/SurfaceCard`) — the one card-face composite. `variant="nested"` reproduces the flat, border-not-shadow look this card always had; `padding={1}` keeps the face flush so the cover can bleed to the edge; `onPress`/`href` reuse `SurfaceCard`'s own press handling (ripple + press-scale for `onPress`, a real anchor for `href`) instead of a hand-rolled wrapper.
- **`Image`** (`@/components/atoms/media/Image`) — the fallback 16:9 cover when {@link cover} is omitted.
- **`Typography`** (`@/components/atoms/text/Typography`) — the title and the two-line-clamped description.
- **`Cluster`** (`@/components/frames/Cluster`) — wraps `meta` in the same wrapping, `gap-2`-spaced row the card has always used.
- **`Box`** (`@/components/frames/Box`) — the frame-tier escape hatch for the fixed-aspect, `object-cover` cover slot (an arbitrary caller-supplied node, not a shape any typed frame owns).

## Notes

- **Tier.** `MediaCard` takes no domain entity — every prop is a shape/slot (`cover`, `title`, `meta`, `description`, `footer`, `onPress`, `href`), so per canon `BLOCK-7` it is a **composite**, not a block, even though it lives under `blocks/cards/` and keeps that folder/export name (moving it would break every importer; that is a separate pass).
- **`cover`/`meta`/`description`/`footer` stay `ReactNode`, not `ComponentType`.** Composite tier (`COMPOSITE-8`) prefers a component reference so a slot can be told `isSkeleton`, but `MediaCard` has no loading state of its own and two real call sites (`PinnedProjectCard`, `CvGallery`) already pass fully-built nodes (buttons, live renders) for these slots. Changing the type would break both without touching this folder, so the looser `ReactNode` shape stayed — a known, documented gap rather than a silent one.
- **`cover` is unpadded.** The resolved cover node renders inside a `Box` framed to `aspect-video w-full overflow-hidden`, before the padded title/meta/description/footer stack, so an `<img>` or gradient fills edge-to-edge. Do not add padding inside your cover node.
- **`description` line clamp.** The description is always clamped to two lines via `Typography`'s own `lineClamp={2}`. Avoid passing rich node trees here — plain strings or a single `<span>` work best.
- **Spacing.** The body stack uses `gap={4}` (`gap-3`) between all slots (title / meta / description / footer) — unchanged from before.
- **Accessibility.** When `href` is set, the outer `<a>` has no `aria-label`; ensure the `title` prop is descriptive enough to serve as the link label. `onPress` renders through `SurfaceCard`'s own `<button type="button">` handling.
