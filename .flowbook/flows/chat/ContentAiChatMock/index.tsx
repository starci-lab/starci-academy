import React from "react"

import { Button, Chip, CloseButton, Link, ScrollShadow, Switch, Typography, cn } from "@heroui/react"
import {
    ArrowLeftIcon,
    ArrowRightIcon,
    BookOpenIcon,
    CardsIcon,
    CaretDownIcon,
    ChatsCircleIcon,
    CheckIcon,
    DotsThreeVerticalIcon,
    MagnifyingGlassIcon,
    PaperPlaneTiltIcon,
    PlusIcon,
    PuzzlePieceIcon,
    QuotesIcon,
    SparkleIcon,
} from "@phosphor-icons/react"

import { SAMPLE_QUESTION, SELECTED_PASSAGE, SESSIONS, SOURCES, type MockSource } from "../fixtures"

/**
 * A faithful, STATIC redraw of `src/components/features/learn/ContentAiChat` — every
 * in-rail screen posed for the storyboard (not interactive). Hand-built from HeroUI
 * primitives so the prototype carries none of the real redux/socket/SWR wiring.
 */
export type ScreenId =
    | "empty"
    | "composing"
    | "sending"
    | "streaming"
    | "answered"
    | "error"
    | "gated"
    | "selection"
    | "search"
    | "conversations"
    | "rename"
    | "skillMenu"
    | "modelPicker"

const KIND_META: Record<MockSource["kind"], { label: string; Icon: typeof CardsIcon }> = {
    content: { label: "Bài học", Icon: BookOpenIcon },
    challenge: { label: "Thử thách", Icon: PuzzlePieceIcon },
    flashcard: { label: "Flashcard", Icon: CardsIcon },
}

/** The four retrieval skills (chips + menu rows). */
const SKILLS: Array<{ label: string; Icon: typeof CardsIcon }> = [
    { label: "Tìm thử thách liên quan", Icon: PuzzlePieceIcon },
    { label: "Tìm flashcard liên quan", Icon: CardsIcon },
    { label: "Tìm bài học liên quan", Icon: BookOpenIcon },
    { label: "Nội dung liên quan", Icon: SparkleIcon },
]

const Bubble = ({ role, children }: { role: "user" | "assistant"; children: React.ReactNode }) => (
    <div className={cn("flex", role === "user" ? "justify-end" : "justify-start")}>
        <div
            className={cn(
                "max-w-[85%] rounded-2xl px-3 py-2",
                role === "user" ? "bg-accent-soft" : "bg-surface-secondary",
            )}
        >
            {children}
        </div>
    </div>
)

const SourceRow = ({ source }: { source: MockSource }) => {
    const { label, Icon } = KIND_META[source.kind]
    return (
        <div className="flex items-center gap-3 border-b border-default px-3 py-2 last:border-b-0">
            <Icon className="size-5 shrink-0 text-muted" aria-hidden focusable="false" />
            <div className="flex min-w-0 flex-1 flex-col gap-0">
                <Typography type="body-sm" className="truncate">
                    {source.title}
                </Typography>
                <Typography type="body-xs" color="muted" className="truncate">
                    {source.breadcrumb}
                </Typography>
            </div>
            {source.locked ? (
                <Chip size="sm" color="warning" variant="soft">
                    Ghi danh
                </Chip>
            ) : (
                <Chip size="sm" variant="soft">
                    {label}
                </Chip>
            )}
        </div>
    )
}

const ToolResult = () => (
    <div className="flex flex-col gap-2">
        <Typography type="body-sm">Mình tìm được vài nguồn trong khoá:</Typography>
        <div className="flex flex-col overflow-hidden rounded-2xl border border-default">
            <div className="flex items-center gap-2 border-b border-default px-3 py-2">
                <SparkleIcon className="size-4 text-muted" aria-hidden focusable="false" />
                <Typography type="body-xs" color="muted">
                    Nguồn liên quan
                </Typography>
            </div>
            {SOURCES.map((source) => (
                <SourceRow key={source.title} source={source} />
            ))}
            <div className="px-3 py-2 text-sm text-accent-soft-foreground">Xem tất cả</div>
        </div>
    </div>
)

