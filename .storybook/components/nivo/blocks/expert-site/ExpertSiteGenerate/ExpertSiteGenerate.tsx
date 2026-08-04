import { SparkleIcon } from "@phosphor-icons/react"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Chip } from "@sb-components/atoms/chips/Chip/Chip"
import { InputTextarea } from "@sb-components/atoms/forms/Input/Input"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `ExpertSiteGenerate` — the "AI drafts your site" block. The expert writes a
 * brief and presses Generate; a DRAFT (name/headline/bio/template/offerings)
 * comes back for the editor to fill in. The three phases — `empty`,
 * `isGenerating`, `draft` present — are DATA, so they are STATES of the single
 * shape. Grounded in the real `ExpertSiteGenerate`; the draft maps onto
 * `ExpertSiteConfig` + `ExpertSiteOfferingEntity` fields.
 */

/** Which industry template the generator picked — mirrors `ExpertSiteTemplate`. */
export type ExpertSiteTemplateKey = "minimal" | "creator" | "consultant"

/** One offering the generator suggested — a subset of `ExpertSiteOfferingEntity`. */
export interface ExpertSiteGeneratedOffering {
    /** Suggested offering title. */
    title: string
    /** Suggested one-line subtitle. */
    subtitle?: string | null
    /** Suggested display price (free text — nothing transacts). */
    priceText?: string | null
}

/** The draft the generator returns — maps onto `ExpertSiteConfig` + its offerings. */
export interface ExpertSiteGeneratedDraft {
    /** Suggested display name. */
    displayName?: string | null
    /** Suggested one-line headline. */
    headline?: string | null
    /** Suggested longer bio. */
    bio?: string | null
    /** Suggested industry template. */
    templateKey?: ExpertSiteTemplateKey | null
    /** Suggested offerings, in order. */
    offerings: Array<ExpertSiteGeneratedOffering>
}

/** Props for {@link ExpertSiteGenerate}. */
export interface ExpertSiteGenerateProps {
    /** The brief the expert is writing — the generator's only input. */
    brief: string
    /** Fires as the brief changes. */
    onBriefChange: (value: string) => void
    /** Run the generator on the current brief. */
    onGenerate: () => void
    /** The returned draft, or `null` before the first run. */
    draft: ExpertSiteGeneratedDraft | null
    /** `true` → the generator is running (button shows a spinner, inputs lock). */
    isGenerating?: boolean
    /** Already-localized copy for the header, field, and button. */
    labels: ExpertSiteGenerateLabels
}

/** The already-resolved copy the block renders. */
export interface ExpertSiteGenerateLabels {
    /** Card title (e.g. "Let AI draft your site"). */
    title: string
    /** Supporting line under the title. */
    description: string
    /** Label above the brief textarea. */
    briefLabel: string
    /** Placeholder inside the brief textarea. */
    briefPlaceholder: string
    /** Generate button label. */
    submitLabel: string
    /** Heading above the returned-draft preview. */
    draftHeading: string
    /** Heading above the suggested-offerings list in the preview. */
    offeringsHeading: string
}

/** Minimum brief length before Generate is offered — mirrors the real app's guard. */
const MIN_BRIEF_LENGTH = 10

/**
 * The AI draft generator. See the file header for why the three phases are
 * states of one shape rather than separate leaves.
 *
 * @param props - {@link ExpertSiteGenerateProps}
 */
const ExpertSiteGenerate = ({
    brief,
    onBriefChange,
    onGenerate,
    draft,
    isGenerating = false,
    labels,
}: ExpertSiteGenerateProps) => {
    const canGenerate = brief.trim().length >= MIN_BRIEF_LENGTH

    /** The read-only preview of a returned draft — only mounted once a draft exists. */
    const DraftPreview = () => {
        if (!draft) {
            return null
        }
        return (
            <SurfaceCard
                variant="nested"
                padding={3}
                body={() => (
                    <StackV
                        gap={2}
                        items={[
                            () => (
                                <StackH
                                    gap={2}
                                    justify="between"
                                    items={[
                                        () => (
                                            <Typography
                                                size="sm"
                                                weight="medium"
                                                color="muted"
                                                text={labels.draftHeading}
                                            />
                                        ),
                                        ...(draft.templateKey
                                            ? [() => <Chip tone="accent" text={draft.templateKey ?? ""} />]
                                            : []),
                                    ]}
                                />
                            ),
                            ...(draft.displayName
                                ? [() => <Typography size="lg" weight="bold" text={draft.displayName ?? ""} />]
                                : []),
                            ...(draft.headline
                                ? [() => <Typography size="sm" color="accent" text={draft.headline ?? ""} />]
                                : []),
                            ...(draft.bio
                                ? [() => <Typography size="sm" color="muted" preserveWhitespace text={draft.bio ?? ""} />]
                                : []),
                            ...(draft.offerings.length > 0
                                ? [
                                    () => (
                                        <Typography
                                            size="xs"
                                            weight="medium"
                                            color="muted"
                                            text={labels.offeringsHeading}
                                        />
                                    ),
                                    () => (
                                        <StackV
                                            gap={1}
                                            items={draft.offerings.map((offering) => () => (
                                                <Typography size="sm" text={offering.title} />
                                            ))}
                                        />
                                    ),
                                ]
                                : []),
                        ]}
                    />
                )}
            />
        )
    }

    return (
        <div data-tier="block" data-component="ExpertSiteGenerate">
            <SurfaceCard
                padding={3}
                body={() => (
                    <StackV
                        gap={3}
                        items={[
                            () => (
                                <StackH
                                    gap={2}
                                    items={[
                                        () => (
                                            <SparkleIcon
                                                aria-hidden
                                                focusable="false"
                                                weight="fill"
                                                className="size-5 shrink-0 text-accent"
                                            />
                                        ),
                                        () => <Typography size="base" weight="semibold" text={labels.title} />,
                                    ]}
                                />
                            ),
                            () => <Typography size="sm" color="muted" text={labels.description} />,
                            () => (
                                <InputTextarea
                                    variant="secondary"
                                    label={labels.briefLabel}
                                    placeholder={labels.briefPlaceholder}
                                    rows={3}
                                    value={brief}
                                    onValueChange={onBriefChange}
                                    isDisabled={isGenerating}
                                />
                            ),
                            ...(draft ? [() => <DraftPreview />] : []),
                            () => (
                                <StackH
                                    gap={3}
                                    justify="end"
                                    items={[
                                        () => (
                                            <Button
                                                variant="primary"
                                                prefixIcon={SparkleIcon}
                                                label={labels.submitLabel}
                                                onPress={onGenerate}
                                                isDisabled={!canGenerate}
                                                isPending={isGenerating}
                                            />
                                        ),
                                    ]}
                                />
                            ),
                        ]}
                    />
                )}
            />
        </div>
    )
}

export { ExpertSiteGenerate }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "block", name: "ExpertSiteGenerate" } as const
