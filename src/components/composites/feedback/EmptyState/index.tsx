import type { ComponentType, ReactNode, SVGProps } from "react"
import { cn } from "@heroui/react"
import { Typography } from "@/components/atoms/text/Typography"
import type { AllowedClassName } from "@/components/atoms/_allowed-class-name"
import { StackV } from "@/components/frames/Stack"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * STORYBOOK-LOCAL DESIGN SPEC — `EmptyState`, a CENTERED vertical stack that
 * fills an empty/error spot (`code`/`icon`/`title`/`description`/`body`(+`children`)/`action`).
 *
 * ⚠️ Split out of the `Feedback.*` namespace (2026-08-01) back into its own flat
 * file — the 2026-07-25 consolidation grouped `Callout`/`Empty`/`Confirm` under
 * one `Feedback` folder; this reverses that so each frame is discoverable by
 * its own name again (this member was `Feedback.Empty` / `FeedbackEmpty`).
 * Props/behaviour are UNCHANGED — this is a file-location + naming refactor,
 * not a visual or API change.
 *
 * ATOM COMPOSITION (§12): text goes through `Typography.*`, icons come from
 * `@phosphor-icons/react` — ONE SET ONLY (§5⃣0), passed as a component ref, the
 * frame forces size/weight itself (§4/§5).
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Source-level tier metadata — see `.claude/design/storybook/architecture/elements/*.md`. */
export const meta = { tier: "composite", name: "EmptyState" } as const

/** Icon passed as a COMPONENT (phosphor), never JSX — the frame owns its scale (§4/§5). */
export type EmptyStateIcon = ComponentType<SVGProps<SVGSVGElement>>

/** Props for {@link EmptyState}. */
export interface EmptyStateProps {
    /**
     * Optional decorative icon as a COMPONENT (Phosphor) above the title — the frame
     * renders it `size-8` + toned. Ignored in `size="compact"`.
     */
    icon?: EmptyStateIcon
    /**
     * Optional large status numeral (e.g. `"404"`, `"500"`) above the icon/title.
     * Intended for `size="page"`; ignored in `size="compact"`.
     */
    code?: ReactNode
    /** Primary message describing why the area is empty (e.g. "No results"). */
    title: ReactNode
    /** Optional supporting text under the title. Ignored in `size="compact"`. */
    description?: ReactNode
    /**
     * Optional free-form body under `description` (a hint list, an illustration).
     * Equivalent to `children`; wins over it. Ignored in `size="compact"`.
     */
    body?: ReactNode
    /** Shorthand for {@link EmptyStateProps.body}. */
    children?: ReactNode
    /**
     * Optional call-to-action (typically a Button) below the body. Ignored in
     * `size="compact"`. In `size="page"`, multiple actions are centered and wrap.
     */
    action?: ReactNode
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
    /**
     * Where this sits inside its parent. Appearance is not passable — it is already a prop.
     */
    classNames?: Array<AllowedClassName>
}

/**
 * Centered placeholder for lists, panels, sections, or whole routes with no content —
 * and for the "failed to load" variant of the same hole (`tone="danger"` + a retry `action`).
 * A vertical, centered stack: optional `code` → optional icon → title → optional
 * description → optional body → optional action. Omits a card wrapper — the caller
 * wraps it in a surface (e.g. `SurfaceCardList emptyState={…}`) when a frame is wanted.
 *
 * @param props - {@link EmptyStateProps}
 */
export const EmptyState = ({
    icon: Icon,
    code,
    title,
    description,
    body,
    children,
    action,
    tone = "neutral",
    size = "default",
    classNames,
}: EmptyStateProps) => {
    if (size === "compact") {
        // ⚠️ The `Typography.*` atom does NOT accept unknown props (no rest spread) → every
        // anatomy tag must sit on a WRAPPING element, not be stuffed into the atom.
        return (
            <span
                className={cn("block", classNames)}
                data-tier="composite"
                data-component="EmptyState"
            >
                <Typography size="sm" text={title} color="muted" />
            </span>
        )
    }

    const isPage = size === "page"
    const main = body ?? children

    return (
        <div
            className={cn(
                isPage
                    ? "mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center gap-6 px-6 py-8 text-center"
                    : "flex flex-col items-center gap-3 py-6 text-center",
                classNames,
            )}
            data-tier="composite"
            data-component="EmptyState"
        >
            {code != null ? (
                <div>
                    <Typography size="h1" weight="bold" color="muted" text={code} />
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
                    body={
                        <>
                            <div>
                                <Typography size="h4" weight="semibold" align="center" text={title} />
                            </div>
                            {description ? (
                                <div>
                                    <Typography size="sm" text={description} color="muted" />
                                </div>
                            ) : null}
                        </>
                    }
                />
            ) : (
                <>
                    <div>
                        <Typography text={title} weight="medium" />
                    </div>
                    {description ? (
                        <div>
                            <Typography size="xs" text={description} color="muted" />
                        </div>
                    ) : null}
                </>
            )}
            {main != null ? <div>{main}</div> : null}
            {action ? (
                <div className={isPage ? "flex flex-wrap items-center justify-center gap-3" : undefined}>
                    {action}
                </div>
            ) : null}
        </div>
    )
}
