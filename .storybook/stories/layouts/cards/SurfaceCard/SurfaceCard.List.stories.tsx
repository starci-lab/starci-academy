import type { SVGProps } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Avatar, AvatarFallback, Button, Chip, Skeleton as HeroSkeleton } from "@heroui/react"
import { CaretRightIcon, CreditCardIcon, TrayIcon, WalletIcon } from "@phosphor-icons/react"
import { SurfaceCard, type SurfaceCardListItem } from "@sb-components/layouts/cards/SurfaceCard/SurfaceCard"
import { Feedback } from "@sb-components/layouts/feedback/Feedback/Feedback"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

// `Feedback.Empty` accepts icon as a COMPONENT ref and forces `size-8` itself (§4/§5) —
// phosphor's `weight="duotone"` can no longer tag along, so it's wrapped in a component to KEEP the artwork.
const TrayDuotone = (props: SVGProps<SVGSVGElement>) => <TrayIcon {...props} weight="duotone" />

/**
 * ⚠️ STATE SCOPE (confirmed by the mentor 2026-07-25): `SurfaceCard.List` is a REPEATING
 * LIST frame, so `items` MUST be data (children forbidden). The stories here only render
 * states that this component itself produces: two row shapes (fixed `title` vs free-form
 * `content`), row flags (`selected`/`isDisabled`/`hover`/`tone`), the empty + 1-row edge
 * cases, and the loading mirror.
 *
 * The header section set (`label`/`labelEnd`/`onSeeMore`/`action`/`subtleLabel`/
 * `description`) SHARES `SurfaceCardHeader` with `SurfaceCard.Base` — here only ONE leaf
 * `WithLabel` is kept to prove the header can turn on; the full header state set lives in
 * the `SurfaceCard.Base` story.
 *
 * ⚠️ `variant` (§1a, `.List` also has this prop — 2026-07-26) has NO leaf of its own here:
 * that state is the surface-in-surface AXIS, the same `Variants` leaf already demonstrated
 * on `SurfaceCard.Base`/`.Accordion` — it is not repeated again for every member of the
 * same frame.
 */
const meta: Meta<typeof SurfaceCard.List> = {
    title: "Layouts/Cards/SurfaceCard/SurfaceCard.List",
    component: SurfaceCard.List,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof SurfaceCard.List>

const caret = <CaretRightIcon className="size-3 text-muted" aria-hidden focusable="false" />

/**
 * Standard mock content (C-fixture) for the item's FREE-FORM `content` slot: avatar +
 * title + description. The item is ALREADY a row box (its own padding + hover +
 * separator) so it does NOT wrap an extra outer `Card` (avoids card-in-card) — just keeps
 * the row.
 */
const profileRow = (initials: string, title: string, description: string) => (
    <div className="flex items-center gap-3">
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
    { key: "fundamentals", title: "Programming fundamentals", subtitle: "12 lessons · 4 hours", onPress: () => {}, trailing: caret, anatPart: "Row" },
    { key: "dsa", title: "Data structures & algorithms", subtitle: "18 lessons · 7 hours", onPress: () => {}, trailing: caret, anatPart: "Row" },
    { key: "system-design", title: "System design", subtitle: "9 lessons · 5 hours", onPress: () => {}, trailing: caret, anatPart: "Row" },
]

/**
 * `Feedback.Empty` is a REAL DEP of the `Empty` leaf (its own story, clickable) — it
 * matches the icon+title+description+action shape rendered by this leaf ⇒ it points at
 * the right `Action` leaf over there. Every other part of the frame (`Surface`/`Header`/
 * `Row`/`Item`) has no story of its own, so it's NOT declared — the old `parts={...}` path
 * that used to declare them only created dead entries (not clickable).
 */
const PART_FEEDBACK_EMPTY: AnatomyAnnotation = {
    role: "Fills the Surface when items is empty — icon + title + description + action.",
    tier: "primitive",
    storyId: "layouts-feedback-feedback-feedback-empty--action",
}

export const Default: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SurfaceCard.List"
                tier="primitive"
                leaf="Default"
                reason="A BOUNDED list frame: one large-radius surface holds edge-to-edge rows, each separated by a full-bleed divider (the last row hides its own). No `label` → renders bare, no Header."
                code={`<SurfaceCard.List
  items={[
    { key: "fundamentals", title: "Programming fundamentals", subtitle: "12 lessons · 4 hours", onPress: () => {}, trailing: caret },
    { key: "dsa", title: "Data structures & algorithms", subtitle: "18 lessons · 7 hours", onPress: () => {}, trailing: caret },
  ]}
/>`}
            >
                <SurfaceCard.List items={courseItems} showAnatomy />
            </BlockAnatomy>
        </div>
    ),
}

