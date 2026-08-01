import type { Meta, StoryObj } from "@storybook/nextjs"
import { UsersIcon } from "@phosphor-icons/react"
import { IconLabelValueRow } from "@sb-components/composites/lists/IconLabelValueRow/IconLabelValueRow"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * COMPOSITE — `IconLabelValueRow`: a leading icon + flex-1 label + trailing
 * value, one `content-row` seam (12px) across all three segments. For a flat
 * "spec line" — a permission row, a plan-limit line, a settings line reporting
 * its current value — where `ListRow`'s own title↔subtitle column would be one
 * text line too many.
 *
 * `label` reads as the row's own text (`default`, medium weight); `value`
 * reads as the fact the row reports (`muted`), pinned to the trailing end —
 * the same foreground/muted split `ListRow`'s title/meta pairing already uses.
 */
const meta: Meta<typeof IconLabelValueRow> = {
    title: "Composites/Lists/IconLabelValueRow/IconLabelValueRow",
    component: IconLabelValueRow,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof IconLabelValueRow>

/** LEAF — icon + label (flex-1, truncates) + trailing value, one `content-row` seam. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="IconLabelValueRow"
                tier="composite"
                leaf="Default"
                parts={[]}
                renderClassName="mx-auto max-w-xs"
                states={[
                    {
                        name: "icon + label + value",
                        why: "One `content-row` seam (12px) across icon↔label↔value — no sub-grouping inside the row, so a single gap value is the honest read. `label` is `default`/medium (the row's own text), `value` is `muted` (the fact it reports).",
                        code: `<IconLabelValueRow icon={UsersIcon} label="Members" value="12 / 20" />`,
                        render: (
                            <IconLabelValueRow
                                anatPart="IconLabelValueRow"
                                showAnatomy
                                icon={UsersIcon}
                                label="Members"
                                value="12 / 20"
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — the caller flips `isSkeleton`; icon becomes a flat placeholder, label/value shimmer through `Typography`'s own bar. */
export const Skeleton: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="IconLabelValueRow"
                tier="composite"
                leaf="Prop `isSkeleton`"
                parts={[]}
                renderClassName="mx-auto max-w-xs"
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "The icon slot shimmers as a flat `bg-default` placeholder (no bare icon-shaped skeleton atom exists yet); `label`/`value` shimmer through `Typography`'s own `isSkeleton` bar, sized to a fraction this row picks.",
                        code: `<IconLabelValueRow isSkeleton icon={UsersIcon} label="Members" value="12 / 20" />`,
                        render: (
                            <IconLabelValueRow
                                anatPart="IconLabelValueRow"
                                showAnatomy
                                isSkeleton
                                icon={UsersIcon}
                                label="Members"
                                value="12 / 20"
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — a long label truncates inside a bounded width; `value` stays put at the trailing end. */
export const TruncatedLabel: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <div data-tier="fixture" className="w-64 rounded-2xl border border-separator p-3">
                <IconLabelValueRow
                    icon={UsersIcon}
                    label="A very long label used to test line truncation in the middle of a row"
                    value="12 / 20"
                />
            </div>
        </div>
    ),
}
