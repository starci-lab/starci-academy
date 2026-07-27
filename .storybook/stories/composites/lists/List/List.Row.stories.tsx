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
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ⚠️ STATE SCOPE (teacher confirmed 2026-07-25): `List.Row` is a SINGLE-ROW frame. What
 * it produces: toggling each slot on/off (`leading`/`subtitle`/`meta`/`trailing`), the
 * `divider` separator line, swapping the wrapper tag on interaction (`href`/`onPress`),
 * and mirroring `isSkeleton` for THIS row itself. The section label (`label` + CTA) and
 * the list's EMPTY state belong to `List.Labeled` — NOT repeated here.
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
const TITLE_ONLY_PARTS: Array<AnatomyNode> = [
    { name: "TitledText", tier: "composite", role: "title (body-sm medium), no subtitle/leading/meta", storyId: "composites-texts-titledtext--row" },
]

const LEADING_SUBTITLE_PARTS: Array<AnatomyNode> = [
    { name: "Leading", tier: "composite", role: "lesson-type icon (does not shrink)" },
    { name: "TitledText", tier: "composite", role: "title + subtitle (module breadcrumb)", storyId: "composites-texts-titledtext--row" },
]

const META_TRAILING_PARTS: Array<AnatomyNode> = [
    { name: "TitledText", tier: "composite", role: "title + subtitle (submission date)", storyId: "composites-texts-titledtext--row" },
    { name: "MetaTrailing", tier: "composite", role: "status chip + navigation chevron, sharing 1 right-side row" },
]

const LEADING_META_TRAILING_PARTS: Array<AnatomyNode> = [
    { name: "Leading", tier: "composite", role: "status/type icon (does not shrink)" },
    { name: "TitledText", tier: "composite", role: "title + subtitle", storyId: "composites-texts-titledtext--row" },
    { name: "MetaTrailing", tier: "composite", role: "meta cluster (chip/count) + trailing, sharing 1 right-side row" },
]

/** The simplest row — just a title. Used when the list has no subtitle, icon, or trailing action. */
export const TitleOnly: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="List.Row"
                tier="composite"
                leaf="TitleOnly"
                parts={TITLE_ONLY_PARTS}
                reason="A highly reusable list-row frame: leading/TitledText/meta-trailing are all optional via props — this leaf only turns on title."
                code={`<List.Row
  title="Bài tập buổi 1: Vòng lặp và điều kiện"
/>`}
            >
                <div className="w-full max-w-md rounded-2xl border border-default px-3">
                    <List.Row title="Bài tập buổi 1: Vòng lặp và điều kiện" showAnatomy />
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/**
 * `leading` (lesson-type icon) + `subtitle` (module breadcrumb) under the title.
 *
 * MERGED INTO ONE LEAF (§14d.2): `isSkeleton` is NOT a leaf — the mirror KEEPS the exact
 * same node set (`Leading` + `TitledText`), only swapping the icon for a square and the
 * text for two bars. It's a STATE of this row itself so it renders right in this leaf,
 * the bottom row.
 */