/** With label: Header (SurfaceCardHeader) + Surface + Row. See the full header slot set in `SurfaceCard.Base`. */
export const WithLabel: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SurfaceCard.List"
                tier="primitive"
                leaf="WithLabel"
                note="`label` turns on the Header above (gap-3). Drop both `label` and `description` → the frame returns a bare surface div directly. The full header slot set (see-more/action/labelEnd/subtleLabel) is demonstrated in the SurfaceCard.Base story."
                code={`<SurfaceCard.List
  label="My learning path"
  items={[…]}
/>`}
            >
                <SurfaceCard.List label="My learning path" items={courseItems} showAnatomy />
            </BlockAnatomy>
        </div>
    ),
}

/** `leading` (thumbnail/icon) + `meta` (a short per-row tag) + `trailing` — the row is a composition, not flat. */
export const LeadingMeta: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SurfaceCard.List"
                tier="primitive"
                leaf="LeadingMeta"
                note="The row also takes `leading` (a round icon) + `meta` (a Chip) — still ONE Row node (leading/meta are INTERNAL slots of Row, not separate frame parts)."
                code={`<SurfaceCard.List
  items={[
    { key: "once", leading: <IconCircle/>, title: "One-time payment", subtitle: "Pay the full tuition now",
      meta: <Chip size="sm" variant="soft" color="success">Save 10%</Chip>, onPress: () => {} },
  ]}
/>`}
            >
                <SurfaceCard.List
                    showAnatomy
                    items={[
                        {
                            key: "once",
                            leading: (
                                <div className="flex size-10 items-center justify-center rounded-full bg-default">
                                    <CreditCardIcon className="size-5 text-muted" aria-hidden focusable="false" />
                                </div>
                            ),
                            title: "One-time payment",
                            subtitle: "Pay the full tuition now",
                            meta: <Chip size="sm" variant="soft" color="success" className="shrink-0">Save 10%</Chip>,
                            onPress: () => {},
                            anatPart: "Row",
                        },
                        {
                            key: "installments",
                            leading: (
                                <div className="flex size-10 items-center justify-center rounded-full bg-default">
                                    <WalletIcon className="size-5 text-muted" aria-hidden focusable="false" />
                                </div>
                            ),
                            title: "Installments over 3 months",
                            subtitle: "No interest",
                            trailing: caret,
                            onPress: () => {},
                            anatPart: "Row",
                        },
                    ]}
                />
            </BlockAnatomy>
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
        <div className="p-8">
            <BlockAnatomy
                name="SurfaceCard.List"
                tier="primitive"
                leaf="FreeForm"
                note="An item with `content` (instead of Row's `title`) skips the forced leading/title/subtitle shape — content is entirely free-form (here: avatar + title + description, the C-fixture)."
                code={`<SurfaceCard.List
  items={[
    { key: "starci", content: profileRow("SC", "StarCi Academy", "…"), onPress: () => {} },
    { key: "quang", content: profileRow("QN", "Mentor Quang", "…"), onPress: () => {} },
  ]}
/>`}
            >
                <SurfaceCard.List
                    showAnatomy
                    items={[
                        {
                            key: "starci",
                            content: profileRow("SC", "StarCi Academy", "Learn fullstack, system design, and DevOps along an interview-prep path."),
                            onPress: () => {},
                            anatPart: "Item",
                        },
                        {
                            key: "quang",
                            content: profileRow("QN", "Mentor Quang", "Fullstack mentor — reviews projects and runs mock interviews."),
                            onPress: () => {},
                            anatPart: "Item",
                        },
                    ]}
                />
            </BlockAnatomy>
        </div>
    ),
}

