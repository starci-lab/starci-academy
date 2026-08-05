import React from "react"
import { ArrowRightIcon, BriefcaseIcon, BuildingsIcon, MapPinIcon } from "@phosphor-icons/react"
import { AsyncContentEmpty, AsyncContentError } from "@/components/composites/async/AsyncContent"
import { Callout } from "@/components/composites/feedback/Callout"
import { SurfaceCard } from "@/components/composites/cards/SurfaceCard"
import type { ComponentTypeWithSkeleton } from "@/components/frames/_slot"
import { Button } from "@/components/atoms/buttons/Button"
import { Chip } from "@/components/atoms/chips/Chip"
import { Typography } from "@/components/atoms/text/Typography"
import { Container } from "@/components/frames/Container"
import { Cluster } from "@/components/frames/Cluster"
import { StackH, StackV } from "@/components/frames/Stack"
import { PageHeader } from "@/components/blocks/layout/PageHeader"
import { IconTile } from "@/components/blocks/identity/IconTile"
import { MarkdownContent } from "@/components/blocks/rendering/MarkdownContent"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"

/** How many lines the description/requirements paragraphs shimmer while loading. */
const DESCRIPTION_SKELETON_LINES = 4
const REQUIREMENTS_SKELETON_LINES = 3

/** The posting company, already resolved (title/description text, no i18n). */
export interface JobDetailCompany {
    /** Company display name. */
    title: string
    /** Optional short company description (already truncated to 2 lines by the frame). */
    description?: string
    /** Cover logo — falls back to a building glyph when absent/broken. */
    logoUrl?: string | null
    /** Deep link to the company's (course-scoped) page — omitted when unresolvable. */
    href?: string
}

/** All display text, already localized by the connected `JobDetailPage`; a story passes i18n keys. */
export interface JobDetailLabels {
    /** Empty-state title — the `displayId` resolved to no posting. */
    notFound: string
    /** Error-state title on a settled fetch failure. */
    error: string
    /** Retry button label (paired with `onRetry`). */
    retry: string
    /** "Description" section heading. */
    descriptionLabel: string
    /** "Requirements" section heading. */
    requirementsLabel: string
    /** Expired-posting callout message. */
    expired: string
    /** Primary "Apply" CTA label (external-URL apply method). */
    apply: string
    /** "Apply via <email>" CTA label, already interpolated with the address — only meaningful when `canApplyByEmail`. */
    applyByEmail?: string
}

/** Props for {@link _JobDetailPage} — presentational; all data resolved, no fetch/store/i18n. */
export interface JobDetailPageProps {
    /** First load, nothing in hand → the whole tree shimmers in place (co-located). Owned by the connected file. */
    isSkeleton?: boolean
    /** Settled with no posting for the given `displayId` → the not-found empty message. */
    isEmpty?: boolean
    /** Truthy → the error message (beats loading + empty). The connected file passes its settled fetch error. */
    error?: unknown
    /** Retry handler — paired with `labels.retry` to show a retry button on the error branch. */
    onRetry?: () => void
    /** Posting title. */
    title?: string
    /** Already-translated work-mode label (e.g. "Remote") — omitted when the posting carries no work mode. */
    workModeLabel?: string
    /** Already-translated employment-type label (e.g. "Full-time") — omitted when absent. */
    employmentTypeLabel?: string
    /** Free-text location — omitted when absent. */
    location?: string
    /** Already-translated "Posted X ago" sentence. */
    postedAgoLabel?: string
    /** The posting company. */
    company?: JobDetailCompany
    /** Already-formatted salary label (a range, a single figure, or "Negotiable"). */
    salaryLabel?: string
    /** Markdown job description. */
    description?: string
    /** Optional markdown requirements/qualifications. */
    requirements?: string
    /** `true` → the posting is past `expiresAt`; the Apply CTA is replaced with a closed-notice callout. */
    expired?: boolean
    /** `true` → the external-URL Apply CTA renders (posting's `applyMethod` is `ExternalUrl` and carries a URL). */
    canApplyExternal?: boolean
    /** `true` → the email Apply CTA renders (posting's `applyMethod` is `Email` and carries an address). */
    canApplyByEmail?: boolean
    /** Opens `applyUrl` in a new tab — only meaningful with `canApplyExternal`. */
    onApplyExternal?: () => void
    /** Hands off to the OS mail client — only meaningful with `canApplyByEmail`. */
    onApplyByEmail?: () => void
    labels: JobDetailLabels
}

