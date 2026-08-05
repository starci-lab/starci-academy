import type { SVGProps } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Avatar, AvatarFallback, Button, Chip } from "@heroui/react"
import { CaretRightIcon, CreditCardIcon, TrayIcon, WalletIcon } from "@phosphor-icons/react"
import { SurfaceCardList, type SurfaceCardListItem } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { EmptyState } from "@sb-components/composites/feedback/EmptyState/EmptyState"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"
// `EmptyState` accepts icon as a COMPONENT ref and forces `size-8` itself (§4/§5) —
// phosphor's `weight="duotone"` can no longer tag along, so it's wrapped in a component to KEEP the artwork.
const TrayDuotone = (props: SVGProps<SVGSVGElement>) => <TrayIcon data-tier="fixture" {...props} weight="duotone" />
/**
 * `SurfaceCardList` — a repeating-list frame; `items` is required data. Owns two row shapes
 * (fixed `title` vs free-form `content`), row flags (`selected`/`isDisabled`/`hover`/`tone`), the
 * empty + 1-row edge cases, and the loading mirror. Shares `SurfaceCardHeader` and the `variant`
 * axis with `SurfaceCard`.
 */
const meta: Meta<typeof SurfaceCardList> = {
    title: "Composites/Cards/SurfaceCard/SurfaceCardList",
    component: SurfaceCardList,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}
export default meta
type Story = StoryObj<typeof SurfaceCardList>
/** `trailing` slot fixture — a component reference (COMPOSITE-8), not a built node. */
const Caret = () => <CaretRightIcon data-tier="fixture" className="size-3 text-muted" aria-hidden focusable="false" />
/**
 * Standard mock content (C-fixture) for the item's FREE-FORM `content` slot: avatar +
 * title + description. The item is ALREADY a row box (its own padding + hover +
 * separator) so it does NOT wrap an extra outer `Card` (avoids card-in-card), it just
 * keeps the row.
 */
const profileRow = (initials: string, title: string, description: string) => (
    <div data-tier="fixture" className="flex items-center gap-3">
        <Avatar className="size-10 shrink-0">
            <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-medium">{title}</span>
            <span className="truncate text-xs text-muted">{description}</span>
        </div>
    </div>
)
const courseItems: ReadonlyArray<SurfaceCardListItem> = [
    { key: "fundamentals", title: "Programming fundamentals", subtitle: "12 lessons · 4 hours", onPress: () => {}, trailing: Caret },
    { key: "dsa", title: "Data structures & algorithms", subtitle: "18 lessons · 7 hours", onPress: () => {}, trailing: Caret },
    { key: "system-design", title: "System design", subtitle: "9 lessons · 5 hours", onPress: () => {}, trailing: Caret },
]
/**
 * `EmptyState` is a REAL DEP of the `Empty` leaf (its own story, clickable), it
 * matches the icon+title+description+action shape rendered by this leaf, so it points at
 * the right `Action` leaf over there. Every other part of the frame (`Surface`/`Header`/
 * `Row`/`Item`) has no story of its own, so it's NOT declared, the old `parts={...}` path
 * that used to declare them only created dead entries (not clickable).
 */
