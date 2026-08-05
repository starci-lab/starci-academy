import type { ComponentType, SVGProps } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { BookOpenIcon, ChartBarIcon, FlaskIcon, GearSixIcon, PlayIcon } from "@phosphor-icons/react"
import { CollapsibleSidebar, useSidebarCollapsed } from "@sb-components/starci/blocks/navigation/CollapsibleSidebar/CollapsibleSidebar"
import { ButtonBase } from "@sb-components/atoms/buttons/Button/ButtonBase"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `CollapsibleSidebar` — a content-agnostic shell for a left navigation sidebar
 * that collapses in place (no overlay/Drawer). Owns collapse/expand, the width
 * animation, persisting the choice to `localStorage`, and a `useSidebarCollapsed`
 * context so nav-row content can self-adapt to the icon-only rail. It never
 * inspects `children`. One leaf: `topSlot` presence and the collapsed flag are
 * data, so they are states, not separate leaves.
 */
const meta: Meta<typeof CollapsibleSidebar> = {
    title: "StarCi/Blocks/Navigation/CollapsibleSidebar/CollapsibleSidebar",
    component: CollapsibleSidebar,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof CollapsibleSidebar>

/** One demo nav row's icon, kept generic — this story does not model a real nav taxonomy. */
type DemoIcon = ComponentType<SVGProps<SVGSVGElement>>

/** Named shape (check-inline-types gate) for one story-local placeholder row. */
interface DemoNavRowData {
    key: string
    label: string
    icon: DemoIcon
}

/** Story-local placeholder row — NOT a design-system component. Reads `useSidebarCollapsed`
 *  to prove the context contract: real nav rows (out of scope this pass) would do the same. */
const DemoNavRow = ({ label, icon: Icon }: DemoNavRowData) => {
    const collapsed = useSidebarCollapsed()
    return collapsed ? (
        <div data-tier="fixture" className="flex items-center justify-center rounded-lg p-2 text-muted" title={label}>
            <Icon className="size-5" aria-hidden />
        </div>
    ) : (
        <div data-tier="fixture" className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-foreground">
            <Icon className="size-4" aria-hidden />
            <span>{label}</span>
        </div>
    )
}

const DEMO_ROWS: Array<DemoNavRowData> = [
    { key: "content", label: "Course content", icon: BookOpenIcon },
    { key: "sandbox", label: "Sandbox", icon: FlaskIcon },
    { key: "leaderboard", label: "Leaderboard", icon: ChartBarIcon },
    { key: "settings", label: "Settings", icon: GearSixIcon },
]

/** Distinct storage keys per state so switching the BlockAnatomy state tab never leaks
 *  one state's collapsed flag into another's initial render. */
const STORAGE_KEY_EXPANDED = "story-collapsible-sidebar-expanded"
const STORAGE_KEY_WITH_TOP_SLOT = "story-collapsible-sidebar-with-top-slot"
const STORAGE_KEY_COLLAPSED = "story-collapsible-sidebar-collapsed"

/** Seed `localStorage` BEFORE the component mounts and reads it — the component's own
 *  hydration effect runs after this, same trick a real app relies on across navigations. */
const seed = (key: string, value: string) => {
    if (typeof window !== "undefined") {
        window.localStorage.setItem(key, value)
    }
}

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "ButtonBase": { tier: "atom", role: "the collapse/expand toggle — icon-only, aria-label flips with the state", storyId: "atoms-buttons-button-button--is-icon-only" },
    "Typography": { tier: "atom", role: "the panel title; fades out (not just hidden) while collapsed, truncates in the rail", storyId: "atoms-text-typography-typography--truncate" },
    "DragScrollArea": { tier: "frame", role: "the scrollable nav region — hidden scrollbar + Windows-safe pointer-pan, reused rather than a bare ScrollShadow", storyId: "behaviors-dragscrollarea-dragscrollarea--overview" },
}