/**
 * "Meta" chip/text row under the title: work-mode chip, employment-type chip, location, and
 * "posted X ago" — each shown only when its data resolved, EXCEPT while `isSkeleton`, when all
 * four render as generic placeholders (real shape unknown yet, so a plausible full row shimmers).
 */
const buildMetaItems = ({
    isSkeleton,
    workModeLabel,
    employmentTypeLabel,
    location,
    postedAgoLabel,
}: Pick<JobDetailPageProps, "isSkeleton" | "workModeLabel" | "employmentTypeLabel" | "location" | "postedAgoLabel">): Array<ComponentTypeWithSkeleton> => {
    if (isSkeleton) {
        return [
            () => <Chip tone="default" isSkeleton />,
            () => <Chip tone="accent" isSkeleton />,
            () => <Typography size="sm" color="muted" isSkeleton />,
        ]
    }
    return [
        ...(workModeLabel ? [() => <Chip tone="default" text={workModeLabel} />] : []),
        ...(employmentTypeLabel ? [() => <Chip tone="accent" text={employmentTypeLabel} />] : []),
        ...(location ? [() => <Typography size="sm" color="muted" prefixIcon={MapPinIcon} text={location} />] : []),
        ...(postedAgoLabel ? [() => <Typography size="sm" color="muted" text={postedAgoLabel} />] : []),
    ]
}

/**
 * `_JobDetailPage` — the presentational half of {@link import("./index").JobDetailPage}: full posting
 * (title, company, markdown description + requirements, salary, work-mode/employment-type chips)
 * and the apply CTA. Four states in the fixed order error → skeleton → empty → content
 * (`loading-and-skeleton.md`): `error` falls to the shared `AsyncContentError` frame, `isEmpty`
 * to `AsyncContentEmpty`, and otherwise the ONE tree renders with `isSkeleton` threaded to every
 * leaf that supports it. `PageHeader`/`IconTile`/`MarkdownContent` carry no `isSkeleton` prop of
 * their own, so their loading state is mirrored in place with `Skeleton.*` right where each sits.
 * See `tiers/split.md` — the connected `index.tsx` owns the fetch and i18n.
 *
 * @param props - {@link JobDetailPageProps}
 */
