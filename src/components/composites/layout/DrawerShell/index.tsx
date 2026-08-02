import React from "react"
import type { ReactNode } from "react"
import { cn, Drawer } from "@heroui/react"
import type { AllowedClassName } from "@/components/atoms/_allowed-class-name"
import { Typography } from "@/components/atoms/text/Typography"
import { StackV } from "@/components/frames/Stack"

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
    /** Body content of the drawer. */
    body?: ReactNode
    /**
     * Bottom action row of the panel (the CTA cluster). Rendered as HeroUI
     * `Drawer.Footer`, which already lays it out `flex flex-row items-center
     * justify-end gap-2` — pass the buttons bare, do NOT re-wrap them in a
     * flex row.
     */
    footer?: ReactNode
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
    classNames}: DrawerShellBaseProps) => {
    const hasHeader = header != null || title != null
    const main = body
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
                        {header ? (
                            <Drawer.Header>{header}</Drawer.Header>
                        ) : title != null ? (
                            <Drawer.Header>
                                <StackV
                                    gap={2}
                                    pattern="title-subtitle"
                                    className={cn("pr-8", titleClassName)}
                                    body={
                                        <>
                                            <Typography
                                                weight="bold"
                                                text={title}
                                            />
                                            {description != null ? (
                                                <Typography size="sm"
                                                    color="muted"
                                                    text={description}
                                                />
                                            ) : null}
                                        </>
                                    }
                                />
                            </Drawer.Header>
                        ) : null}
                        <Drawer.Body
                            className={cn(
                                // `mt-0!` only cancels HeroUI's shipped margin; the gap the
                                // reader sees comes from the Dialog's own `gap-3` (same rule
                                // as ModalShell — one seam, one owner, §10a).
                                hasHeader && "mt-0!",
                                "overflow-y-auto",
                                bodyClassName)}
                        >
                            {main}
                        </Drawer.Body>
                        {footer != null ? (
                            <Drawer.Footer
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
