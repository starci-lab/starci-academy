import { WarningOctagonIcon, type Icon as PhosphorIcon } from "@phosphor-icons/react"

import { Typography } from "@/components/atoms/text/Typography"
import { Button } from "@/components/atoms/buttons/Button"
import { StackV } from "@/components/frames/Stack"

/**
 * Props for the {@link ErrorContent} composite.
 */
export interface ErrorContentProps {
    /** Primary error line, already translated. */
    title: string
    /** Optional supporting line below the title (cause / what to do), already translated. */
    description?: string
    /** Override the default warning-octagon glyph — a COMPONENT reference (Phosphor), never JSX. */
    icon?: PhosphorIcon
    /** Retry handler — renders a button when paired with {@link ErrorContentProps.retryLabel}. */
    onRetry?: () => void
    /** Translated label for the retry button (required to render it). */
    retryLabel?: string
}

/**
 * Standalone error state — a warning glyph, a title + optional description, and a
 * "try again" button, centered. Used directly by several screens as the retry
 * state for a failed fetch, and as the `errorContent` of the legacy
 * {@link import("@/components/blocks/async/AsyncContent").AsyncContent} switch.
 *
 * This is a COMPOSITE mislabeled by its folder (BLOCK-7): it takes no domain
 * entity, only already-resolved strings and a handler, so it never fetches and
 * never resolves i18n itself — the caller always hands it translated text.
 *
 * @see Story: .storybook/stories/blocks/async/ErrorContent/ErrorContent.stories
 * @param props - {@link ErrorContentProps}
 */
export const ErrorContent = ({
    title,
    description,
    icon: Icon = WarningOctagonIcon,
    onRetry,
    retryLabel,
}: ErrorContentProps) => (
    <div data-tier="composite" data-component="ErrorContent">
        <StackV
            gap={4}
            align="center"
            padding={6}
            items={[
                () => <Icon aria-hidden focusable="false" weight="duotone" className="size-8 text-foreground" />,
                () => (
                    <StackV
                        gap={2}
                        principle="title-subtitle"
                        explain="Title over supporting line — not label-field, because neither line is a form control label."
                        items={[
                            () => <Typography size="sm" weight="medium" align="center" text={title} />,
                            ...(description
                                ? [() => <Typography size="xs" color="muted" align="center" text={description} />]
                                : []),
                        ]}
                    />
                ),
                ...(onRetry && retryLabel
                    ? [() => <Button variant="secondary" size="sm" onPress={onRetry} label={retryLabel} />]
                    : []),
            ]}
        />
    </div>
)

/** Tier metadata for `ErrorContent`, used by the component registry/Storybook lookup. */
export const meta = { tier: "composite", name: "ErrorContent" } as const
