import type { FormEvent } from "react"
import { cn } from "@heroui/react"
import { ButtonGroup, type ButtonGroupItem } from "@/components/composites/buttons/ButtonGroup"
import { Typography } from "@/components/atoms/text/Typography"
import { GAP_CLASS, type AllowedGap } from "@/components/frames/_spacing"
import { StackV } from "@/components/frames/Stack"
import type { AllowedClassName } from "@/components/atoms/_allowed-class-name"
import type { ComponentTypeWithSkeleton } from "@/components/frames/_slot"
import { principleAttr, explainAttr, type PrincipleToken, type ExplainReason } from "@/components/frames/_principles"
import { isGapPrinciple, PRINCIPLE_STYLE } from "@/components/frames/_principle-style"
/**
 * ─────────────────────────────────────────────────────────────────────────────
 * STORYBOOK-LOCAL DESIGN SPEC — `Form.*`, the ONE form composite namespace
 * (§13, teacher confirmed 2026-07-25 — tier name changed from `layout` to
 * `composite` at the tier split 2026-07-27: `Form` owns a content role via
 * `Section`/`Actions`, it is not a bare slot like the 7 frames are).
 *
 * Once a form atom carries its OWN `label`/`hint`/`errorMessage`/`isRequired`
 * (§12e — the `Field.*` tier was DELETED per §13c), the form shell has nothing
 * left to "dress" for a field. Its remaining job is LAYOUT ONLY: build a real
 * `<form>`, group fields under a heading, and lay out the closing button row.
 *
 * | Member | Shell | Content channel |
 * |---|---|---|
 * | `.Base`    | `<form>` shell + content column + button row | slot `body` · `actions` |
 * | `.Section` | a titled group of fields                     | `title`/`description` + slot `body` |
 * | `.Actions` | the closing button row                        | **`items` — children FORBIDDEN** |
 *
 * SHELL API LAW (§13b):
 * - `.Base` / `.Section` are WRAPPING shells → the named slot (`body`) is the
 *   main path, a COMPONENT reference (COMPOSITE-8) this shell calls itself so
 *   `isSkeleton` can reach inside it.
 * - `.Actions` is a REPEATED LIST (N buttons of the same kind) → `items` DATA
 *   is REQUIRED, children FORBIDDEN — exactly like `ButtonGroup.items` (§12b).
 * - Namespace only — does NOT export a bare component (§13a).
 *
 * THE SHELL CARRIES NO BEHAVIOUR (§13):
 * - It must NOT re-declare `label`/`hint`/`errorMessage`/`isRequired` — the atom
 *   owns those (§12e).
 * - NO validation, NO field state, NO business rule — that belongs to the
 *   `block` tier. The shell only knows "locked or not" (`isDisabled`) and "submit".
 * - It must NOT hand-draw a button — `.Actions` COMPOSES the atom `ButtonGroup` (§13c).
 *
 * SPACING (§10c): every gap goes through {@link AllowedGap} — a union literal
 * `1..8`, a STEP in the scale, never a raw px number (`gap={3}` → `gap-2`, not
 * `gap-3`). The shell FORCES the scale via the TYPE, it accepts no arbitrary
 * number; off-scale values simply don't compile. Spacing comes from the
 * **parent's gap**, NEVER a child's margin (§10a).
 * ─────────────────────────────────────────────────────────────────────────────
 */
/** Source-level tier metadata — see `.claude/design/storybook/architecture/elements/*.md`. */
export const meta = { tier: "composite", name: "Form" } as const

