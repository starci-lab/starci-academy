import { ChatsCircleIcon, SidebarSimpleIcon, SquareHalfIcon } from "@phosphor-icons/react"
import { DrawerShell } from "@/components/composites/layout/DrawerShell"
import { ButtonRadioGroup, type ButtonRadioGroupItem } from "@/components/composites/buttons/ButtonRadioGroup"
import { Typography } from "@/components/atoms/text/Typography"
import { SurfaceCard } from "@/components/composites/cards/SurfaceCard"
import { EmptyState } from "@/components/composites/feedback/EmptyState"
import { StackH } from "@/components/frames/Stack"
import { Box } from "@/components/frames/Box"

/**
 * `ContentAiChatDrawer` — the global "ask StarCi AI" chat panel in drawer
 * presentation. Presentational overlay only: `isOpen`/`onOpenChange` are plain
 * props, the overlay-store wiring lives in the mounting layout. Two structural
 * leaves by header shape: the mode switch present (desktop, where rail⇄drawer
 * is a real choice) versus absent (forced mobile). Which title text shows
 * (caller-supplied vs the block's fallback) is a data state. The chat body is a
 * placeholder (`SurfaceCard` + `EmptyState`) standing in for the real
 * `ChatThread`/`ChatComposer` blocks.
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

/** Props for {@link _ContentAiChatDrawer}. */
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
const _ContentAiChatDrawer = ({
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
            <Typography
                text={title ?? FALLBACK_TITLE}
                weight="bold"
                truncate
                classNames={["min-w-0", "flex-1"]}
            />
        ),
        ...(hasModeSwitch ? [() => (
            <ButtonRadioGroup
                items={MODE_ITEMS}
                value={mode as ContentAiChatDrawerMode}
                onChange={(next) => onModeChange?.(next)}
                ariaLabel={MODE_SWITCH_ARIA_LABEL}
            />
        )] : []),
    ]

    // `DrawerShell.header` only carries ONE Typography node, so a second element
    // beside it (the mode switch) has to compose its own wrapper — which then
    // owns its own `pr-8` for the close button, same contract `AiQuotaModal`'s
    // caller-built header uses. `Box` is the frame tier's own escape hatch for
    // exactly this: a single-side padding no `Stack`/`Flex` prop can express.
    const header = () => (
        <Box className="pr-8">
            <StackH
                gap={3}
                principle="sibling-stack"
                justify="between"
                items={titleAndModeSwitch}
            />
        </Box>
    )

    return (
        <DrawerShell
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            placement={placement}
            header={header}
            identity={{ tier: "overlay", component: "ContentAiChatDrawer" }}
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
    )
}

export { _ContentAiChatDrawer }
