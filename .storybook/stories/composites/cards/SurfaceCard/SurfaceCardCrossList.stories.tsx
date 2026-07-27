import type { Meta, StoryObj } from "@storybook/nextjs"
import { Typography } from "@heroui/react"
import { SurfaceCardCrossList } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"
/**
 * KHUNG (Layouts) — a STATIC "brief" list of MARKED rows (✓ / ✗ / none) inside a
 * bounded `bg-surface` khung with a full-bleed divider: ONE list can mix both ✓
 * (included) and ✗ (not included). Read-only; for CLICKABLE rows use `SurfaceCardList`.
 *
 * ⚠️ STATE SCOPE (teacher's call, 2026-07-25): this is a REPEATING list, so `items`
 * is REQUIRED data (children forbidden). Stories here only render the states of
 * ITS OWN props: `mark` (check/cross/none), `tone` (success/muted/danger), `variant`,
 * and the `isSkeleton` mirror.
 *
 * 2026-07-26 (teacher, THREE INDEPENDENT AXES): `bordered?: boolean` → `variant?:
 * SurfaceCardVariant` (`"surface" | "nested"`, default `"surface"`). 1-1 mapping:
 * `bordered=true` → `variant="nested"`. The leaf previously split out as `Bordered`
 * is now merged into ONE `Variant` leaf rendering both values side by side (§ union
 * side-by-side, same mold as `MutedTone`).
 */
const meta: Meta<typeof SurfaceCardCrossList> = {
    title: "Composites/Cards/SurfaceCard/SurfaceCardCrossList",
    component: SurfaceCardCrossList,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}
export default meta
type Story = StoryObj<typeof SurfaceCardCrossList>
const row = (text: string) => <Typography type="body-sm">{text}</Typography>
/**
 * ANATOMY IS PER-LEAF: each story wraps its own render in its own BlockAnatomy.
 *
 * 2026-07-26 (teacher): drop the `parts` prop entirely (the OLD road, `type
 * AnatomyNode`) — this khung's repeating `CrossListItem` leaf has no story of its
 * own, so it has no REAL `storyId`; under the panel's new whitelist rule (only
 * accepts entries with a clickable `storyId`), declaring `parts`/`annotate` here
 * would just create a "dep" that clicks nowhere. Drop the prop entirely instead of
 * declaring it empty.
 */