const HistoryHeader = () => (
    <div className="flex items-center gap-2">
        <Link className="flex min-w-0 flex-1 cursor-pointer items-center gap-2 text-sm font-medium text-foreground">
            <ChatsCircleIcon className="size-5 shrink-0" />
            <span className="min-w-0 flex-1 truncate text-left">Lịch sử trò chuyện</span>
            <CaretDownIcon weight="bold" className="size-4 shrink-0" />
        </Link>
    </div>
)

const BackHeader = ({ children }: { children: React.ReactNode }) => (
    <Link className="flex w-fit cursor-pointer items-center gap-2 text-sm text-muted">
        <ArrowLeftIcon className="size-4" />
        <span>{children}</span>
    </Link>
)

const SearchField = ({ placeholder, defaultValue }: { placeholder: string; defaultValue?: string }) => (
    <div className="flex items-center gap-2 rounded-xl bg-default px-3 py-2">
        <MagnifyingGlassIcon className="size-4 shrink-0 text-muted" aria-hidden focusable="false" />
        <input
            type="text"
            aria-label={placeholder}
            defaultValue={defaultValue}
            placeholder={placeholder}
            className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted"
        />
    </div>
)

const Composer = ({ draft, isPending }: { draft?: string; isPending?: boolean }) => (
    <div className="flex flex-col gap-2 rounded-2xl bg-default px-3 py-2">
        <input
            type="text"
            aria-label="Nhập câu hỏi"
            defaultValue={draft}
            placeholder="Nhập câu hỏi…"
            className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted"
        />
        <div className="flex w-full items-center justify-between gap-2">
            <Button size="sm" variant="tertiary" className="min-w-0">
                <SparkleIcon className="size-4 shrink-0" aria-hidden focusable="false" />
                Auto
                <CaretDownIcon className="size-3 shrink-0" aria-hidden focusable="false" />
            </Button>
            <div className="flex shrink-0 items-center gap-2">
                <Button isIconOnly size="sm" variant="tertiary" aria-label="Tìm nội dung khoá">
                    <MagnifyingGlassIcon className="size-5" />
                </Button>
                <Button isIconOnly size="sm" variant="primary" isPending={isPending} aria-label="Gửi">
                    <PaperPlaneTiltIcon className="size-5" />
                </Button>
            </div>
        </div>
    </div>
)

const EmptyState = () => (
    <div className="flex flex-col gap-2">
        <Typography type="body-sm" color="muted">
            Hỏi bất cứ điều gì về bài học này.
        </Typography>
        {["Tóm tắt bài này", "Phần nào khó nhất?", "Cho mình một ví dụ"].map((suggestion) => (
            <Button key={suggestion} variant="secondary" size="sm" className="justify-start text-start">
                {suggestion}
            </Button>
        ))}
        {SKILLS.slice(0, 2).map((skill) => (
            <Button key={skill.label} variant="secondary" size="sm" className="justify-start text-start">
                <skill.Icon className="size-4 shrink-0 text-muted" aria-hidden focusable="false" />
                {skill.label} bài này
            </Button>
        ))}
    </div>
)

const ConversationThread = ({ screen }: { screen: ScreenId }) => (
    <>
        <Bubble role="user">
            <Typography type="body-sm">{SAMPLE_QUESTION}</Typography>
        </Bubble>
        {screen === "sending" ? (
            <Bubble role="assistant">
                <Typography type="body-sm" color="muted">
                    Đang trả lời…
                </Typography>
            </Bubble>
        ) : null}
        {screen === "streaming" ? (
            <Bubble role="assistant">
                <Typography type="body-sm">
                    Ý chính: dùng <b>idempotency key</b> để mỗi request charge là duy nhất và lặp lại được an toàn
                </Typography>
            </Bubble>
        ) : null}
        {screen === "answered" ? (
            <Bubble role="assistant">
                <div className="flex flex-col gap-2">
                    <Typography type="body-sm">
                        Dùng <b>idempotency key</b>: client gắn một key duy nhất cho mỗi lần charge. Server lưu key
                        kèm kết quả — thấy lại đúng key thì trả kết quả cũ thay vì charge lần nữa.
                    </Typography>
                    <ToolResult />
                </div>
            </Bubble>
        ) : null}
        {screen === "error" ? (
            <Bubble role="assistant">
                <Typography type="body-sm" className="text-danger-soft-foreground">
                    ⚠️ Xin lỗi, mình chưa trả lời được. Bấm gửi để thử lại nhé.
                </Typography>
            </Bubble>
        ) : null}
        {screen === "gated" ? (
            <Bubble role="assistant">
                <div className="flex flex-col gap-2">
                    <Typography type="body-sm" className="text-danger-soft-foreground">
                        ⚠️ Bạn đã hết lượt hỏi AI cho hôm nay.
                    </Typography>
                    <Button variant="primary" size="sm" className="self-start">
                        Nâng cấp
                        <ArrowRightIcon className="size-4" aria-hidden focusable="false" />
                    </Button>
                </div>
            </Bubble>
        ) : null}
    </>
)

