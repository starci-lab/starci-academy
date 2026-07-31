import React from "react"
import type { ReactNode } from "react"
import { cn, Drawer } from "@heroui/react"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { StackV } from "@sb-components/frames/Stack/Stack"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * STORYBOOK-LOCAL DESIGN SPEC — `DrawerShell.*`, the panel-scaffold KHUNG
 * namespace. Sibling of `ModalShell` (canon §13a/§13b) — same slot contract
 * (`header`/`body`/`footer`, `children` = body shorthand), same seam rule
 * (`gap-3` on the Dialog owns the rhythm, children only cancel HeroUI's own
 * `mt-*` with `mt-0!`), same tier-3 presentational contract (no state of its
 * own — caller threads `isOpen`/`onOpenChange` plus content via props).
 *
 * Differs from `ModalShell` only where the underlying HeroUI primitive
 * differs: `Modal.Container` takes `size` (dialog width, centered dialog);
 * `Drawer.Content` takes `placement` (which edge the panel slides from — a
 * drawer has no "size" in that sense, it is full-bleed along its edge).
 * ─────────────────────────────────────────────────────────────────────────────
 */

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
     * Simple title string/node rendered as HeroUI {@link Typography}
     * (`type="body"` `weight="bold"`). With optional {@link description}, both
     * sit in one `pr-8` stack (room for the close button). Ignored when
     * {@link header} is provided. Omit title/header to render no header at all.
     */
    title?: ReactNode
    /**
     * Explanatory copy under {@link title} (`Typography` `body-sm` muted). Part
     * of the simple header path. Ignored when {@link header} is provided, or when
     * {@link title} is omitted.
     */
    description?: ReactNode
    /** Extra classes on the default title/description wrapper (only with {@link title}). */
    titleClassName?: string
    /**
     * Full custom header content — use instead of {@link title}/{@link description}
     * for a non-standard header. Takes precedence over both.
     */
    header?: ReactNode
    /** Body content of the drawer. Equivalent to `children`; wins over it when both are passed. */
    body?: ReactNode
    /**
     * Bottom action row of the panel (the CTA cluster). Rendered as HeroUI
     * `Drawer.Footer`, which already lays it out `flex flex-row items-center
     * justify-end gap-2` — pass the buttons bare, do NOT re-wrap them in a
     * flex row.
     */
    footer?: ReactNode
    /** Shorthand for {@link DrawerShellBaseProps.body} — a wrapper frame wraps anything. */
    children?: ReactNode
    /** Extra classes merged onto `Drawer.Content` (the sliding panel itself — width/height). */
    contentClassName?: string
    /** Extra classes merged onto `Drawer.Dialog`, in addition to {@link className}. */
    dialogClassName?: string
    /** Extra classes merged onto `Drawer.Body`. */
    bodyClassName?: string
    /** Extra classes merged onto `Drawer.Footer`. */
    footerClassName?: string
    /** Extra classes merged onto `Drawer.Dialog`. */
    className?: string
    /**
     * When `true`, each composed part (close trigger / header / body / footer)
     * emits `data-anat-part="<name>"` so a BlockAnatomy panel can badge it
     * on-render. Off by default (production).
     */
    showAnatomy?: boolean
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
    header,
    body,
    footer,
    contentClassName,
    dialogClassName,
    bodyClassName,
    footerClassName,
    className,
    children,
    showAnatomy = false,
}: DrawerShellBaseProps) => {
    const hasHeader = header != null || title != null
    const main = body ?? children
    return (
        <Drawer isOpen={isOpen} onOpenChange={onOpenChange}>
            <Drawer.Backdrop>
                <Drawer.Content className={contentClassName} placement={placement}>
                    <Drawer.Dialog className={cn("gap-3", dialogClassName, className)}>
                        <Drawer.CloseTrigger data-anat-part={showAnatomy ? "Drawer.CloseTrigger" : undefined} />
                        {header ? (
                            <Drawer.Header data-anat-part={showAnatomy ? "Drawer.Header" : undefined}>{header}</Drawer.Header>
                        ) : title != null ? (
                            <Drawer.Header>
                                <StackV
                                    gap="tight"
                                    className={cn("pr-8", titleClassName)}
                                    body={
                                        <>
                                            <Typography
                                                weight="bold"
                                                showAnatomy={showAnatomy}
                                                anatPart={showAnatomy ? "Typography" : undefined}
                                                text={title}
                                            />
                                            {description != null ? (
                                                <Typography size="sm"
                                                    color="muted"
                                                    showAnatomy={showAnatomy}
                                                    anatPart={showAnatomy ? "Typography" : undefined}
                                                    text={description}
                                                />
                                            ) : null}
                                        </>
                                    }
                                />
                            </Drawer.Header>
                        ) : null}
                        <Drawer.Body
                            data-anat-part={showAnatomy ? "Drawer.Body" : undefined}
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
                        {footer != null ? (
                            <Drawer.Footer
                                data-anat-part={showAnatomy ? "Drawer.Footer" : undefined}
                                className={cn("mt-0!", footerClassName)}
                            >
                                {footer}
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
 * | `.Base` | `title`+`description` (or `header`) / `body` / `footer` (+ `children` = body) |
 */
export { Base as DrawerShell }
