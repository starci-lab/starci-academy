import { ChatsCircleIcon, SidebarSimpleIcon, SquareHalfIcon } from "@phosphor-icons/react"
import { DrawerShell } from "@sb-components/composites/layout/DrawerShell/DrawerShell"
import { ButtonRadioGroup, type ButtonRadioGroupItem } from "@sb-components/composites/buttons/ButtonRadioGroup/ButtonRadioGroup"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { EmptyState } from "@sb-components/composites/feedback/EmptyState/EmptyState"
import { StackH } from "@sb-components/frames/Stack/Stack"

/**
 * `ContentAiChatDrawer` — the global "ask StarCi AI" chat panel in drawer
 * presentation: forced on mobile, and an optional desktop stand-in for the rail-mode
 * panel. Composes `DrawerShell` plus a custom header row — the lesson/course title
 * beside a rail⇄drawer mode switch built on `Button.RadioGroup`.
 *
 * Presentational: `isOpen`/`onOpenChange` control open state; `mode`/`onModeChange`,
 * when both omitted, drop the switch entirely; `title` falls back to a fixed label.
 * The chat body itself is a scoped placeholder.
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

    const titleAndModeSwitch = [
        () => (
            <span className="min-w-0 flex-1">
                <Typography text={title ?? FALLBACK_TITLE} weight="bold" truncate />
            </span>
        ),
        ...(hasModeSwitch ? [() => (
            <span>
                <ButtonRadioGroup
                    items={MODE_ITEMS}
                    value={mode as ContentAiChatDrawerMode}
                    onChange={(next) => onModeChange?.(next)}
                    ariaLabel={MODE_SWITCH_ARIA_LABEL}

                />
            </span>
        )] : []),
    ]

    const header = () => (
        <div className="pr-8">
            <StackH
                gap={3}
                justify="between"
                items={titleAndModeSwitch}
            />
        </div>
    )

    return (
        <div>
            <DrawerShell
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                placement={placement}
                header={header}
                body={() => (
                    <SurfaceCard


                        body={() => (
                            <EmptyState
                                icon={ChatsCircleIcon}
                                title={BODY_GAP_TITLE}
                                description={BODY_GAP_DESCRIPTION}

                            />
                        )}
                    />
                )}
            />
        </div>
    )
}

export { ContentAiChatDrawer }
