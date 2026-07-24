import React from "react"
import type { ReactNode } from "react"
import { cn, Switch, Typography } from "@heroui/react"
import {
    CaretDownIcon,
    ChatsCircleIcon,
    DotsThreeVerticalIcon,
    MagnifyingGlassIcon,
    PaperPlaneTiltIcon,
    PlusIcon,
    QuotesIcon,
    SidebarSimpleIcon,
    SquareHalfIcon,
    XIcon,
} from "@phosphor-icons/react"
import { Button } from "../../buttons/Button/Button"
import { ChipButtonList } from "../../buttons/ChipButtonList/ChipButtonList"
import { SearchBar } from "../../form/SearchBar/SearchBar"
import {
    AiModelTask,
    GradeModelDropdown,
} from "../../grading/GradeModelDropdown/GradeModelDropdown"
import { SurfaceListCard, SurfaceListCardItem } from "../../cards/SurfaceListCard/SurfaceListCard"
import { TitledText } from "../../text/TitledText/TitledText"
import { EntityResultRow, type SearchCourseContentItem } from "../../learn/EntityResultRow/EntityResultRow"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * STORYBOOK-LOCAL DESIGN SPEC — BLOCK: the AI-chat drawer's INNER CONTENT
 * (`Drawer.Header` + `Drawer.Body`), rendered as a STATIC bounded panel — NOT the
 * live HeroUI `Drawer` portal. Ported from `src/components/drawers/ContentAiChatDrawer`
 * + `src/components/features/learn/ContentAiChat` (the real body hand-rolls its own
 * thread + composer + in-panel conversations/search views).
 *
 * The panel frame (surface + radius + shadow) stands in for the drawer dialog so
 * the composition reads inline like any other block story. Portal/placement/
 * backdrop are the app's concern (raw HeroUI `Drawer`), out of scope here.
 *
 * ── 4 LEAVES = 4 STRUCTURES (not states) ──────────────────────────────────────
 * The real panel has exactly FOUR distinct SHAPES, switched by `PanelView` in the
 * source (`chat` / `conversations` / `search`) crossed with whether a passage is
 * selected:
 *   1. Chat thường     — HistoryLink + ChatThread + ChatComposer(normal)
 *   2. Chat bôi đen    — HistoryLink + SelectionBanner + ChatThread + ChatComposer(selection)
 *   3. Lịch sử phiên   — BackLink + ConversationList, NO composer
 *   4. Tìm nội dung    — BackLink + ContentSearchList, NO composer
 * Every OTHER difference (empty/loading/error/content, streaming…) is a STATE
 * that lives INSIDE these blocks' own future stories — never a separate leaf here.
 *
 * ── NOT-YET-PORTED SUB-BLOCKS ─────────────────────────────────────────────────
 * `ChatThread` / `ChatComposer` / `SelectionBanner` / `ConversationList` /
 * `ContentSearchList` have no port yet under `blocks/learn/*`; they are
 * hand-rolled HERE (each marked "TODO port") composing already-ported primitives
 * (`Button`, `GradeModelDropdown`, `SearchBar`, `SurfaceListCard`, `TitledText`,
 * `EntityResultRow`, `ChipButtonList`). Once a real port lands under
 * `blocks/learn/<Name>/<Name>.tsx`, swap the import here and delete the local copy.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Desktop presentation mode the segmented switch toggles (mirrors `ContentAiChatMode`). */
export type ChatDrawerMode = "rail" | "drawer"

const MODE_ICON: Record<ChatDrawerMode, typeof SidebarSimpleIcon> = {
    rail: SidebarSimpleIcon,
    drawer: SquareHalfIcon,
}
const MODE_LABEL: Record<ChatDrawerMode, string> = {
    rail: "Chuyển sang chế độ rail",
    drawer: "Chuyển sang chế độ drawer",
}

/**
 * TODO port: extract to `blocks/navigation/ContentAiChatModeSwitch` (mirrors
 * `src/components/features/learn/ContentAiChat/ContentAiChatModeSwitch`). Hand-rolled
 * with plain `<button>`s (not the `Button` primitive) because the real control needs
 * `aria-pressed` on the trigger itself — the `Button` port's prop surface has no
 * pass-through for extra aria attributes.
 */
