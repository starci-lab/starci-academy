import type { Meta, StoryObj } from "@storybook/nextjs"
import { Typography } from "@heroui/react"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * KHUNG (Layouts) — a STATIC "brief" list of MARKED rows (✓ / ✗ / none) inside a
 * bounded `bg-surface` khung with a full-bleed divider: ONE list can mix both ✓
 * (included) and ✗ (not included). Read-only; for CLICKABLE rows use `SurfaceCard.List`.
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
const meta: Meta<typeof SurfaceCard.CrossList> = {
    title: "Composites/Cards/SurfaceCard/SurfaceCard.CrossList",
    component: SurfaceCard.CrossList,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof SurfaceCard.CrossList>

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
                name="SurfaceCard.CrossList"
                tier="composite"
                leaf="Checks"
                reason="A marked (✓/✗) brief list inside a bounded bg-surface frame, reused by PricingTable/CourseCard for value-props. `mark` defaults to 'check', so an item only needs `text`."
                code={`<SurfaceCard.CrossList
  items={[
    { key: "projects", text: <Typography type="body-sm">Build 3 real-world projects…</Typography> },
    { key: "grading", text: <Typography type="body-sm">AI-graded assignments…</Typography> },
  ]}
/>`}
            >
                <SurfaceCard.CrossList
                    showAnatomy
                    items={[
                        { key: "projects", mark: "check", text: row("Build 3 real-world projects from scratch to deployment") },
                        { key: "grading", mark: "check", text: row("AI-graded assignments using real hiring checklists") },
                        { key: "mock", mark: "check", text: row("Unlimited mock interviews") },
                    ]}
                />
            </BlockAnatomy>
        </div>
    ),
}

export const Crosses: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SurfaceCard.CrossList"
                tier="composite"
                leaf="Crosses"
                note="`mark='cross'` → XCircleIcon, default tone 'muted' (not included — recede, not a warning)."
                code={`<SurfaceCard.CrossList
  items={[{ key: "cert", mark: "cross", text: <Typography type="body-sm">No certificate…</Typography> }]}
/>`}
            >
                <SurfaceCard.CrossList
                    showAnatomy
                    items={[
                        { key: "cert", mark: "cross", text: row("No certificate to submit to employers") },
                        { key: "mentor", mark: "cross", text: row("No 1-on-1 mentor support") },
                    ]}
                />
            </BlockAnatomy>
        </div>
    ),
}

/** Why merged: ONE list mixing both an included row (✓) and a not-included row (✗). */
export const Mixed: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SurfaceCard.CrossList"
                tier="composite"
                leaf="Mixed"
                note="One CrossList mixing both `mark: 'check'` and `mark: 'cross'` — mark lives on the ITEM, not the frame."
                code={`<SurfaceCard.CrossList
  items={[
    { key: "content", mark: "check", text: <…/> },
    { key: "mentor", mark: "cross", text: <…/> },
  ]}
/>`}
            >
                <SurfaceCard.CrossList
                    showAnatomy
                    items={[
                        { key: "content", mark: "check", text: row("All 12 weeks of content + self-graded exercises") },
                        { key: "mock", mark: "check", text: row("Unlimited mock interviews") },
                        { key: "mentor", mark: "cross", text: row("Not included: 1-on-1 mentor review") },
                        { key: "referral", mark: "cross", text: row("Not included: job referral support") },
                    ]}
                />
            </BlockAnatomy>
        </div>
    ),
}