/** The retrieval-skill menu (⌥ composer button open). */
const SkillMenu = () => (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-default bg-surface">
        <div className="px-3 pb-1 pt-2">
            <Typography type="body-xs" color="muted">
                Chọn kỹ năng tìm kiếm
            </Typography>
        </div>
        {SKILLS.map((skill) => (
            <div key={skill.label} className="flex items-center gap-3 px-3 py-2">
                <skill.Icon className="size-4 shrink-0 text-muted" aria-hidden focusable="false" />
                <Typography type="body-sm" className="truncate">
                    {skill.label}
                </Typography>
            </div>
        ))}
    </div>
)

/** The model picker (composer "Auto" pill open). */
const ModelPicker = () => {
    const rows: Array<{ name: string; badge?: string; selected?: boolean }> = [
        { name: "Auto (miễn phí)", selected: true },
        { name: "Qwen 2.5", badge: "Free" },
        { name: "GPT-4o", badge: "Premium" },
        { name: "Claude Sonnet", badge: "Premium" },
    ]
    return (
        <div className="flex flex-col overflow-hidden rounded-2xl border border-default bg-surface">
            <div className="px-3 pb-1 pt-2">
                <Typography type="body-xs" color="muted">
                    Chọn model
                </Typography>
            </div>
            {rows.map((row) => (
                <div key={row.name} className="flex items-center gap-2 px-3 py-2">
                    <SparkleIcon className="size-4 shrink-0 text-muted" aria-hidden focusable="false" />
                    <Typography type="body-sm" className="min-w-0 flex-1 truncate">
                        {row.name}
                    </Typography>
                    {row.badge ? (
                        <Chip size="sm" color={row.badge === "Premium" ? "accent" : "default"} variant="soft">
                            {row.badge}
                        </Chip>
                    ) : null}
                    {row.selected ? <CheckIcon className="size-4 shrink-0 text-accent-soft-foreground" /> : null}
                </div>
            ))}
        </div>
    )
}

/** Props for {@link ContentAiChatMock}. */
export interface ContentAiChatMockProps {
    screen: ScreenId
    /** Composer draft text (composing screen). */
    draft?: string
}

