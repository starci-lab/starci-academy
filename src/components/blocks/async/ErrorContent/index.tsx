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
 * Shell mirrors {@link import("../EmptyContent").EmptyContent}: StackV identity root,
 * no hand-rolled host wrapper.
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
    <StackV
        identity={{ tier: "block", component: "ErrorContent" }}
        principle="sibling-stack"
        explain="Same-kind peer stack of error-state parts (glyph, copy, optional retry) — not group-boundary, because these are peers of one error unit rather than section groups."
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
)

/** Tier metadata for `ErrorContent`, used by the component registry/Storybook lookup. */
export const meta = { tier: "composite", name: "ErrorContent" } as const