const PART_FEEDBACK_EMPTY: AnatomyAnnotation = {
    role: "Fills the Surface when `items` is empty: icon, title, description, and action.",
    tier: "composite",
    storyId: "composites-feedback-emptystate--action",
}
/** Story: resting state for this component. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="SurfaceCardList"
                tier="composite"
                leaf="Default"
                reason="A BOUNDED list frame: one large-radius surface holds edge-to-edge rows, each separated by a full-bleed divider (the last row hides its own)."
                states={[
                    {
                        name: "3 course items, no label",
                        why: "Three rows sit inside one bounded, large-radius surface, edge to edge, with a full-bleed divider between each pair and the last row hiding its own. With no `label` passed the frame renders bare, with no Header above the rows.",
                        code: `<SurfaceCardList
  items={[
    { key: "fundamentals", title: "Programming fundamentals", subtitle: "12 lessons · 4 hours", onPress: () => {}, trailing: caret },
    { key: "dsa", title: "Data structures & algorithms", subtitle: "18 lessons · 7 hours", onPress: () => {}, trailing: caret },
  ]}
/>`,
                        render: <SurfaceCardList items={courseItems} />,
                    },
                ]}
            />
        </div>
    ),
}
/** With label: Header (SurfaceCardHeader) + Surface + Row. See the full header slot set in `SurfaceCard`. */
export const WithLabel: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="SurfaceCardList"
                tier="composite"
                leaf="WithLabel"
                states={[
                    {
                        name: "label set",
                        why: "Passing `label` turns on the Header region above the rows, with a `gap-3` seam between them. Dropping both `label` and `description` returns the frame to a bare surface div directly, and the full header slot set (see-more/action/labelEnd/subtleLabel) is demonstrated separately in the `SurfaceCard` story rather than repeated here.",
                        code: `<SurfaceCardList
  label="My learning path"
  items={[…]}
/>`,
                        render: <SurfaceCardList label="My learning path" items={courseItems} />,
                    },
                ]}
            />
        </div>
    ),
}
/** `leading`/`meta` slot fixtures for {@link LeadingMeta} — component references (COMPOSITE-8), not built nodes. */
const OneTimeLeading = () => (
    <div data-tier="fixture" className="flex size-10 items-center justify-center rounded-full bg-default">
        <CreditCardIcon className="size-5 text-muted" aria-hidden focusable="false" />
    </div>
)
const InstallmentsLeading = () => (
    <div data-tier="fixture" className="flex size-10 items-center justify-center rounded-full bg-default">
        <WalletIcon className="size-5 text-muted" aria-hidden focusable="false" />
    </div>
)
const SaveTenPercentMeta = () => (
    <Chip data-tier="fixture" size="sm" variant="soft" color="success" className="shrink-0">Save 10%</Chip>
)
/** `leading` (thumbnail/icon) + `meta` (a short per-row tag) + `trailing` — the row is a composition, not flat. */
export const LeadingMeta: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="SurfaceCardList"
                tier="composite"
                leaf="LeadingMeta"
                states={[
                    {
                        name: "leading + meta set",
                        why: "Each row now also carries `leading` (a round icon) and `meta` (a Chip) beside the title, and both stay inside the same single Row node rather than becoming separate frame parts. Leading and meta are internal slots of Row, so a row can grow richer content without the frame itself gaining new parts.",
                        code: `<SurfaceCardList
  items={[
    { key: "once", leading: <IconCircle/>, title: "One-time payment", subtitle: "Pay the full tuition now",
      meta: <Chip size="sm" variant="soft" color="success">Save 10%</Chip>, onPress: () => {} },
  ]}
/>`,
                        render: (
                            <SurfaceCardList

                                items={[
                                    {
                                        key: "once",
                                        leading: OneTimeLeading,
                                        title: "One-time payment",
                                        subtitle: "Pay the full tuition now",
                                        meta: SaveTenPercentMeta,
                                        onPress: () => {},

                                    },
                                    {
                                        key: "installments",
                                        leading: InstallmentsLeading,
                                        title: "Installments over 3 months",
                                        subtitle: "No interest",
                                        trailing: Caret,
                                        onPress: () => {},

                                    },
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
 * The item's second shape: `content` replaces the fixed slot set — the frame still keeps
 * padding + separator inset, the caller lays out the inside itself. `content` WINS over
 * `title` when both are passed.
 */
export const FreeForm: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="SurfaceCardList"
                tier="composite"
                leaf="FreeForm"
                states={[
                    {
                        name: "content set (instead of title)",
                        why: "Passing `content` instead of `title` skips Row's forced leading/title/subtitle shape entirely, and the item lays out whatever the caller hands it, here the avatar + title + description C-fixture. `content` wins over `title` whenever both are passed, so a row can escape the fixed shape when the fixed shape doesn't fit the data.",
                        code: `<SurfaceCardList
  items={[
    { key: "starci", content: profileRow("SC", "StarCi Academy", "…"), onPress: () => {} },
    { key: "quang", content: profileRow("QN", "Mentor Quang", "…"), onPress: () => {} },
  ]}
/>`,
                        render: (
                            <SurfaceCardList

                                items={[
                                    {
                                        key: "starci",
                                        content: () => profileRow("SC", "StarCi Academy", "Learn fullstack, system design, and DevOps along an interview-prep path."),
                                        onPress: () => {},

                                    },
                                    {
                                        key: "quang",
                                        content: () => profileRow("QN", "Mentor Quang", "Fullstack mentor — reviews projects and runs mock interviews."),
                                        onPress: () => {},

                                    },
                                ]}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
/** `selected` — the option CURRENTLY IN USE within a single-select group: accent CheckCircleIcon at the end of the row (does not tint the whole row). */
export const Selected: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="SurfaceCardList"
                tier="composite"
                leaf="Selected"
                states={[
                    {
                        name: "selected = true (one row)",
                        why: "The selected row grows a trailing accent CheckCircleIcon and an `aria-current` attribute, while staying the same single Row node as every other row. This marks the option currently in use inside a single-select group without tinting the whole row, which would read as a hover state instead of a selection.",
                        code: `<SurfaceCardList
  items={[
    { key: "vi", title: "Vietnamese", onPress: () => {} },
    { key: "en", title: "English", selected: true, onPress: () => {} },
  ]}
/>`,
                        render: (
                            <SurfaceCardList

                                items={[
                                    { key: "vi", title: "Vietnamese", onPress: () => {} },
                                    { key: "en", title: "English", selected: true, onPress: () => {} },
                                ]}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
/** `isDisabled` — an option that EXISTS but isn't unlocked yet: dimmed + interaction off, still shown (not hidden from the list). */
export const Disabled: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="SurfaceCardList"
                tier="composite"
                leaf="Disabled"
                states={[
                    {
                        name: "isDisabled = true (one row)",
                        why: "The disabled row stays fully visible in the list, only dimmed and stripped of interaction, rather than being hidden or removed. An option that exists but isn't unlocked yet should still be seen, so the learner knows it's coming rather than wondering why it's missing.",
                        code: `<SurfaceCardList
  items={[
    { key: "pdf", title: "Export PDF invoice", onPress: () => {} },
    { key: "xlsx", title: "Export Excel report (coming soon)", isDisabled: true, onPress: () => {} },
  ]}
/>`,
                        render: (
                            <SurfaceCardList

                                items={[
                                    { key: "pdf", title: "Export PDF invoice", onPress: () => {} },
                                    {
                                        key: "xlsx",
                                        title: "Export Excel report (coming soon)",
                                        subtitle: "Not yet available on the current plan",
                                        isDisabled: true,
                                        onPress: () => {},

                                    },
                                ]}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
/** `hover="underline"` — the row IS a link (navigates away): TITLE underlines on hover, no row background tint. */
export const HoverUnderline: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="SurfaceCardList"
                tier="composite"
                leaf="HoverUnderline"
                states={[
                    {
                        name: "hover = \"underline\", href set",
                        why: "With `hover=\"underline\"` and `href` set, the Row renders as a real `<a>` and only the title underlines on hover, with no row background tint. This suits a row that behaves like an inline text link, navigating away, rather than a card-like clickable surface.",
                        code: `<SurfaceCardList
  items={[
    { key: "dropout", title: "Why do learners drop out of courses?", subtitle: "12.4k reads", hover: "underline", href: "#" },
  ]}
/>`,
                        render: (
                            <SurfaceCardList

                                items={[
                                    { key: "dropout", title: "Why do learners drop out of courses?", subtitle: "12.4k reads", hover: "underline", href: "#" },
                                    { key: "senior", title: "The path to becoming a Senior Backend engineer", subtitle: "9.1k reads", hover: "underline", href: "#" },
                                ]}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
/** `meta` slot fixtures for {@link Static} — component references (COMPOSITE-8), not built nodes. */
const ResilienceMeta = () => <Chip data-tier="fixture" size="sm" variant="soft" color="danger" className="shrink-0">25% recall</Chip>
const ErrorHandlingMeta = () => <Chip data-tier="fixture" size="sm" variant="soft" color="warning" className="shrink-0">33% recall</Chip>
const AuthorizationMeta = () => <Chip data-tier="fixture" size="sm" variant="soft" color="success" className="shrink-0">57% recall</Chip>
/** Static (read-only): no `onPress`/`href` → a plain `<div>`, no hover/focus/cursor (don't pretend it's clickable). */
export const Static: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="SurfaceCardList"
                tier="composite"
                leaf="Static"
                states={[
                    {
                        name: "no onPress, no href",
                        why: "With neither `onPress` nor `href` passed, the Row renders a plain, static `<div>` with no hover background, no focus ring, and no pointer cursor. Faking any of those on a row that cannot actually be activated would mislead a keyboard or screen-reader user into expecting an action.",
                        code: `<SurfaceCardList
  items={[
    { key: "resilience", title: "Resilience", meta: <Chip size="sm" variant="soft" color="danger">25% recall</Chip> },
  ]}
/>`,
                        render: (
                            <SurfaceCardList

                                items={[
                                    { key: "resilience", title: "Resilience", meta: ResilienceMeta },
                                    { key: "errors", title: "Error Handling", meta: ErrorHandlingMeta },
                                    { key: "authz", title: "Authorization", meta: AuthorizationMeta },
                                ]}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
/** `tone` — the left inset band carries MEANING FROM DATA (a tier / promote-demote zone). Shorthand for `withVerdict`. */
export const Verdict: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="SurfaceCardList"
                tier="composite"
                leaf="Verdict"
                states={[
                    {
                        name: "tone = \"success\"",
                        why: "The row grows a left inset-shadow band in the success colour, since `tone` is shorthand for `withVerdict={{ enable: true, variant: tone }}` rather than a separate part. This marks a passing or on-track verdict directly on the row's own edge.",
                        code: `<SurfaceCardList
  items={[{ key: "shell", title: "Shell & file system", tone: "success", onPress: () => {} }]}
/>`,
                        render: (
                            <SurfaceCardList

                                items={[
                                    { key: "shell", title: "Shell & file system", tone: "success", onPress: () => {} },
                                ]}
                            />
                        ),
                    },
                    {
                        name: "tone = \"warning\"",
                        why: "The row grows a left inset-shadow band in the warning colour, the same shorthand for `withVerdict={{ enable: true, variant: tone }}` as the other tones. This marks a borderline verdict, one that needs attention but hasn't failed outright.",
                        code: `<SurfaceCardList
  items={[{ key: "pipe", title: "Redirect & pipe", tone: "warning", onPress: () => {} }]}
/>`,
                        render: (
                            <SurfaceCardList

                                items={[
                                    { key: "pipe", title: "Redirect & pipe", tone: "warning", onPress: () => {} },
                                ]}
                            />
                        ),
                    },
                    {
                        name: "tone = \"danger\"",
                        why: "The row grows a left inset-shadow band in the danger colour, the same shorthand for `withVerdict={{ enable: true, variant: tone }}` as the other tones. This marks a failing verdict, so the learner can spot the weak spot at a glance.",
                        code: `<SurfaceCardList
  items={[{ key: "perm", title: "Basic file permissions", tone: "danger", onPress: () => {} }]}
/>`,
                        render: (
                            <SurfaceCardList

                                items={[
                                    { key: "perm", title: "Basic file permissions", tone: "danger", onPress: () => {} },
                                ]}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
/** Edge case: exactly 1 row — the separator hides itself on the last row (no need for ≥2 rows to be valid). */
export const SingleRow: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="SurfaceCardList"
                tier="composite"
                leaf="SingleRow"
                states={[
                    {
                        name: "items has exactly 1 entry",
                        why: "With only one Row in the list, no divider line appears below it, since the separator always hides itself on the last row. A list frame does not need two or more rows to be a valid render, one row is still a complete, correctly-drawn list.",
                        code: `<SurfaceCardList
  items={[{ key: "only", title: "Just one item", onPress: () => {}, trailing: caret }]}
/>`,
                        render: (
                            <SurfaceCardList

                                items={[{ key: "only", title: "Just one item", subtitle: "The separator hides itself on the last row", onPress: () => {}, trailing: Caret }]}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
/** `emptyState` slot fixture for {@link Empty} — a component reference (COMPOSITE-8), not a built node. */
const CoursesEmptyState = () => (
    <EmptyState
        icon={TrayDuotone}
        title="No courses yet"
        description="Enroll in a course to see it here."
        action={() => <Button data-tier="fixture" variant="primary" size="sm">Explore courses</Button>}

    />
)
/** Empty: `items` is empty → {@link EmptyState} fills the surface (no bare blank card). */
export const Empty: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="SurfaceCardList"
                tier="composite"
                leaf="Empty"
                annotate={{ "EmptyState": PART_FEEDBACK_EMPTY }}
                states={[
                    {
                        name: "items = []",
                        why: "With `items` empty, `emptyState` (a `EmptyState` icon, title, description, and action) fills the surface's own padding instead of leaving a blank card. A list that can be empty needs to say so, not just render nothing where rows used to be.",
                        code: `<SurfaceCardList
  label="My courses"
  items={[]}
  emptyState={CoursesEmptyState}
/>`,
                        render: (
                            <SurfaceCardList
                                label="My courses"
                                items={[]}
                                emptyState={CoursesEmptyState}

                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
/**
 * Loading: `isSkeleton` flows straight into every real Row — the Header, Surface, and
 * Row nodes stay exactly as they are (keeping the full-bleed separator + frame), and
 * each Row's own `Typography` swaps `title`/`subtitle` for a shimmer bar (COMPOSITE-10:
 * the frame forwards the flag, it never draws a bar itself).
 */
export const Loading: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="SurfaceCardList"
                tier="composite"
                leaf="Loading"
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "The Header, Surface, and real Row nodes stay exactly as they are, and only each Row's own `Typography` swaps its `title`/`subtitle` for a shimmer bar. Mirroring the real tree instead of drawing a separate skeleton shape is what keeps the list from jumping once the real titles arrive.",
                        code: `<SurfaceCardList
  label="My courses"
  items={items}
  isSkeleton
/>`,
                        render: (
                            <SurfaceCardList
                                label="My courses"

                                items={courseItems}
                                isSkeleton
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}