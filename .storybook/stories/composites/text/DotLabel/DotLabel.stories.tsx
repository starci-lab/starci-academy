import type { Meta, StoryObj } from "@storybook/nextjs"
import { DotLabel } from "@sb-components/composites/text/DotLabel/DotLabel"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * COMPOSITE — `DotLabel`: a colour dot + an inline text label, as ONE unit —
 * no pill/background around it. Use it where a coloured dot reads faster than
 * the word alone but a full chip's padding/background would be too heavy for
 * the surface it sits in (a status line inside a card, an "Online" row beside
 * a name, a category line in a dense list).
 *
 * TWO-CANDIDATES AUDIT (build brief): checked against `Chip`'s dot variant
 * (`dotColor`/`dotClassName`) — that variant always renders inside a real
 * `HeroChip` (background + padding + rounded-full pill), so it answers "a
 * status chip", not a bare dot + label. Also checked against `Legend`
 * (`composites/stats/Legend`), which already renders this exact bare shape
 * per-entry — but only as one row of a repeated `items` list scoped to chart
 * legends, not a standalone single-instance composite. Genuinely absent
 * either way, so `DotLabel` is new.
 *
 * 📐 1 PROP = 1 LEAF: `tone` · `color` · `isSkeleton`, each its own leaf, each
 * rendering the FULL set of its values. `label` has no leaf of its own — it
 * is the content every other leaf fills in.
 *
 * Props with NO leaf, and why:
 * - `showAnatomy` / `anatPart` — anatomy tooling only, not a rendered value.
 * - `classNames` — placement inside a parent, appearance is not passable
 *   through it.
 *
 * ATOM GAP (documented in the component's own file header, same gap
 * `Legend`'s swatch and `AuthorByline`'s glyphs already flag): no bare
 * swatch/dot atom exists yet, so the dot stays a plain, unbadged span in
 * `ANNOTATE` — real DOM, no story of its own to jump to.
 */
const meta: Meta<typeof DotLabel> = {
    title: "Composites/Texts/DotLabel",
    component: DotLabel,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}
export default meta

type Story = StoryObj<typeof DotLabel>

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "Typography": {
        tier: "atom",
        role: "the label text; its tone comes from this composite's own 6-value `tone` scale, not a colour the caller sets on Typography directly",
        storyId: "atoms-text-typography-typography--plain",
    },
}