// ─────────────────────────────────────────────────────────────────────────────
// .Base — the `<form>` shell
// ─────────────────────────────────────────────────────────────────────────────
/** Props for {@link Form}. */
export interface FormBaseProps {
    /**
     * Submit handler. The shell calls `preventDefault()` itself and then invokes
     * this callback, so pressing ENTER inside a field also submits (native
     * `<form>` behaviour — the reason the shell renders a REAL `<form>` tag
     * instead of a column of stacked `<div>`s).
     * Omit → the form never submits (page reload is still blocked).
     */
    onSubmit?: () => void
    /** Main content region (the `FormSection`s / fields), as a COMPONENT reference (COMPOSITE-8) — the shell calls it itself so `isSkeleton` can reach inside it. */
    body?: ComponentTypeWithSkeleton
    /**
     * The closing button row — usually a {@link FormActions}. A NAMED slot
     * (rather than the last node in `body`) so the shell knows where the
     * "bottom" is and keeps the right `gap` seam. A COMPONENT reference
     * (COMPOSITE-8) — same contract as `body`.
     */
    actions?: ComponentTypeWithSkeleton
    /**
     * Vertical rhythm between the form's sub-regions. Default `{6}` (`gap-6`,
     * §10b: design ↔ design within one block). Drop to `{4}` (`gap-3`) for a
     * short form inside a modal.
     * Optional when `principle` owns the seam — then the resolver supplies gap.
     */
    gap?: AllowedGap
    /**
     * Semantic seam for body ↔ actions (and the fieldset column). When set,
     * owns gap CSS — do not also pass `gap` / `classNames`. Query as
     * `[data-principle="token"]`.
     */
    principle?: PrincipleToken
    /**
     * `true` → LOCKS THE WHOLE FORM (submitting / waiting on the server). Uses
     * a native `<fieldset disabled>` so EVERY child control (including the
     * button inside `actions`) disables along with it — the shell never has to
     * thread `isDisabled` down to each field.
     */
    isDisabled?: boolean
    /**
     * `true` → forwarded into whichever of `body`/`actions` renders
     * (COMPOSITE-8 — each is a component reference this shell calls itself, so
     * the flag reaches inside every one of them).
     */
    isSkeleton?: boolean
    /**
     * Where this sits inside its parent. Appearance is not passable — it is already a prop.
     * Ignored when `principle` is set (strict principle-only contract).
     */
    classNames?: Array<AllowedClassName>
}
/**
 * The composite tier's `<form>` shell: a real `<form>` tag (ENTER submits, a11y),
 * a content column following the `gap` rhythm, and an `actions` slot at the bottom.
 *
 * KNOWS NOTHING about the fields inside — no validation, no value, no error.
 * The one flag it owns is `isDisabled` (currently locked), implemented via a
 * native `<fieldset disabled>` so the browser handles disabling every child
 * control.
 *
 * @param props - {@link FormBaseProps}
 */
const Base = ({
    onSubmit,
    body: Body,
    actions: Actions,
    gap = 6,
    principle,
    isDisabled = false,
    isSkeleton = false,
    classNames}: FormBaseProps) => {
    const submit = (event: FormEvent<HTMLFormElement>) => {
        // Always block the form's default navigation, even when there's no handler.
        event.preventDefault()
        onSubmit?.()
    }
    // Strict: when principle owns a gap seam, ignore public gap/classNames.
    const ownsLayout = principle != null && isGapPrinciple(principle)
    const gapStep: AllowedGap = ownsLayout
        ? (PRINCIPLE_STYLE[principle].kind === "gap" ? PRINCIPLE_STYLE[principle].step : gap)
        : gap
    const gapClass = GAP_CLASS[gapStep]
    return (
        <form
            onSubmit={submit}
            noValidate
            className={cn(!ownsLayout && classNames)}
            data-tier="composite"
            data-component="Form"
            data-principle={principleAttr(principle)}
        >
            {/*
                `<fieldset disabled>` = the NATIVE way to lock the whole cluster: every
                child <input>/<button> disables along with it, no need for the shell to
                thread a flag down to each field. `min-w-0` because a fieldset defaults
                to `min-width: min-content` (which would break truncation inside).
            */}
            <fieldset disabled={isDisabled} className={cn("flex min-w-0 flex-col", gapClass)}>
                {Body != null ? (
                    <div className={cn("flex min-w-0 flex-col", gapClass)}>
                        <Body isSkeleton={isSkeleton} />
                    </div>
                ) : null}
                {Actions != null ? <div><Actions isSkeleton={isSkeleton} /></div> : null}
            </fieldset>
        </form>
    )
}
// ─────────────────────────────────────────────────────────────────────────────
// .Section — a titled group of fields
// ─────────────────────────────────────────────────────────────────────────────
/** Props for {@link FormSection}. */
export interface FormSectionProps {
    /** Group title — `Typography.Sm` medium (§9b: a working-context emphasis, not a page heading). The shell wraps it in `Typography` itself (COMPOSITE-8). */
    title: string
    /** Description line under the title — `Typography.Xs` muted (§9a). Omit → title only. Same text contract as {@link FormSectionProps.title}. */
    description?: string
    /** The group's fields, as a COMPONENT reference (COMPOSITE-8) — the shell calls it itself so `isSkeleton` can reach inside it. */
    body?: ComponentTypeWithSkeleton
    /**
     * Vertical rhythm: used for BOTH of the section's seams (header ↔ body, and
     * field ↔ field). Default `{4}` (`gap-3`, §10b: rows/blocks stacked within
     * one block). One token, one owner — change the group's rhythm in exactly
     * one place.
     */
    gap?: AllowedGap
    /**
     * `true` → `title`/`description` switch to shimmer, and `body` (if any) is
     * CALLED with `isSkeleton` too (COMPOSITE-8 — `body` is a component
     * reference this shell calls itself, so the flag reaches inside it the same
     * way it reaches the text lines).
     */
    isSkeleton?: boolean
    /** Where this sits inside its parent. Appearance is not passable — it is already a prop. */
    classNames?: Array<AllowedClassName>
}
/**
 * A titled group of fields: a `header` block (title + optional description,
 * tight `gap-1` because they're a PAIR that sticks together — §10b) followed
 * by the field column.
 *
 * Layout + text only, through the `Typography.*` atom (§9c). It doesn't invent
 * new meaning: the title here is NOT a field's `label` (that belongs to the
 * atom, §12e).
 *
 * @param props - {@link FormSectionProps}
 */
