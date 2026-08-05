import React from "react"
import { cn, Modal } from "@heroui/react"
import type { AllowedClassName } from "@/components/atoms/_allowed-class-name"
import { Typography } from "@/components/atoms/text/Typography"
import { StackV } from "@/components/frames/Stack"
import type { ComponentTypeWithSkeleton } from "@/components/frames/_slot"
import { resolveIdentity, type CallerIdentity } from "@/components/frames/_identity"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * STORYBOOK-LOCAL DESIGN SPEC — `ModalShell.*`, the dialog-scaffold FRAME
 * namespace (teacher's call, 2026-07-25, canon §13a). Authored in Storybook (not `src`);
 * synced to `src` later. No `@/components` imports (design-spec ports stay
 * self-contained).
 *
 * FRAME API LAW (§13b): `.Base` is a WRAPPER frame → the named slots
 * `header`/`body`/`footer` are the main road. `footer` is a REAL slot now (rendered as HeroUI `Modal.Footer`)
 * — before this refactor every caller hand-rolled a wrapper div
 * (`flex justify-end gap-2`) CTA row INSIDE the body, which is
 * exactly the "several things crammed into one place" the slot law exists to
 * stop. Nothing here repeats, so no `items` member. Namespace only — no bare
 * component export.
 *
 * A tier-3 presentational frame — it owns no state of its own; the caller
 * threads open/close state plus the header and body content via props.
 *
 * COMPOSITE-8: `title`/`description` are TEXT the frame renders itself (wrapped
 * in `Typography` here, with `isSkeleton`); `header`/`body`/`footer` are CONTENT
 * REGIONS — component references the frame mounts itself
 * (`<Header isSkeleton={isSkeleton} />`), never already-built nodes.
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
     * Bottom action row of the dialog (the CTA cluster). Rendered as HeroUI
     * `Modal.Footer`, which already lays it out `flex flex-row items-center
     * justify-end gap-2` — pass the buttons bare, do NOT re-wrap them in a
     * flex row. A COMPONENT reference (COMPOSITE-8) the frame mounts itself.
     */
    footer?: ComponentTypeWithSkeleton
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
     * `true` → the `title`/`description` text this frame owns switches to
     * shimmer, AND every content-region slot it mounts (`header` / `body` /
     * `footer`) is CALLED with `isSkeleton` too (COMPOSITE-8 — each is a
     * component reference this frame calls itself, so the flag reaches inside
     * it the same way it reaches the title/description text).
     */
    isSkeleton?: boolean
    /**
     * Caller identity to wear on this scaffold's root `<Modal>` instead of its own — pass this
     * when a `block`/`layout`/`overlay`/`page` component (BLOCK-2: never draws a shape of its
     * own) is using this scaffold AS its root element, instead of wrapping it in a raw
     * `<div data-tier=… data-component=…>`. See `_identity.ts`. Omitted → this scaffold keeps
     * emitting its own `data-tier="composite" data-component="ModalShell"`, unchanged.
     */
    identity?: CallerIdentity
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
    identity,
}: ModalShellBaseProps) => {
    const hasHeader = Header != null || title != null
    const main = Body ? <Body isSkeleton={isSkeleton} /> : null
    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            {...resolveIdentity(identity, { tier: "composite", name: "ModalShell" })}
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
                        {Header ? (
                            <Modal.Header><Header isSkeleton={isSkeleton} /></Modal.Header>
                        ) : title != null ? (
                            <Modal.Header>
                                <div className={cn("pr-8", titleClassName)}>
                                    <StackV
                                        gap={2}
                                        principles={["title-subtitle"]}
                                        isSkeleton={isSkeleton}
                                        items={[
                                            () => (
                                                <Typography
                                                    weight="bold"
                                                    isSkeleton={isSkeleton}
                                                    text={title}
                                                />
                                            ),
                                            ...(description != null
                                                ? [() => (
                                                    <Typography size="sm"
                                                        color="muted"
                                                        isSkeleton={isSkeleton}
                                                        text={description}
                                                    />
                                                )]
                                                : []),
                                        ]}
                                    />
                                </div>
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
                        {Footer != null ? (
                            <Modal.Footer
                                className={cn("mt-0!", footerClassName)}
                            >
                                <Footer isSkeleton={isSkeleton} />
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
 * | `.Base` | `title`+`description` (or `header`) / `body` / `footer` |
 */
export { Base as ModalShell }