export const _JobDetailPage = ({
    isSkeleton = false,
    isEmpty = false,
    error,
    onRetry,
    title,
    workModeLabel,
    employmentTypeLabel,
    location,
    postedAgoLabel,
    company,
    salaryLabel,
    description,
    requirements,
    expired = false,
    canApplyExternal = false,
    canApplyByEmail = false,
    onApplyExternal,
    onApplyByEmail,
    labels,
}: JobDetailPageProps) => {
    // error beats a stale loading flag; empty only once settled (loading-and-skeleton.md §1)
    if (error) {
        return <AsyncContentError title={labels.error} onRetry={onRetry} retryLabel={labels.retry} />
    }
    if (!isSkeleton && isEmpty) {
        return <AsyncContentEmpty icon={BriefcaseIcon} title={labels.notFound} />
    }

    const metaItems = buildMetaItems({ isSkeleton, workModeLabel, employmentTypeLabel, location, postedAgoLabel })
    const showRequirements = isSkeleton || Boolean(requirements)
    const showCompanyDescription = isSkeleton || Boolean(company?.description)

    return (
        <Container
            body={() => (
                <StackV
                    gap={8}
                    items={[
                        // Title + meta chip row — PageHeader has no isSkeleton of its own, so its
                        // title slot is fed a co-located Skeleton.Typography while loading.
                        () => (
                            <PageHeader
                                title={isSkeleton ? <Skeleton.Typography type="h3" width="2/3" /> : title}
                                meta={<Cluster gap={3} items={metaItems} />}
                            />
                        ),

                        // Company card — logo tile (no isSkeleton of its own, mirrored in place),
                        // name (linked to the company page when resolvable), description, salary.
                        () => (
                            <SurfaceCard
                                body={() => (
                                    <StackH
                                        gap={3}
                                        principles={["content-row"]}
                                        items={[
                                            () => (isSkeleton ? (
                                                <Skeleton className="size-16 shrink-0 rounded-2xl" />
                                            ) : (
                                                <IconTile
                                                    icon={<BuildingsIcon aria-hidden focusable="false" />}
                                                    src={company?.logoUrl}
                                                    alt={company?.title}
                                                    tone="neutral"
                                                    size="md"
                                                />
                                            )),
                                            () => {
                                                const companyHref = !isSkeleton ? company?.href : undefined
                                                return (
                                                    <StackV
                                                        gap={1}
                                                        classNames={["min-w-0", "flex-1"]}
                                                        items={[
                                                            () => (companyHref ? (
                                                                <Typography
                                                                    size="base"
                                                                    weight="semibold"
                                                                    isLink
                                                                    href={companyHref}
                                                                    underlineOnHover
                                                                    color="default"
                                                                    text={company?.title ?? ""}
                                                                />
                                                            ) : (
                                                                <Typography size="base" weight="semibold" isSkeleton={isSkeleton} text={company?.title ?? ""} />
                                                            )),
                                                            ...(showCompanyDescription ? [() => (
                                                                <Typography size="sm" color="muted" lineClamp={2} isSkeleton={isSkeleton} text={company?.description ?? ""} />
                                                            )] : []),
                                                        ]}
                                                    />
                                                )
                                            },
                                            () => <Typography size="h4" weight="bold" classNames={["shrink-0"]} isSkeleton={isSkeleton} text={salaryLabel ?? ""} />,
                                        ]}
                                    />
                                )}
                            />
                        ),

                        // Description + optional requirements — MarkdownContent has no isSkeleton of
                        // its own, so its loading state is a co-located Skeleton.Paragraph.
                        () => (
                            <StackV
                                gap={6}
                                items={[
                                    () => (
                                        <StackV
                                            gap={2}
                                            items={[
                                                () => <Typography size="base" weight="semibold" isSkeleton={isSkeleton} text={labels.descriptionLabel} />,
                                                () => (isSkeleton
                                                    ? <Skeleton.Paragraph lines={DESCRIPTION_SKELETON_LINES} />
                                                    : <MarkdownContent markdown={description ?? ""} />),
                                            ]}
                                        />
                                    ),
                                    ...(showRequirements ? [() => (
                                        <StackV
                                            gap={2}
                                            items={[
                                                () => <Typography size="base" weight="semibold" isSkeleton={isSkeleton} text={labels.requirementsLabel} />,
                                                () => (isSkeleton
                                                    ? <Skeleton.Paragraph lines={REQUIREMENTS_SKELETON_LINES} />
                                                    : <MarkdownContent markdown={requirements ?? ""} />),
                                            ]}
                                        />
                                    )] : []),
                                ]}
                            />
                        ),

                        // Apply CTA — a closed-notice callout once expired, otherwise the one CTA the
                        // posting's applyMethod resolves to. A generic button shimmer while loading,
                        // since expiry/method aren't known yet.
                        () => {
                            if (isSkeleton) {
                                return <Button isSkeleton size="lg" />
                            }
                            if (expired) {
                                return <Callout status="warning" title={labels.expired} />
                            }
                            if (canApplyExternal) {
                                return <Button variant="primary" size="lg" label={labels.apply} suffixIcon={ArrowRightIcon} onPress={onApplyExternal} />
                            }
                            if (canApplyByEmail && labels.applyByEmail) {
                                return <Button variant="primary" size="lg" label={labels.applyByEmail} suffixIcon={ArrowRightIcon} onPress={onApplyByEmail} />
                            }
                            return null
                        },
                    ]}
                />
            )}
        />
    )
}