const ModeSwitch = ({ mode, anatPart }: { mode: ChatDrawerMode, anatPart?: string }) => (
    <div
        role="group"
        aria-label="Chế độ hiển thị"
        data-anat-part={anatPart}
        className="inline-flex items-center gap-1 rounded-full bg-default p-1"
    >
        {(["rail", "drawer"] as const).map((m) => {
            const Icon = MODE_ICON[m]
            const isActive = m === mode
            return (
                <button
                    key={m}
                    type="button"
                    aria-label={MODE_LABEL[m]}
                    aria-pressed={isActive}
                    className={cn(
                        "flex size-7 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:text-foreground",
                        isActive && "bg-surface text-accent-soft-foreground shadow-surface hover:text-accent-soft-foreground",
                    )}
                >
                    <Icon aria-hidden focusable="false" className="size-4" />
                </button>
            )
        })}
    </div>
)

/**
 * The go-there link that opens the conversations view — sits ABOVE the thread
 * (own row, not nested inside {@link ChatThread}'s scroll region).
 */
const HistoryLink = ({ anatPart }: { anatPart?: string }) => (
    <button
        type="button"
        data-anat-part={anatPart}
        className="flex w-fit cursor-pointer items-center gap-2 text-sm font-medium text-foreground underline-offset-4 decoration-[var(--separator-tertiary)] hover:underline"
    >
        <ChatsCircleIcon aria-hidden focusable="false" className="size-5 shrink-0" />
        Lịch sử trò chuyện
        <CaretDownIcon weight="bold" aria-hidden focusable="false" className="size-4 shrink-0" />
    </button>
)

/** Props for the {@link ChatThread} block. */
export interface ChatThreadProps {
    /** The thread content — {@link ChatBubble}s (rendered by the caller; internals are
     *  NOT exposed at this tier — drill into ChatThread's own story for those). */
    children: ReactNode
    anatPart?: string
}

/**
 * TODO port: extract to `blocks/learn/ChatThread/ChatThread.tsx`. The scrolling
 * message region. At THIS (overlay) tier it is one opaque node — its own bubbles /
 * tool-result / empty-state suggestions are that block's own concern.
 */
export const ChatThread = ({ children, anatPart }: ChatThreadProps) => (
    <div data-anat-part={anatPart} className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto">
        {children}
    </div>
)

/** Props for the {@link ChatComposer} block. */
export interface ChatComposerProps {
    /**
     * `"normal"` — a single box: bare input + action row (model picker · tìm
     * nguồn · gửi). `"selection"` — the input RELOCATES into a quick-ask box
     * (chips + input) ABOVE the action row, which then shows actions only.
     */
    mode?: "normal" | "selection"
    anatPart?: string
}

/**
 * TODO port: extract to `blocks/learn/ChatComposer/ChatComposer.tsx`. Composes the
 * ported `GradeModelDropdown` (model picker) + `Button` (tìm nguồn / gửi) +
 * `ChipButtonList` (selection quick-asks). ONE functional block — in `selection`
 * mode it renders as two visual boxes (quick-ask box + action bar) but stays a
 * single anatomy node, matching how the input itself relocates in the real UI.
 */
export const ChatComposer = ({ mode = "normal", anatPart }: ChatComposerProps) => (
    <div data-anat-part={anatPart} className="flex flex-col gap-2">
        {mode === "selection" ? (
            <div className="flex flex-col gap-2 rounded-xl border border-default bg-transparent px-3 py-2 focus-within:ring-2 focus-within:ring-accent">
                <ChipButtonList
                    items={[
                        { label: "Giải thích đoạn này" },
                        { label: "Cho ví dụ thực tế" },
                        { label: "Rút gọn lại" },
                    ]}
                />
                <input
                    type="text"
                    placeholder="Hỏi AI về đoạn đã chọn…"
                    className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted"
                />
            </div>
        ) : null}
        <div className="flex flex-col gap-2 rounded-2xl bg-default px-3 py-2 focus-within:ring-2 focus-within:ring-accent">
            {mode === "normal" ? (
                <input
                    type="text"
                    placeholder="Hỏi AI về bài học này…"
                    className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted"
                />
            ) : null}
            <div className="flex w-full items-center justify-between gap-2">
                <div className="min-w-0 overflow-hidden">
                    <GradeModelDropdown
                        className="min-w-0 max-w-full"
                        models={[]}
                        selection={{ model: null, provider: null }}
                        canPremium={false}
                        task={AiModelTask.Chatting}
                        isButton
                        onSelect={() => {}}
                        onUpgrade={() => {}}
                    />
                </div>
                <div className="flex shrink-0 items-center gap-2">
                    <Button
                        iconOnly
                        variant="tertiary"
                        size="sm"
                        ariaLabel="Tìm nguồn"
                        icon={<MagnifyingGlassIcon aria-hidden focusable="false" />}
                    />
                    <Button
                        iconOnly
                        variant="primary"
                        size="sm"
                        ariaLabel="Gửi"
                        icon={<PaperPlaneTiltIcon aria-hidden focusable="false" />}
                    />
                </div>
            </div>
        </div>
    </div>
)

