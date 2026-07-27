import React from "react"
import type { ReactNode } from "react"
import { cn } from "@heroui/react"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { CaretDownIcon, ChatsCircleIcon, SidebarSimpleIcon, SquareHalfIcon } from "@phosphor-icons/react"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * OVERLAY SHELL — the AI-chat drawer's static panel (a `bg-surface` sheet standing
 * in for the portal `Drawer.Dialog`, NOT a rounded floating card). The portal /
 * placement / backdrop are the app's concern (raw HeroUI `Drawer`), out of scope.
 *
 * This file owns ONLY the shell + its header chrome (`ModeSwitch`, `HistoryLink`).
 * The body of each leaf is composed from the REAL learn/* blocks — `ChatThread` ·
 * `ChatComposer` · `SelectionBanner` · `ConversationList` · `ContentSearchList` —
 * in the story, NOT re-hand-rolled here (§compose: no branch-cut duplication).
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
 * The rail⇄drawer segmented switcher (mirrors `ContentAiChatModeSwitch`). Hand-rolled
 * with plain `<button>`s because each trigger needs `aria-pressed`.
 */
export const ModeSwitch = ({ mode, anatPart }: { mode: ChatDrawerMode; anatPart?: string }) => (
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

/** The go-there link opening the conversations view — sits above the thread (chat leaves). */
export const HistoryLink = ({ anatPart }: { anatPart?: string }) => (
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

/** Props for the {@link ContentAiChatDrawer} shell. */
export interface ContentAiChatDrawerProps {
    /** Drawer heading (the lesson/course title). */
    title: ReactNode
    /** Desktop presentation-mode switch value (visual only in this story). */
    mode?: ChatDrawerMode
    /**
     * The row directly under the header — {@link HistoryLink} (chat leaves) or a
     * `BackLink` (list leaves). The shell renders whichever is passed; it owns neither.
     */
    headerSecondary?: ReactNode
    /** The leaf's body — whichever real blocks that leaf composes. */
    children: ReactNode
    /** Extra classes on the panel root. */
    className?: string
    /** Anatomy tag: names the panel root so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
    /** When on, emit `data-anat-part` on the shell's OWN header primitives (title, mode switch). */
    showAnatomy?: boolean
}

/**
 * The AI-chat drawer shell: a SQUARE surface panel with a bordered header (title +
 * mode switch), then `headerSecondary` + the leaf `children` below.
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
            <span className="min-w-0 flex-1" data-anat-part={showAnatomy ? "Title" : undefined}>
                <Typography text={title} weight="bold" truncate />
            </span>
            <ModeSwitch mode={mode} anatPart={showAnatomy ? "ModeSwitch" : undefined} />
        </div>
        <div className="flex min-h-0 flex-1 flex-col gap-3 p-3">
            {headerSecondary}
            {children}
        </div>
    </div>
)
