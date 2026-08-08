import React from "react"
import { ArrowRightIcon } from "@phosphor-icons/react"
import { ModalShell } from "@/components/composites/layout/ModalShell"
import { Button } from "@/components/atoms/buttons/Button"
import { Typography } from "@/components/atoms/text/Typography"
import { StackV } from "@/components/frames/Stack"
import { GithubIcon } from "@/components/svg/GithubIcon"

/**
 * `_LinkGithubModal` — the SRC TWIN's presentational half. Presentational: typed
 * props, already resolved; no fetch/store/i18n (that's the connected half,
 * `./index.tsx`). See `tiers/split.md`.
 *
 * GitHub-linking prompt: the GitHub mark, a one-line value statement, and one CTA
 * that starts the OAuth redirect. Composes `ModalShell` (the shared dialog
 * scaffold) + `Button`.
 */

/** All display text {@link _LinkGithubModal} renders, already localized by the connected `LinkGithubModal`. */
export interface LinkGithubModalLabels {
    /** Modal header title. */
    title: string
    /** Body copy explaining why linking GitHub matters. */
    description: string
    /** CTA button label. */
    button: string
}

/** Props for {@link _LinkGithubModal} — presentational; all data resolved, no fetch/store/i18n. */
export interface LinkGithubModalProps {
    /** Whether the modal is currently open. */
    isOpen: boolean
    /** Open-state change handler — backdrop click, Escape, close button. */
    onOpenChange: (open: boolean) => void
    /** Fired when the CTA is pressed. The connected half builds the OAuth redirect URL and navigates. */
    onLinkPress: () => void
    /** All display text, already localized by the connected `LinkGithubModal`. */
    labels: LinkGithubModalLabels
}

/**
 * Renders the GitHub-linking prompt inside the shared modal scaffold. See the
 * file header for the full contract.
 *
 * @param props - {@link LinkGithubModalProps}
 */
const _LinkGithubModal = ({
    isOpen,
    onOpenChange,
    onLinkPress,
    labels,
}: LinkGithubModalProps) => {
    const introItems = [
        () => <GithubIcon />,
        () => (
            <Typography
                size="sm"
                color="muted"
                align="center"
                text={labels.description}
            />
        ),
    ]

    const modalBody = [
        () => (
            <StackV
                principle="sibling-stack"
                explain="Same-kind peer stack — not group-boundary, because these items are repeating siblings rather than section groups."
                items={introItems}
            />
        ),
        () => (
            <Button
                variant="primary"
                size="lg"
                suffixIcon={ArrowRightIcon}
                label={labels.button}
                onPress={onLinkPress}
            />
        ),
    ]

    return (
        <ModalShell
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            title={labels.title}
            size="xs"
            body={() => (
                <StackV
                    principle="block-boundary"
                    explain="Intro mark over the link CTA — not group-boundary, because this is the modal body's major section seam, and not sibling-stack, because intro and CTA are different-function zones."
                    items={modalBody}
                />
            )}
            identity={{ tier: "overlay", component: "LinkGithubModal" }}
        />
    )
}

export { _LinkGithubModal }
