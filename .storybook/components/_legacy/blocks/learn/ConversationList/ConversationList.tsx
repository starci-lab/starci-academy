"use client"

import React from "react"
import {
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownPopover,
    DropdownSection,
    DropdownTrigger,
    ScrollShadow,
    cn,
    Skeleton as HeroSkeleton,
} from "@heroui/react"
import { ArchiveIcon, DotsThreeVerticalIcon, PencilSimpleIcon, TrashIcon } from "@phosphor-icons/react"
import { AsyncContent } from "@sb-components/layouts/async/AsyncContent/AsyncContent"
import { SurfaceCard, type SurfaceCardListItem } from "@sb-components/layouts/cards/SurfaceCard/SurfaceCard"
import { TitledText } from "@sb-components/layouts/text/TitledText/TitledText"
import { Button } from "@sb-components/_legacy/designs/buttons/Button/Button"
import { AnatomyOverlay } from "@sb-utils/AnatomyOverlay/AnatomyOverlay"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * STORYBOOK-LOCAL DESIGN SPEC — faithful port of the conversation-picker REGION
 * rendered by `@/components/features/learn/ContentAiChat/index.tsx:1044-1197`
 * (the "chọn/quản lý phiên trò chuyện" list inside the AI-chat drawer). A BLOCK
 * = a real bounded region driven by `AsyncContent.Base` (error → loading → empty →
 * content), not a lone row. Composes `SurfaceCard.List` (rows = `items` data) +
 * `TitledText` + the `Button` primitive + raw HeroUI `Dropdown` — NOT a
 * hand-rolled one-off. Authored in Storybook (not `src`); synced back later.
 * NO `@/components` imports.
 *
 * DEVIATION from source (documented, not silent): the paginating footer at
 * source :1189-1197 is a bare "đang tải" `Typography` line — no layout
 * affordance, so the list visually "jumps" once the next page lands. Here it
 * renders a SKELETON ROW that mirrors the real row shape (same title/subtitle/
 * ⋯-button footprint), so appending a page never shifts the frame — see the
 * `isPaginating` branch appended after the `items.map` below.
 *
 * NOTE on the "active row" tint (source :1078, `text-accent-soft-foreground`
 * on the row wrapper): this fork's `Typography` always sets its OWN explicit
 * color class (`typography--color-default` → `text-foreground`,
 * `typography--color-muted` → `text-muted`), so an ambient text-color class on
 * an ANCESTOR never cascades into a `Typography` child — the same reality the
 * real source has (its title/subtitle Typography also carry no color prop).
 * Per canon §1 (`Typography` never takes a `text-*`/`font-*` className), the
 * wrapper tint is kept EXACTLY where source puts it (the row wrapper, not on
 * `TitledText`'s Typography) — faithful to source's actual DOM, including its
 * limitation.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** One conversation session the list renders. `subtitle` arrives PRE-RESOLVED
 * by the caller (source picks it from 4 branches: search snippet / lesson
 * title · turns / "Cả khoá" · turns / just turns — see index.tsx:1123-1129). */
export interface ConversationListItem {
    /** Stable id (select/rename/archive/delete payload). */
    id: string
    /** Session title; `null` → renders the "Chưa đặt tên" fallback. */
    title: string | null
    /** Pre-resolved secondary line (search snippet, or "<nguồn> · N lượt", or "N lượt"). */
    subtitle: string
    /** Whether this is the currently-open session (source :1078 accent tint). */
    isActive: boolean
}

/** Props for the {@link ConversationList} block. */
export interface ConversationListProps {
    /** The sessions to render (already fetched/filtered by the caller). */
    items: Array<ConversationListItem>
    /** First load in flight, nothing cached yet → skeleton mirror. */
    isLoading?: boolean
    /** Loaded, zero sessions → the empty state. */
    isEmpty?: boolean
    /** Load failed with nothing cached → the error state (SAME copy as empty, no retry — source :1063-1070). */
    hasError?: boolean
    /** Fetching the NEXT page while sessions are already showing → trailing skeleton row. */
    isPaginating?: boolean
    /** Id of the session currently in rename mode, or `null`. */
    renamingId?: string | null
    /** Live draft value of the rename `<input>` (only meaningful while `renamingId` is set). */
    renameValue?: string
    /** Fired with a session id when its row is pressed (not while renaming). */
    onSelect: (id: string) => void
    /** Fired from the ⋯ menu's "Đổi tên" — seeds the rename draft with the current title. */
    onRenameStart: (id: string, title: string | null) => void
    /** Fired on every keystroke of the rename `<input>`. */
    onRenameChange: (value: string) => void
    /** Enter / blur on the rename `<input>` → commit the draft. */
    onRenameCommit: () => void
    /** Escape on the rename `<input>` → discard the draft. */
    onRenameCancel: () => void
    /** Fired from the ⋯ menu's "Lưu trữ". */
    onArchive: (id: string) => void
    /** Fired from the ⋯ menu's "Xoá" (destructive, tinted danger). */
    onDelete: (id: string) => void
    /**
     * `true` → ANATOMY overlay: each composed part self-annotates with an
     * ABSOLUTE tier-tagged marker (no layout change). Dev/spec only.
     */
    showAnatomy?: boolean
    /** Extra classes on the block wrapper. */
    className?: string
}

/** How many skeleton rows the loading state mirrors (matches source :1049 `[0, 1, 2]`). */
const SKELETON_ROW_COUNT = 3

/**
 * One skeleton row BODY: title bar (2/3) + subtitle bar (1/2) + a size-8 ⋯-button
 * mirror. Goes into a `SurfaceCard.List` row via `item.content` (the frame owns the
 * row padding + separator).
 */
const ConversationSkeletonRow = ({ showAnatomy }: { showAnatomy?: boolean }) => (
    <div className="flex items-center gap-2">
        <div className="flex min-w-0 flex-1 flex-col gap-0">
            <Typography size="sm" isSkeleton className="w-2/3" anatPart={showAnatomy ? "Skeleton.Title" : undefined} />
            <Typography size="xs" isSkeleton className="w-1/2" anatPart={showAnatomy ? "Skeleton.Subtitle" : undefined} />
        </div>
        {/* mirrors the row's ⋯ overflow-menu trigger (size-sm icon button) — source :1057 */}
        <HeroSkeleton className="size-8 shrink-0 rounded-xl" data-anat-part={showAnatomy ? "Skeleton" : undefined} />
    </div>
)

/**
 * ConversationList — the conversation-picker REGION: a bounded, self-scrolling
 * list of chat sessions driven by `AsyncContent.Base` (error → loading → empty →
 * content), each row switchable to an inline rename `<input>`, with a ⋯ menu
 * for Đổi tên / Lưu trữ / Xoá.
 *
 * @param props - {@link ConversationListProps}
 */
export const ConversationList = ({
    items,
    isLoading = false,
    isEmpty = false,
    hasError = false,
    isPaginating = false,
    renamingId = null,
    renameValue = "",
    onSelect,
    onRenameStart,
    onRenameChange,
    onRenameCommit,
    onRenameCancel,
    onArchive,
    onDelete,
    showAnatomy = false,
    className,
}: ConversationListProps) => {
    const skeleton = (
        // Codemod 2026-07-26: `bordered` → `variant="nested"` (API 3-trục SurfaceCard).
        <SurfaceCard.List
            variant="nested"
            anatPart={showAnatomy ? "SurfaceListCard" : undefined}
            items={Array.from({ length: SKELETON_ROW_COUNT }).map((_, index) => ({
                key: String(index),
                content: <ConversationSkeletonRow showAnatomy={showAnatomy} />,
            }))}
        />
    )

    // Rows = DATA (`items`), never children (khung API law). Each row body is
    // free-form (rename input ⇄ title button + ⋯ menu), so it rides `item.content`.
    const rowItems: Array<SurfaceCardListItem> = items.map((item) => {
        const isRenaming = renamingId === item.id
        return {
            key: item.id,
            content: (
                <div
                    className={cn(
                        "group flex items-center gap-2",
                        item.isActive && "text-accent-soft-foreground",
                    )}
                    data-anat-part={showAnatomy && item.isActive ? "Row.Active" : undefined}
                >
                    {isRenaming ? (
                        // inline rename — replaces the title row while editing;
                        // Enter / blur commits, Escape cancels (source :1081-1102)
                        <input
                            type="text"
                            autoFocus
                            aria-label="Đổi tên cuộc trò chuyện"
                            className="min-w-0 flex-1 border-b border-default bg-transparent py-1 text-sm text-foreground outline-none focus:border-accent"
                            value={renameValue}
                            onChange={(event) => onRenameChange(event.target.value)}
                            onBlur={() => onRenameCommit()}
                            onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                    event.preventDefault()
                                    onRenameCommit()
                                }
                                if (event.key === "Escape") {
                                    event.preventDefault()
                                    onRenameCancel()
                                }
                            }}
                            data-anat-part={showAnatomy ? "Input.Rename" : undefined}
                        />
                    ) : (
                        <button
                            type="button"
                            className="flex min-w-0 flex-1 cursor-pointer flex-col text-left"
                            onClick={() => onSelect(item.id)}
                        >
                            <TitledText
                                title={item.title ?? "Chưa đặt tên"}
                                subtitle={item.subtitle}
                                truncate
                                anatPart={showAnatomy ? "TitledText" : undefined}
                            />
                        </button>
                    )}
                    {/* overflow menu ⋯ — Đổi tên · Lưu trữ · Xoá, HIDDEN while renaming (source :1135) */}
                    {isRenaming ? null : (
                        <Dropdown>
                            <DropdownTrigger
                                className="shrink-0 cursor-pointer"
                                data-anat-part={showAnatomy ? "DropdownTrigger" : undefined}
                            >
                                <Button
                                    iconOnly
                                    size="sm"
                                    variant="tertiary"
                                    ariaLabel="Tuỳ chọn cuộc trò chuyện"
                                    anatPart={showAnatomy ? "Button.Menu" : undefined}
                                >
                                    <DotsThreeVerticalIcon weight="bold" />
                                </Button>
                            </DropdownTrigger>
                            <DropdownPopover
                                placement="bottom end"
                                className="min-w-44"
                                data-anat-part={showAnatomy ? "DropdownPopover" : undefined}
                            >
                                <DropdownMenu
                                    aria-label="Tuỳ chọn cuộc trò chuyện"
                                    data-anat-part={showAnatomy ? "DropdownMenu" : undefined}
                                >
                                    <DropdownSection data-anat-part={showAnatomy ? "DropdownSection" : undefined}>
                                        <DropdownItem
                                            key="rename"
                                            onPress={() => onRenameStart(item.id, item.title)}
                                            data-anat-part={showAnatomy ? "DropdownItem.Rename" : undefined}
                                        >
                                            <div className="flex items-center gap-2">
                                                <PencilSimpleIcon className="size-4 shrink-0" />
                                                <span className="text-sm">Đổi tên</span>
                                            </div>
                                        </DropdownItem>
                                        <DropdownItem
                                            key="archive"
                                            onPress={() => onArchive(item.id)}
                                            data-anat-part={showAnatomy ? "DropdownItem.Archive" : undefined}
                                        >
                                            <div className="flex items-center gap-2">
                                                <ArchiveIcon className="size-4 shrink-0" />
                                                <span className="text-sm">Lưu trữ</span>
                                            </div>
                                        </DropdownItem>
                                        <DropdownItem
                                            key="delete"
                                            className="text-danger-soft-foreground"
                                            onPress={() => onDelete(item.id)}
                                            data-anat-part={showAnatomy ? "DropdownItem.Delete" : undefined}
                                        >
                                            <div className="flex items-center gap-2">
                                                <TrashIcon className="size-4 shrink-0" />
                                                <span className="text-sm">Xoá</span>
                                            </div>
                                        </DropdownItem>
                                    </DropdownSection>
                                </DropdownMenu>
                            </DropdownPopover>
                        </Dropdown>
                    )}
                </div>
            ),
        }
    })

    // IMPROVEMENT over source (see file header): a skeleton row instead of a bare
    // "đang tải" line — same footprint, no layout jump.
    if (isPaginating) {
        rowItems.push({
            key: "__paginating",
            content: <ConversationSkeletonRow showAnatomy={showAnatomy} />,
        })
    }

    return (
        <div className={cn("relative", className)} data-anat={showAnatomy ? "" : undefined}>
            {showAnatomy ? (
                <AnatomyOverlay label="ConversationList" tier="block" href="/?path=/docs/block-learn-conversationlist--docs" />
            ) : null}
            {/* self-bounded ScrollShadow — mirrors source :1044 (`max-h-[55vh]`) */}
            <ScrollShadow
                hideScrollBar
                className="-mx-1 max-h-[55vh] min-h-0 min-w-0 flex-1 overflow-y-auto px-1"
                data-anat-part={showAnatomy ? "ScrollShadow" : undefined}
            >
                <AsyncContent.Base
                    isLoading={isLoading}
                    skeleton={skeleton}
                    isEmpty={isEmpty}
                    emptyContent={{ title: "Chưa có cuộc trò chuyện", showAnatomy }}
                    error={hasError || undefined}
                    errorContent={{ title: "Chưa có cuộc trò chuyện", showAnatomy }}
                    showAnatomy={showAnatomy}
                >
                    {/* Codemod 2026-07-26: `bordered` → `variant="nested"` (API 3-trục SurfaceCard). */}
                    <SurfaceCard.List
                        variant="nested"
                        anatPart={showAnatomy ? "SurfaceListCard" : undefined}
                        items={rowItems}
                    />
                </AsyncContent.Base>
            </ScrollShadow>
        </div>
    )
}
