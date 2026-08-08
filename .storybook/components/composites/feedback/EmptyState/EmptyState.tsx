import type { ComponentType, SVGProps } from "react"
import { cn } from "@heroui/react"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { StackV } from "@sb-components/frames/Stack/Stack"
import type { ComponentTypeWithSkeleton } from "@sb-components/frames/_slot"

/**
 * `EmptyState` — a centered vertical stack that fills an empty spot (empty list, no results)
 * or a broken spot (`tone="danger"` + a retry button). Slots: `code`, `icon`, `description`,
 * `body`, `action`; axes `tone` and `size` (`compact`/`page`). This shell IS the empty/error
 * state, so it has no loading leaf of its own.
 */

/** Source-level tier metadata — see `.claude/design/storybook/architecture/elements/*.md`. */
export const meta = { tier: "composite", name: "EmptyState" } as const

/** Icon passed as a COMPONENT (phosphor), never JSX — the frame owns its scale (§4/§5). */
export type EmptyStateIcon = ComponentType<SVGProps<SVGSVGElement>>

/** Props SPECIFIC to {@link EmptyState} — EXCEPT the `title`/`isSkeleton` pair (see {@link EmptyStateProps}). */
interface EmptyStateOwnProps {
    /**
     * Optional decorative icon as a COMPONENT (Phosphor) above the title — the frame
     * renders it `size-8` + toned. Ignored in `size="compact"`.
     */
    icon?: EmptyStateIcon
    /**
     * Optional large status numeral (e.g. `"404"`, `"500"`) above the icon/title.
     * Intended for `size="page"`; ignored in `size="compact"`. `string`, not
     * `ReactNode` (COMPOSITE-8) — the frame wraps it in `Typography` itself.
     */
    code?: string
    /**
     * Optional supporting text under the title. Ignored in `size="compact"`.
     * `string`, not `ReactNode` (COMPOSITE-8) — the frame wraps it in `Typography`
     * itself, so `isSkeleton` reaches the text it renders.
     */
    description?: string
    /**
     * Optional free-form body region under `description` (a hint list, an
     * illustration). Ignored in `size="compact"`. A COMPONENT reference, not a
     * built node (COMPOSITE-8) — the frame calls it itself with `isSkeleton`
     * forwarded.
     */
    body?: ComponentTypeWithSkeleton
    /**
     * Optional call-to-action region below the body (typically a `Button`).
     * Ignored in `size="compact"`. In `size="page"`, this can lay out multiple
     * actions itself — centered and wrapped. A COMPONENT reference, not a built
     * node (COMPOSITE-8) — the frame calls it itself with `isSkeleton` forwarded.
     */
    action?: ComponentTypeWithSkeleton
    /**
     * Icon tone. `"neutral"` (default) tints the icon `text-foreground`;
     * `"danger"` tints it `text-danger` for error placeholders. Only the icon
     * colour changes — title and description stay as-is.
     */
    tone?: "neutral" | "danger"
    /**
     * Layout size:
     * - `"default"` — the standard centered stack for lists/panels/sections.
     * - `"compact"` — a single muted title-only line (no icon/description/body/action/code).
     * - `"page"` — roomy full-page sizing for whole-route failures (404/500), with a
     *   larger title and room for a `code` numeral above it.
     */
    size?: "default" | "compact" | "page"
}

/**
 * `isSkeleton` is a co-located loading state — this frame renders its own
 * skeleton bars (via `Typography`) rather than delegating to a `Skeleton.*`
 * compound. `title` is optional only in the `isSkeleton: true` branch; the
 * live branch still requires it. `string`, not `ReactNode` (COMPOSITE-8).
 */
export type EmptyStateProps = EmptyStateOwnProps &
    (
        | { isSkeleton: true; title?: string }
        | { isSkeleton?: false; title: string }
    )

/**
 * Centered placeholder for lists, panels, sections, or whole routes with no content —
 * and for the "failed to load" variant of the same hole (`tone="danger"` + a retry `action`).
 * A vertical, centered stack: optional `code` → optional icon → title → optional
 * description → optional body → optional action. Omits a card wrapper — the caller
 * wraps it in a surface (e.g. `SurfaceCardList emptyState={…}`) when a frame is wanted.
 *
 * @param props - {@link EmptyStateProps}
 */
export const EmptyState = (props: EmptyStateProps) => {
    const {
        icon: Icon,
        code,
        description,
        body: Body,
        action: Action,
        tone = "neutral",
        size = "default",
    } = props
    const isSkeleton = props.isSkeleton ?? false
    // Narrowed off the discriminant so `title` stays required in the live branch —
    // destructuring it straight off `props` above would widen it to `string | undefined`
    // and lose exactly that guarantee (same shape `Alert`/`Toast` already use).
    const titleContent = props.isSkeleton
        ? ({ isSkeleton: true, text: props.title } as const)
        : ({ isSkeleton: false, text: props.title } as const)
    // Same discriminant trick for the optional strings below — `isSkeleton` must stay the
    // exact `true`/`false` literal, not the widened `boolean` this frame's own flag would
    // give, because `Typography`'s prop type is the same kind of union.
    const skeletonAttrs = isSkeleton ? ({ isSkeleton: true } as const) : ({ isSkeleton: false } as const)

    if (size === "compact") {
        // NOTE: The `Typography.*` atom does NOT accept unknown props (no rest spread) → every
        // anatomy tag must sit on a WRAPPING element, not be stuffed into the atom.
        return (
            <span
                className={cn("block")}

                data-tier="composite"
                data-component="EmptyState"
            >
                <Typography size="sm" color="muted" {...titleContent} />
            </span>
        )
    }

    const isPage = size === "page"

    return (
        <div

            className={cn(
                isPage
                    ? "mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center gap-6 px-6 py-8 text-center"
                    : "flex flex-col items-center gap-3 py-6 text-center",
            )}
            data-tier="composite"
            data-component="EmptyState"
        >
            {code != null ? (
                <div>
                    <Typography size="h1" weight="bold" color="muted" text={code} {...skeletonAttrs} />
                </div>
            ) : null}
            {Icon ? (
                <span className={cn("inline-flex", tone === "danger" ? "text-danger" : "text-foreground")}>
                    <Icon className="size-8" />
                </span>
            ) : null}
            {isPage ? (
                <StackV
                    gap={3}
                    principle="sibling-stack"
                    explain="Same-kind peer stack — not group-boundary, because these items are repeating siblings rather than section groups."
                    isSkeleton={isSkeleton}
                    items={[
                        () => (
                            <div>
                                <Typography size="h4" weight="semibold" align="center" {...titleContent} />
                            </div>
                        ),
                        ...(description ? [() => (
                            <div>
                                <Typography size="sm" color="muted" text={description} {...skeletonAttrs} />
                            </div>
                        )] : []),
                    ]}
                />
            ) : (
                <>
                    <div>
                        <Typography weight="medium" {...titleContent} />
                    </div>
                    {description ? (
                        <div>
                            <Typography size="xs" color="muted" text={description} {...skeletonAttrs} />
                        </div>
                    ) : null}
                </>
            )}
            {Body ? <div><Body isSkeleton={isSkeleton} /></div> : null}
            {Action ? (
                <div className={isPage ? "flex flex-wrap items-center justify-center gap-3" : undefined}>
                    <Action isSkeleton={isSkeleton} />
                </div>
            ) : null}
        </div>
    )
}