const Section = ({
    title,
    description,
    body: Body,
    gap = 4,
    isSkeleton = false,
    classNames}: FormSectionProps) => (
    <section
        className={cn("flex min-w-0 flex-col", GAP_CLASS[gap], classNames)}
        data-tier="composite"
        data-component="FormSection"
        data-principle="label-field"
    >
        {/* tight gap-1: title ↔ description is a PAIR, not two regions (§10b).
            No `` wrapper: it never helps the reader past what the
            `Typography` nodes inside already say on their own (§11a.1 CASE 2/3 — a
            badge with nowhere to link is worse than no badge; those two atoms keep their
            own badge below and surface as top-level nodes instead). */}
        <StackV
            principle="title-subtitle"
            explain="Title over supporting line — not label-field, because neither line is a form control label."
            isSkeleton={isSkeleton}
            items={[
                () => (
                    <span>
                        <Typography size="sm" text={title} weight="medium" isSkeleton={isSkeleton} />
                    </span>
                ),
                ...(description != null
                    ? [() => (
                        <span>
                            <Typography size="xs" text={description} color="muted" isSkeleton={isSkeleton} />
                        </span>
                    )]
                    : []),
            ]}
        />
        {/* No `` here either: `body` is arbitrary
            caller-supplied field content (§11a.1 CASE 3 — caller slot). */}
        {Body != null ? (
            <div className={cn("flex min-w-0 flex-col", GAP_CLASS[gap])}>
                <Body isSkeleton={isSkeleton} />
            </div>
        ) : null}
    </section>
)
// ─────────────────────────────────────────────────────────────────────────────
// .Actions — the closing button row
// ─────────────────────────────────────────────────────────────────────────────
/** Props for {@link FormActions}. */
export interface FormActionsProps {
    /**
     * The button row described as DATA (§13b: a repeated list ⇒ `items`,
     * children FORBIDDEN). Same shape as `ButtonGroup` items — the shell passes
     * it straight down to the atom, it does NOT hand-draw a button (§13c).
     */
    items: Array<ButtonGroupItem>
    /**
     * Layout meaning for the closing row. Default `flex-action-end` (CTA on the
     * trailing edge). Use `flex-action-between` for escape|commit, `flex-action-start`
     * for a left-anchored cluster. Owns gap + justify — do not pass `align`.
     */
    principle?: PrincipleToken
    /**
     * Why this layer exists - one sentence, emitted as `data-explain` beside the token.
     */
    explain?: ExplainReason
    /**
     * `true` → the button row STICKS to the bottom of the scroll container
     * (`sticky bottom-0`) with a divider + background, for a long form inside a
     * modal/drawer. Chrome only — it doesn't change the button API.
     */
    sticky?: boolean
}
/**
 * The form's closing button row. COMPOSES the atom `ButtonGroup` (§13c — the
 * shell does not hand-roll its own buttons): the shell only adds BOTTOM-STICKING
 * (`sticky`). Main-axis distribution comes from `principle`.
 *
 * Each button's role/behaviour (`variant`/`isPending`/`isDisabled`) still
 * belongs to the atom — the shell only forwards it through `items`.
 *
 * @param props - {@link FormActionsProps}
 */
const Actions = ({
    items,
    principle = "flex-action-end",
    explain,
    sticky = false}: FormActionsProps) => (
    <div
        className={cn(
            // Sticky-shell chrome: divider + solid background so scrolled-under content doesn't show through.
            sticky && "sticky bottom-0 z-10 border-t border-default bg-background py-3")}
        data-tier="composite"
        data-component="FormActions"
        data-principle={principleAttr(principle)}
        data-explain={explainAttr(explain)}
    >
        <ButtonGroup items={items} principle={principle} explain={explain} />
    </div>
)
/**
 * `Form.*` — the form composite namespace (§13). `Base` (the `<form>` shell +
 * content column + button slot) · `Section` (a titled group of fields) ·
 * `Actions` (the button row, `items` data → atom `ButtonGroup`).
 *
 * A field's label/hint/error/required does NOT live here — the form atom
 * carries it itself (§12e).
 */
export { Base as Form, Section as FormSection, Actions as FormActions }
