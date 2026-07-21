import React from "react"
import { ArrowLeftIcon } from "@phosphor-icons/react"
import { Button } from "@heroui/react"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — the target `SubPageHeader` layout primitive.
 * Authored in Storybook (not `src`); synced to `src` later. No `@/components`
 * imports (design-spec ports stay self-contained). The real block resolves the
 * default back aria-label via `useTranslations()` (`common.back`); here it
 * falls back to a plain string so the port stays hook-free.
 */

/** Props for the {@link SubPageHeader} block. */
export interface SubPageHeaderProps {
    /** Page title shown beside the back button. */
    title: string
    /** Optional subtitle; reserved height is three lines; longer text wraps then truncates. */
    description?: string
    /** Called when the back button is pressed. */
    onBack: () => void
    /** Accessible label for the back button (defaults to `"Back"`). */
    backAriaLabel?: string
    /** Optional wrapper class. */
    className?: string
}

/**
 * Reusable sub-page header with back navigation, title, and optional description.
 *
 * @param props.title - Main heading text.
 * @param props.description - Muted subtitle; block keeps a fixed three-line height.
 * @param props.onBack - Back button handler (parent owns routing).
 * @param props.backAriaLabel - Override for back button aria-label.
 * @param props.className - Optional wrapper class.
 */
export const SubPageHeader = ({
    title,
    description,
    onBack,
    backAriaLabel,
    className,
}: SubPageHeaderProps) => {
    return (
        <div className={className}>
            <div className="flex items-center gap-2">
                <Button
                    variant="ghost"
                    isIconOnly
                    aria-label={backAriaLabel ?? "Back"}
                    onPress={onBack}
                    className="shrink-0"
                >
                    <ArrowLeftIcon
                        className="size-6"
                    />
                </Button>
                <div className="min-w-0 flex-1">
                    <div className="text-2xl font-bold text-foreground">
                        {title}
                    </div>
                    {description !== undefined ? (
                        <div className="mt-1 text-sm text-muted line-clamp-3 overflow-hidden whitespace-normal break-words">
                            {description}
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    )
}
