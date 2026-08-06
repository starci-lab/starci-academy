import { useState } from "react"
import { type SkeletonProps } from "@sb-components/frames/_slot"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Chip, Typography } from "@heroui/react"
// ONE ICON SET ONLY = Phosphor (§5.0). Size scale per §5a: leading <-> title
// `text-sm` -> `size-5` (regular); a glyph smaller than `size-5` (lock next to a
// `text-xs` chip -> `size-4`, navigation caret -> `size-3`) must compensate with `weight="bold"` (§5.0a).
import {
    CaretRightIcon,
    FileTextIcon,
    ArrowRightIcon,
    BellIcon,
    CheckCircleIcon,
    PlayCircleIcon,
    CircleIcon,
    LockIcon,
} from "@phosphor-icons/react"
import { ListRow } from "@sb-components/composites/lists/List/List"
import { VariantChipDifficulty } from "@sb-components/starci/blocks/learn/VariantChip/VariantChip"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `ListRow` — a single-row frame: toggling each slot on/off (`leading`/`subtitle`/`meta`/`trailing`),
 * the `divider` separator line, swapping the wrapper tag on interaction (`href`/`onPress`), and
 * mirroring `isSkeleton` for the row. The section label and the list's empty state belong to `ListLabeled`.
 */
const meta: Meta<typeof ListRow> = {
    title: "Composites/Lists/List/ListRow",
    component: ListRow,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof ListRow>

// Navigation caret = `size-3` FIXED (exception to §5a) -> smaller than `size-5` => `weight="bold"` (§5.0a).
// A COMPONENT reference (COMPOSITE-8): `ListRow.trailing` calls this itself, it does not receive a built node.
const Chevron = () => <CaretRightIcon data-tier="fixture" className="size-3 text-muted" weight="bold" aria-hidden focusable="false" />

// Real DOM: ListRow ⊃ Leading?(icon/avatar, doesn't shrink) · TitledText(title+subtitle
// merged — 1 semantic unit, does NOT split Title/Subtitle separately, see TitledText.tsx) ·
// MetaTrailing?(meta+trailing cluster, sharing 1 gap-2 row on the right).
//
// `Leading` and `MetaTrailing` are CALLER SLOTS — the div only positions
// whatever component `leading`/`meta`/`trailing` names, it doesn't build that content
// itself, and neither has a story of its own to jump to. Per the panel's whitelist rule
// (only a part with a REAL `storyId` or `tier: "heroui"` counts), they are NOT annotated
// here — the component does not badge them (nothing to declare).
//
// `leading`/`meta`/`trailing` take a COMPONENT reference each — the row calls them
// itself (forwarding `isSkeleton` into `leading`) instead of receiving an already-built
// node. Every fixture below defines a small named function component per slot instead of
// a JSX element.
const TITLE_ONLY_ANNOTATE: Record<string, AnatomyAnnotation> = {
    "TitledText": { tier: "composite", role: "title (body-sm medium), no subtitle/leading/meta", storyId: "composites-texts-titledtext--overview" },
}

const LEADING_SUBTITLE_ANNOTATE: Record<string, AnatomyAnnotation> = {
    "TitledText": { tier: "composite", role: "title + subtitle (module breadcrumb)", storyId: "composites-texts-titledtext--overview" },
    // `FileTextLeading` (the `leading` component below) simply renders
    // nothing while `isSkeleton`, since the house has no dedicated icon-shimmer atom
    // yet; it is still called every time, it just chooses to render null for this
    // particular fixture.
}

const META_TRAILING_ANNOTATE: Record<string, AnatomyAnnotation> = {
    "TitledText": { tier: "composite", role: "title + subtitle (submission date)", storyId: "composites-texts-titledtext--overview" },
}

const LEADING_META_TRAILING_ANNOTATE: Record<string, AnatomyAnnotation> = {
    "TitledText": { tier: "composite", role: "title + subtitle", storyId: "composites-texts-titledtext--overview" },
}

/** The simplest row — just a title. Used when the list has no subtitle, icon, or trailing action. */
export const TitleOnly: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ListRow"
                tier="composite"
                leaf="TitleOnly"
                annotate={TITLE_ONLY_ANNOTATE}
                reason="A highly reusable list-row frame: leading/TitledText/meta-trailing are all optional via props; this leaf only turns on title."
                states={[
                    {
                        name: "title only",
                        why: "Only the TitledText node renders, with leading, subtitle, and meta-trailing all left off. This is the row's simplest shape, used whenever the list itself carries no icon, no secondary line, and no trailing action.",
                        code: `<ListRow
  title="Exercise 1: Loops and conditionals"
/>`,
                        render: (
                            <div data-tier="fixture" className="w-full max-w-md rounded-2xl border border-default px-3">
                                <ListRow title="Exercise 1: Loops and conditionals" />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/**
 * `leading` (lesson-type icon) + `subtitle` (module breadcrumb) under the title.
 *
 * MERGED INTO ONE LEAF (§14d.2): `isSkeleton` is NOT a leaf, the mirror KEEPS the exact
 * same node set (`Leading` + `TitledText`), only swapping the icon for a square and the
 * text for two bars. It's a STATE of this row itself, so both render side by side inside
 * this one leaf.
 */
/** Leading icon component (COMPOSITE-8): `ListRow` calls this itself and forwards `isSkeleton`. */
const FileTextLeading = ({ isSkeleton }: SkeletonProps) => (
    isSkeleton ? null : <FileTextIcon data-tier="fixture" className="size-5 text-muted" aria-hidden focusable="false" />
)

/** Story: list row with a leading subtitle. */
export const LeadingSubtitle: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ListRow"
                tier="composite"
                leaf="LeadingSubtitle"
                annotate={LEADING_SUBTITLE_ANNOTATE}
                reason="`isSkeleton` is a STATE of this row, not a leaf of its own (§14d.2): the mirror keeps the exact node set of whichever slots are actually present, so it sits beside its real-data counterpart in this same leaf."
                states={[
                    {
                        name: "leading + subtitle set",
                        why: "The row grows a Leading icon before the title and a subtitle line, a module breadcrumb, sharing the same TitledText node as the title, since Title and Subtitle are not split into separate nodes. Both extra pieces read together as one row identity: what kind of item this is, and which module it belongs to.",
                        code: `<ListRow
  leading={FileTextLeading}
  title="Normalizing relational data to 3NF"
  subtitle="Module 4 · Database design"
/>`,
                        render: (
                            <div data-tier="fixture" className="w-full max-w-md rounded-2xl border border-default px-3">
                                <ListRow
                                    leading={FileTextLeading}
                                    title="Normalizing relational data to 3NF"
                                    subtitle="Module 4 · Database design"

                                />
                            </div>
                        ),
                    },
                    {
                        name: "isSkeleton = true (same slots present)",
                        why: "The mirror keeps the identical `gap-3 py-2` frame and the same Leading + TitledText node set, only swapping the icon for a square and the text for two shimmer bars. The mirror follows whichever slot is actually present, so a row without `leading` would not draw a square either, which is what keeps the row from jumping once the real data lands.",
                        code: `<ListRow
  leading={FileTextLeading}
  title="…"
  subtitle="…"
  isSkeleton
/>`,
                        render: (
                            <div data-tier="fixture" className="w-full max-w-md rounded-2xl border border-default px-3">
                                <ListRow
                                    leading={FileTextLeading}
                                    title="Indexes and query plans"
                                    subtitle="Module 4 · Database design"
                                    isSkeleton

                                />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** Status chip component (COMPOSITE-8): `ListRow` calls this itself for the `meta` slot. */
const PassedMeta = () => (
    <Chip data-tier="fixture" size="sm" variant="soft" color="success">
        <Chip.Label>Passed</Chip.Label>
    </Chip>
)

/** `meta` (a status chip) + `trailing` (a navigation chevron) on the right edge. */
export const MetaTrailing: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ListRow"
                tier="composite"
                leaf="MetaTrailing"
                annotate={META_TRAILING_ANNOTATE}
                states={[
                    {
                        name: "meta + trailing set",
                        why: "Both `meta` (a status chip) and `trailing` (a navigation chevron) render into the same single div on the right edge, sharing one `gap-2` cluster rather than becoming two separate parts. Merging them into one right-side cluster keeps the row from needing a second layout seam just to hold two small pieces.",
                        code: `<ListRow
  title="Write a migration adding a unique index on email"
  subtitle="Submitted Mar 15, 2026"
  meta={PassedMeta}
  trailing={Chevron}
/>`,
                        render: (
                            <div data-tier="fixture" className="w-full max-w-md rounded-2xl border border-default px-3">
                                <ListRow
                                    title="Write a migration adding a unique index on email"
                                    subtitle="Submitted Mar 15, 2026"
                                    meta={PassedMeta}
                                    trailing={Chevron}

                                />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** `divider` between consecutive rows — set on every row EXCEPT the last, so no trailing border. */
export const DividerList: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ListRow"
                tier="composite"
                leaf="DividerList"
                annotate={TITLE_ONLY_ANNOTATE}
                states={[
                    {
                        name: "3 rows, divider on all but the last",
                        why: "Three rows share the identical TitledText-only composition, so the same part name repeats three times in the tree instead of growing new parts. `divider` only adds a bottom border on the rows that carry it, it does not add or change any part, which is why the last row in a list normally leaves it off.",
                        code: `<ListRow title="Session 1…" subtitle="Completed" divider />
<ListRow title="Session 2…" subtitle="Completed" divider />
<ListRow title="Session 3…" subtitle="In progress" />`,
                        render: (
                            <div data-tier="fixture" className="w-full max-w-md rounded-2xl border border-default px-3">
                                <ListRow title="Session 1: Loops and conditionals" subtitle="Completed" divider />
                                <ListRow title="Session 2: Functions and variable scope" subtitle="Completed" divider />
                                <ListRow title="Session 3: Basic data structures" subtitle="In progress" />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** `href`: the whole row is an `<a>` that navigates to a real route on click (vs `onPress` for in-page callbacks). */
export const LinkRow: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ListRow"
                tier="composite"
                leaf="LinkRow"
                annotate={META_TRAILING_ANNOTATE}
                states={[
                    {
                        name: "href set, trailing only (no meta)",
                        why: "With only `trailing` (no `meta`) passed, the right side still merges into the same MetaTrailing part rather than becoming a bare chevron floating on its own. `href` (instead of `onPress`) is what turns the whole row into a real `<a>` that navigates to another route, rather than firing an in-page callback.",
                        code: `<ListRow
  title="View course completion certificate"
  subtitle="Issued Feb 1, 2026"
  href="/certificates/fullstack-mastery"
  trailing={Chevron}
/>`,
                        render: (
                            <div data-tier="fixture" className="w-full max-w-md rounded-2xl border border-default px-3">
                                <ListRow
                                    title="View course completion certificate"
                                    subtitle="Issued Feb 1, 2026"
                                    href="/certificates/fullstack-mastery"
                                    trailing={Chevron}

                                />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** `onPress`: the entire row is a keyboard-accessible button — click a row to fire its own handler (hover/focus surface). */
export const Clickable: Story = {
    render: () => {
        const ClickableRows = () => {
            const [lastClicked, setLastClicked] = useState("(no row clicked yet)")
            const rows = [
                "Exercise 1: Loops and conditionals",
                "Exercise 2: Functions and variable scope",
                "Exercise 3: Basic data structures",
            ]
            return (
                <div data-tier="fixture" className="flex w-full max-w-md flex-col gap-3">
                    <BlockAnatomy
                        name="ListRow"
                        tier="composite"
                        leaf="Clickable"
                        annotate={TITLE_ONLY_ANNOTATE}
                        states={[
                            {
                                name: "onPress set",
                                why: "Passing `onPress` switches the row's root element to `role=\"button\"` with its own hover and focus surface, without adding any new part to the tree. This is what makes an entire row keyboard-accessible and clickable as one unit, rather than requiring a nested button inside it.",
                                code: `<ListRow
  title="Exercise 1…"
  onPress={() => …}
  divider
/>`,
                                render: (
                                    <div data-tier="fixture" className="flex flex-col rounded-2xl border border-default px-3">
                                        {rows.map((row, index) => (
                                            <ListRow
                                                key={row}
                                                title={row}
                                                onPress={() => setLastClicked(row)}
                                                divider={index < rows.length - 1}

                                            />
                                        ))}
                                    </div>
                                ),
                            },
                        ]}
                    />
                    <Typography type="body-sm" color="muted">
                        {`Row just clicked: ${lastClicked}`}
                    </Typography>
                </div>
            )
        }
        return (
            <div data-tier="fixture" className="p-8">
                <ClickableRows />
            </div>
        )
    },
}

// Three status icons SHARE THE SAME round mold (§5.0a): done = FILLED
// circle (`weight="fill"`), in progress = circle with >, not opened =
// empty circle. All three are `size-5` (next to `text-sm` title,
// Phosphor scale §5a) so they do NOT need `weight="bold"` compensation.
// Each is a COMPONENT reference (COMPOSITE-8) — `ListRow` calls it itself.
const DoneLeading = () => <CheckCircleIcon data-tier="fixture" className="size-5 text-success" weight="fill" aria-hidden />
const InProgressLeading = () => <PlayCircleIcon data-tier="fixture" className="size-5 text-accent" aria-hidden />
const NotStartedLeading = () => <CircleIcon data-tier="fixture" className="size-5 text-muted" aria-hidden />

const LoopsMeta = () => <VariantChipDifficulty difficulty="beginner" />
const FunctionsMeta = () => <VariantChipDifficulty difficulty="intermediate" />
// Next to a `text-xs` chip -> `size-4` (Phosphor scale §5a); smaller than `size-5` =>
// compensate with `weight="bold"` (§5.0a).
const RecursionMeta = () => (
    <>
        <VariantChipDifficulty difficulty="advanced" />
        <LockIcon data-tier="fixture" className="size-4 text-muted" weight="bold" aria-hidden />
    </>
)

const lessons = [
    { leading: DoneLeading, title: "Loops and conditionals", subtitle: "8 min read", meta: LoopsMeta },
    { leading: InProgressLeading, title: "Functions and variable scope", subtitle: "12 min read", meta: FunctionsMeta },
    { leading: NotStartedLeading, title: "Recursion and divide-and-conquer", subtitle: "15 min read", meta: RecursionMeta },
]

/**
 * PROOF: `ListRow` alone covers a "lesson row" (leading state icon · title ·
 * subtitle read-time · meta = DifficultyChip + lock · onPress) — no dedicated
 * `LessonRow` component needed. Variant-of-chrome comes entirely from props.
 */
export const AsLessonRow: Story = {
    render: () => {
        const LessonRows = () => {
            const [lastClicked, setLastClicked] = useState("(no lesson clicked yet)")
            return (
                <div data-tier="fixture" className="flex w-full max-w-md flex-col gap-3">
                    <BlockAnatomy
                        name="ListRow"
                        tier="composite"
                        leaf="AsLessonRow"
                        annotate={LEADING_META_TRAILING_ANNOTATE}
                        reason="PROOF: ListRow alone covers a 'lesson row' (leading state icon, title, subtitle read-time, meta = DifficultyChip + lock, onPress); no dedicated LessonRow component is needed, since the variant of chrome comes entirely from props."
                        states={[
                            {
                                name: "3 lesson rows: state icon + difficulty chip + lock",
                                why: "Three rows share the identical Leading/TitledText/MetaTrailing composition, and only the data behind each slot changes: which status icon leads, which difficulty chip shows, and whether a lock icon joins it. Seeing all three side by side is the proof that a dedicated LessonRow component was never needed, ListRow's existing props already cover the shape.",
                                code: `<ListRow
  leading={DoneLeading}
  title="Loops and conditionals"
  subtitle="8 min read"
  meta={LoopsMeta}
  divider
/>`,
                                render: (
                                    <div data-tier="fixture" className="flex flex-col rounded-2xl border border-default px-3">
                                        {lessons.map((lesson, index) => (
                                            <ListRow
                                                key={lesson.title}
                                                leading={lesson.leading}
                                                title={lesson.title}
                                                subtitle={lesson.subtitle}
                                                meta={lesson.meta}
                                                onPress={() => setLastClicked(lesson.title)}
                                                divider={index < lessons.length - 1}

                                            />
                                        ))}
                                    </div>
                                ),
                            },
                        ]}
                    />
                    <Typography type="body-sm" color="muted">
                        {`Lesson just clicked: ${lastClicked}`}
                    </Typography>
                </div>
            )
        }
        return (
            <div data-tier="fixture" className="p-8">
                <LessonRows />
            </div>
        )
    },
}

/** COMPOSITE-8 component references for the two nudge rows below. */
const BellLeading = () => <BellIcon data-tier="fixture" className="size-5 text-muted" aria-hidden focusable="false" />
const AssignmentsMeta = () => (
    <Chip data-tier="fixture" size="sm" variant="soft" color="warning">
        <Chip.Label>3</Chip.Label>
    </Chip>
)
const NotesMeta = () => (
    <Chip data-tier="fixture" size="sm" variant="soft" color="accent">
        <Chip.Label>5</Chip.Label>
    </Chip>
)
const ArrowTrailing = () => <ArrowRightIcon data-tier="fixture" className="size-3 text-muted" weight="bold" aria-hidden focusable="false" />

/**
 * PROOF: `ListRow` also covers a "nudge row" (leading icon · label title ·
 * meta count · trailing arrow · href) — no dedicated `NudgeRow` component
 * needed. Same frame, different props.
 */
export const AsNudgeRow: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ListRow"
                tier="composite"
                leaf="AsNudgeRow"
                annotate={LEADING_META_TRAILING_ANNOTATE}
                reason="PROOF: ListRow also covers a 'nudge row' (leading icon, TitledText label, meta count, trailing arrow, href); no separate NudgeRow component is needed."
                states={[
                    {
                        name: "2 nudge rows: leading icon + meta count + href",
                        why: "Two rows share the identical Leading/TitledText/MetaTrailing composition used by `AsLessonRow` above, with `href` turning each into a real link instead of an onPress button. This is the second proof that the same frame covers a very different-looking row, a dashboard nudge instead of a lesson, purely through the props passed to it.",
                        code: `<ListRow
  leading={BellLeading}
  title="Pending assignments"
  href="/dashboard/assignments?status=pending"
  meta={AssignmentsMeta}
  trailing={ArrowTrailing}
  divider
/>`,
                        render: (
                            <div data-tier="fixture" className="w-full max-w-md rounded-2xl border border-default px-3">
                                <ListRow
                                    leading={BellLeading}
                                    title="Pending assignments"
                                    href="/dashboard/assignments?status=pending"
                                    meta={AssignmentsMeta}
                                    trailing={ArrowTrailing}
                                    divider

                                />
                                <ListRow
                                    leading={FileTextLeading}
                                    title="Unread notes"
                                    href="/dashboard/notes?status=unread"
                                    meta={NotesMeta}
                                    trailing={ArrowTrailing}
                                />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}