/** Props for the {@link SelectionBanner} block. */
export interface SelectionBannerProps {
    /** The highlighted excerpt this side-thread is about. */
    excerpt: ReactNode
    anatPart?: string
}

/**
 * TODO port: extract to `blocks/learn/SelectionBanner/SelectionBanner.tsx`. The
 * pinned quote of the learner's highlighted passage — sits ABOVE {@link ChatThread}.
 */
export const SelectionBanner = ({ excerpt, anatPart }: SelectionBannerProps) => (
    <div data-anat-part={anatPart} className="flex flex-col gap-2 rounded-xl border border-warning bg-warning-soft px-3 py-2">
        <div className="flex items-start gap-2">
            <QuotesIcon aria-hidden focusable="false" className="size-4 shrink-0 text-warning-soft-foreground" />
            <Typography type="body-sm" weight="medium" className="line-clamp-2 flex-1 text-warning-soft-foreground">
                {excerpt}
            </Typography>
            <Button
                iconOnly
                variant="ghost"
                size="sm"
                ariaLabel="Bỏ đoạn đã chọn"
                className="shrink-0 text-warning-soft-foreground"
                icon={<XIcon aria-hidden focusable="false" />}
            />
        </div>
        <Typography type="body-xs" color="muted">
            Cuộc trò chuyện về đoạn này được lưu riêng, tách khỏi lịch sử chính.
        </Typography>
    </div>
)

/** One demo row for {@link ConversationList} (fixture data — not wired to a query). */
interface DemoSession {
    id: string
    title: string
    subtitle: string
}
const DEMO_SESSIONS: Array<DemoSession> = [
    { id: "s1", title: "Closure và memory leak", subtitle: "Bài học này · 6 lượt" },
    { id: "s2", title: "So sánh var / let / const", subtitle: "Bài học này · 3 lượt" },
    { id: "s3", title: "Sự kiện bất đồng bộ trong Node.js", subtitle: "Cả khoá · 12 lượt" },
]

/**
 * TODO port: extract to `blocks/learn/ConversationList/ConversationList.tsx`. ONE
 * functional region — search + "new" + "show archived" toggle + the session rows —
 * folded together (canon §4: a block owns its own filter chrome, not the overlay).
 * Composes the ported `SearchBar`, `Button`, `SurfaceListCard`/`SurfaceListCardItem`,
 * `TitledText`; the archive toggle is a raw HeroUI `Switch` (no dedicated port yet).
 */
export const ConversationList = ({ anatPart }: { anatPart?: string }) => (
    <div data-anat-part={anatPart} className="flex min-h-0 flex-1 flex-col gap-3">
        <div className="flex items-center gap-2">
            <SearchBar className="!max-w-none min-w-0 flex-1" />
            <Button
                iconOnly
                variant="tertiary"
                size="sm"
                ariaLabel="Tạo hội thoại mới"
                icon={<PlusIcon aria-hidden focusable="false" />}
            />
        </div>
        <label className="flex cursor-pointer items-center justify-between gap-2">
            <Typography type="body-sm" color="muted">Hiện hội thoại đã lưu trữ</Typography>
            <Switch className="shrink-0" aria-label="Hiện hội thoại đã lưu trữ">
                <Switch.Content>
                    <Switch.Control>
                        <Switch.Thumb />
                    </Switch.Control>
                </Switch.Content>
            </Switch>
        </label>
        <SurfaceListCard bordered>
            {DEMO_SESSIONS.map((session) => (
                <SurfaceListCardItem key={session.id}>
                    <div className="flex items-center gap-2">
                        <TitledText title={session.title} subtitle={session.subtitle} truncate className="min-w-0 flex-1" />
                        <Button
                            iconOnly
                            variant="tertiary"
                            size="sm"
                            ariaLabel="Tác vụ hội thoại"
                            icon={<DotsThreeVerticalIcon weight="bold" aria-hidden focusable="false" />}
                        />
                    </div>
                </SurfaceListCardItem>
            ))}
        </SurfaceListCard>
    </div>
)

