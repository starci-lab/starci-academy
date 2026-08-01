import type { ComponentType, ReactNode, SVGProps } from "react"
import { cn } from "@heroui/react"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import type { AllowedClassName } from "@sb-components/atoms/_allowed-class-name"
import { StackV } from "@sb-components/frames/Stack/Stack"

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
    /** Anatomy tag: names this frame so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
    /**
     * When on, each composed part with a FIXED identity emits `data-anat-part`
     * (`Code`/`Title`/`Description`, all as `Typography`/`Typography`) for a
     * BlockAnatomy panel.
     *
     * ⚠️ `Icon`/`Body`/`Action` do NOT badge (2026-07-28, §11a.1 CASE 3): each is an
     * arbitrary node the CALLER supplies (a different icon component every call, a
     * hint list, one or two buttons), so there is no single fixed component for a
     * panel link to point to — a badge with nowhere to link is worse than no badge.
     */
    showAnatomy?: boolean
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
    anatPart,
    showAnatomy = false,
}: EmptyStateProps) => {
    if (size === "compact") {
        // ⚠️ The `Typography.*` atom does NOT accept unknown props (no rest spread) → every
        // anatomy tag must sit on a WRAPPING element, not be stuffed into the atom.
        return (
            <span
                className={cn("block", classNames)}
                data-anat-part={showAnatomy ? "Typography" : anatPart}
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
            data-anat-part={anatPart}
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
                <div data-anat-part={showAnatomy ? "Typography" : undefined}>
                    <Typography size="h1" weight="bold" color="muted" text={code} />
                </div>
            ) : null}
            {Icon ? (
                // No `data-anat-part` here: `icon` is an arbitrary caller-supplied component (a
                // different Phosphor glyph every call), so there is no ONE fixed component for a
                // panel link to point to (§11a.1 CASE 3 — caller slot, stop badging).
                <span className={cn("inline-flex", tone === "danger" ? "text-danger" : "text-foreground")}>
                    <Icon className="size-8" />
                </span>
            ) : null}
            {isPage ? (
                <StackV
                    gap={3}
                    body={
                        <>
                            <div data-anat-part={showAnatomy ? "Typography" : undefined}>
                                <Typography size="h4" weight="semibold" align="center" text={title} />
                            </div>
                            {description ? (
                                <div data-anat-part={showAnatomy ? "Typography" : undefined}>
                                    <Typography size="sm" text={description} color="muted" />
                                </div>
                            ) : null}
                        </>
                    }
                />
            ) : (
                <>
                    <div data-anat-part={showAnatomy ? "Typography" : undefined}>
                        <Typography text={title} weight="medium" />
                    </div>
                    {description ? (
                        <div data-anat-part={showAnatomy ? "Typography" : undefined}>
                            <Typography size="xs" text={description} color="muted" />
                        </div>
                    ) : null}
                </>
            )}
            {/* No `data-anat-part` on `Body`/`Action` below: both are arbitrary caller-supplied
                nodes (a hint list here, one or two buttons there) with no ONE fixed component a
                panel link could point to (§11a.1 CASE 3 — caller slot, stop badging). */}
            {main != null ? <div>{main}</div> : null}
            {action ? (
                <div className={isPage ? "flex flex-wrap items-center justify-center gap-3" : undefined}>
                    {action}
                </div>
            ) : null}
        </div>
    )
}