export const LeadingSubtitle: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="List.Row"
                tier="composite"
                leaf="LeadingSubtitle"
                parts={LEADING_SUBTITLE_PARTS}
                note="leading turns on 1 more part; subtitle shares the SAME TitledText node (Title/Subtitle are not split). The last row is `isSkeleton` — same `gap-3 py-2` frame, same node set, so the row doesn't jump once data lands. The mirror follows WHICHEVER SLOT IS PRESENT: skip `leading` and the mirror won't draw a square either."
                code={`<List.Row
  leading={<FileTextIcon className="size-5 text-muted" />}
  title="Chuẩn hoá dữ liệu quan hệ tới 3NF"
  subtitle="Module 4 · Thiết kế cơ sở dữ liệu"
/>
{/* the same row while it's loading */}
<List.Row leading={…} title="…" subtitle="…" isSkeleton />`}
            >
                <div className="flex w-full max-w-md flex-col rounded-2xl border border-default px-3">
                    <List.Row
                        leading={<FileTextIcon className="size-5 text-muted" aria-hidden focusable="false" />}
                        title="Chuẩn hoá dữ liệu quan hệ tới 3NF"
                        subtitle="Module 4 · Thiết kế cơ sở dữ liệu"
                        divider
                        showAnatomy
                    />
                    <List.Row
                        leading={<FileTextIcon className="size-5 text-muted" aria-hidden focusable="false" />}
                        title="Chỉ mục và kế hoạch truy vấn"
                        subtitle="Module 4 · Thiết kế cơ sở dữ liệu"
                        isSkeleton
                        showAnatomy
                    />
                </div>
            </BlockAnatomy>
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
                parts={META_TRAILING_PARTS}
                note="meta + trailing render into THE SAME 1 div (`ml-auto flex ... gap-2`) — not 2 separate clusters, so they merge into 1 part."
                code={`<List.Row
  title="Viết migration thêm unique index cho email"
  subtitle="Nộp ngày 15/03/2026"
  meta={<Chip …>Đạt</Chip>}
  trailing={<CaretRightIcon />}
/>`}
            >
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
            </BlockAnatomy>
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
                parts={TITLE_ONLY_PARTS}
                note="3 rows with the SAME composition (TitledText only) — the same part name repeats, `divider` only adds a bottom border, it's not a separate part."
                code={`<List.Row title="Buổi 1…" subtitle="Hoàn thành" divider />
<List.Row title="Buổi 2…" subtitle="Hoàn thành" divider />
<List.Row title="Buổi 3…" subtitle="Đang học" />`}
            >
                <div className="w-full max-w-md rounded-2xl border border-default px-3">
                    <List.Row title="Buổi 1: Vòng lặp và điều kiện" subtitle="Hoàn thành" divider showAnatomy />
                    <List.Row title="Buổi 2: Hàm và phạm vi biến" subtitle="Hoàn thành" divider showAnatomy />
                    <List.Row title="Buổi 3: Cấu trúc dữ liệu cơ bản" subtitle="Đang học" showAnatomy />
                </div>
            </BlockAnatomy>
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
                parts={META_TRAILING_PARTS}
                note="Only trailing (chevron), no meta — still merges into the same MetaTrailing part (1 right-side div)."
                code={`<List.Row
  title="Xem lại chứng chỉ hoàn thành khoá"
  subtitle="Cấp ngày 01/02/2026"
  href="/certificates/fullstack-mastery"
  trailing={<CaretRightIcon />}
/>`}
            >
                <div className="w-full max-w-md rounded-2xl border border-default px-3">
                    <List.Row
                        title="Xem lại chứng chỉ hoàn thành khoá"
                        subtitle="Cấp ngày 01/02/2026"
                        href="/certificates/fullstack-mastery"
                        trailing={chevron}
                        showAnatomy
                    />
                </div>
            </BlockAnatomy>
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
                        parts={TITLE_ONLY_PARTS}
                        note="onPress switches the root to role=button (hover/focus surface) — adds no part, only changes the wrapper tag."
                        code={`<List.Row
  title="Bài tập buổi 1…"
  onPress={() => …}
  divider
/>`}
                    >
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
                    </BlockAnatomy>
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
                        parts={LEADING_META_TRAILING_PARTS}
                        reason="PROOF: List.Row alone covers a 'lesson row' — leading state icon · TitledText · meta (DifficultyChip+lock) — no separate LessonRow needed."
                        code={`<List.Row
  leading={<CheckCircleIcon weight="fill" />}
  title="Loops and conditionals"
  subtitle="8 min read"
  meta={<DifficultyChip difficulty="beginner" />}
  divider
/>`}
                    >
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
                    </BlockAnatomy>
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
                parts={LEADING_META_TRAILING_PARTS}
                reason="PROOF: List.Row also covers a 'nudge row' — leading icon · TitledText (label) · meta count · trailing arrow · href — no separate NudgeRow needed."
                code={`<List.Row
  leading={<BellIcon />}
  title="Pending assignments"
  href="/dashboard/assignments?status=pending"
  meta={<Chip size="sm" variant="soft" color="warning"><Chip.Label>3</Chip.Label></Chip>}
  trailing={<ArrowRightIcon />}
  divider
/>`}
            >
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
                        showAnatomy
                    />
                </div>
            </BlockAnatomy>
        </div>
    ),
}
