import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Chip, Typography } from "@heroui/react"
import {
    CaretRightIcon,
    FileTextIcon,
    ArrowRightIcon,
    BellIcon,
} from "@phosphor-icons/react"
// PILOT (gravity migration eyeball) — AsLessonRow icons swapped to @gravity-ui/icons,
// size = font-size (leading↔title text-sm → size-3.5; lock↔chip text-xs → size-3).
// So sánh weight/size với các story List.Row khác (còn Phosphor). Chưa đụng canon.
import { CircleCheckFill, Play, Circle, Lock } from "@gravity-ui/icons"
import { List } from "@sb-components/layouts/lists/List/List"
import { DifficultyChip } from "@sb-components/_designs/chips/DifficultyChip/DifficultyChip"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ⚠️ PHẠM VI STATE (thầy chốt 2026-07-25): `List.Row` là khung MỘT HÀNG. Thứ nó đẻ ra:
 * bật/tắt từng slot (`leading`/`subtitle`/`meta`/`trailing`), viền ngăn `divider`, đổi thẻ
 * bọc khi tương tác (`href`/`onPress`), và mirror `isSkeleton` của CHÍNH hàng. Nhãn phần
 * (`label` + CTA) và trạng thái RỖNG của danh sách là tài sản của `List.Labeled` — KHÔNG lặp ở đây.
 */
