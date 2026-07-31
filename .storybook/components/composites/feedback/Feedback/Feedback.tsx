import type { ComponentType, ReactNode, SVGProps } from "react"
import { AlertDialog, Typography as HeroTypography, cn } from "@heroui/react"
import { Alert, type AlertStatus } from "@sb-components/atoms/feedback/Alert/Alert"
import { Button, ButtonGroup } from "@sb-components/atoms/buttons/Button/Button"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { StackV } from "@sb-components/frames/Stack/Stack"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * STORYBOOK-LOCAL DESIGN SPEC — `Feedback.*`, the ONE "tell the user what's
 * happening" KHUNG namespace (teacher confirmed 2026-07-25, canon §13a).
 *
 * Three sibling frames that used to live in three separate folders (`Callout` ·
 * `EmptyState` · `ConfirmDialog`) are now MEMBERS of one namespace — same tier,
 * same job (put a MESSAGE + an exit into an already-shaped frame), one import:
 *
 * | Member | Frame | Content channel |
 * |---|---|---|
 * | `.Callout` | flat tint strip LIVING INSIDE a surface | `title`/`description`/`body`(+`children`)/`action` |
 * | `.Empty`   | centered vertical stack filling an empty/error spot | `code`/`icon`/`title`/`description`/`body`(+`children`)/`action` |
 * | `.Confirm` | blocking dialog shell for an action that can't be undone | `title`/`description` + `confirmLabel`/`cancelLabel` |
 *
 * ⚠️ `InfoTooltip` is NOT present here — REMOVED per §13c (see end of file).
 *
 * FRAME API LAW (§13b):
 * - No member is a REPEATED LIST → no frame accepts `items`.
 * - A NAMED slot is the main path. `title` = header, `description`/`body` = body,
 *   `action` = footer — these three frames have a FIXED SHAPE so slots are named
 *   by role (not renamed to bare header/body/footer, which would lose the meaning).
 * - `children` is just a shorthand for `body` (WRAPPING frames), and ONLY on
 *   `.Callout`/`.Empty` — `.Confirm` is a dialog shell built with a fixed
 *   header/body/footer so it does NOT open up children.
 * - Namespace only — does NOT export a bare component (§13a).
 *
 * ATOM COMPOSITION (§12): text goes through `Typography.*`, buttons through
 * `Button.*`, icons come from `@phosphor-icons/react` — ONE SET ONLY (§5⃣0),
 * passed as a component ref, the frame forces size/weight itself (§4/§5).
 * DELIBERATE EXCEPTION: `.Callout` keeps HeroUI's `Alert.Title`/`Alert.Description`
 * because HeroUI itself carries the COLOR-BY-STATUS contract (`.alert--warning
 * .alert__title` → `text-warning-soft-foreground`). Swapping in `Typography` would
 * mean hand-feeding a color table — that's the real "hand-rolled". Switch to the
 * atom once an `Alert` atom exists.
 *
 * Behavior/skin of each member is KEPT AS-IS from the old folders; this is an API
 * + atom-infra refactor, not a visual change. Sync to `src` later.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Icon passed as a COMPONENT (phosphor), never JSX — the frame owns its scale (§4/§5). */
export type FeedbackIcon = ComponentType<SVGProps<SVGSVGElement>>

// ─────────────────────────────────────────────────────────────────────────────
// .Callout — tinted flat strip inside a surface (was `Callout`)
// ─────────────────────────────────────────────────────────────────────────────

/** Semantic tone — the atom's `AlertStatus` re-exported under this frame's name. */
export type FeedbackCalloutStatus = AlertStatus

/**
 * Action button bg/text per status — SOLID `bg-<status>` CTA against the lighter
 * tint. INTERNAL (teacher confirmed 2026-07-25): previously exported because the
 * CTA lived in the caller's `action` slot, so the caller had to hold `Button` and
 * apply the skin itself. Now the frame builds the button ITSELF from
 * `actionLabel`/`onAction` ⇒ the caller (especially a SCREEN) no longer touches the atom.
 */
const CALLOUT_ACTION_CLASS: Record<FeedbackCalloutStatus, string> = {
    default: "bg-foreground text-background",
    accent: "bg-accent text-accent-foreground",
    success: "bg-success text-success-foreground",
    warning: "bg-warning text-warning-foreground",
    danger: "bg-danger text-danger-foreground",
    info: "bg-info text-info-foreground",
}