export const Checks: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SurfaceCardCrossList"
                tier="composite"
                leaf="Checks"
                reason="A marked (✓/✗) brief list inside a bounded bg-surface frame, reused by PricingTable/CourseCard for value-props. `mark` defaults to 'check', so an item only needs `text`."
                states={[
                    {
                        name: "all items mark = check (default)",
                        why: "Every row draws a green check ahead of its text. The default mark is `check`, so a list of achievements never has to repeat `mark: \"check\"` on each row.",
                        code: `<SurfaceCardCrossList
  items={[
    { key: "projects", text: <Typography type="body-sm">Build 3 real-world projects…</Typography> },
    { key: "grading", text: <Typography type="body-sm">AI-graded assignments…</Typography> },
  ]}
/>`,
                        render: (
                            <SurfaceCardCrossList
                                showAnatomy
                                items={[
                                    { key: "projects", mark: "check", text: row("Build 3 real-world projects from scratch to deployment") },
                                    { key: "grading", mark: "check", text: row("AI-graded assignments using real hiring checklists") },
                                    { key: "mock", mark: "check", text: row("Unlimited mock interviews") },
                                ]}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
export const Crosses: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SurfaceCardCrossList"
                tier="composite"
                leaf="Crosses"
                states={[
                    {
                        name: "all items mark = cross",
                        why: "Every row draws a muted cross ahead of its text instead of a green check. `mark: \"cross\"` defaults its tone to `muted` rather than a warning color, since a plan simply not including a feature is not a warning.",
                        code: `<SurfaceCardCrossList
  items={[{ key: "cert", mark: "cross", text: <Typography type="body-sm">No certificate…</Typography> }]}
/>`,
                        render: (
                            <SurfaceCardCrossList
                                showAnatomy
                                items={[
                                    { key: "cert", mark: "cross", text: row("No certificate to submit to employers") },
                                    { key: "mentor", mark: "cross", text: row("No 1-on-1 mentor support") },
                                ]}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
/** Why merged: ONE list mixing both an included row (✓) and a not-included row (✗). */
export const Mixed: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SurfaceCardCrossList"
                tier="composite"
                leaf="Mixed"
                states={[
                    {
                        name: "items mix mark = check and mark = cross",
                        why: "Check rows and cross rows render inside the SAME list, in whatever order the caller passes them. `mark` lives on the item, not on the whole frame, so one plan's included and excluded features share a single list instead of two separate ones.",
                        code: `<SurfaceCardCrossList
  items={[
    { key: "content", mark: "check", text: <…/> },
    { key: "mentor", mark: "cross", text: <…/> },
  ]}
/>`,
                        render: (
                            <SurfaceCardCrossList
                                showAnatomy
                                items={[
                                    { key: "content", mark: "check", text: row("All 12 weeks of content + self-graded exercises") },
                                    { key: "mock", mark: "check", text: row("Unlimited mock interviews") },
                                    { key: "mentor", mark: "cross", text: row("Not included: 1-on-1 mentor review") },
                                    { key: "referral", mark: "cross", text: row("Not included: job referral support") },
                                ]}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
/** `mark="none"` — a plain row (e.g. a prerequisite, NOT an achievement, so no tick). */
export const NoMark: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SurfaceCardCrossList"
                tier="composite"
                leaf="NoMark"
                states={[
                    {
                        name: "items mark = none",
                        why: "No leading icon renders at all, only the row's text, one row = one part either way. A prerequisite is a plain requirement rather than an achievement, so it earns no tick and no cross.",
                        code: `<SurfaceCardCrossList
  items={[{ key: "lang", mark: "none", text: <Typography type="body-sm">Know any programming language</Typography> }]}
/>`,
                        render: (
                            <SurfaceCardCrossList
                                showAnatomy
                                items={[
                                    { key: "lang", mark: "none", text: row("Know any programming language") },
                                    { key: "node", mark: "none", text: row("A computer with Node.js installed") },
                                ]}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
/**
 * `variant` — surface-in-surface (§1a). `"surface"` (default) when rendered DIRECTLY
 * on `bg-background`; `"nested"` (border instead of shadow) when this khung is
 * nested inside another surface (modal/drawer/panel).
 *
 * 2026-07-26 (teacher): merged from the old `Bordered` leaf (which only rendered
 * ONE value, `bordered=true`) into ONE `Variant` leaf rendering the full union side
 * by side — row composition doesn't change between the two values, only the outer
 * khung changes.
 */
export const Variant: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SurfaceCardCrossList"
                tier="composite"
                leaf="Variant"
                reason="Surface-in-surface (§1a): the list needs to know whether it sits directly on the page background or inside another surface, since a shadow disappears against a surface of the same tone."
                states={[
                    {
                        name: "variant = surface (default)",
                        why: "The list draws its own drop shadow, since it is rendered directly on `bg-background` with nothing else behind it. This is the variant a list gets without passing `variant` at all.",
                        code: "<SurfaceCardCrossList items={[…]} />",
                        render: (
                            <SurfaceCardCrossList
                                showAnatomy
                                items={[
                                    { key: "included", mark: "check", text: row("Included: full course content") },
                                    { key: "excluded", mark: "cross", text: row("Not included: 1-on-1 mentor") },
                                ]}
                            />
                        ),
                    },
                    {
                        name: "variant = nested",
                        why: "The list draws a border instead of a shadow, so it stays legible sitting inside another surface (a modal, a drawer, a panel) where a shadow would be invisible. Row composition doesn't change between the two variants, only the outer frame does.",
                        code: "<SurfaceCardCrossList variant=\"nested\" items={[…]} />",
                        render: (
                            <div className="rounded-3xl bg-surface p-3 shadow-surface">
                                <SurfaceCardCrossList
                                    variant="nested"
                                    showAnatomy
                                    items={[
                                        { key: "included", mark: "check", text: row("Included: full course content") },
                                        { key: "excluded", mark: "cross", text: row("Not included: 1-on-1 mentor") },
                                    ]}
                                />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}
/**
 * `tone="danger"` — a RED mark for a hard-negative row (a real loss/block/warning),
 * distinct from a muted cross which just means "not included". Same mark element,
 * only the TONE escalates (§2d) — e.g. a list of consequences when cancelling a plan.
 */
export const DangerTone: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SurfaceCardCrossList"
                tier="composite"
                leaf="DangerTone"
                states={[
                    {
                        name: "items mark = cross, tone = danger on the escalated rows",
                        why: "Two rows draw a red cross instead of the usual muted one, while a third cross row beside them stays muted. The same mark element only escalates in tone (§2d) for a real loss or block, like the consequences of cancelling a plan, distinct from a plain not-included row.",
                        code: `<SurfaceCardCrossList
  items={[{ key: "progress", mark: "cross", tone: "danger", text: <…/> }]}
/>`,
                        render: (
                            <SurfaceCardCrossList
                                showAnatomy
                                items={[
                                    { key: "progress", mark: "cross", tone: "danger", text: row("Lose all AI-graded assignment progress") },
                                    { key: "mock", mark: "cross", tone: "danger", text: row("Lose unlimited mock interview access") },
                                    { key: "mentor", mark: "cross", text: row("Not included: 1-on-1 mentor (unchanged)") },
                                ]}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
/**
 * `tone="muted"` — the check fades so the text leads (used for value-props living
 * INSIDE another card, e.g. CourseCard): avoids color noise when the card already
 * has another focal point (price/CTA). Compare with `tone="success"` (default,
 * green — a real "included" signal, as in PricingTable). See `principles.md` §2.
 */
export const MutedTone: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SurfaceCardCrossList"
                tier="composite"
                leaf="MutedTone"
                reason="Compares tone success (default, a real included signal, as in PricingTable) against tone muted (used for value-props living inside another card, e.g. CourseCard, to avoid color noise when the card already has another focal point like a price or a CTA). See principles.md §2."
                states={[
                    {
                        name: "items mark = check, tone = success (default)",
                        why: "Both checks render bright green. This is the tone a check gets without passing `tone` at all, a real included signal on its own.",
                        code: `<SurfaceCardCrossList
  variant="nested"
  items={[{ key: "projects", mark: "check", text: <…/> }]}
/>`,
                        render: (
                            <SurfaceCardCrossList
                                variant="nested"
                                showAnatomy
                                items={[
                                    { key: "projects", mark: "check", text: row("Build 3 real-world projects") },
                                    { key: "grading", mark: "check", text: row("AI-graded assignments") },
                                ]}
                            />
                        ),
                    },
                    {
                        name: "items mark = check, tone = muted",
                        why: "Both checks fade to the muted tone so the text leads instead of the icon. Use this when the list lives inside another card that already has its own focal point, like a price or a CTA, and the check would otherwise add color noise.",
                        code: `<SurfaceCardCrossList
  variant="nested"
  items={[{ key: "projects", mark: "check", tone: "muted", text: <…/> }]}
/>`,
                        render: (
                            <SurfaceCardCrossList
                                variant="nested"
                                showAnatomy
                                items={[
                                    { key: "projects", mark: "check", tone: "muted", text: row("Build 3 real-world projects") },
                                    { key: "grading", mark: "check", tone: "muted", text: row("AI-graded assignments") },
                                ]}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
/** `isSkeleton` — `skeletonRows` mirror rows (round dot + text bar) while the list hasn't loaded yet. */
export const Loading: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SurfaceCardCrossList"
                tier="composite"
                leaf="Loading"
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "The frame self-generates `skeletonRows` mirror rows (a round dot + a text bar), ignoring `items` entirely, all sharing the same single `CrossListItem` part as the loaded rows. The caller never has to build placeholder items by hand while data hasn't landed yet.",
                        code: `<SurfaceCardCrossList
  items={[]}
  isSkeleton
/>`,
                        render: <SurfaceCardCrossList items={[]} isSkeleton showAnatomy />,
                    },
                ]}
            />
        </div>
    ),
}