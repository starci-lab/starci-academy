import { cn } from "@heroui/react"
import { XIcon } from "@phosphor-icons/react"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { Button, type IconComponent } from "@sb-components/atoms/buttons/Button/Button"
import type { AllowedClassName } from "@sb-components/atoms/_allowed-class-name"
import { StackH } from "@sb-components/frames/Stack/Stack"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * STORYBOOK-LOCAL DESIGN SPEC — the target `RemovableToken`. Authored in
 * Storybook (not `src`); synced to `src` later. NO `@/components` imports.
 *
 * Grounded in the hand-rolled "picked company" row in
 * `CompanySection` (`src/components/features/careers/Jobs/JobPostForm/CompanySection/index.tsx`):
 * a bordered `rounded-2xl` flex row — a label on the left, a tertiary
 * `Button` (× icon + "Change" text) on the right that clears the pick. This
 * composite generalises that ONE hand-rolled row into a reusable
 * selected-item token: any label/icon in, an optional remove (×) and/or
 * edit ("Change"-style) affordance out.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Props for the {@link RemovableToken} composite. */
export interface RemovableTokenProps {
    /** Token label content — text the composite wraps itself (in `Typography`). */
    label: string
    /**
     * Optional LEADING glyph before the label, passed as a COMPONENT reference
     * (e.g. `icon={FolderIcon}`), never JSX — the composite renders it at its own
     * scale (`size-4`) and, being a reference rather than an already-called node,
     * can still call it during `isSkeleton` (unlike a frozen element).
     */
    icon?: IconComponent
    /**
     * Renders a trailing edit affordance — a small tertiary `Button` (× icon +
     * {@link RemovableTokenProps.editLabel}), mirroring the ground-truth
     * "Change" button that clears a picked company so the user can re-search.
     * Use this when removing the token means "go pick a different one", not
     * "delete it".
     */
    onEdit?: () => void
    /** Label for the edit affordance's button text. Defaults to "Change". */
    editLabel?: string
    /**
     * Renders a trailing COMPACT close (×) — click it to remove the token
     * outright (no re-pick flow). Own compact scale (size-6 hit, size-4
     * glyph), like a chip's cancel-×, not the button-scale edit affordance.
     */
    onRemove?: () => void
    /** Accessible label for the remove (×) button. Falls back to "Remove". */
    removeLabel?: string
    /** Disables both affordances and dims the token. */
    isDisabled?: boolean
    /**
     * Where this sits inside its parent. Appearance is not passable — it is already a prop.
     * Prefer this over `className`; the string form is going away.
     */
    classNames?: Array<AllowedClassName>
    /** `true` → render the skeleton mirror (row frame + placeholder bars). */
    isSkeleton?: boolean
}

/**
 * Generic selected-item token: a bordered `rounded-2xl` row holding an
 * optional leading icon + label, with an optional trailing remove (×) and/or
 * edit ("Change"-style) affordance. Compact — one line, no wrapping content.
 * Presentational; the only callbacks it takes are the two trailing
 * affordances.
 *
 * @param props - {@link RemovableTokenProps}
 */
/** Source-level tier metadata — see `.claude/design/storybook/architecture/elements/*.md`. */
export const meta = { tier: "composite", name: "RemovableToken" } as const

export const RemovableToken = ({
    label,
    icon: Icon,
    onEdit,
    editLabel = "Change",
    onRemove,
    removeLabel = "Remove",
    isDisabled = false,
    classNames,
    isSkeleton = false,
}: RemovableTokenProps) => {
    // One render path: the row's own frame stays identical whether loading or not;
    // only the trailing affordance's CONTENT differs (a shimmer pill vs the real
    // edit/remove controls) — `Button`/`Typography` each draw their own shimmer,
    // this composite only decides which parts show and how many (COMPOSITE-10).
    const trailing = isSkeleton ? (
        <Button isSkeleton size="sm" classNames={["shrink-0"]} />
    ) : onEdit || onRemove ? (
        <StackH
            gap={3}
            classNames={["shrink-0"]}
            body={
                <>
                    {onEdit ? (
                        <Button variant="tertiary" size="sm" isDisabled={isDisabled} onPress={onEdit} prefixIcon={XIcon} label={editLabel} />
                    ) : null}
                    {onRemove ? (
                        // Compact chip-scale close × (NOT the button-scale edit
                        // affordance above) — a real <button> for a11y.
                        <button
                            type="button"
                            aria-label={removeLabel}
                            disabled={isDisabled}
                            onClick={onRemove}
                            className="inline-flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-full text-muted outline-none transition hover:bg-default hover:text-foreground focus-visible:ring-2 focus-visible:ring-accent disabled:cursor-not-allowed [&_svg]:size-4"
                        >
                            <XIcon aria-hidden focusable="false" />
                        </button>
                    ) : null}
                </>
            }
        />
    ) : null

    return (
        <div
            aria-disabled={isDisabled}
            className={cn(
                "flex items-center justify-between gap-3 rounded-2xl border border-default px-3 py-3",
                isDisabled && "opacity-50",
                classNames,
            )}
            data-tier="composite"
            data-component="RemovableToken"
            data-principles="cell-pad"
        >
            <StackH
                gap={3}
                classNames={["min-w-0"]}
                body={
                    <>
                        {Icon ? (
                            // COMPOSITE owns the size (§4) — the atom's own scale, not the
                            // caller's. A component reference can still be called during
                            // `isSkeleton` (it's static chrome, not loaded data), so it
                            // always renders — no shimmer needed for it either way.
                            <span aria-hidden className="inline-flex shrink-0 [&_svg]:size-4">
                                <Icon />
                            </span>
                        ) : null}
                        <Typography
                            size="sm"
                            weight="medium"
                            truncate
                            isSkeleton={isSkeleton}
                            classNames={isSkeleton ? ["w-1/3"] : undefined}
                            text={label}
                        />
                    </>
                }
            />
            {trailing}
        </div>
    )
}