/** Props for {@link FeedbackCallout}. */
export interface FeedbackCalloutProps {
    /** Semantic tone (drives tint + icon/title colour). Default `"default"`. */
    status?: FeedbackCalloutStatus
    /** Headline line (always shown) — the header slot of this frame. */
    title: ReactNode
    /** Optional supporting line under the title — the body TEXT slot. */
    description?: ReactNode
    /**
     * Optional free-form body under `description` (a short list, a meta row).
     * Equivalent to `children`; wins over it when both are passed.
     */
    body?: ReactNode
    /** Shorthand for {@link FeedbackCalloutProps.body}. */
    children?: ReactNode
    /** Optional custom indicator icon as a COMPONENT; omit for the status default. */
    icon?: FeedbackIcon
    /**
     * CTA label (footer slot). The frame builds the button ITSELF and applies the
     * skin per `status` — the caller only supplies TEXT, not a `Button` (a screen
     * must not hold the atom).
     */
    actionLabel?: string
    /** Handler for the CTA; the button only shows once `actionLabel` is also present. */
    onAction?: () => void
    /** When provided, renders a status-coloured close (×) wired to this. */
    onClose?: () => void
    /** Accessible label for the close button. */
    closeAriaLabel?: string
    /** Placement utilities only (e.g. `mb-4`) — NOT for restyling the callout. */
    className?: string
    /** Anatomy tag: names this frame so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
    /**
     * Story-only: when on, the frame names ITSELF `"FeedbackCallout"` so a panel can badge it
     * without the story wrapping an extra div.
     *
     * Until 2026-07-27 this prop was declared and destructured but NEVER USED — six story
     * leaves passed it and got NO badge at all, while the JSDoc claimed "each composed part
     * emits data-anat-part". A frame that promises anatomy and emits nothing is invisible in
     * the panel with no error anywhere, which is exactly why 11a.1 pins the idiom
     * `anatPart ?? (showAnatomy ? "<name>" : undefined)`.
     */
    showAnatomy?: boolean
}

/**
 * A tinted, flat note for use INSIDE a card / surface (surface-in-surface): a thin
 * `bg-<status>-soft` + `shadow-none` highlight strip, so it doesn't read as a
 * card-in-card.
 *
 * A thin FRAME around the `Alert` atom (teacher confirmed 2026-07-25): callout =
 * an alert PLACED INSIDE a surface, so the frame only picks `tone="soft"` + glyph
 * `md` and hands the whole skin (tint · icon per valence · × button) to the atom.
 * The frame used to hand-feed three color tables in parallel with `Toast` — that
 * was drift, now removed.
 *
 * @param props - {@link FeedbackCalloutProps}
 */
const Callout = ({
    status = "default",
    title,
    description,
    body,
    children,
    icon,
    actionLabel,
    onAction,
    onClose,
    closeAriaLabel,
    className,
    anatPart,
    showAnatomy = false,
}: FeedbackCalloutProps) => (
    <Alert
        status={status}
        tone="soft"
        title={title}
        description={description}
        body={body ?? children}
        icon={icon}
        action={
            actionLabel ? (
                // The frame owns the CTA: builds the button + applies skin per status itself. Caller only supplies text.
                <Button label={actionLabel} size="sm" onPress={onAction} className={CALLOUT_ACTION_CLASS[status]} />
            ) : undefined
        }
        onClose={onClose}
        closeAriaLabel={closeAriaLabel}
        className={className}
        // Self-names as the thing it COMPOSES, not as itself. The parent already gives it a
        // name through `anatPart`; running inside its own story the useful answer is "this is
        // an Alert wearing a callout skin", which is what a Deps tab is for. Naming it
        // `FeedbackCallout` here made the subject label itself and left the tree empty,
        // because the only frame this composite is built on never appeared (caught 2026-07-27).
        anatPart={anatPart ?? (showAnatomy ? "Alert" : undefined)}
    />
)

// ─────────────────────────────────────────────────────────────────────────────
// .Empty — centered placeholder stack (was `EmptyState`)
// ─────────────────────────────────────────────────────────────────────────────