/** `mark="none"` — a plain row (e.g. a prerequisite, NOT an achievement, so no tick). */
export const NoMark: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SurfaceCard.CrossList"
                tier="composite"
                leaf="NoMark"
                note="`mark: 'none'` → the row renders no icon, only content — still the same composition (1 row = 1 part)."
                code={`<SurfaceCard.CrossList
  items={[{ key: "lang", mark: "none", text: <Typography type="body-sm">Know any programming language</Typography> }]}
/>`}
            >
                <SurfaceCard.CrossList
                    showAnatomy
                    items={[
                        { key: "lang", mark: "none", text: row("Know any programming language") },
                        { key: "node", mark: "none", text: row("A computer with Node.js installed") },
                    ]}
                />
            </BlockAnatomy>
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
        <div className="flex flex-col gap-6 p-8">
            <div className="flex flex-col gap-2">
                <Typography type="body-xs" color="muted">variant=&quot;surface&quot; (default) — shadow-surface, rendered directly on bg-background</Typography>
                <BlockAnatomy
                    name="SurfaceCard.CrossList"
                    tier="composite"
                    leaf="Variant / surface"
                    code={"<SurfaceCard.CrossList items={[…]} />"}
                >
                    <SurfaceCard.CrossList
                        showAnatomy
                        items={[
                            { key: "included", mark: "check", text: row("Included: full course content") },
                            { key: "excluded", mark: "cross", text: row("Not included: 1-on-1 mentor") },
                        ]}
                    />
                </BlockAnatomy>
            </div>
            <div className="flex flex-col gap-2">
                <Typography type="body-xs" color="muted">variant=&quot;nested&quot; — border instead of shadow, when nested inside another surface</Typography>
                <div className="rounded-3xl bg-surface p-3 shadow-surface">
                    <BlockAnatomy
                        name="SurfaceCard.CrossList"
                        tier="composite"
                        leaf="Variant / nested"
                        note={"`variant=\"nested\"` changes the outer frame (border instead of shadow) when nested in another surface — row composition stays the same."}
                        code={"<SurfaceCard.CrossList variant=\"nested\" items={[…]} />"}
                    >
                        <SurfaceCard.CrossList
                            variant="nested"
                            showAnatomy
                            items={[
                                { key: "included", mark: "check", text: row("Included: full course content") },
                                { key: "excluded", mark: "cross", text: row("Not included: 1-on-1 mentor") },
                            ]}
                        />
                    </BlockAnatomy>
                </div>
            </div>
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
                name="SurfaceCard.CrossList"
                tier="composite"
                leaf="DangerTone"
                note="`tone: 'danger'` only changes the mark icon's color inside the row — composition (1 row = 1 part) stays the same."
                code={`<SurfaceCard.CrossList
  items={[{ key: "progress", mark: "cross", tone: "danger", text: <…/> }]}
/>`}
            >
                <SurfaceCard.CrossList
                    showAnatomy
                    items={[
                        { key: "progress", mark: "cross", tone: "danger", text: row("Lose all AI-graded assignment progress") },
                        { key: "mock", mark: "cross", tone: "danger", text: row("Lose unlimited mock interview access") },
                        { key: "mentor", mark: "cross", text: row("Not included: 1-on-1 mentor (unchanged)") },
                    ]}
                />
            </BlockAnatomy>
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
        <div className="flex flex-col gap-6 p-8">
            <div className="flex flex-col gap-2">
                <Typography type="body-xs" color="muted">tone=&quot;success&quot; (default) — green check, an &quot;included&quot; signal</Typography>
                <BlockAnatomy
                    name="SurfaceCard.CrossList"
                    tier="composite"
                    leaf="MutedTone / success"
                    code={`<SurfaceCard.CrossList
  variant="nested"
  items={[{ key: "projects", mark: "check", text: <…/> }]}
/>`}
                >
                    <SurfaceCard.CrossList
                        variant="nested"
                        showAnatomy
                        items={[
                            { key: "projects", mark: "check", text: row("Build 3 real-world projects") },
                            { key: "grading", mark: "check", text: row("AI-graded assignments") },
                        ]}
                    />
                </BlockAnatomy>
            </div>
            <div className="flex flex-col gap-2">
                <Typography type="body-xs" color="muted">tone=&quot;muted&quot; — faded check, text leads (value-props inside another card)</Typography>
                <BlockAnatomy
                    name="SurfaceCard.CrossList"
                    tier="composite"
                    leaf="MutedTone / muted"
                    note="`tone: 'muted'` only changes the icon color — composition stays the same as the success leaf above."
                    code={`<SurfaceCard.CrossList
  variant="nested"
  items={[{ key: "projects", mark: "check", tone: "muted", text: <…/> }]}
/>`}
                >
                    <SurfaceCard.CrossList
                        variant="nested"
                        showAnatomy
                        items={[
                            { key: "projects", mark: "check", tone: "muted", text: row("Build 3 real-world projects") },
                            { key: "grading", mark: "check", tone: "muted", text: row("AI-graded assignments") },
                        ]}
                    />
                </BlockAnatomy>
            </div>
        </div>
    ),
}

/** `isSkeleton` — `skeletonRows` mirror rows (round dot + text bar) while the list hasn't loaded yet. */
export const Loading: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SurfaceCard.CrossList"
                tier="composite"
                leaf="Loading"
                note="`isSkeleton` → the frame self-generates `skeletonRows` rows in skeleton state (ignores `items`), same single part 'CrossListItem'."
                code={`<SurfaceCard.CrossList
  items={[]}
  isSkeleton
/>`}
            >
                <SurfaceCard.CrossList items={[]} isSkeleton showAnatomy />
            </BlockAnatomy>
        </div>
    ),
}
