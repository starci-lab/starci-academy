import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Chip, Typography } from "@heroui/react"
// ONE ICON SET ONLY = Phosphor (§5.0). Size scale per §5a: leading ↔ title
// `text-sm` → `size-5` (regular); a glyph smaller than `size-5` (lock next to a
// `text-xs` chip → `size-4`, navigation caret → `size-3`) must compensate with `weight="bold"` (§5.0a).
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
import { List } from "@sb-components/composites/lists/List/List"
import { DifficultyChip } from "@sb-components/_legacy/designs/chips/DifficultyChip/DifficultyChip"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ⚠️ STATE SCOPE (teacher confirmed 2026-07-25): `List.Row` is a SINGLE-ROW frame. What
 * it produces: toggling each slot on/off (`leading`/`subtitle`/`meta`/`trailing`), the
 * `divider` separator line, swapping the wrapper tag on interaction (`href`/`onPress`),
 * and mirroring `isSkeleton` for THIS row itself. The section label (`label` + CTA) and
 * the list's EMPTY state belong to `List.Labeled`, NOT repeated here.
 */
const meta: Meta<typeof List.Row> = {
    title: "Composites/Lists/List/List.Row",
    component: List.Row,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof List.Row>

// Navigation caret = `size-3` FIXED (exception to §5a) → smaller than `size-5` ⇒ `weight="bold"` (§5.0a).
const chevron = <CaretRightIcon className="size-3 text-muted" weight="bold" aria-hidden focusable="false" />

// Real DOM: List.Row ⊃ Leading?(icon/avatar, doesn't shrink) · TitledText(title+subtitle
// merged — 1 semantic unit, does NOT split Title/Subtitle separately, see TitledText.tsx) ·
// MetaTrailing?(meta+trailing cluster, sharing 1 gap-2 row on the right).
//
// ⚠️ 2026-07-28: `Leading` and `MetaTrailing` are CALLER SLOTS — the div only positions
// whatever `leading`/`meta`/`trailing` the caller passed, it doesn't build that content
// itself, and neither has a story of its own to jump to. Per the panel's whitelist rule
// (only a part with a REAL `storyId` or `tier: "heroui"` counts), they are NOT annotated
// here anymore — the component also stopped badging them (nothing to declare).
const TITLE_ONLY_ANNOTATE: Record<string, AnatomyAnnotation> = {
    "TitledText": { tier: "composite", role: "title (body-sm medium), no subtitle/leading/meta", storyId: "composites-texts-titledtext--row" },
}

const LEADING_SUBTITLE_ANNOTATE: Record<string, AnatomyAnnotation> = {
    "TitledText": { tier: "composite", role: "title + subtitle (module breadcrumb)", storyId: "composites-texts-titledtext--row" },
    // ⭐ 2026-07-27 — while `isSkeleton`, the leading slot's placeholder box renders
    // straight from HeroUI's `Skeleton` (aliased `HeroSkeleton` in the component). `heroui`
    // needs no `storyId` to show up, only the tier.
    "Skeleton": { tier: "heroui", role: "the shimmer placeholder standing in for the leading icon while isSkeleton" },
}

const META_TRAILING_ANNOTATE: Record<string, AnatomyAnnotation> = {
    "TitledText": { tier: "composite", role: "title + subtitle (submission date)", storyId: "composites-texts-titledtext--row" },
}

const LEADING_META_TRAILING_ANNOTATE: Record<string, AnatomyAnnotation> = {
    "TitledText": { tier: "composite", role: "title + subtitle", storyId: "composites-texts-titledtext--row" },
}

/** The simplest row — just a title. Used when the list has no subtitle, icon, or trailing action. */
export const TitleOnly: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="List.Row"
                tier="composite"
                leaf="TitleOnly"
                annotate={TITLE_ONLY_ANNOTATE}
                reason="A highly reusable list-row frame: leading/TitledText/meta-trailing are all optional via props; this leaf only turns on title."
                states={[
                    {
                        name: "title only",
                        why: "Only the TitledText node renders, with leading, subtitle, and meta-trailing all left off. This is the row's simplest shape, used whenever the list itself carries no icon, no secondary line, and no trailing action.",
                        code: `<List.Row
  title="Bài tập buổi 1: Vòng lặp và điều kiện"
/>`,
                        render: (
                            <div className="w-full max-w-md rounded-2xl border border-default px-3">
                                <List.Row title="Bài tập buổi 1: Vòng lặp và điều kiện" showAnatomy />
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
export const LeadingSubtitle: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="List.Row"
                tier="composite"
                leaf="LeadingSubtitle"
                annotate={LEADING_SUBTITLE_ANNOTATE}
                reason="`isSkeleton` is a STATE of this row, not a leaf of its own (§14d.2): the mirror keeps the exact node set of whichever slots are actually present, so it sits beside its real-data counterpart in this same leaf."
                states={[
                    {
                        name: "leading + subtitle set",
                        why: "The row grows a Leading icon before the title and a subtitle line, a module breadcrumb, sharing the same TitledText node as the title, since Title and Subtitle are not split into separate nodes. Both extra pieces read together as one row identity: what kind of item this is, and which module it belongs to.",
                        code: `<List.Row
  leading={<FileTextIcon className="size-5 text-muted" />}
  title="Chuẩn hoá dữ liệu quan hệ tới 3NF"
  subtitle="Module 4 · Thiết kế cơ sở dữ liệu"
/>`,
                        render: (
                            <div className="w-full max-w-md rounded-2xl border border-default px-3">
                                <List.Row
                                    leading={<FileTextIcon className="size-5 text-muted" aria-hidden focusable="false" />}
                                    title="Chuẩn hoá dữ liệu quan hệ tới 3NF"
                                    subtitle="Module 4 · Thiết kế cơ sở dữ liệu"
                                    showAnatomy
                                />
                            </div>
                        ),
                    },
                    {
                        name: "isSkeleton = true (same slots present)",
                        why: "The mirror keeps the identical `gap-3 py-2` frame and the same Leading + TitledText node set, only swapping the icon for a square and the text for two shimmer bars. The mirror follows whichever slot is actually present, so a row without `leading` would not draw a square either, which is what keeps the row from jumping once the real data lands.",
                        code: `<List.Row
  leading={…}
  title="…"
  subtitle="…"
  isSkeleton
/>`,
                        render: (
                            <div className="w-full max-w-md rounded-2xl border border-default px-3">
                                <List.Row
                                    leading={<FileTextIcon className="size-5 text-muted" aria-hidden focusable="false" />}
                                    title="Chỉ mục và kế hoạch truy vấn"
                                    subtitle="Module 4 · Thiết kế cơ sở dữ liệu"
                                    isSkeleton
                                    showAnatomy
                                />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** `meta` (a status chip) + `trailing` (a navigation chevron) on the right edge. */
export const MetaTrailing: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="List.Row"
                tier="composite"
                leaf="MetaTrailing"
                annotate={META_TRAILING_ANNOTATE}
                states={[
                    {
                        name: "meta + trailing set",
                        why: "Both `meta` (a status chip) and `trailing` (a navigation chevron) render into the same single div on the right edge, sharing one `gap-2` cluster rather than becoming two separate parts. Merging them into one right-side cluster keeps the row from needing a second layout seam just to hold two small pieces.",
                        code: `<List.Row
  title="Viết migration thêm unique index cho email"
  subtitle="Nộp ngày 15/03/2026"
  meta={<Chip …>Đạt</Chip>}
  trailing={<CaretRightIcon />}
/>`,
                        render: (
                            <div className="w-full max-w-md rounded-2xl border border-default px-3">
                                <List.Row
                                    title="Viết migration thêm unique index cho email"
                                    subtitle="Nộp ngày 15/03/2026"
                                    meta={
                                        <Chip size="sm" variant="soft" color="success">
                                            <Chip.Label>Đạt</Chip.Label>
                                        </Chip>
                                    }
                                    trailing={chevron}
                                    showAnatomy
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
        <div className="p-8">
            <BlockAnatomy
                name="List.Row"
                tier="composite"
                leaf="DividerList"
                annotate={TITLE_ONLY_ANNOTATE}
                states={[
                    {
                        name: "3 rows, divider on all but the last",
                        why: "Three rows share the identical TitledText-only composition, so the same part name repeats three times in the tree instead of growing new parts. `divider` only adds a bottom border on the rows that carry it, it does not add or change any part, which is why the last row in a list normally leaves it off.",
                        code: `<List.Row title="Buổi 1…" subtitle="Hoàn thành" divider />
<List.Row title="Buổi 2…" subtitle="Hoàn thành" divider />
<List.Row title="Buổi 3…" subtitle="Đang học" />`,
                        render: (
                            <div className="w-full max-w-md rounded-2xl border border-default px-3">
                                <List.Row title="Buổi 1: Vòng lặp và điều kiện" subtitle="Hoàn thành" divider showAnatomy />
                                <List.Row title="Buổi 2: Hàm và phạm vi biến" subtitle="Hoàn thành" divider />
                                <List.Row title="Buổi 3: Cấu trúc dữ liệu cơ bản" subtitle="Đang học" />
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
        <div className="p-8">
            <BlockAnatomy
                name="List.Row"
                tier="composite"
                leaf="LinkRow"
                annotate={META_TRAILING_ANNOTATE}
                states={[
                    {
                        name: "href set, trailing only (no meta)",
                        why: "With only `trailing` (no `meta`) passed, the right side still merges into the same MetaTrailing part rather than becoming a bare chevron floating on its own. `href` (instead of `onPress`) is what turns the whole row into a real `<a>` that navigates to another route, rather than firing an in-page callback.",
                        code: `<List.Row
  title="Xem lại chứng chỉ hoàn thành khoá"
  subtitle="Cấp ngày 01/02/2026"
  href="/certificates/fullstack-mastery"
  trailing={<CaretRightIcon />}
/>`,
                        render: (
                            <div className="w-full max-w-md rounded-2xl border border-default px-3">
                                <List.Row
                                    title="Xem lại chứng chỉ hoàn thành khoá"
                                    subtitle="Cấp ngày 01/02/2026"
                                    href="/certificates/fullstack-mastery"
                                    trailing={chevron}
                                    showAnatomy
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
                "Bài tập buổi 1: Vòng lặp và điều kiện",
                "Bài tập buổi 2: Hàm và phạm vi biến",
                "Bài tập buổi 3: Cấu trúc dữ liệu cơ bản",
            ]
            return (
                <div className="flex w-full max-w-md flex-col gap-3">
                    <BlockAnatomy
                        name="List.Row"
                        tier="composite"
                        leaf="Clickable"
                        annotate={TITLE_ONLY_ANNOTATE}
                        states={[
                            {
                                name: "onPress set",
                                why: "Passing `onPress` switches the row's root element to `role=\"button\"` with its own hover and focus surface, without adding any new part to the tree. This is what makes an entire row keyboard-accessible and clickable as one unit, rather than requiring a nested button inside it.",
                                code: `<List.Row
  title="Bài tập buổi 1…"
  onPress={() => …}
  divider
/>`,
                                render: (
                                    <div className="flex flex-col rounded-2xl border border-default px-3">
                                        {rows.map((row, index) => (
                                            <List.Row
                                                key={row}
                                                title={row}
                                                onPress={() => setLastClicked(row)}
                                                divider={index < rows.length - 1}
                                                showAnatomy
                                            />
                                        ))}
                                    </div>
                                ),
                            },
                        ]}
                    />
                    <Typography type="body-sm" color="muted">
                        {`Dòng vừa bấm: ${lastClicked}`}
                    </Typography>
                </div>
            )
        }
        return (
            <div className="p-8">
                <ClickableRows />
            </div>
        )
    },
}

/**
 * PROOF: `List.Row` alone covers a "lesson row" (leading state icon · title ·
 * subtitle read-time · meta = DifficultyChip + lock · onPress) — no dedicated
 * `LessonRow` component needed. Variant-of-chrome comes entirely from props.
 */
export const AsLessonRow: Story = {
    render: () => {
        const LessonRows = () => {
            const [lastClicked, setLastClicked] = useState("(chưa bấm bài nào)")
            const lessons = [
                {
                    // Three status icons SHARE THE SAME round mold (§5.0a): done = FILLED
                    // circle (`weight="fill"`), in progress = circle with ▶, not opened =
                    // empty circle. All three are `size-5` (next to `text-sm` title,
                    // Phosphor scale §5a) so they do NOT need `weight="bold"` compensation.
                    leading: <CheckCircleIcon className="size-5 text-success" weight="fill" aria-hidden />,
                    title: "Vòng lặp và điều kiện",
                    subtitle: "8 phút đọc",
                    difficulty: "beginner" as const,
                    locked: false,
                },
                {
                    leading: <PlayCircleIcon className="size-5 text-accent" aria-hidden />,
                    title: "Hàm và phạm vi biến",
                    subtitle: "12 phút đọc",
                    difficulty: "intermediate" as const,
                    locked: false,
                },
                {
                    leading: <CircleIcon className="size-5 text-muted" aria-hidden />,
                    title: "Đệ quy và chia để trị",
                    subtitle: "15 phút đọc",
                    difficulty: "advanced" as const,
                    locked: true,
                },
            ]
            return (
                <div className="flex w-full max-w-md flex-col gap-3">
                    <BlockAnatomy
                        name="List.Row"
                        tier="composite"
                        leaf="AsLessonRow"
                        annotate={LEADING_META_TRAILING_ANNOTATE}
                        reason="PROOF: List.Row alone covers a 'lesson row' (leading state icon, title, subtitle read-time, meta = DifficultyChip + lock, onPress); no dedicated LessonRow component is needed, since the variant of chrome comes entirely from props."
                        states={[
                            {
                                name: "3 lesson rows: state icon + difficulty chip + lock",
                                why: "Three rows share the identical Leading/TitledText/MetaTrailing composition, and only the data behind each slot changes: which status icon leads, which difficulty chip shows, and whether a lock icon joins it. Seeing all three side by side is the proof that a dedicated LessonRow component was never needed, List.Row's existing props already cover the shape.",
                                code: `<List.Row
  leading={<CheckCircleIcon weight="fill" />}
  title="Loops and conditionals"
  subtitle="8 min read"
  meta={<DifficultyChip difficulty="beginner" />}
  divider
/>`,
                                render: (
                                    <div className="flex flex-col rounded-2xl border border-default px-3">
                                        {lessons.map((lesson, index) => (
                                            <List.Row
                                                key={lesson.title}
                                                leading={lesson.leading}
                                                title={lesson.title}
                                                subtitle={lesson.subtitle}
                                                meta={
                                                    <>
                                                        <DifficultyChip difficulty={lesson.difficulty} />
                                                        {lesson.locked ? (
                                                            // Next to a `text-xs` chip → `size-4` (Phosphor scale §5a);
                                                            // smaller than `size-5` ⇒ compensate with `weight="bold"` (§5.0a).
                                                            <LockIcon className="size-4 text-muted" weight="bold" aria-hidden />
                                                        ) : null}
                                                    </>
                                                }
                                                onPress={() => setLastClicked(lesson.title)}
                                                divider={index < lessons.length - 1}
                                                showAnatomy
                                            />
                                        ))}
                                    </div>
                                ),
                            },
                        ]}
                    />
                    <Typography type="body-sm" color="muted">
                        {`Bài vừa bấm: ${lastClicked}`}
                    </Typography>
                </div>
            )
        }
        return (
            <div className="p-8">
                <LessonRows />
            </div>
        )
    },
}

/**
 * PROOF: `List.Row` also covers a "nudge row" (leading icon · label title ·
 * meta count · trailing arrow · href) — no dedicated `NudgeRow` component
 * needed. Same frame, different props.
 */
export const AsNudgeRow: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="List.Row"
                tier="composite"
                leaf="AsNudgeRow"
                annotate={LEADING_META_TRAILING_ANNOTATE}
                reason="PROOF: List.Row also covers a 'nudge row' (leading icon, TitledText label, meta count, trailing arrow, href); no separate NudgeRow component is needed."
                states={[
                    {
                        name: "2 nudge rows: leading icon + meta count + href",
                        why: "Two rows share the identical Leading/TitledText/MetaTrailing composition used by `AsLessonRow` above, with `href` turning each into a real link instead of an onPress button. This is the second proof that the same frame covers a very different-looking row, a dashboard nudge instead of a lesson, purely through the props passed to it.",
                        code: `<List.Row
  leading={<BellIcon />}
  title="Pending assignments"
  href="/dashboard/assignments?status=pending"
  meta={<Chip size="sm" variant="soft" color="warning"><Chip.Label>3</Chip.Label></Chip>}
  trailing={<ArrowRightIcon />}
  divider
/>`,
                        render: (
                            <div className="w-full max-w-md rounded-2xl border border-default px-3">
                                <List.Row
                                    leading={<BellIcon className="size-5 text-muted" aria-hidden focusable="false" />}
                                    title="Bài tập chưa nộp"
                                    href="/dashboard/assignments?status=pending"
                                    meta={
                                        <Chip size="sm" variant="soft" color="warning">
                                            <Chip.Label>3</Chip.Label>
                                        </Chip>
                                    }
                                    trailing={<ArrowRightIcon className="size-3 text-muted" weight="bold" aria-hidden focusable="false" />}
                                    divider
                                    showAnatomy
                                />
                                <List.Row
                                    leading={<FileTextIcon className="size-5 text-muted" aria-hidden focusable="false" />}
                                    title="Ghi chú chưa đọc"
                                    href="/dashboard/notes?status=unread"
                                    meta={
                                        <Chip size="sm" variant="soft" color="accent">
                                            <Chip.Label>5</Chip.Label>
                                        </Chip>
                                    }
                                    trailing={<ArrowRightIcon className="size-3 text-muted" weight="bold" aria-hidden focusable="false" />}
                                />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}
