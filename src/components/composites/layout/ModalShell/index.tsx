import React from "react"
import type { ReactNode } from "react"
import { cn, Modal } from "@heroui/react"
import type { AllowedClassName } from "@/components/atoms/_allowed-class-name"
import { Typography } from "@/components/atoms/text/Typography"
import { StackV } from "@/components/frames/Stack"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * STORYBOOK-LOCAL DESIGN SPEC — `ModalShell.*`, the dialog-scaffold FRAME
 * namespace (teacher's call, 2026-07-25, canon §13a). Authored in Storybook (not `src`);
 * synced to `src` later. No `@/components` imports (design-spec ports stay
 * self-contained).
 *
 * FRAME API LAW (§13b): `.Base` is a WRAPPER frame → the named slots
 * `header`/`body`/`footer` are the main road, `children` stays as shorthand
 * for `body`. `footer` is a REAL slot now (rendered as HeroUI `Modal.Footer`)
 * — before this refactor every caller hand-rolled a
 * `<div className="flex justify-end gap-2">` CTA row INSIDE the body, which is
 * exactly the "several things crammed into one place" the slot law exists to
 * stop. Nothing here repeats, so no `items` member. Namespace only — no bare
 * component export.
 *
 * A tier-3 presentational frame — it owns no state of its own; the caller
 * threads open/close state plus the header and body content via props.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Source-level tier metadata — see `.claude/design/storybook/architecture/elements/*.md`. */
export const meta = { tier: "composite", name: "ModalShell" } as const

/** Props for {@link ModalShell}. */
export interface ModalShellBaseProps {
    /** Whether the modal is currently open. Forwarded to HeroUI `<Modal>`. */
    isOpen: boolean
    /**
     * Open-state change handler (fires on backdrop click, Escape, and the
     * close-trigger button). Forwarded to HeroUI `<Modal>`.
     */
    onOpenChange: (open: boolean) => void
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
    /** Body content of the modal. Equivalent to `children`; wins over it when both are passed. */
    body?: ReactNode
    /**
     * Bottom action row of the dialog (the CTA cluster). Rendered as HeroUI
     * `Modal.Footer`, which already lays it out `flex flex-row items-center
     * justify-end gap-2` — pass the buttons bare, do NOT re-wrap them in a
     * flex row.
     */
    footer?: ReactNode
    /** Shorthand for {@link ModalShellBaseProps.body} — a wrapper frame wraps anything. */
    children?: ReactNode
    /** Size of the underlying `Modal.Container` (dialog width). */
    size?: React.ComponentProps<typeof Modal.Container>["size"]
    /**
     * Scroll behavior of the underlying `Modal.Container`. Use `"inside"` when
     * the body is longer than the viewport — header stays put, body scrolls.
     * When set, the container also gets `max-h-[85vh]`.
     */
    scroll?: React.ComponentProps<typeof Modal.Container>["scroll"]
    /** Extra classes merged onto `Modal.Container` (merged after the `scroll="inside"` max-height default). */
    containerClassName?: string
    /** Extra classes merged onto `Modal.Dialog`, in addition to {@link ModalShellBaseProps.classNames}. */
    dialogClassName?: string
    /** Extra classes merged onto `Modal.Body`. */
    bodyClassName?: string
    /** Extra classes merged onto `Modal.Footer`. */
    footerClassName?: string
    /**
     * Where this sits inside its parent. Appearance is not passable — it is already a prop.
     */
    classNames?: Array<AllowedClassName>
    /**
     * When `true`, each composed part (close trigger / header / body / footer)
     * emits `` so a BlockAnatomy panel can badge it
     * on-render. Off by default (production).
     */
}

/**
 * Shared modal scaffold: `Modal > Backdrop > Container > Dialog > CloseTrigger
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
    header,
    body,
    footer,
    size,
    scroll,
    containerClassName,
    dialogClassName,
    bodyClassName,
    footerClassName,
    classNames,
    children}: ModalShellBaseProps) => {
    const hasHeader = header != null || title != null
    const main = body ?? children
    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            data-tier="composite"
            data-component="ModalShell"
        >
            <Modal.Backdrop>
                <Modal.Container
                    className={cn(scroll === "inside" && "max-h-[85vh]", containerClassName)}
                    scroll={scroll}
                    size={size}
                >
                    {/* ⭐ The PARENT keeps the rhythm (teacher's call (a), 2026-07-27). The Dialog is
                        ALREADY a flex, but with `rowGap: normal`, so the seam must be pushed by the
                        child itself via `mt-*!` — the `!` only overrides HeroUI's own CSS
                        (`.modal__header + .modal__body { mt-2 }`, `mt-5` before the footer), not to
                        compete with the parent.
                        Now `gap-4` here + `mt-0!` on the child: ONE seam, ONE owner (§10a). */}
                    <Modal.Dialog className={cn("gap-3", dialogClassName, classNames)}>
                        <Modal.CloseTrigger />
                        {header ? (
                            <Modal.Header>{header}</Modal.Header>
                        ) : title != null ? (
                            <Modal.Header>
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
                            </Modal.Header>
                        ) : null}
                        {/* ⚠️ `bodyStartsWithTabs` was DELETED in this same pass. It made the
                            caller declare "my body starts with tabs" so the frame could subtract
                            4px — which means the FRAME WAS ASKING WHAT KIND OF CONTENT SITS
                            INSIDE IT, exactly what the definition of a frame forbids.
                            That 4px exists because `Tabs` has its own top padding; that padding is
                            `Tabs`'s own geometry, and it must own it itself (§13z), not have the
                            frame compensate for it from outside.
                            Real consequence: a tabs case turned 12px into 16px. */}
                        <Modal.Body
                            className={cn(
                                // `mt-0!` only TURNS OFF the margin HeroUI ships with; the rhythm is
                                // decided by the Dialog's own `gap-4`. The 0 sits on the scale, so it
                                // is not an exception.
                                hasHeader && "mt-0!",
                                bodyClassName)}
                        >
                            {main}
                        </Modal.Body>
                        {/* Same reason as above: HeroUI ships `mt-5` (20px) before the
                            footer, off the scale — the Dialog's own `gap-3` decides it now so
                            header→body and body→footer read as the SAME gap. */}
                        {footer != null ? (
                            <Modal.Footer
                                className={cn("mt-0!", footerClassName)}
                            >
                                {footer}
                            </Modal.Footer>
                        ) : null}
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    )
}

/**
 * The dialog-scaffold KHUNG namespace — one member:
 *
 * | Member | Content channel |
 * |---|---|
 * | `.Base` | `title`+`description` (or `header`) / `body` / `footer` (+ `children` = body) |
 */
export { Base as ModalShell }
