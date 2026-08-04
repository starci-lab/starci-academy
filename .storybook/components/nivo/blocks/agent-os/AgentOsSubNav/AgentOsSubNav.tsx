import type { ComponentType, SVGProps } from "react"
import { Tabs, type TabItem } from "@sb-components/atoms/navigation/Tabs/Tabs"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `AgentOsSubNav` — the Agent OS console's secondary nav over its nine sections.
 * ONE data shape, TWO RENDERINGS behind a single `variant` prop: `"mini-rail"`
 * (default — a persistent thin rail reading as "an OS inside the app") and
 * `"segmented"` (the narrow-width fallback, built on the existing `Tabs` atom).
 * Both read the exact same `sections`/`activeKey`, so the taxonomy can never
 * drift between the two renderings. `isDisabled` marks a STUB section —
 * Knowledge/Models/Tools/Playground/Events have no screen commissioned yet.
 */

/** A section glyph passed as a COMPONENT reference, rendered at row scale. */
export type AgentOsSubNavIcon = ComponentType<SVGProps<SVGSVGElement> & { weight?: "regular" | "bold" }>

/** One destination in the sub-nav. */
export interface AgentOsSubNavSection {
    /** Stable id (e.g. `"overview"`, `"agents"`) — also the selection key. */
    key: string
    /** Already-localized section label. */
    label: string
    /** Leading glyph as a COMPONENT reference. */
    icon: AgentOsSubNavIcon
    /** `true` → a stub section with no screen behind it yet: rendered, not selectable. */
    isDisabled?: boolean
}

/** Props for {@link AgentOsSubNav}. */
export interface AgentOsSubNavProps {
    /** The nine sections, in display order — the ONE source both renderings read. */
    sections: Array<AgentOsSubNavSection>
    /** The currently-selected section key. */
    activeKey: string
    /** Select a section — the connected layer swaps the console's section body. */
    onSelect: (key: string) => void
    /** Which rendering to draw. Default `"mini-rail"` — see the file header. */
    variant?: "mini-rail" | "segmented"
    /** Render the strip/rail in its skeleton (loading) state. */
    isSkeleton?: boolean
}

/** How many placeholder rows the mini-rail skeleton draws — mirrors the real nine sections. */
const SKELETON_ROW_COUNT = 9

/** Mini-rail row chrome, written out per state so the block never composes a class string at runtime. */
const ROW_BASE = "flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm transition-colors"
const ROW_ACTIVE = "bg-accent/10 font-medium text-accent"
const ROW_IDLE = "text-muted hover:bg-default/40 hover:text-foreground"
const ROW_STUB = "text-muted opacity-50 cursor-not-allowed"

/** One mini-rail placeholder row — mirrors {@link MiniRailRow}'s real shape (icon square + label bar). */
const MiniRailSkeletonRow = () => (
    <div className={ROW_BASE}>
        <div className="size-5 shrink-0 rounded-md bg-default" />
        <Typography size="sm" isSkeleton />
    </div>
)

/** One real mini-rail row — a section button, toned by active/idle/stub. */
const MiniRailRow = ({ section, isActive, onSelect }: {
    section: AgentOsSubNavSection
    isActive: boolean
    onSelect: () => void
}) => {
    const Icon = section.icon
    return (
        <button
            type="button"
            disabled={section.isDisabled}
            aria-current={isActive ? "page" : undefined}
            onClick={section.isDisabled ? undefined : onSelect}
            className={`${ROW_BASE} ${section.isDisabled ? ROW_STUB : isActive ? ROW_ACTIVE : ROW_IDLE}`}
        >
            <Icon aria-hidden focusable="false" className="size-5 shrink-0" />
            <Typography
                size="sm"
                weight={isActive ? "medium" : undefined}
                color={section.isDisabled ? "muted" : isActive ? "accent" : "muted"}
                text={section.label}
            />
        </button>
    )
}

/**
 * The Agent OS sub-nav. See the file header for why `mini-rail`/`segmented` are
 * one shape behind a prop, and why stub sections render disabled rather than
 * being dropped from the list.
 *
 * @param props - {@link AgentOsSubNavProps}
 */
const AgentOsSubNav = ({ sections, activeKey, onSelect, variant = "mini-rail", isSkeleton = false }: AgentOsSubNavProps) => {
    if (variant === "segmented") {
        // The `Tabs` atom already owns the segmented-pill look plus its own
        // `isDisabled`/`isSkeleton` leaves — no bespoke strip or `@heroui/react`
        // import needed in this block.
        const items: Array<TabItem> = sections.map((section) => ({
            key: section.key,
            label: section.label,
            icon: section.icon,
            isDisabled: section.isDisabled,
        }))
        return (
            <div data-tier="block" data-component="AgentOsSubNav">
                <Tabs
                    items={items}
                    selectedKey={activeKey}
                    onSelectionChange={onSelect}
                    ariaLabel="Agent OS sections"
                    variant="primary"
                    isSkeleton={isSkeleton}
                    classNames={["w-full"]}
                />
            </div>
        )
    }

    // Chrome (size/border/radius/surface/padding) sits on the semantic `<nav>` — the
    // vertical seam between rows is owned by `StackV`, not hand-rolled here (§13z).
    return (
        <nav
            data-tier="block"
            data-component="AgentOsSubNav"
            aria-label="Agent OS sections"
            className="w-48 shrink-0 rounded-2xl border border-default bg-surface p-2"
        >
            <StackV
                gap={1}
                items={
                    isSkeleton
                        ? Array.from({ length: SKELETON_ROW_COUNT }, () => () => <MiniRailSkeletonRow />)
                        : sections.map((section) => () => (
                            <MiniRailRow
                                section={section}
                                isActive={!section.isDisabled && section.key === activeKey}
                                onSelect={() => onSelect(section.key)}
                            />
                        ))
                }
            />
        </nav>
    )
}

export { AgentOsSubNav }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "block", name: "AgentOsSubNav" } as const
