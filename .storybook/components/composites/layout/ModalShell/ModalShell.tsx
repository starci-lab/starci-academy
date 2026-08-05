import React from "react"
import { cn } from "@heroui/react"
import type { AllowedClassName } from "@sb-components/atoms/_allowed-class-name"
import {
    ModalRoot,
    ModalBackdrop,
    ModalContainer,
    ModalDialog,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ModalCloseTrigger,
} from "@sb-components/atoms/overlay/Modal/Modal"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { StackV } from "@sb-components/frames/Stack/Stack"
import type { ComponentTypeWithSkeleton } from "@sb-components/frames/_slot"

/**
 * `ModalShell` — the dialog scaffold frame:
 * `ModalRoot > Backdrop > Container > Dialog > CloseTrigger + Header? + Body + Footer?`.
 * Named slots `header`/`body`/`footer` are the main road; `children` is
 * shorthand for `body`. `footer` replaces the hand-rolled
 * `<div className="flex justify-end gap-2">` every caller used to nest inside
 * the body.
 */

/** Source-level tier metadata — see `.claude/design/storybook/architecture/elements/*.md`. */
export const meta = { tier: "composite", name: "ModalShell" } as const

/** Props for {@link ModalShell}. */
export interface ModalShellBaseProps {
    /** Whether the modal is currently open. Forwarded to house `<ModalRoot>`. */
    isOpen: boolean
    /**
     * Open-state change handler (fires on backdrop click, Escape, and the
     * close-trigger button). Forwarded to house `<ModalRoot>`.
     */
    onOpenChange: (open: boolean) => void
    /**
     * Simple title text, rendered by the frame itself as {@link Typography}
     * (`weight="bold"`). With optional {@link description}, both sit in one
     * `pr-8` stack (room for the close button). Ignored when {@link header} is
     * provided. Omit title/header to render no header at all.
     */
    title?: string
    /**
     * Explanatory copy under {@link title}, rendered by the frame itself as
     * {@link Typography} (`size="sm"` muted). Part of the simple header path.
     * Ignored when {@link header} is provided, or when {@link title} is omitted.
     */
    description?: string
    /** Extra classes on the default title/description wrapper (only with {@link title}). */
    titleClassName?: string
    /**
     * Full custom header content — use instead of {@link title}/{@link description}
     * for a non-standard header. Takes precedence over both. A COMPONENT
     * reference (COMPOSITE-8) the frame mounts itself, never an already-built
     * node — so `isSkeleton` can reach inside it.
     */
    header?: ComponentTypeWithSkeleton
    /** Body content of the modal. A COMPONENT reference (COMPOSITE-8) the frame mounts itself. */
    body?: ComponentTypeWithSkeleton
    /**
     * Bottom action row of the dialog (the CTA cluster). Rendered as house
     * `ModalFooter`, which already lays it out `flex flex-row items-center
     * justify-end gap-2` — pass the buttons bare, do NOT re-wrap them in a
     * flex row. A COMPONENT reference (COMPOSITE-8) the frame mounts itself.
     */
    footer?: ComponentTypeWithSkeleton
    /** Size of the underlying `ModalContainer` (dialog width). */
    size?: React.ComponentProps<typeof ModalContainer>["size"]
    /**
     * Scroll behavior of the underlying `ModalContainer`. Use `"inside"` when
     * the body is longer than the viewport — header stays put, body scrolls.
     * When set, the container also gets `max-h-[85vh]`.
     */
    scroll?: React.ComponentProps<typeof ModalContainer>["scroll"]
    /** Extra classes merged onto `ModalContainer` (merged after the `scroll="inside"` max-height default). */
    containerClassName?: string
    /** Extra classes merged onto `ModalDialog`, in addition to {@link ModalShellBaseProps.classNames}. */
    dialogClassName?: string
    /** Extra classes merged onto `ModalBody`. */
    bodyClassName?: string
    /** Extra classes merged onto `ModalFooter`. */
    footerClassName?: string
    /**
     * Where this sits inside its parent. Appearance is not passable — it is already a prop.
     */
    classNames?: Array<AllowedClassName>
    /**
     * `true` → the `title`/`description` text this frame owns switches to
     * shimmer, AND every content-region slot it mounts (`header` / `body` /
     * `footer`) is CALLED with `isSkeleton` too (COMPOSITE-8 — each is a
     * component reference this frame calls itself, so the flag reaches inside
     * it the same way it reaches the title/description text).
     */
    isSkeleton?: boolean
}