export const ContentAiChatMock = ({ screen, draft }: ContentAiChatMockProps) => {
    // ── search view ("Tìm nội dung khoá / quiz") ──────────────────────────
    if (screen === "search") {
        return (
            <div className="flex h-full flex-col gap-3">
                <BackHeader>Tìm nội dung khoá</BackHeader>
                <SearchField placeholder="Tìm bài học, thử thách, quiz…" defaultValue="idempotency" />
                <ScrollShadow hideScrollBar className="min-h-0 flex-1 overflow-y-auto">
                    <div className="flex flex-col overflow-hidden rounded-2xl border border-default">
                        {SOURCES.map((source) => (
                            <SourceRow key={source.title} source={source} />
                        ))}
                    </div>
                </ScrollShadow>
            </div>
        )
    }

    // ── conversations view + inline-rename variant ────────────────────────
    if (screen === "conversations" || screen === "rename") {
        const isRenaming = screen === "rename"
        return (
            <div className="flex h-full flex-col gap-3">
                <BackHeader>Lịch sử trò chuyện</BackHeader>
                <div className="flex items-center gap-2">
                    <div className="min-w-0 flex-1">
                        <SearchField placeholder="Tìm cuộc trò chuyện…" />
                    </div>
                    <Button isIconOnly size="sm" variant="tertiary" aria-label="Cuộc trò chuyện mới">
                        <PlusIcon className="size-5" />
                    </Button>
                </div>
                <label className="flex cursor-pointer items-center justify-between gap-2">
                    <Typography type="body-sm" color="muted">
                        Hiện cả đã lưu trữ
                    </Typography>
                    <Switch className="shrink-0" aria-label="Hiện cả đã lưu trữ">
                        <Switch.Content>
                            <Switch.Control>
                                <Switch.Thumb />
                            </Switch.Control>
                        </Switch.Content>
                    </Switch>
                </label>
                <ScrollShadow hideScrollBar className="min-h-0 flex-1 overflow-y-auto">
                    <div className="flex flex-col overflow-hidden rounded-2xl border border-default">
                        {SESSIONS.map((session, index) => (
                            <div
                                key={session.title}
                                className="flex items-center gap-2 border-b border-default px-3 py-2 last:border-b-0"
                            >
                                {isRenaming && index === 0 ? (
                                    <input
                                        type="text"
                                        aria-label="Đổi tên cuộc trò chuyện"
                                        defaultValue={session.title}
                                        className="min-w-0 flex-1 border-b border-accent bg-transparent py-1 text-sm text-foreground outline-none"
                                    />
                                ) : (
                                    <div className="flex min-w-0 flex-1 flex-col text-left">
                                        <Typography
                                            type="body-sm"
                                            className={cn("truncate", index === 0 && "text-accent-soft-foreground")}
                                        >
                                            {session.title}
                                        </Typography>
                                        <Typography type="body-xs" color="muted" className="truncate">
                                            {session.meta}
                                        </Typography>
                                    </div>
                                )}
                                {isRenaming && index === 0 ? null : (
                                    <Button
                                        isIconOnly
                                        size="sm"
                                        variant="tertiary"
                                        aria-label="Tuỳ chọn cuộc trò chuyện"
                                    >
                                        <DotsThreeVerticalIcon weight="bold" className="size-5" />
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>
                </ScrollShadow>
            </div>
        )
    }

    // ── chat view (empty · conversation · selection · overlays) ───────────
    const isEmpty = screen === "empty" || screen === "composing" || screen === "skillMenu" || screen === "modelPicker"
    const isSelection = screen === "selection"
    const isPending = screen === "sending" || screen === "streaming"

    return (
        <div className="flex h-full flex-col gap-3">
            <HistoryHeader />

            {isSelection ? (
                <div className="flex flex-col gap-2 rounded-xl border border-warning bg-warning-soft px-3 py-2">
                    <div className="flex items-start gap-2">
                        <QuotesIcon className="size-4 shrink-0 text-warning-soft-foreground" />
                        <Typography
                            type="body-sm"
                            weight="medium"
                            className="line-clamp-2 flex-1 text-warning-soft-foreground"
                        >
                            {SELECTED_PASSAGE}
                        </Typography>
                        <CloseButton aria-label="Bỏ đoạn đã chọn" />
                    </div>
                    <Typography type="body-xs" color="muted">
                        Cuộc trò chuyện về đoạn này được lưu riêng.
                    </Typography>
                </div>
            ) : null}

            <ScrollShadow hideScrollBar className="min-h-0 flex-1 overflow-y-auto">
                <div className="flex flex-col gap-3">
                    {isSelection ? (
                        <div className="flex flex-col gap-2">
                            {["Giải thích đoạn này", "Cho một ví dụ", "Giải thích đơn giản hơn"].map((ask) => (
                                <Button key={ask} variant="secondary" size="sm" className="justify-start text-start">
                                    {ask}
                                </Button>
                            ))}
                        </div>
                    ) : isEmpty ? (
                        <EmptyState />
                    ) : (
                        <ConversationThread screen={screen} />
                    )}
                </div>
            </ScrollShadow>

            {screen === "skillMenu" ? <SkillMenu /> : null}
            {screen === "modelPicker" ? <ModelPicker /> : null}

            <Composer draft={screen === "composing" ? draft : undefined} isPending={isPending} />
        </div>
    )
}
