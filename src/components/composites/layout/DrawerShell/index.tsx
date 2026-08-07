import React from "react"
import { cn } from "@heroui/react"
import {
    DrawerRoot,
    DrawerBackdrop,
    DrawerContent,
    DrawerDialog,
    DrawerHeader,
    DrawerBody,
    DrawerFooter,
    DrawerCloseTrigger,
} from "@/components/atoms/overlay/Drawer"
import { Typography } from "@/components/atoms/text/Typography"
import { StackV } from "@/components/frames/Stack"
import type { ComponentTypeWithSkeleton } from "@/components/frames/_slot"
import { resolveIdentity, type CallerIdentity } from "@/components/frames/_identity"
import {
    resolveDrawerDialogWidth,
    resolveDrawerFooterVariant,
    type DrawerDialogWidth,
    type DrawerFooterVariant,
} from "@/components/composites/_semantic-contracts"

/**
 * `DrawerShell` — the panel scaffold frame:
 * `DrawerRoot > Backdrop > Content > Dialog > CloseTrigger + Header? + Body + Footer?`.
 * Sibling of `ModalShell` — same named slots (`header`/`body`/`footer`,
 * `children` = body shorthand), differing only where the drawer primitive
 * differs: `placement` (which edge it slides from) instead of `size`.
 */

/** Source-level tier metadata — see `.claude/design/storybook/architecture/elements/*.md`. */
export const meta = { tier: "composite", name: "DrawerShell" } as const

export type { DrawerDialogWidth, DrawerFooterVariant }

/** Props for {@link DrawerShell}. */
export interface DrawerShellBaseProps {
    /** Whether the drawer is currently open. Forwarded to house `<DrawerRoot>`. */
    isOpen: boolean
    /**
     * Open-state change handler (fires on backdrop click, Escape, and the
     * close-trigger button). Forwarded to house `<DrawerRoot>`.
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
     * Bottom action row of the panel (the CTA cluster). Rendered as house
     * `DrawerFooter`, which already lays it out `flex flex-row items-center
     * justify-end gap-2` — pass the buttons bare, do NOT re-wrap them in a
     * flex row. A COMPONENT reference (COMPOSITE-8) the frame mounts itself.
     */
    footer?: ComponentTypeWithSkeleton
    /**
     * Named dialog width. `"cart"` owns MiniCart's `sm:max-w-md`; `"default"` keeps
     * HeroUI drawer dialog width. Prefer this over raw class escapes.
     * @default "default"
     */
    dialogWidth?: DrawerDialogWidth
    /**
     * Named footer layout. `"stacked"` owns MiniCart's column stretch + top border;
     * `"default"` keeps HeroUI DrawerFooter row. Prefer this over raw class escapes.
     * @default "default"
     */
    footerVariant?: DrawerFooterVariant
    /**
     * Caller identity to wear on this composite's root instead of its own — pass this
     * when a block/layout/overlay/page uses this composite as its root element.
     * Omitted → this composite keeps emitting its own data-tier/data-component.
     */
    identity?: CallerIdentity
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
 * Shared drawer scaffold: `DrawerRoot > Backdrop > Content > Dialog > CloseTrigger
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
    header: Header,
    body: Body,
    footer: Footer,
    dialogWidth = "default",
    footerVariant = "default",
    isSkeleton = false,
    identity,
}: DrawerShellBaseProps) => {
    const hasHeader = Header != null || title != null
    const main = Body ? <Body isSkeleton={isSkeleton} /> : null
    return (
        <DrawerRoot
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            {...resolveIdentity(identity, { tier: "composite", name: "DrawerShell" })}
        >
            <DrawerBackdrop>
                <DrawerContent placement={placement}>
                    <DrawerDialog className={resolveDrawerDialogWidth(dialogWidth)}>
                        <DrawerCloseTrigger />
                        {Header ? (
                            <DrawerHeader><Header isSkeleton={isSkeleton} /></DrawerHeader>
                        ) : title != null ? (
                            <DrawerHeader>
                                {/* `pr-8` (room for the close button) rides a plain wrapper —
                                    not an `AllowedClassName`, so the typed `StackV` frame keeps
                                    its closed `classNames` union. */}
                                <div className="pr-8">
                                    <StackV
                                        gap={2}
                                        principle="title-subtitle"
                                        explain="Title over supporting line — not label-field, because neither line is a form control label."
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
                            </DrawerHeader>
                        ) : null}
                        <DrawerBody

                            className={cn(
                                // mt-0 only cancels HeroUI's shipped margin; the gap the
                                // reader sees comes from DrawerDialog's baked seam (same rule
                                // as ModalShell — one seam, one owner, §10a).
                                hasHeader && "mt-0!",
                                "overflow-y-auto",
                            )}
                        >
                            {main}
                        </DrawerBody>
                        {Footer != null ? (
                            <DrawerFooter

                                className={cn("mt-0!", resolveDrawerFooterVariant(footerVariant))}
                            >
                                <Footer isSkeleton={isSkeleton} />
                            </DrawerFooter>
                        ) : null}
                    </DrawerDialog>
                </DrawerContent>
            </DrawerBackdrop>
        </DrawerRoot>
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