/**
 * Shared modal scaffold: `ModalRoot > Backdrop > Container > Dialog > CloseTrigger
 * + Header? + Body + Footer?`. Extracted so each modal only supplies its
 * open-state, header content, body, and action row.
 *
 * @param props - See {@link ModalShellBaseProps}.
 */
const Base = ({
    isOpen,
    onOpenChange,
    title,
    description,
    titleClassName,
    header: Header,
    body: Body,
    footer: Footer,
    size,
    scroll,
    containerClassName,
    dialogClassName,
    bodyClassName,
    footerClassName,
    classNames,
    isSkeleton = false,
}: ModalShellBaseProps) => {
    const hasHeader = Header != null || title != null
    const main = Body ? <Body isSkeleton={isSkeleton} /> : null
    return (
        <ModalRoot
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            data-tier="composite"
            data-component="ModalShell"
        >
            <ModalBackdrop>
                <ModalContainer
                    className={cn(scroll === "inside" && "max-h-[85vh]", containerClassName)}
                    scroll={scroll}
                    size={size}
                >
                    {/* The PARENT keeps the rhythm. The Dialog is
                        ALREADY a flex, but with `rowGap: normal`, so the seam must be pushed by the
                        child itself via `mt-*!` — the `!` only overrides HeroUI's own CSS
                        (`.modal__header + .modal__body { mt-2 }`, `mt-5` before the footer), not to
                        compete with the parent.
                        Dialog gap + mt-0 on the child: ONE seam, ONE owner. */}
                    <ModalDialog className={cn(dialogClassName, classNames)}>
                        <ModalCloseTrigger />
                        {Header ? (
                            <ModalHeader><Header isSkeleton={isSkeleton} /></ModalHeader>
                        ) : title != null ? (
                            <ModalHeader>
                                {/* `pr-8` (room for the close button) + arbitrary caller `titleClassName`
                                    ride a plain wrapper — neither is an `AllowedClassName`, so the typed
                                    `StackV` frame keeps its closed `classNames` union. */}
                                <div className={cn("pr-8", titleClassName)}>
                                    <StackV
                                        gap={2}
                                        principle="title-subtitle"
                                        isSkeleton={isSkeleton}
                                        items={[
                                            () => (
                                                <Typography
                                                    weight="bold"
                                                    isSkeleton={isSkeleton}
                                                    text={title}
                                                />
                                            ),
                                            ...(description != null ? [() => (
                                                <Typography size="sm"
                                                    color="muted"
                                                    isSkeleton={isSkeleton}
                                                    text={description}
                                                />
                                            )] : []),
                                        ]}
                                    />
                                </div>
                            </ModalHeader>
                        ) : null}
                        {/* NOTE: `bodyStartsWithTabs` was DELETED in this same pass. It made the
                            caller declare "my body starts with tabs" so the frame could subtract
                            4px — which means the FRAME WAS ASKING WHAT KIND OF CONTENT SITS
                            INSIDE IT, exactly what the definition of a frame forbids.
                            That 4px exists because `Tabs` has its own top padding; that padding is
                            `Tabs`'s own geometry, and it must own it itself (§13z), not have the
                            frame compensate for it from outside.
                            Real consequence: a tabs case turned 12px into 16px. */}
                        <ModalBody

                            className={cn(
                                // mt-0 only turns off the margin HeroUI ships with; the rhythm is
                                // decided by ModalDialog's baked seam. The 0 sits on the scale, so it
                                // is not an exception.
                                hasHeader && "mt-0!",
                                bodyClassName,
                            )}
                        >
                            {main}
                        </ModalBody>
                        {/* Same reason as above: HeroUI ships mt-5 (20px) before the
                            footer, off the scale — ModalDialog's baked seam decides it now so
                            header→body and body→footer read as the SAME gap. */}
                        {Footer != null ? (
                            <ModalFooter

                                className={cn("mt-0!", footerClassName)}
                            >
                                <Footer isSkeleton={isSkeleton} />
                            </ModalFooter>
                        ) : null}
                    </ModalDialog>
                </ModalContainer>
            </ModalBackdrop>
        </ModalRoot>
    )
}

/**
 * The dialog-scaffold KHUNG namespace — one member:
 *
 * | Member | Content channel |
 * |---|---|
 * | `.Base` | `title`+`description` (or `header`) / `body` / `footer` |
 */
export { Base as ModalShell }