/** Fixture RAG hits for {@link ContentSearchList} (not wired to a query). */
const DEMO_CONTENT_RESULTS: Array<SearchCourseContentItem> = [
    {
        kind: "content",
        title: "Closure và scope trong JavaScript",
        breadcrumb: "Module 2 · Hàm và scope",
        snippet: "Giải thích cách closure giữ tham chiếu tới biến ngoài scope sau khi hàm cha return.",
        score: 0.91,
        moduleId: "mod-2",
        contentId: "content-closure",
        deckId: null,
        taskId: null,
        isLocked: false,
    },
    {
        kind: "flashcard",
        title: "Ôn khái niệm đóng (closure)",
        breadcrumb: null,
        snippet: "Bộ thẻ ôn cách closure giữ tham chiếu biến ngoài scope lâu hơn cần thiết.",
        score: 0.87,
        moduleId: null,
        contentId: null,
        deckId: "deck-closure-101",
        taskId: null,
        isLocked: false,
    },
    {
        kind: "challenge",
        title: "Sửa lỗi memory leak do closure",
        breadcrumb: "Closure và scope trong JavaScript",
        snippet: "Thử thách debug một event handler giữ closure sống lâu hơn cần thiết.",
        score: 0.79,
        moduleId: "mod-2",
        contentId: "content-closure",
        deckId: null,
        taskId: "task-closure-leak",
        isLocked: true,
    },
]

/**
 * TODO port: extract to `blocks/learn/ContentSearchList/ContentSearchList.tsx`. ONE
 * functional region — search field + the pickable result rows — folded together
 * (same reasoning as {@link ConversationList}). Composes the ported `SearchBar` +
 * `EntityResultRow`.
 */
export const ContentSearchList = ({ anatPart }: { anatPart?: string }) => (
    <div data-anat-part={anatPart} className="flex min-h-0 flex-1 flex-col gap-3">
        <SearchBar />
        <div className="flex flex-col overflow-hidden rounded-2xl border border-default">
            {DEMO_CONTENT_RESULTS.map((item, index) => (
                <EntityResultRow
                    key={`${item.kind}-${item.contentId ?? item.deckId ?? item.taskId ?? index}`}
                    item={item}
                    showKindChip
                    showSnippet
                    onSelect={() => {}}
                />
            ))}
        </div>
    </div>
)

/** Props for the {@link ContentAiChatDrawer} shell. */
export interface ContentAiChatDrawerProps {
    /** Drawer heading (the lesson/course title). */
    title: ReactNode
    /** Desktop presentation-mode switch value (visual only in this story). */
    mode?: ChatDrawerMode
    /**
     * The row directly under the header, above the body — {@link HistoryLink} (chat
     * leaves) or a `BackLink` (list leaves). The shell renders whichever is passed;
     * it owns neither.
     */
    headerSecondary?: ReactNode
    /** The leaf's body — whichever blocks that leaf composes. */
    children: ReactNode
    /** Extra classes on the panel root. */
    className?: string
    /** Anatomy tag: names the panel root so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
    /** When on, emit `data-anat-part` on each block-owned part (title, mode switch). */
    showAnatomy?: boolean
}

/**
 * The AI-chat drawer content as a self-contained SQUARE surface panel (a
 * `bg-surface` sheet standing in for the portal `Drawer.Dialog` — rounded only on
 * the inner edge like a right side-drawer meeting the viewport edge, never a
 * floating rounded card): a bordered header (title + mode switch), then whatever
 * `headerSecondary` + `children` the active leaf composes below it.
 *
 * @param props - {@link ContentAiChatDrawerProps}
 */
export const ContentAiChatDrawer = ({
    title,
    mode = "drawer",
    headerSecondary,
    children,
    className,
    anatPart,
    showAnatomy = false,
}: ContentAiChatDrawerProps) => (
    <div
        data-anat-part={anatPart}
        className={cn(
            "flex h-[600px] w-full max-w-md flex-col overflow-hidden rounded-l-2xl bg-surface shadow-surface",
            className,
        )}
    >
        <div className="flex items-center gap-2 border-b border-default p-3">
            <Typography
                type="body"
                weight="bold"
                truncate
                className="min-w-0 flex-1"
                data-anat-part={showAnatomy ? "Typography · tiêu đề" : undefined}
            >
                {title}
            </Typography>
            <ModeSwitch mode={mode} anatPart={showAnatomy ? "ModeSwitch" : undefined} />
        </div>
        <div className="flex min-h-0 flex-1 flex-col gap-3 p-3">
            {headerSecondary}
            {children}
        </div>
    </div>
)

export { HistoryLink }