const meta: Meta<typeof List.Row> = {
    title: "Layouts/Lists/List/List.Row",
    component: List.Row,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof List.Row>

const chevron = <CaretRightIcon className="size-3 text-muted" aria-hidden focusable="false" />

// DOM thật: List.Row ⊃ Leading?(icon/avatar, không co) · TitledText(title+subtitle
// gộp — 1 semantic unit, KHÔNG tách Title/Subtitle riêng, xem TitledText.tsx) ·
// MetaTrailing?(cụm meta+trailing, chia sẻ 1 hàng gap-2 bên phải).
const TITLE_ONLY_PARTS: Array<AnatomyNode> = [
    { name: "TitledText", tier: "primitive", role: "title (body-sm medium), không subtitle/leading/meta", storyId: "primitives-texts-titledtext--row" },
]

const LEADING_SUBTITLE_PARTS: Array<AnatomyNode> = [
    { name: "Leading", tier: "primitive", role: "icon loại bài (không co giãn)" },
    { name: "TitledText", tier: "primitive", role: "title + subtitle (breadcrumb module)", storyId: "primitives-texts-titledtext--row" },
]

const META_TRAILING_PARTS: Array<AnatomyNode> = [
    { name: "TitledText", tier: "primitive", role: "title + subtitle (ngày nộp)", storyId: "primitives-texts-titledtext--row" },
    { name: "MetaTrailing", tier: "primitive", role: "chip trạng thái + chevron điều hướng, chung 1 hàng phải" },
]

const LEADING_META_TRAILING_PARTS: Array<AnatomyNode> = [
    { name: "Leading", tier: "primitive", role: "icon trạng thái/loại (không co giãn)" },
    { name: "TitledText", tier: "primitive", role: "title + subtitle", storyId: "primitives-texts-titledtext--row" },
    { name: "MetaTrailing", tier: "primitive", role: "cụm meta (chip/đếm) + trailing, chung 1 hàng phải" },
]

/** The simplest row — just a title. Used when the list has no subtitle, icon, or trailing action. */
export const TitleOnly: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="List.Row"
                tier="primitive"
                leaf="TitleOnly"
                parts={TITLE_ONLY_PARTS}
                reason="Khung hàng danh sách tái dùng cao: leading/TitledText/meta-trailing đều optional theo props — leaf này chỉ bật title."
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

/** `leading` (type icon) + `subtitle` (a module breadcrumb) below the title. */
export const LeadingSubtitle: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="List.Row"
                tier="primitive"
                leaf="LeadingSubtitle"
                parts={LEADING_SUBTITLE_PARTS}
                note="leading bật thêm 1 part; subtitle gộp CHUNG node TitledText (không tách Title/Subtitle)."
                code={`<List.Row
  leading={<FileTextIcon className="size-5 text-muted" />}
  title="Chuẩn hoá dữ liệu quan hệ tới 3NF"
  subtitle="Module 4 · Thiết kế cơ sở dữ liệu"
/>`}
            >
                <div className="w-full max-w-md rounded-2xl border border-default px-3">
                    <List.Row
                        leading={<FileTextIcon className="size-5 text-muted" aria-hidden focusable="false" />}
                        title="Chuẩn hoá dữ liệu quan hệ tới 3NF"
                        subtitle="Module 4 · Thiết kế cơ sở dữ liệu"
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
                tier="primitive"
                leaf="MetaTrailing"
                parts={META_TRAILING_PARTS}
                note="meta + trailing render CHUNG 1 div (`ml-auto flex ... gap-2`) — không phải 2 cluster tách biệt, nên gộp 1 part."
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
                tier="primitive"
                leaf="DividerList"
                parts={TITLE_ONLY_PARTS}
                note="3 hàng CÙNG composition (chỉ TitledText) — cùng 1 tên part lặp lại, `divider` chỉ thêm viền dưới, không phải part riêng."
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
                tier="primitive"
                leaf="LinkRow"
                parts={META_TRAILING_PARTS}
                note="Chỉ trailing (chevron), không meta — vẫn gộp vào cùng part MetaTrailing (1 div phải)."
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
            const [lastClicked, setLastClicked] = useState("(chưa bấm dòng nào)")
            const rows = [
                "Bài tập buổi 1: Vòng lặp và điều kiện",
                "Bài tập buổi 2: Hàm và phạm vi biến",
                "Bài tập buổi 3: Cấu trúc dữ liệu cơ bản",
            ]
            return (
                <div className="flex w-full max-w-md flex-col gap-3">
                    <BlockAnatomy
                        name="List.Row"
                        tier="primitive"
                        leaf="Clickable"
                        parts={TITLE_ONLY_PARTS}
                        note="onPress đổi root sang role=button (hover/focus surface) — không thêm part, chỉ đổi thẻ bọc."
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

const SKELETON_PARTS: Array<AnatomyNode> = [
    { name: "Leading", tier: "primitive", role: "ô vuông thay icon (chỉ khi hàng thật có leading)" },
    { name: "TitledText", tier: "primitive", role: "mirror 2 thanh: title + subtitle", storyId: "primitives-texts-titledtext--row" },
]

/**
 * `isSkeleton` — mirror CỦA CHÍNH hàng: giữ nguyên khung `gap-3 py-2`, đổi leading
 * thành ô vuông và cột text thành 2 thanh, nên hàng không nhảy khi dữ liệu về.
 * Mirror bám theo SLOT CÓ MẶT: không truyền `leading` thì mirror cũng không vẽ ô vuông.
 */
export const Loading: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="List.Row"
                tier="primitive"
                leaf="Loading"
                parts={SKELETON_PARTS}
                note="isSkeleton → Leading và TitledText tự swap sang mirror riêng, vẫn cùng bộ node."
                code={`<List.Row
  leading={<FileTextIcon />}
  title="Chuẩn hoá dữ liệu quan hệ tới 3NF"
  subtitle="Module 4 · Thiết kế cơ sở dữ liệu"
  isSkeleton
/>`}
            >
                <div className="flex w-full max-w-md flex-col rounded-2xl border border-default px-3">
                    <List.Row
                        leading={<FileTextIcon aria-hidden focusable="false" />}
                        title="Chuẩn hoá dữ liệu quan hệ tới 3NF"
                        subtitle="Module 4 · Thiết kế cơ sở dữ liệu"
                        divider
                        isSkeleton
                        showAnatomy
                    />
                    <List.Row
                        leading={<FileTextIcon aria-hidden focusable="false" />}
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
                    leading: <CircleCheckFill className="size-3.5 text-success" aria-hidden />,
                    title: "Vòng lặp và điều kiện",
                    subtitle: "8 phút đọc",
                    difficulty: "beginner" as const,
                    locked: false,
                },
                {
                    leading: <Play className="size-3.5 text-accent" aria-hidden />,
                    title: "Hàm và phạm vi biến",
                    subtitle: "12 phút đọc",
                    difficulty: "intermediate" as const,
                    locked: false,
                },
                {
                    leading: <Circle className="size-3.5 text-muted" aria-hidden />,
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
                        tier="primitive"
                        leaf="AsLessonRow"
                        parts={LEADING_META_TRAILING_PARTS}
                        reason="PROOF: List.Row một mình phủ 'lesson row' — leading state icon · TitledText · meta (DifficultyChip+lock) — không cần LessonRow riêng."
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
                                                <Lock className="size-3 text-muted" aria-hidden />
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
 * needed. Same khung, different props.
 */
export const AsNudgeRow: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="List.Row"
                tier="primitive"
                leaf="AsNudgeRow"
                parts={LEADING_META_TRAILING_PARTS}
                reason="PROOF: List.Row cũng phủ 'nudge row' — leading icon · TitledText (label) · meta count · trailing arrow · href — không cần NudgeRow riêng."
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
                        trailing={<ArrowRightIcon className="size-3 text-muted" aria-hidden focusable="false" />}
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
                        trailing={<ArrowRightIcon className="size-3 text-muted" aria-hidden focusable="false" />}
                        showAnatomy
                    />
                </div>
            </BlockAnatomy>
        </div>
    ),
}
