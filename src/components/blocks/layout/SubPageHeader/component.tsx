import { ArrowLeftIcon } from "@phosphor-icons/react"
import React from "react"
import {
    Button,
} from "@heroui/react"
import { Typography } from "@/components/atoms/text/Typography"

/** Props for {@link _SubPageHeader} — presentational; the back-button aria-label already resolved. */
export interface SubPageHeaderProps {
    /** Page title shown beside the back button. */
    title: string
    /** Optional subtitle; reserved height is three lines; longer text wraps then truncates. */
    description?: string
    /** Called when the back button is pressed. */
    onBack: () => void
    /** Already-localized accessible label for the back button. */
    backAriaLabel: string
}

/**
 * Reusable sub-page header with back navigation, title, and optional description.
 *
 * @param props - {@link SubPageHeaderProps}
 */
export const _SubPageHeader = ({
    title,
    description,
    onBack,
    backAriaLabel,
}: SubPageHeaderProps) => (
    <div className="flex items-center gap-2">
        <Button
            variant="ghost"
            isIconOnly
            aria-label={backAriaLabel}
            onPress={onBack}
            className="shrink-0"
        >
            <ArrowLeftIcon

                className="size-6"
            />
        </Button>
        <div className="min-w-0 flex-1">
            <Typography size="h3" weight="bold" text={title} />
            {description !== undefined ? (
                <div className="mt-1 text-sm text-muted line-clamp-3 overflow-hidden whitespace-normal break-words">
                    {description}
                </div>
            ) : null}
        </div>
    </div>
)
