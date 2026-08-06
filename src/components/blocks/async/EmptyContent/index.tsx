import type { ReactNode } from "react"
import { TrayIcon } from "@phosphor-icons/react"
import { Button } from "@/components/atoms/buttons/Button"
import { Typography } from "@/components/atoms/text/Typography"
import type { AllowedClassName } from "@/components/atoms/_allowed-class-name"
import { StackV } from "@/components/frames/Stack"

/**
 * Props for the {@link EmptyContent} composite.
 */
export interface EmptyContentProps {
    /** Primary "nothing here" line. */
    title: ReactNode
    /** Optional supporting line below the title. */
    description?: ReactNode
    /**
     * Override the default tray icon. Takes an already-built node (not a
     * component reference) — every call site hands this a pre-sized glyph
     * (`<Icon className="size-8 …" />`), so the shape stays a node here too.
     */
    icon?: ReactNode
    /** Optional retry/refresh handler — renders a button when paired with a label. */
    onRetry?: () => void
    /** Translated label for the retry button (required to render it). */
    retryLabel?: ReactNode
    /**
     * Where this sits inside its parent. Appearance is not passable — it is already a prop.
     */
    classNames?: Array<AllowedClassName>
}

/**
 * Standalone empty state — a tray icon, a title + optional description, and
 * an optional "try again" button, centered. The standard `emptyContent` for
 * {@link import("../AsyncContent").AsyncContent}. Pure/props-only, one file (an
 * atom/composite never fetches or resolves i18n) — text arrives already
 * translated from the caller.
 */
export const EmptyContent = ({
    title,
    description,
    icon,
    onRetry,
    retryLabel,
    classNames,
}: EmptyContentProps) => {
    const titleLines = [
        () => <Typography size="sm" weight="medium" align="center" text={title} />,
        ...(description
            ? [() => <Typography size="xs" color="muted" align="center" text={description} />]
            : []),
    ]

    return (
        <StackV identity={{ tier: "block", component: "EmptyContent" }}
            gap={4}
            align="center"
            justify="center"
            padding={6}
            classNames={["w-full", ...(classNames ?? [])]}
            items={[
                () => (
                    <>
                        {icon ?? (
                            <TrayIcon aria-hidden focusable="false" weight="duotone" className="size-8 text-foreground" />
                        )}
                    </>
                ),
                () => <StackV gap={2} principle="title-subtitle"
                    explain="Title over supporting line — not label-field, because neither line is a form control label."
                    items={titleLines} />,
                ...(onRetry && retryLabel
                    ? [() => <Button variant="secondary" size="sm" onPress={onRetry} label={retryLabel} />]
                    : []),
            ]}
        />
    )
}

/** Tier metadata for `EmptyContent`, used by the component registry/Storybook lookup. */
export const meta = { tier: "composite", name: "EmptyContent" } as const
