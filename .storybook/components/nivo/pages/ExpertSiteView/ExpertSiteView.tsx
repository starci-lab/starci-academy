import type { CSSProperties, ReactNode } from "react"
import { Avatar } from "@sb-components/atoms/display/Avatar/Avatar"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { EmptyState } from "@sb-components/composites/feedback/EmptyState/EmptyState"
import type { SkeletonProps } from "@sb-components/frames/_slot"
import { Grid } from "@sb-components/frames/Grid/Grid"
import { StackV } from "@sb-components/frames/Stack/Stack"
import {
    ExpertSiteLeadForm,
    ExpertSiteLeadFormSkeleton,
    type ExpertSiteLeadFormProps,
} from "@sb-components/nivo/blocks/expert-site/ExpertSiteLeadForm/ExpertSiteLeadForm"
import type { ExpertSiteTemplateKey } from "@sb-components/nivo/blocks/expert-site/ExpertSiteGenerate/ExpertSiteGenerate"

/**
 * `ExpertSiteView` — the PAGE a visitor sees at `<slug>.nivo.vn`. A page is a
 * list of functions: hero, bio, offerings grid, embedded lead form, arranged in
 * frames. `templateKey` picks the section ORDER. A page's story is one complete
 * STATE per story — `loading`, `empty`, `content` — not a leaf-per-prop map.
 * Grounded in the real `ExpertSiteView`; maps onto `ExpertSiteEntity`.
 */

/** One published offering — a subset of `ExpertSiteOfferingEntity`. */
export interface ExpertSiteViewOffering {
    /** Offering id. */
    id: string
    /** Offering title. */
    title: string
    /** One-line subtitle, or null. */
    subtitle?: string | null
    /** Longer description, or null. */
    description?: string | null
    /** Display price, or null (free text — nothing transacts). */
    priceText?: string | null
    /** CTA button label, or null → a default label. */
    ctaLabel?: string | null
    /** CTA target, or null → the card shows no button. */
    ctaUrl?: string | null
    /** Fires when the CTA is pressed — the connected layer opens the link. */
    onCtaPress?: () => void
}

/** The presentation content of the site — mirrors `ExpertSiteConfig`. */
export interface ExpertSiteViewConfig {
    /** Expert's display name shown in the hero. */
    displayName?: string | null
    /** One-line positioning statement under the name. */
    headline?: string | null
    /** Longer free-text introduction. */
    bio?: string | null
    /** Absolute URL of the expert's avatar image. */
    avatarUrl?: string | null
    /** Accent hue (oklch hue, 0-360) — remapped onto the `--accent` token. */
    accentHue?: number | null
    /** Which industry template lays the site out. */
    templateKey?: ExpertSiteTemplateKey | null
}

/** Props for {@link ExpertSiteView}. */
export interface ExpertSiteViewProps {
    /** The subdomain label — the fallback name when `config.displayName` is empty. */
    slug: string
    /** Presentation content, or `null` when the site has never been filled in. */
    config: ExpertSiteViewConfig | null
    /** Published offerings, in order. */
    offerings: Array<ExpertSiteViewOffering>
    /** Forwarded to the embedded {@link ExpertSiteLeadForm}. */
    leadForm: ExpertSiteLeadFormProps
    /** Already-localized copy for the page's own sections. */
    labels: ExpertSiteViewLabels
    /** `true` → the page is still loading; the skeleton mirror is shown. */
    isLoading?: boolean
}

/** The already-resolved copy the page renders. */
export interface ExpertSiteViewLabels {
    /** Heading above the offerings grid. */
    offeringsTitle: string
    /** Heading above the contact form (falls back for `config.ctaLabel`). */
    contactTitle: string
    /** Default CTA label when an offering supplies none. */
    defaultOfferingCta: string
    /** Footer "powered by" line. */
    poweredBy: string
    /** Empty-state title (a claimed slug with no content). */
    emptyTitle: string
    /** Empty-state supporting line. */
    emptyDescription: string
}

/** How many offering placeholders the skeleton draws. */
const SKELETON_OFFERING_COUNT = 2

/** Maps a config hue onto the `--accent` token so every accent atom picks up the site's colour. */
const accentStyleOf = (config: ExpertSiteViewConfig | null): CSSProperties | undefined =>
    config?.accentHue != null
        ? ({ "--accent": `oklch(0.62 0.19 ${config.accentHue})` } as CSSProperties)
        : undefined

/**
 * The public site page. See the file header for why the sections are functions
 * this page names and why the story is one state per render.
 *
 * @param props - {@link ExpertSiteViewProps}
 */
