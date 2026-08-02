import React from "react"
import { cn, Drawer } from "@heroui/react"
import type { AllowedClassName } from "@sb-components/atoms/_allowed-class-name"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { StackV } from "@sb-components/frames/Stack/Stack"
import type { ComponentTypeWithSkeleton } from "@sb-components/composites/_slot"

/**
 * `DrawerShell` — the panel scaffold frame:
 * `Drawer > Backdrop > Content > Dialog > CloseTrigger + Header? + Body + Footer?`.
 * Sibling of `ModalShell` — same named slots (`header`/`body`/`footer`,
 * `children` = body shorthand), differing only where the HeroUI primitive
 * differs: `placement` (which edge it slides from) instead of `size`.
 */

/** Source-level tier metadata — see `.claude/design/storybook/architecture/elements/*.md`. */
export const meta = { tier: "composite", name: "DrawerShell" } as const

/** Props for {@link DrawerShell}. */
export interface DrawerShellBaseProps {
    /** Whether the drawer is currently open. Forwarded to HeroUI `<Drawer>`. */
    isOpen: boolean
    /**
     * Open-state change handler (fires on backdrop click, Escape, and the
     * close-trigger button). Forwarded to HeroUI `<Drawer>`.
     */
    onOpenChange: (open: boolean) => void
    /** Which edge the panel slides in from. @default "right" */
    placement?: "top" | "bottom" | "left" | "right"
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
    /** Body content of the drawer. A COMPONENT reference (COMPOSITE-8) the frame mounts itself. */
    body?: ComponentTypeWithSkeleton
    /**
     * Bottom action row of the panel (the CTA cluster). Rendered as HeroUI
     * `Drawer.Footer`, which already lays it out `flex flex-row items-center
     * justify-end gap-2` — pass the buttons bare, do NOT re-wrap them in a
     * flex row. A COMPONENT reference (COMPOSITE-8) the frame mounts itself.
     */
    footer?: ComponentTypeWithSkeleton
    /** Extra classes merged onto `Drawer.Content` (the sliding panel itself — width/height). */
    contentClassName?: string
    /** Extra classes merged onto `Drawer.Dialog`, in addition to {@link DrawerShellBaseProps.classNames}. */
    dialogClassName?: string
    /** Extra classes merged onto `Drawer.Body`. */
    bodyClassName?: string
    /** Extra classes merged onto `Drawer.Footer`. */
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
 * Shared drawer scaffold: `Drawer > Backdrop > Content > Dialog > CloseTrigger
 * + Header? + Body + Footer?`. Extracted so each drawer only supplies its
 * open-state, header content, body, and action row.
 *
 * @param props - See {@link DrawerShellBaseProps}.
 */
const Base = ({
    isOpen,
    onOpenChange,
    placement = "right",
    title,
    description,
    titleClassName,
    header: Header,
    body: Body,
    footer: Footer,
    contentClassName,
    dialogClassName,
    bodyClassName,
    footerClassName,
    classNames,
    isSkeleton = false,
}: DrawerShellBaseProps) => {
    const hasHeader = Header != null || title != null
    const main = Body ? <Body isSkeleton={isSkeleton} /> : null
    return (
        <Drawer
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            data-tier="composite"
            data-component="DrawerShell"
        >
            <Drawer.Backdrop>
                <Drawer.Content className={contentClassName} placement={placement}>
                    <Drawer.Dialog className={cn("gap-3", dialogClassName, classNames)}>
                        <Drawer.CloseTrigger />
                        {Header ? (
                            <Drawer.Header><Header isSkeleton={isSkeleton} /></Drawer.Header>
                        ) : title != null ? (
                            <Drawer.Header>
                                {/* `pr-8` (room for the close button) + arbitrary caller `titleClassName`
                                    ride a plain wrapper — neither is an `AllowedClassName`, so the typed
                                    `StackV` frame keeps its closed `classNames` union. */}
                                <div className={cn("pr-8", titleClassName)}>
                                    <StackV
                                        gap={2}
                                        pattern="title-subtitle"
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
                            </Drawer.Header>
                        ) : null}
                        <Drawer.Body

                            className={cn(
                                // `mt-0!` only cancels HeroUI's shipped margin; the gap the
                                // reader sees comes from the Dialog's own `gap-3` (same rule
                                // as ModalShell — one seam, one owner, §10a).
                                hasHeader && "mt-0!",
                                "overflow-y-auto",
                                bodyClassName,
                            )}
                        >
                            {main}
                        </Drawer.Body>
                        {Footer != null ? (
                            <Drawer.Footer

                                className={cn("mt-0!", footerClassName)}
                            >
                                <Footer isSkeleton={isSkeleton} />
                            </Drawer.Footer>
                        ) : null}
                    </Drawer.Dialog>
                </Drawer.Content>
            </Drawer.Backdrop>
        </Drawer>
    )
}

/**
 * The panel-scaffold KHUNG namespace — one member:
 *
 * | Member | Content channel |
 * |---|---|
 * | `.Base` | `title`+`description` (or `header`) / `body` / `footer` |
 */
export { Base as DrawerShell }