/** `selected` — the option CURRENTLY IN USE within a single-select group: accent CheckCircleIcon at the end of the row (does not tint the whole row). */
export const Selected: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SurfaceCard.List"
                tier="primitive"
                leaf="Selected"
                note="Row `selected` → a trailing accent CheckCircleIcon + `aria-current` — still one Row node, no drilling into the icon."
                code={`<SurfaceCard.List
  items={[
    { key: "vi", title: "Vietnamese", onPress: () => {} },
    { key: "en", title: "English", selected: true, onPress: () => {} },
  ]}
/>`}
            >
                <SurfaceCard.List
                    showAnatomy
                    items={[
                        { key: "vi", title: "Vietnamese", onPress: () => {}, anatPart: "Row" },
                        { key: "en", title: "English", selected: true, onPress: () => {}, anatPart: "Row" },
                    ]}
                />
            </BlockAnatomy>
        </div>
    ),
}

/** `isDisabled` — an option that EXISTS but isn't unlocked yet: dimmed + interaction off, still shown (not hidden from the list). */
export const Disabled: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SurfaceCard.List"
                tier="primitive"
                leaf="Disabled"
                note="One Row with `isDisabled` — stays visible, dimmed + non-interactive (not hidden from the list)."
                code={`<SurfaceCard.List
  items={[
    { key: "pdf", title: "Export PDF invoice", onPress: () => {} },
    { key: "xlsx", title: "Export Excel report (coming soon)", isDisabled: true, onPress: () => {} },
  ]}
/>`}
            >
                <SurfaceCard.List
                    showAnatomy
                    items={[
                        { key: "pdf", title: "Export PDF invoice", onPress: () => {}, anatPart: "Row" },
                        {
                            key: "xlsx",
                            title: "Export Excel report (coming soon)",
                            subtitle: "Not yet available on the current plan",
                            isDisabled: true,
                            onPress: () => {},
                            anatPart: "Row",
                        },
                    ]}
                />
            </BlockAnatomy>
        </div>
    ),
}

/** `hover="underline"` — the row IS a link (navigates away): TITLE underlines on hover, no row background tint. */
export const HoverUnderline: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SurfaceCard.List"
                tier="primitive"
                leaf="HoverUnderline"
                note={"`hover=\"underline\"` + `href` → the Row renders as an `<a>`, the title underlines on hover (no row background tint)."}
                code={`<SurfaceCard.List
  items={[
    { key: "dropout", title: "Why do learners drop out of courses?", subtitle: "12.4k reads", hover: "underline", href: "#" },
  ]}
/>`}
            >
                <SurfaceCard.List
                    showAnatomy
                    items={[
                        { key: "dropout", title: "Why do learners drop out of courses?", subtitle: "12.4k reads", hover: "underline", href: "#", anatPart: "Row" },
                        { key: "senior", title: "The path to becoming a Senior Backend engineer", subtitle: "9.1k reads", hover: "underline", href: "#", anatPart: "Row" },
                    ]}
                />
            </BlockAnatomy>
        </div>
    ),
}

/** Static (read-only): no `onPress`/`href` → a plain `<div>`, no hover/focus/cursor (don't pretend it's clickable). */
export const Static: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SurfaceCard.List"
                tier="primitive"
                leaf="Static"
                note="No `onPress`/`href` → the Row renders a static `<div>` (no fake hover/focus/cursor)."
                code={`<SurfaceCard.List
  items={[
    { key: "resilience", title: "Resilience", meta: <Chip size="sm" variant="soft" color="danger">25% recall</Chip> },
  ]}
/>`}
            >
                <SurfaceCard.List
                    showAnatomy
                    items={[
                        { key: "resilience", title: "Resilience", meta: <Chip size="sm" variant="soft" color="danger" className="shrink-0">25% recall</Chip>, anatPart: "Row" },
                        { key: "errors", title: "Error Handling", meta: <Chip size="sm" variant="soft" color="warning" className="shrink-0">33% recall</Chip>, anatPart: "Row" },
                        { key: "authz", title: "Authorization", meta: <Chip size="sm" variant="soft" color="success" className="shrink-0">57% recall</Chip>, anatPart: "Row" },
                    ]}
                />
            </BlockAnatomy>
        </div>
    ),
}