const ExpertSiteView = ({ slug, config, offerings, leadForm, labels, isLoading = false }: ExpertSiteViewProps) => {
    const shell = (children: ReactNode, style?: CSSProperties) => (
        <div
            data-tier="page"
            data-component="ExpertSiteView"
            style={style}
            className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-4 py-12"
        >
            {children}
        </div>
    )

    // ── LOADING state: the skeleton mirror, so nothing jumps when the site resolves.
    if (isLoading) {
        return shell(
            <StackV
                gap={8}
                items={[
                    () => (
                        <StackV
                            gap={3}
                            align="center"
                            items={[
                                () => <Avatar isSkeleton size="lg" />,
                                () => <Typography size="h2" isSkeleton />,
                                () => <Typography size="sm" isSkeleton />,
                            ]}
                        />
                    ),
                    () => <SurfaceCard isSkeleton padding={3} body={() => <Typography size="sm" isSkeleton />} />,
                    () => (
                        <Grid
                            columns={{ base: 1, sm: 2 }}
                            gap={3}
                            isSkeleton
                            items={Array.from({ length: SKELETON_OFFERING_COUNT }, (_unused, index) => ({
                                key: `offering-skeleton-${index}`,
                                content: ({ isSkeleton: skeleton }: SkeletonProps) => (
                                    <SurfaceCard
                                        variant="nested"
                                        padding={3}
                                        isSkeleton={skeleton}
                                        body={() => <Typography size="sm" isSkeleton />}
                                    />
                                ),
                            }))}
                        />
                    ),
                    () => <ExpertSiteLeadFormSkeleton isSkeleton />,
                ]}
            />,
        )
    }

    // ── EMPTY state: a claimed slug the owner has not filled in yet.
    if (config == null) {
        return shell(
            <EmptyState size="page" title={labels.emptyTitle} description={labels.emptyDescription} />,
        )
    }

    const displayName = config.displayName?.trim() || slug
    const template = config.templateKey ?? "minimal"

    const hero = (
        <StackV
            key="hero"
            gap={3}
            align="center"
            items={[
                () => <Avatar size="lg" name={displayName} src={config.avatarUrl ?? undefined} fallback="initials" />,
                () => <Typography size="h2" weight="bold" align="center" text={displayName} />,
                ...(config.headline
                    ? [() => <Typography size="base" color="accent" align="center" text={config.headline ?? ""} />]
                    : []),
            ]}
        />
    )

    const bio = config.bio ? (
        <SurfaceCard
            key="bio"
            padding={3}
            body={() => <Typography size="sm" color="muted" preserveWhitespace text={config.bio ?? ""} />}
        />
    ) : null

    const offeringsSection = offerings.length > 0 ? (
        <StackV
            key="offerings"
            gap={3}
            items={[
                () => <Typography size="base" weight="semibold" text={labels.offeringsTitle} />,
                () => (
                    <Grid
                        columns={{ base: 1, sm: 2 }}
                        gap={3}
                        items={offerings.map((offering) => ({
                            key: offering.id,
                            content: () => (
                                <SurfaceCard
                                    variant="nested"
                                    padding={3}
                                    body={() => (
                                        <StackV
                                            gap={2}
                                            items={[
                                                () => <Typography size="sm" weight="semibold" text={offering.title} />,
                                                ...(offering.subtitle
                                                    ? [() => <Typography size="xs" color="muted" text={offering.subtitle ?? ""} />]
                                                    : []),
                                                ...(offering.description
                                                    ? [() => <Typography size="sm" preserveWhitespace text={offering.description ?? ""} />]
                                                    : []),
                                                ...(offering.priceText
                                                    ? [() => <Typography size="sm" weight="medium" color="accent" text={offering.priceText ?? ""} />]
                                                    : []),
                                                ...(offering.ctaUrl
                                                    ? [
                                                        () => (
                                                            <Button
                                                                variant="primary"
                                                                size="sm"
                                                                label={offering.ctaLabel || labels.defaultOfferingCta}
                                                                onPress={offering.onCtaPress}
                                                            />
                                                        ),
                                                    ]
                                                    : []),
                                            ]}
                                        />
                                    )}
                                />
                            ),
                        }))}
                    />
                ),
            ]}
        />
    ) : null

    const contact = (
        <SurfaceCard
            key="contact"
            padding={3}
            label={labels.contactTitle}
            body={() => <ExpertSiteLeadForm {...leadForm} />}
        />
    )

    // The template decides section ORDER + emphasis; the sections are shared, so a
    // template is a layout choice, not a separate renderer (mirrors real `src`).
    const sections =
        template === "creator"
            ? [hero, offeringsSection, bio, contact]
            : template === "consultant"
                ? [hero, contact, offeringsSection, bio]
                : [hero, bio, offeringsSection, contact]

    return shell(
        <>
            {sections.filter((section) => section != null)}
            <Typography size="xs" color="muted" align="center" text={labels.poweredBy} />
        </>,
        accentStyleOf(config),
    )
}

export { ExpertSiteView }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "page", name: "ExpertSiteView" } as const