/** LEAF — the sidebar has one shape; `topSlot` and the collapsed flag are DATA ⇒ states. */
export const Default: Story = {
    render: () => {
        seed(STORAGE_KEY_EXPANDED, "false")
        seed(STORAGE_KEY_WITH_TOP_SLOT, "false")
        seed(STORAGE_KEY_COLLAPSED, "true")
        return (
            <div data-tier="fixture" className="p-8">
                <BlockAnatomy
                    name="CollapsibleSidebar"
                    tier="composite"
                    leaf="Sidebar shell"
                    parts={[]}
                    annotate={ANNOTATE}
                    renderClassName="h-[32rem] overflow-hidden rounded-2xl border border-default"
                    states={[
                        {
                            name: "expanded",
                            why: "Default, first-mount shape: full panel, title visible, nav rows show icon + label. This is what a reader sees before ever touching the toggle.",
                            code: `<CollapsibleSidebar
    title="Coursework"
    collapseLabel="Collapse"
    expandLabel="Expand"
    storageKey="learn-sidebar-collapsed"
>
    {navRows}
</CollapsibleSidebar>`,
                            render: (
                                <CollapsibleSidebar


                                    title="Coursework"
                                    collapseLabel="Collapse"
                                    expandLabel="Expand"
                                    storageKey={STORAGE_KEY_EXPANDED}
                                >
                                    {DEMO_ROWS.map((row) => (
                                        <DemoNavRow key={row.key} label={row.label} icon={row.icon} />
                                    ))}
                                </CollapsibleSidebar>
                            ),
                        },
                        {
                            name: "topSlot set",
                            why: "A caller pins content BETWEEN the header and the scroll area — always visible, never scrolls away. The real use is a resume-progress pill (`ResumeRail`, out of scope this pass); here a plain button stands in for it.",
                            code: `<CollapsibleSidebar
    title="Coursework"
    collapseLabel="Collapse"
    expandLabel="Expand"
    storageKey="learn-sidebar-collapsed"
    topSlot={<ResumeButton />}
>
    {navRows}
</CollapsibleSidebar>`,
                            render: (
                                <CollapsibleSidebar
                                    title="Coursework"
                                    collapseLabel="Collapse"
                                    expandLabel="Expand"
                                    storageKey={STORAGE_KEY_WITH_TOP_SLOT}
                                    topSlot={(
                                        <ButtonBase
                                            label="Continue learning"
                                            prefixIcon={PlayIcon}
                                            variant="secondary"
                                            size="sm"

                                            onPress={() => {}}
                                        />
                                    )}
                                >
                                    {DEMO_ROWS.map((row) => (
                                        <DemoNavRow key={row.key} label={row.label} icon={row.icon} />
                                    ))}
                                </CollapsibleSidebar>
                            ),
                        },
                        {
                            name: "collapsed = true",
                            why: "The reader (or a previous page) toggled the rail shut. The choice is read from `localStorage` on mount — seeded here to `true` — so it survives navigation between pages sharing this sidebar. The title fades out, rows drop to icon-only via `useSidebarCollapsed`, and the toggle's aria-label flips to `expandLabel`.",
                            code: `// localStorage["learn-sidebar-collapsed"] === "true" from a prior toggle
<CollapsibleSidebar
    title="Coursework"
    collapseLabel="Collapse"
    expandLabel="Expand"
    storageKey="learn-sidebar-collapsed"
>
    {navRows}
</CollapsibleSidebar>`,
                            render: (
                                <CollapsibleSidebar
                                    title="Coursework"
                                    collapseLabel="Collapse"
                                    expandLabel="Expand"
                                    storageKey={STORAGE_KEY_COLLAPSED}
                                >
                                    {DEMO_ROWS.map((row) => (
                                        <DemoNavRow key={row.key} label={row.label} icon={row.icon} />
                                    ))}
                                </CollapsibleSidebar>
                            ),
                        },
                    ]}
                />
            </div>
        )
    },
}
