import type { Meta, StoryObj } from "@storybook/nextjs"
import { SurfaceCardCrossList } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"
/**
 * `SurfaceCardCrossList` — a static "brief" list of marked rows (check / x / none) inside a
 * bounded `bg-surface` frame with a full-bleed divider: one list can mix both check (included) and
 * x (not included). Read-only; for clickable rows use `SurfaceCardList`. Owns `mark`
 * (check/cross/none), `tone` (success/muted/danger), and `variant` (`"surface" | "nested"`).
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
/** `text` is a plain string (COMPOSITE-8) — the composite wraps it in `Typography` itself. Kept as a named helper so every leaf below reads the same as before. */
const row = (text: string) => text
/**
 * ANATOMY IS PER-LEAF: each story wraps its own render in its own BlockAnatomy.
 *
 * No `parts`/`annotate` here — this khung's repeating `CrossListItem` leaf has no
 * story of its own, so it has no REAL `storyId`; under the panel's whitelist rule
 * (only accepts entries with a clickable `storyId`), declaring them here would just
 * create a "dep" that clicks nowhere.
 */
export const Checks: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="SurfaceCardCrossList"
                tier="composite"
                leaf="Checks"
                reason="A marked (check/x) brief list inside a bounded bg-surface frame, reused by PricingTable/CourseCard for value-props. `mark` defaults to 'check', so an item only needs `text`."
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
/** Story: marked rows using the cross mark. */
export const Crosses: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
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
/** Why merged: ONE list mixing both an included row (check) and a not-included row (x). */
export const Mixed: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
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
        <div data-tier="fixture" className="p-8">
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
 * `variant` — surface-in-surface. `"surface"` (default) when rendered DIRECTLY
 * on `bg-background`; `"nested"` (border instead of shadow) when this frame is
 * nested inside another surface (modal/drawer/panel). Row composition doesn't
 * change between the two values, only the outer frame changes.
 */
export const Variant: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
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
                            <div data-tier="fixture" className="rounded-3xl bg-surface p-3 shadow-surface">
                                <SurfaceCardCrossList
                                    variant="nested"

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
        <div data-tier="fixture" className="p-8">
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
        <div data-tier="fixture" className="p-8">
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
        <div data-tier="fixture" className="p-8">
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
                        render: <SurfaceCardCrossList items={[]} isSkeleton />,
                    },
                ]}
            />
        </div>
    ),
}