import type { Meta, StoryObj } from "@storybook/nextjs"
import type { ReactNode } from "react"
import { FloppyDiskIcon } from "@phosphor-icons/react"
import { ActionBar, type ActionBarSlot } from "@sb-components/composites/buttons/ActionBar/ActionBar"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ⚠️ STATE SCOPE: `ActionBar` does not grow new meaning — it composes `Button` per
 * role and hands the row to `ResponsiveCluster`. Stories here render only state that
 * BELONGS TO THE ROW: which roles are present (`primary`/`secondary`/`dismiss`),
 * the row-level `isSkeleton`, and the row-level `at` threshold. Per-button state
 * (`prefixIcon`, `isPending`, `isDisabled`, what a variant looks like) lives on the
 * `Button` story, not repeated here — same split `ButtonGroup`'s stories already draw.
 *
 * 📐 1 PROP = 1 LEAF, with one deliberate exception: `primary`/`secondary`/`dismiss`
 * share ONE leaf ("Slots") rather than three, because they are not independent
 * axes — they are the one shape decision this component exists to make (which
 * roles are in the row), so the states under that leaf vary which slots are
 * present rather than one prop's value in isolation.
 */
const meta: Meta<typeof ActionBar> = {
    title: "Composites/Buttons/ActionBar",
    component: ActionBar,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}
export default meta
type Story = StoryObj<typeof ActionBar>

/**
 * DEPS = the atom this row renders. Since `Button` self-badges (ATOM-10), `ActionBar`
 * only forwards `showAnatomy` — it never hands down a part name of its own.
 */
const ACTION_BAR_ANNOTATE: Record<string, AnatomyAnnotation> = {
    "Button": {
        tier: "atom",
        role: "each present slot renders one Button — `primary` as variant \"primary\", `secondary` as \"secondary\", `dismiss` as \"ghost\" — chosen by the slot, never by the caller",
        storyId: "atoms-buttons-button-button--default",
    },
}

const dismiss: ActionBarSlot = { label: "Cancel" }
const secondary: ActionBarSlot = { label: "Save draft" }
const primary: ActionBarSlot = { label: "Submit", prefixIcon: FloppyDiskIcon }

/** Leaf `primary`/`secondary`/`dismiss` — the one shape decision: which roles are in the row. */
export const Slots: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="ActionBar"
                tier="composite"
                leaf="Slots `primary` / `secondary` / `dismiss`"
                annotate={ACTION_BAR_ANNOTATE}
                reason="Named slots make the hierarchy structural: there is exactly one prop called `primary`, so two primary actions are unrepresentable rather than merely discouraged, and each role renders a fixed variant no caller can override."
                states={[
                    {
                        name: "primary only",
                        why: "`primary` is the only required slot — a row can be just the one emphasized action, e.g. a single-step confirmation with nothing to cancel back to.",
                        code: `<ActionBar primary={{ label: "Submit", onPress }} />`,
                        render: <ActionBar primary={primary} />,
                    },
                    {
                        name: "primary + dismiss",
                        why: "The common modal shape: an exit action and one emphasized action. `dismiss` renders `ghost` so it never competes with `primary` for attention.",
                        code: `<ActionBar
  primary={{ label: "Submit", onPress }}
  dismiss={{ label: "Cancel", onPress }}
/>`,
                        render: <ActionBar primary={primary} dismiss={dismiss} />,
                    },
                    {
                        name: "primary + secondary + dismiss",
                        why: "All three roles at once — Submit / Save draft / Cancel. `secondary` sits between the two in emphasis (`variant=\"secondary\"`), and the row still can't grow a second `primary`.",
                        code: `<ActionBar
  primary={{ label: "Submit", onPress }}
  secondary={{ label: "Save draft", onPress }}
  dismiss={{ label: "Cancel", onPress }}
/>`,
                        render: <ActionBar primary={primary} secondary={secondary} dismiss={dismiss} />,
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf prop `isSkeleton` — turned on at the row level, each present slot draws its own shimmer. */
export const Skeleton: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="ActionBar"
                tier="composite"
                leaf="Prop `isSkeleton`"
                annotate={ACTION_BAR_ANNOTATE}
                reason="The row only passes the flag down; each present slot's Button draws its own shimmer at its own footprint, so the row holds the same shape and count it would with real labels — nothing shifts once data lands."
                states={[
                    {
                        name: "isSkeleton = true, primary + secondary + dismiss",
                        why: "All three roles still render as three shimmer buttons, in the same order and with the same gap — the composite decides the count is three, the atom decides each shimmer's own shape.",
                        code: `<ActionBar isSkeleton primary={{ label: "Submit" }} secondary={{ label: "Save draft" }} dismiss={{ label: "Cancel" }} />`,
                        render: <ActionBar isSkeleton primary={primary} secondary={secondary} dismiss={dismiss} />,
                    },
                ]}
            />
        </div>
    ),
}

/**
 * `@app-md` (the default `at`) reads the nearest `@container`, not the viewport —
 * demoing the switch means opening a `@container` at a real width, same as
 * `ButtonGroup`'s own `Responsive` story does.
 */
const ResponsiveFrame = ({ width, label, children }: { width: string; label: string; children: ReactNode }) => (
    <div className="flex flex-col gap-2">
        <Typography size="xs" text={label} color="muted" />
        <div className="@container rounded-3xl border border-dashed border-default p-3" style={{ width, maxWidth: "100%" }}>
            {children}
        </div>
    </div>
)

/** Leaf prop `at` — the named container step this row leaves a full-width column for a packed row at. */
export const Responsive: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="ActionBar"
                tier="composite"
                leaf="Prop `at`"
                annotate={ACTION_BAR_ANNOTATE}
                reason="A composite does not draw its own flex track (FRAME-1) — the row/column switch and the gap between buttons both belong to the frame underneath (`ResponsiveCluster`), named at a container step rather than wherever the labels happen to wrap (FRAME-10). `at` defaults to `md`, one step wider than `ButtonGroup`'s `sm`, because these labels run longer than a filter row's."
                states={[
                    {
                        name: "narrow container (320px, below @app-md): full-width column",
                        why: "Each button stretches to the row's full width and stacks — dismiss, then secondary, then primary, top to bottom — the shape a phone-width modal needs, never triggered by content wrapping.",
                        code: `<ActionBar primary={{…}} secondary={{…}} dismiss={{…}} />          // at="md" = default`,
                        render: (
                            <ResponsiveFrame width="20rem" label="container 320px, below @app-md, full-width column">
                                <ActionBar primary={primary} secondary={secondary} dismiss={dismiss} />
                            </ResponsiveFrame>
                        ),
                    },
                    {
                        name: "wide container (768px, at or above @app-md = 48rem/768px): packed row",
                        why: "The same three buttons pack into one row, right-aligned (`justify=\"end\"`), at the shared gap step (3 → gap-2) — no re-render, no boolean flag, the same container simply crossed the named width.",
                        code: `<ActionBar primary={{…}} secondary={{…}} dismiss={{…}} />          // at="md" = default`,
                        render: (
                            <ResponsiveFrame width="50rem" label="container 800px, at @app-md, packed row">
                                <ActionBar primary={primary} secondary={secondary} dismiss={dismiss} />
                            </ResponsiveFrame>
                        ),
                    },
                ]}
            />
        </div>
    ),
}
