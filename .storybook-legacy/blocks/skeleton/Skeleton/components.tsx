import type { ReactNode } from "react"
import { Label, Typography } from "@heroui/react"

/** Each text tier (type · size) + `Skeleton.Typography` matches its glyph box — used for both `<Typography type=…>` and `<div className="text-…">`. */
export const TYPE_ROWS = [
    { type: "h1", size: "text-4xl", desc: "36/40 — the largest heading on the page.", sample: "Page title" },
    { type: "h2", size: "text-3xl", desc: "30/36 — a large section heading.", sample: "Section title" },
    { type: "h3", size: "text-2xl", desc: "24/32 — a block/section heading.", sample: "Block title" },
    { type: "h4", size: "text-xl", desc: "20/28 — a card heading.", sample: "Card title" },
    { type: "h5", size: "text-lg", desc: "18/28 — a small heading.", sample: "Small title" },
    { type: "h6", size: "text-base", desc: "16/24 — a bold label.", sample: "Bold label" },
    { type: "body", size: "text-base", desc: "16/28 — regular paragraph text (base).", sample: "Regular paragraph text in content." },
    { type: "body-sm", size: "text-sm", desc: "14/24 — secondary text, descriptions.", sample: "A secondary description line, in a smaller size." },
    { type: "body-xs", size: "text-xs", desc: "12/20 — muted caption, the smallest size.", sample: "A muted caption, the smallest size." },
] as const

/**
 * A skeleton sample in the AllKinds story: a name label + when to pick it, then a
 * two-column comparison row — left is the skeleton piece, right is the REAL component it mimics.
 */
export const SkeletonRow = ({
    label,
    desc,
    skeleton,
    real,
}: {
    label: string
    desc: string
    skeleton: ReactNode
    real: ReactNode
}) => (
    <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-2">
            <Label>{label}</Label>
            <Typography type="body-sm" color="muted">{desc}</Typography>
        </div>
        {/* Two columns split by a vertical separator; the grid gives content FULL-WIDTH per column
            (the card doesn't shrink), the separator (auto column) stretches full height, content self-centers. */}
        <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] gap-6">
            <div className="self-center">{skeleton}</div>
            <div className="border-l border-separator" />
            <div className="self-center">{real}</div>
        </div>
    </div>
)

/** A skeleton family in the AllKinds story: a small heading + 2-column labels (matching the grid) + samples stacked vertically. */
export const SkeletonGroup = ({ title, children }: { title: string; children: ReactNode }) => (
    <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
            <h3 className="text-sm font-medium text-foreground">{title}</h3>
            <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] gap-6">
                <Typography type="body-xs" color="muted">Skeleton</Typography>
                <div />
                <Typography type="body-xs" color="muted">Real</Typography>
            </div>
        </div>
        <div className="flex flex-col gap-6">{children}</div>
    </section>
)