/** Baseline leaf — a status dot (Tailwind `bg-*` token) + label, tone defaults to `"muted"`. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="DotLabel"
                tier="composite"
                annotate={ANNOTATE}
                leaf="No prop turned on"
                reason="A colour swatch beside an inline text label, with no chip shell around either — the shape for a status line inside a card or a dense list row, where a full Chip's padding would be too heavy. Every other leaf on this page differs from this one by exactly one prop."
                states={[
                    {
                        name: "no prop turned on (tone = \"muted\")",
                        why: "The swatch carries a Tailwind `bg-success` token and the label reads in muted text — the plainest shape the composite can take, since a status line reads as secondary text while the swatch already carries the emphasis.",
                        code: "<DotLabel color=\"bg-success\" label=\"Running\" />",
                        render: <DotLabel color="bg-success" label="Running" showAnatomy anatPart="DotLabel" />,
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf for prop `tone` — the FULL 6-value scale; the swatch colour is independent of it (set via `color`). */
export const Tones: Story = {
    render: () => (
        <div data-tier="fixture" className="flex flex-col gap-3 p-8">
            <BlockAnatomy
                name="DotLabel"
                tier="composite"
                annotate={ANNOTATE}
                leaf="Prop `tone`"
                reason="tone colours only the LABEL text, through Typography's own 6-value TypographyColor scale — the swatch's own colour is set independently via `color`, so a green dot can sit next to a danger-toned label if the row calls for it."
                states={[
                    {
                        name: "tone = \"default\"",
                        why: "The label reads in the plain foreground colour, for a status line that should carry the same weight as the surrounding text rather than fade into it.",
                        code: "<DotLabel color=\"bg-accent\" label=\"Processing\" tone=\"default\" />",
                        render: <DotLabel color="bg-accent" label="Processing" tone="default" />,
                    },
                    {
                        name: "tone = \"muted\" (default)",
                        why: "The label reads in muted text, the tone this prop falls back to when left unset — a status line that should read as secondary information beside the swatch that already carries the meaning.",
                        code: "<DotLabel color=\"bg-success\" label=\"Online\" />",
                        render: <DotLabel color="bg-success" label="Online" />,
                    },
                    {
                        name: "tone = \"accent\"",
                        why: "The label takes the brand accent colour, for a status line the row wants to draw a little more attention to, e.g. an in-progress state.",
                        code: "<DotLabel color=\"bg-accent\" label=\"Syncing\" tone=\"accent\" />",
                        render: <DotLabel color="bg-accent" label="Syncing" tone="accent" />,
                    },
                    {
                        name: "tone = \"success\"",
                        why: "The label takes the success colour, matching a green swatch for a status that has completed or is healthy, so the dot and the word agree rather than one carrying the whole message.",
                        code: "<DotLabel color=\"bg-success\" label=\"Healthy\" tone=\"success\" />",
                        render: <DotLabel color="bg-success" label="Healthy" tone="success" />,
                    },
                    {
                        name: "tone = \"warning\"",
                        why: "The label takes the warning colour, for a status that needs the reader's attention soon without yet being a failure.",
                        code: "<DotLabel color=\"bg-warning\" label=\"Away\" tone=\"warning\" />",
                        render: <DotLabel color="bg-warning" label="Away" tone="warning" />,
                    },
                    {
                        name: "tone = \"danger\"",
                        why: "The label takes the danger colour, matching a red swatch for a status that has failed or gone offline, so both the dot and the word read as a problem.",
                        code: "<DotLabel color=\"bg-danger\" label=\"Offline\" tone=\"danger\" />",
                        render: <DotLabel color="bg-danger" label="Offline" tone="danger" />,
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf for prop `color` — the two paint channels `resolveDotColor` splits between: a Tailwind `bg-*` class, or a raw CSS colour value. */
export const Color: Story = {
    render: () => (
        <div data-tier="fixture" className="flex flex-col gap-3 p-8">
            <BlockAnatomy
                name="DotLabel"
                tier="composite"
                annotate={ANNOTATE}
                leaf="Prop `color`"
                reason="color resolves into one of two paint channels: a string starting with `bg-` applies as a Tailwind className, anything else (a raw hex, `var(--…)`, `rgb(…)`) applies as an inline `backgroundColor` — the same dual-mode split `Legend`'s own dot already uses, so one prop covers both a house token and a value outside the Tailwind palette."
                states={[
                    {
                        name: "color = \"bg-success\" (Tailwind class)",
                        why: "The string starts with `bg-`, so it applies as a className — the swatch draws from the same design-token palette every other `bg-*` colour in the app uses.",
                        code: "<DotLabel color=\"bg-success\" label=\"Running\" />",
                        render: <DotLabel color="bg-success" label="Running" />,
                    },
                    {
                        name: "color = \"#3178c6\" (raw hex value)",
                        why: "The string does not start with `bg-`, so it applies as an inline `backgroundColor` instead — this is how a value outside the Tailwind palette (e.g. GitHub's own per-language colour) renders through the exact same prop.",
                        code: "<DotLabel color=\"#3178c6\" label=\"TypeScript\" />",
                        render: <DotLabel color="#3178c6" label="TypeScript" />,
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf for prop `isSkeleton` — the swatch stays a NEUTRAL FLAT fill (no vendor Skeleton) in both states; the label shimmers through Typography. */
export const Skeleton: Story = {
    render: () => (
        <div data-tier="fixture" className="flex flex-col gap-3 p-8">
            <BlockAnatomy
                name="DotLabel"
                tier="composite"
                annotate={ANNOTATE}
                leaf="Prop `isSkeleton`"
                reason="No swatch/dot atom exists yet (ATOM GAP), so a flat, non-animated `bg-default` fill is already a correct not-loaded-yet indicator for a shape this simple — reaching for a vendor Skeleton here would only add weight for no gain. The label still shimmers through Typography's own isSkeleton bar."
                states={[
                    {
                        name: "isSkeleton = false (default)",
                        why: "The real swatch colour and label render — `color` and `label` become required once `isSkeleton` is false, enforced by the discriminated union type.",
                        code: "<DotLabel color=\"bg-success\" label=\"Running\" />",
                        render: <DotLabel color="bg-success" label="Running" />,
                    },
                    {
                        name: "isSkeleton = true",
                        why: "The swatch becomes a flat neutral `bg-default` circle and the label becomes a shimmer bar sized to a third of the row — `color` and `label` are no longer required, since neither has a value to show yet.",
                        code: "<DotLabel isSkeleton />",
                        render: <DotLabel isSkeleton />,
                    },
                ]}
            />
        </div>
    ),
}