/** `tone` — the left inset band carries MEANING FROM DATA (a tier / promote-demote zone). Shorthand for `withVerdict`. */
export const Verdict: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SurfaceCard.List"
                tier="primitive"
                leaf="Verdict"
                note="`tone` is shorthand for `withVerdict={{ enable: true, variant: tone }}` → a left inset-shadow band right on the Row, not a separate part."
                code={`<SurfaceCard.List
  items={[
    { key: "shell", title: "Shell & file system", tone: "success", onPress: () => {} },
    { key: "pipe", title: "Redirect & pipe", tone: "warning", onPress: () => {} },
    { key: "perm", title: "Basic file permissions", tone: "danger", onPress: () => {} },
  ]}
/>`}
            >
                <SurfaceCard.List
                    showAnatomy
                    items={[
                        { key: "shell", title: "Shell & file system", tone: "success", onPress: () => {}, anatPart: "Row" },
                        { key: "pipe", title: "Redirect & pipe", tone: "warning", onPress: () => {}, anatPart: "Row" },
                        { key: "perm", title: "Basic file permissions", tone: "danger", onPress: () => {}, anatPart: "Row" },
                    ]}
                />
            </BlockAnatomy>
        </div>
    ),
}

/** Edge case: exactly 1 row — the separator hides itself on the last row (no need for ≥2 rows to be valid). */
export const SingleRow: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SurfaceCard.List"
                tier="primitive"
                leaf="SingleRow"
                note="Just one Row — the separator hides itself on the last row (edge case: no need for ≥2 rows to be valid)."
                code={`<SurfaceCard.List
  items={[{ key: "only", title: "Just one item", onPress: () => {}, trailing: caret }]}
/>`}
            >
                <SurfaceCard.List
                    showAnatomy
                    items={[{ key: "only", title: "Just one item", subtitle: "The separator hides itself on the last row", onPress: () => {}, trailing: caret, anatPart: "Row" }]}
                />
            </BlockAnatomy>
        </div>
    ),
}

/** Empty: `items` is empty → {@link Feedback.Empty} fills the surface (no bare blank card). */
export const Empty: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SurfaceCard.List"
                tier="primitive"
                leaf="Empty"
                annotate={{ "Feedback.Empty": PART_FEEDBACK_EMPTY }}
                note="`items={[]}` → `emptyState` fills the Surface (p-8) instead of leaving it blank."
                code={`<SurfaceCard.List
  label="My courses"
  items={[]}
  emptyState={<Feedback.Empty icon={TrayDuotone} title="No courses yet" … />}
/>`}
            >
                <SurfaceCard.List
                    label="My courses"
                    items={[]}
                    emptyState={
                        <Feedback.Empty
                            icon={TrayDuotone}
                            title="No courses yet"
                            description="Enroll in a course to see it here."
                            action={<Button variant="primary" size="sm">Explore courses</Button>}
                            anatPart="Feedback.Empty"
                        />
                    }
                    showAnatomy
                />
            </BlockAnatomy>
        </div>
    ),
}

/**
 * Loading: the list frame has NO `isSkeleton` flag — the caller MIRRORS the real tree:
 * still the same `SurfaceCard.List` + REAL items (keeping the full-bleed separator +
 * frame), only `title` swaps for a `Skeleton` bar (skeleton.md: mirror the layout tree,
 * keep the structural nodes — a list skeleton = one solid card, NOT broken apart into
 * separate rows).
 */
export const Loading: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="SurfaceCard.List"
                tier="primitive"
                leaf="Loading"
                note="Skeleton MIRRORS the real tree: Header + Surface + real Row stay exactly as-is, only the title inside each Row swaps for a Skeleton bar."
                code={`<SurfaceCard.List
  label="My courses"
  items={[0, 1, 2].map((i) => ({ key: String(i), title: <HeroSkeleton className="h-[14px] w-1/2 rounded" /> }))}
/>`}
            >
                <SurfaceCard.List
                    label="My courses"
                    showAnatomy
                    items={[0, 1, 2].map((i) => ({
                        key: String(i),
                        title: <HeroSkeleton className="h-[14px] w-1/2 rounded" />,
                        anatPart: "Row",
                    }))}
                />
            </BlockAnatomy>
        </div>
    ),
}