/** Props for {@link FeedbackEmpty}. */
export interface FeedbackEmptyProps {
    /**
     * Optional decorative icon as a COMPONENT (Phosphor) above the title — the frame
     * renders it `size-8` + toned. Ignored in `size="compact"`.
     */
    icon?: FeedbackIcon
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
    /** Shorthand for {@link FeedbackEmptyProps.body}. */
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
    /** Extra classes on the wrapper. */
    className?: string
    /** Anatomy tag: names this frame so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
    /**
     * When on, each composed part with a FIXED identity emits `data-anat-part`
     * (`Code`/`Title`/`Description`, all as `Typography`/`Typography`) for a
     * BlockAnatomy panel.
     *
     * ⚠️ `Icon`/`Body`/`Action` do NOT badge (2026-07-28, §11a.1 LOẠI 3): each is an
     * arbitrary node the CALLER supplies (a different icon component every call, a
     * hint list, one or two buttons), so there is no single fixed component for a
     * panel link to point to — a badge with nowhere to link is worse than no badge.
     *
     * ⚠️ Replaces the old `EmptyState`'s set of 5 props `codeAnatPart`/`iconAnatPart`/… —
     * one flag, FIXED part names (matching every other frame in the system).
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
 * @param props - {@link FeedbackEmptyProps}
 */
const Empty = ({
    icon: Icon,
    code,
    title,
    description,
    body,
    children,
    action,
    tone = "neutral",
    size = "default",
    className,
    anatPart,
    showAnatomy = false,
}: FeedbackEmptyProps) => {
    if (size === "compact") {
        // ⚠️ The `Typography.*` atom does NOT accept unknown props (no rest spread) → every
        // anatomy tag must sit on a WRAPPING element, not be stuffed into the atom.
        return (
            <span className={cn("block", className)} data-anat-part={showAnatomy ? "Typography" : anatPart}>
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
                className,
            )}
        >
            {code != null ? (
                // ⚠️ HeroUI Typography (NOT the atom) for the TWO heading-size slots of
                // `size="page"`: the `Typography.*` atom tops out at `Lg` (text-lg) so
                // forcing a size via a raw className would break the `no-hero-heading-class`
                // lint rule. See the GAP note at the end of the file.
                <div data-anat-part={showAnatomy ? "HeroTypography" : undefined}>
                    <HeroTypography type="h1" weight="bold" color="muted">{code}</HeroTypography>
                </div>
            ) : null}
            {Icon ? (
                // No `data-anat-part` here: `icon` is an arbitrary caller-supplied component (a
                // different Phosphor glyph every call), so there is no ONE fixed component for a
                // panel link to point to (§11a.1 LOẠI 3 — caller slot, stop badging).
                <span className={cn("inline-flex", tone === "danger" ? "text-danger" : "text-foreground")}>
                    <Icon className="size-8" />
                </span>
            ) : null}
            {isPage ? (
                <StackV gap="related">
                    <div data-anat-part={showAnatomy ? "HeroTypography" : undefined}>
                        <HeroTypography type="h4" weight="semibold" align="center">{title}</HeroTypography>
                    </div>
                    {description ? (
                        <div data-anat-part={showAnatomy ? "Typography" : undefined}>
                            <Typography size="sm" text={description} color="muted" />
                        </div>
                    ) : null}
                </StackV>
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
                panel link could point to (§11a.1 LOẠI 3 — caller slot, stop badging). */}
            {main != null ? <div>{main}</div> : null}
            {action ? (
                <div className={isPage ? "flex flex-wrap items-center justify-center gap-3" : undefined}>
                    {action}
                </div>
            ) : null}
        </div>
    )
}

// ─────────────────────────────────────────────────────────────────────────────
// .Confirm — blocking confirmation shell (was `ConfirmDialog`)
// ─────────────────────────────────────────────────────────────────────────────

/** Props for {@link FeedbackConfirm}. */
export interface FeedbackConfirmProps {
    /** Whether the dialog is currently open (controlled). Forwarded to HeroUI `AlertDialog`. */
    isOpen: boolean
    /**
     * Open-state change handler (fires on cancel and, when dismissable, on Escape).
     * The confirm button does NOT close the dialog itself — the caller closes it via
     * this handler once {@link FeedbackConfirmProps.onConfirm} resolves.
     */
    onOpenChange: (open: boolean) => void
    /** Dialog heading — a short question ("Huỷ ghi danh khoá này?"). The header slot. */
    title: ReactNode
    /**
     * Optional supporting copy under the title (the body slot) — spell out the
     * consequence so the choice is informed.
     */
    description?: ReactNode
    /** Label for the confirming action button. Default `"Xác nhận"`. */
    confirmLabel?: string
    /** Label for the cancel / dismiss button. Default `"Huỷ"`. */
    cancelLabel?: string
    /** Fires when the user presses confirm. Run the irreversible action here. */
    onConfirm: () => void
    /**
     * Visual weight of the confirm action. `"danger"` styles the confirm button as
     * destructive for actions that delete or undo; `"default"` for benign ones.
     */
    tone?: "default" | "danger"
    /**
     * When `true`, the confirm button shows a spinner and blocks further presses
     * while the action is in flight; the cancel button is disabled too.
     */
    isConfirming?: boolean
    /** Extra classes on the dialog. */
    className?: string
    /** When on, emit `data-anat-part` on each composed part for a BlockAnatomy panel. */
    showAnatomy?: boolean
}

/**
 * A controlled confirmation dialog for irreversible actions (unenroll from a course,
 * delete a submission) built on HeroUI `AlertDialog`. A purely presentational frame —
 * open state and every callback come in via props; the frame holds no state, does no fetching.
 *
 * The shell already builds a FULL header/body/footer (footer = `ButtonGroup` cancel +
 * confirm) so it does NOT open up `children`: content goes through `title`/`description`.
 *
 * @param props - {@link FeedbackConfirmProps}
 */
const Confirm = ({
    isOpen,
    onOpenChange,
    title,
    description,
    confirmLabel = "Xác nhận",
    cancelLabel = "Huỷ",
    onConfirm,
    tone = "default",
    isConfirming = false,
    className,
    showAnatomy = false,
}: FeedbackConfirmProps) => {
    const isDanger = tone === "danger"
    return (
        <AlertDialog isOpen={isOpen} onOpenChange={onOpenChange}>
            {/* `AlertDialog` root = react-aria `DialogTrigger`: a LOGICAL wrapper, renders no DOM
                node of its own, so it can't carry `data-anat-part` (nothing for the scan to find). */}
            <AlertDialog.Backdrop data-anat-part={showAnatomy ? "AlertDialog.Backdrop" : undefined}>
                <AlertDialog.Container size="sm" data-anat-part={showAnatomy ? "AlertDialog.Container" : undefined}>
                    <AlertDialog.Dialog className={cn(className)} data-anat-part={showAnatomy ? "AlertDialog.Dialog" : undefined}>
                        {/* No status icon — text-only; layout UNCHANGED (heading/body left, footer right) — teacher confirmed 2026-07-23. */}
                        <AlertDialog.Header data-anat-part={showAnatomy ? "AlertDialog.Header" : undefined}>
                            <AlertDialog.Heading data-anat-part={showAnatomy ? "AlertDialog.Heading" : undefined}>{title}</AlertDialog.Heading>
                        </AlertDialog.Header>
                        {description != null ? (
                            <AlertDialog.Body data-anat-part={showAnatomy ? "AlertDialog.Body" : undefined}>
                                {/* Typography atom doesn't accept unknown props — tag the wrapper (§11a.1). */}
                                <span data-anat-part={showAnatomy ? "Typography" : undefined}>
                                    <Typography size="sm" text={description} color="muted" />
                                </span>
                            </AlertDialog.Body>
                        ) : null}
                        <AlertDialog.Footer className="w-full" data-anat-part={showAnatomy ? "AlertDialog.Footer" : undefined}>
                            {/* Footer forwards showAnatomy so the REAL nodes (Button × 2) show up, instead of
                                mislabeling this heroui Footer wrapper as if it were ButtonGroup itself. */}
                            <ButtonGroup
                                align="end"
                                classNames={["w-full"]}
                                showAnatomy={showAnatomy}
                                items={[
                                    {
                                        key: "cancel",
                                        label: cancelLabel,
                                        variant: "secondary",
                                        isDisabled: isConfirming,
                                        onPress: () => onOpenChange(false),
                                    },
                                    {
                                        key: "confirm",
                                        label: confirmLabel,
                                        variant: isDanger ? "danger" : "primary",
                                        isPending: isConfirming,
                                        onPress: onConfirm,
                                    },
                                ]}
                            />
                        </AlertDialog.Footer>
                    </AlertDialog.Dialog>
                </AlertDialog.Container>
            </AlertDialog.Backdrop>
        </AlertDialog>
    )
}

/**
 * `Feedback.*` — the feedback KHUNG namespace: three frames that put a MESSAGE in
 * its right place.
 *
 * | Member | Content channel |
 * |---|---|
 * | `.Callout` | `title` · `description` · `body`/`children` · `action` · `onClose` |
 * | `.Empty`   | `code` · `icon` · `title` · `description` · `body`/`children` · `action` |
 * | `.Confirm` | `title` · `description` · `confirmLabel`/`cancelLabel` (no children) |
 *
 * ⛔ REMOVED from this family — `InfoTooltip` (§13c): it's just `Tooltip` (the
 * atom) dressed with a dotted-underline trigger + a two-line text stack, adding NO
 * frame concept at all. Consumers use `Tooltip` directly with `label` as the
 * content (one or two lines of `Typography.*`). If the "dotted underline for hard
 * terms" convention needs to be kept, that's a component at the DESIGN TIER (e.g.
 * `GlossaryTerm`) — it carries content meaning, not a frame — and sits outside this tier.
 *
 * ⚠️ Known GAP (out of scope, needs its own decision): the `Typography.*` atom tops
 * out at `Lg` (text-lg) and only has `weight` medium|bold → it CANNOT express heading
 * sizes. So exactly TWO slots of `.Empty size="page"` (`code` = h1, `title` = h4) still
 * use HeroUI `Typography` — forcing the size via a raw className would violate the
 * `starci-fe/no-hero-heading-class` lint rule. Switch these 2 spots once the atom opens a
 * heading-size member.
 */
export { Callout as FeedbackCallout, Empty as FeedbackEmpty, Confirm as FeedbackConfirm }
