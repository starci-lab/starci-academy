import type { ReactNode } from "react"
import { ChatsCircleIcon, SidebarSimpleIcon, SquareHalfIcon } from "@phosphor-icons/react"
import { DrawerShell } from "@sb-components/composites/layout/DrawerShell/DrawerShell"
import { ButtonRadioGroup, type ButtonRadioGroupItem } from "@sb-components/composites/buttons/ButtonRadioGroup/ButtonRadioGroup"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { EmptyState } from "@sb-components/composites/feedback/EmptyState/EmptyState"
import { StackH } from "@sb-components/frames/Stack/Stack"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * OVERLAY (drawer) — `ContentAiChatDrawer`: the global "ask StarCi AI" chat
 * panel, drawer presentation — forced on mobile, and an optional stand-in for
 * the rail-mode panel on desktop (the layout that mounts this decides which
 * one shows and passes `placement="bottom"` on a phone; this block never
 * computes `isMobile` itself). Filed under `starci/overlays/drawers/**` per
 * `components/README.md`'s app-folder split — an overlay mounts once at the
 * app root and opens from anywhere via a store, so it is not a screen's own
 * content — next to the existing `E2eResultDrawer` precedent.
 *
 * OVERLAY, PRESENTATIONAL ONLY (Rule 13 / canon §11a "screen owns overlay
 * store"). The real app opens this through `useOverlayStore` + a per-key hook
 * (mirroring `useContentAiChatOverlayState`-style wiring already used by the
 * FAB this drawer answers, `ContentAiFab`) — that store, and any real chat
 * fetch/mutation hooks, are APP-LEVEL, same discipline as a page never wiring
 * its own router. This block only takes `isOpen`/`onOpenChange` as plain props;
 * the caller supplies both.
 *
 * WHAT THIS BLOCK OWNS: the open-state scaffold (composed from `DrawerShell`,
 * not rebuilt — Backdrop/Content/Dialog/CloseTrigger stay the shell's job);
 * and the header IDENTITY row — the lesson/course title beside the
 * rail⇄drawer mode switch, on ONE row. `DrawerShell`'s own `title`/
 * `description` path only stacks two text lines vertically with no room for a
 * trailing control (see its own stories), so this block reaches for the
 * shell's `header` escape hatch instead and builds that one custom row itself
 * — same `pr-8` (room for the close button) convention `DrawerShell`'s own
 * `CustomHeader` story already documents. It does NOT own the chat
 * conversation itself — see the scope-cut note below.
 *
 * ⭐ MODE SWITCH REUSED, NOT HAND-ROLLED. The `_legacy/blocks/overlays/
 * ContentAiChatDrawer` port hand-rolled its own `ModeSwitch` (two bare
 * `<button>`s pressed into a pill) because no reusable icon-toggle row existed
 * yet at the time. `Button.RadioGroup` (now in the catalog) IS that row —
 * single-select, `role="group"` + `aria-pressed` per button — so this build
 * reuses it instead of a second hand-rolled toggle. Same two icons as the
 * legacy version (`SidebarSimpleIcon` for rail, `SquareHalfIcon` for drawer),
 * so a future real chat body keeps recognizing the same glyph vocabulary. Each
 * item renders icon-only (a compact segmented pair, matching the legacy
 * pill's footprint) — `Button.RadioGroup` has no separate per-item label
 * channel, so each item's accessible name rides along as `sr-only` text
 * inside its own `content` node instead.
 *
 * ⭐ `title` OMITTED → FIXED FALLBACK, same idiom as `ContentAiFab`'s
 * `ARIA_LABEL`: this app ships a single locale, so a second caller-supplied
 * "default wording" prop would just repeat one string at its one call site.
 * `mode`/`onModeChange` OMITTED TOGETHER → the switch does not render AT ALL
 * (not disabled) — matches how the real drawer drops the switch entirely on a
 * phone, where there is only one presentation to begin with, so a control that
 * can't do anything would just be dead chrome in the header.
 *
 * ⭐⭐ SCOPE-CUT GAP (§B3) — THE CHAT BODY ITSELF. A real chat panel is
 * `HistoryLink`/`BackLink` + `ChatThread` + `ChatComposer` + `ConversationList`
 * + `ContentSearchList` (see `_legacy/blocks/overlays/ContentAiChatDrawer`'s
 * story for the full four-leaf breakdown) — reusable BLOCKS in their own
 * right, each with its own story, not a detail of THIS shell to redraw. This
 * task's brief is the open-state scaffold + header only, so the body is a
 * clearly-marked placeholder instead of a fake box standing in for a working
 * feature: `SurfaceCard` (a bounded face inside the drawer sheet) wrapping
 * `EmptyState` (icon + honest title/description) — the EXACT pairing
 * `LessonVideoModal`'s `PlayerGap` already established for "the shell around
 * this is real, the runtime inside it isn't yet".
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Fixed accessible name for the mode switch — see the file header on why this is not a prop. */
const MODE_SWITCH_ARIA_LABEL = "Switch AI chat display mode"

/** Fixed fallback drawer title — see the file header on why this is not a caller prop. */
const FALLBACK_TITLE = "Ask StarCi AI"

/** Scope-cut gap copy — see the file header's "SCOPE-CUT GAP" note. */
const BODY_GAP_TITLE = "AI conversation frame"
const BODY_GAP_DESCRIPTION =
    "This frame hasn't wired up a real ChatThread/ChatComposer yet — the conversation will slot in here on a later build pass."

/** Which way the AI chat panel is presented right now. */
export type ContentAiChatDrawerMode = "rail" | "drawer"

/** The mode switch's two options — icon-only, accessible name riding along as `sr-only` text. */
const MODE_ITEMS: Array<ButtonRadioGroupItem<ContentAiChatDrawerMode>> = [
    {
        value: "rail",
        content: (
            <>
                <SidebarSimpleIcon aria-hidden focusable="false" className="size-4" />
                <span className="sr-only">Rail mode</span>
            </>
        ),
    },
    {
        value: "drawer",
        content: (
            <>
                <SquareHalfIcon aria-hidden focusable="false" className="size-4" />
                <span className="sr-only">Drawer mode</span>
            </>
        ),
    },
]

/** Props for {@link ContentAiChatDrawer}. */
export interface ContentAiChatDrawerProps {
    /** Whether the drawer is currently open. Forwarded to `DrawerShell`. */
    isOpen: boolean
    /** Open-state change handler (backdrop click, Escape, close button). Forwarded to `DrawerShell`. */
    onOpenChange: (open: boolean) => void
    /**
     * Which edge the panel slides from. The caller passes `"bottom"` on
     * mobile — this block does not compute `isMobile` itself (see the file
     * header). @default "right"
     */
    placement?: "right" | "bottom"
    /** Resolved lesson/course title. Omitted → the block's own fixed fallback wording. */
    title?: string
    /** Which presentation mode is active. Omit together with {@link onModeChange} to hide the switch entirely. */
    mode?: ContentAiChatDrawerMode
    /** Fired with the mode the reader picked. Omit together with {@link mode} to hide the switch entirely. */
    onModeChange?: (mode: ContentAiChatDrawerMode) => void
    /** When on, each composed part emits `data-anat-part` for a BlockAnatomy panel. */
    /** Anatomy tag: names this block so a BlockAnatomy panel can badge it on-render. */
}

/**
 * The global "ask StarCi AI" chat drawer. See the file header for the
 * open-state/header contract and the chat-body scope cut.
 *
 * @param props - {@link ContentAiChatDrawerProps}
 */
const ContentAiChatDrawer = ({
    isOpen,
    onOpenChange,
    placement = "right",
    title,
    mode,
    onModeChange,
}: ContentAiChatDrawerProps) => {
    // Both halves of the switch must be present together — a mode with nothing to
    // change it, or a handler with no mode to reflect, are both dead controls, so
    // neither renders unless both do.
    const hasModeSwitch = mode != null && onModeChange != null

    const titleAndModeSwitch = (
        <>
            <span className="min-w-0 flex-1">
                <Typography text={title ?? FALLBACK_TITLE} weight="bold" truncate />
            </span>
            {hasModeSwitch ? (
                <span>
                    <ButtonRadioGroup
                        items={MODE_ITEMS}
                        value={mode as ContentAiChatDrawerMode}
                        onChange={(next) => onModeChange?.(next)}
                        ariaLabel={MODE_SWITCH_ARIA_LABEL}

                    />
                </span>
            ) : null}
        </>
    )

    const header: ReactNode = (
        <StackH
            gap={3}
            justify="between"
            className="pr-8"

            body={titleAndModeSwitch}
        />
    )

    return (
        <div>
            <DrawerShell
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                placement={placement}
                header={header}

            >
                <SurfaceCard


                    body={() => (
                        <EmptyState
                            icon={ChatsCircleIcon}
                            title={BODY_GAP_TITLE}
                            description={BODY_GAP_DESCRIPTION}

                        />
                    )}
                />
            </DrawerShell>
        </div>
    )
}

export { ContentAiChatDrawer }
