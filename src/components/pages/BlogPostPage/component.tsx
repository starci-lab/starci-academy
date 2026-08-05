import React from "react"
import { ArrowLeftIcon, ArticleIcon } from "@phosphor-icons/react"
import { Link } from "@/i18n/navigation"
import { AsyncContentEmpty, AsyncContentError } from "@/components/composites/async/AsyncContent"
import { Callout } from "@/components/composites/feedback/Callout"
import { Typography } from "@/components/atoms/text/Typography"
import { Chip, type ChipTone } from "@/components/atoms/chips/Chip"
import { Button } from "@/components/atoms/buttons/Button"
import { Image } from "@/components/atoms/media/Image"
import { Container } from "@/components/frames/Container"
import { StackV } from "@/components/frames/Stack"
import { Cluster } from "@/components/frames/Cluster"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { MarkdownContent } from "@/components/blocks/rendering/MarkdownContent"
import type { ComponentTypeWithSkeleton } from "@/components/composites/_slot"
import { BlogCategory } from "@/modules/api/graphql/queries/types/blog"
import { ReadingProgress } from "./ReadingProgress"
import { RelatedPosts } from "./RelatedPosts"

/** How many placeholder body lines the co-located skeleton mirrors (matches the old 6-full + 1-partial rhythm). */
const SKELETON_BODY_LINES = 7

/** All display text, already localized by the connected `BlogPostPage`; a story passes i18n keys. */
export interface BlogPostLabels {
    back: string
    errorTitle: string
    errorHint: string
    retry: string
    notFound: string
    /** Editorial pillar chip label — only meaningful once a post is loaded. */
    category: string
    premium: string
    /** Already-formatted publish date — only meaningful once a post is loaded. */
    publishedAt: string
    /** Already-interpolated "X min read" — omitted when the post carries no estimate. */
    readingMinutes?: string
    lockedTitle: string
    lockedBody: string
    viewSource: string
    /** Funnel CTA label — the post's own `ctaLabel`, or the generic fallback. */
    cta: string
}

/** Props for {@link _BlogPostPage} — presentational; all data resolved, no fetch/store/i18n. */
export interface BlogPostPageProps {
    /** First load, nothing in hand → the whole tree shimmers in place (co-located). Owned by the connected file. */
    isSkeleton?: boolean
    /** Settled with no matching post → the "not found" message. */
    isEmpty?: boolean
    /** Truthy → the error message (beats loading + empty). The connected file passes its fetch error. */
    error?: unknown
    /** Retry handler for the error branch. */
    onRetry?: () => void

    title?: string
    category?: BlogCategory
    /** Chip tone for {@link BlogPostPageProps.category} — the connected file resolves it from `CATEGORY_COLOR`. */
    categoryTone?: ChipTone
    isPremium?: boolean
    coverImageUrl?: string | null
    /** Article body (markdown). */
    body?: string
    /** `true` when the body was truncated server-side for a non-member viewer. */
    isLocked?: boolean
    /** "View on GitHub" source link — omitted → the button is skipped. */
    sourceUrl?: string | null
    /** Funnel CTA destination — omitted → the button is skipped. */
    ctaUrl?: string | null
    /** Current post's slug — excluded from the "more in this pillar" strip. */
    slug?: string

    labels: BlogPostLabels
}

/**
 * Public `/blog/[slug]` article — the presentational half of {@link BlogPostPage}. Renders a reading-progress
 * bar (once real content is showing), a persistent "back to blog" link, and — error → not-found → content,
 * in that fixed priority — the serif header, the markdown body, the members-only gate, the GitHub source +
 * funnel CTAs, and a "More in {pillar}" strip. The content region threads `isSkeleton` to every leaf so the
 * shimmer mirrors the loaded shape (loading-and-skeleton.md); `MarkdownContent` has no `isSkeleton` of its
 * own, so its slot swaps to a co-located `Skeleton.Paragraph` mirror while shimmering instead.
 *
 * @param props - {@link BlogPostPageProps}
 */
export const _BlogPostPage = ({
    isSkeleton = false,
    isEmpty = false,
    error,
    onRetry,
    title,
    category,
    categoryTone = "default",
    isPremium = false,
    coverImageUrl,
    body,
    isLocked = false,
    sourceUrl,
    ctaUrl,
    slug,
    labels,
}: BlogPostPageProps) => {
    // Always-visible chrome — present in every branch (error/not-found/content alike), unlike the
    // async region below it.
    const backLink: ComponentTypeWithSkeleton = () => (
        <Link href="/blog">
            <Typography size="sm" color="muted" prefixIcon={ArrowLeftIcon} text={labels.back} />
        </Link>
    )

    const shell = (region: React.ReactNode) => (
        <Container
            size="md"
            padding={6}
            identity={{ tier: "block", component: "BlogPostPage" }}
            body={() => (
                <StackV gap={6} items={[backLink, () => region]} />
            )}
        />
    )

    // error beats a stale loading flag; not-found only once settled
    if (error) {
        return shell(
            <AsyncContentError
                title={labels.errorTitle}
                description={labels.errorHint}
                onRetry={onRetry}
                retryLabel={labels.retry}
            />,
        )
    }
    if (!isSkeleton && isEmpty) {
        return shell(<AsyncContentEmpty icon={ArticleIcon} title={labels.notFound} />)
    }

    // header chip row: category pillar + optional premium badge; one shimmering pill while loading
    const chipItems: Array<ComponentTypeWithSkeleton> = isSkeleton
        ? [() => <Chip isSkeleton />]
        : [
            () => <Chip tone={categoryTone} text={labels.category} />,
            ...(isPremium ? [() => <Chip tone="warning" text={labels.premium} />] : []),
        ]

    // header meta row: publish date + optional reading time, separated by a middle dot
    const metaItems: Array<ComponentTypeWithSkeleton> = isSkeleton
        ? [() => <Typography size="sm" color="muted" isSkeleton />]
        : [
            () => <Typography size="sm" color="muted" text={labels.publishedAt} />,
            ...(labels.readingMinutes ? [() => <Typography size="sm" color="muted" text={labels.readingMinutes as string} />] : []),
        ]

    // The ONE real tree — the same shape shimmers while loading and renders once the post arrives.
    // Cover image, the locked gate, the CTA row, and the related strip only ever existed post-load
    // (the legacy skeleton never mirrored them either), so they're skipped entirely while shimmering.
    const articleTree = (
        <StackV gap={6} isSkeleton={isSkeleton} items={[
            () => (
                <StackV gap={3} isSkeleton={isSkeleton} items={[
                    () => <Cluster gap={2} items={chipItems} />,
                    () => <Typography size="h1" text={title ?? ""} isSkeleton={isSkeleton} />,
                    () => <Cluster gap={2} separator items={metaItems} />,
                ]} />
            ),
            ...(!isSkeleton && coverImageUrl ? [() => <Image src={coverImageUrl} alt="" ratio="video" />] : []),
            () => (isSkeleton
                ? <Skeleton.Paragraph lines={SKELETON_BODY_LINES} />
                : <MarkdownContent markdown={body ?? ""} />),
            ...(!isSkeleton && isLocked ? [() => (
                <Callout status="warning" title={labels.lockedTitle} description={labels.lockedBody} />
            )] : []),
            ...(!isSkeleton && (sourceUrl || ctaUrl) ? [() => (
                <StackV gap={3} items={[
                    ...(sourceUrl ? [() => (
                        <a href={sourceUrl} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" size="lg" label={labels.viewSource} classNames={["w-full"]} />
                        </a>
                    )] : []),
                    ...(ctaUrl ? [() => (
                        <Link href={ctaUrl}>
                            <Button variant="primary" size="lg" label={labels.cta} classNames={["w-full"]} />
                        </Link>
                    )] : []),
                ]} />
            )] : []),
            ...(!isSkeleton && category != null && slug != null ? [() => (
                <RelatedPosts category={category} currentSlug={slug} />
            )] : []),
        ]} />
    )

    return (
        <>
            {!isSkeleton && <ReadingProgress />}
            <Container
                size="md"
                padding={6}
                isSkeleton={isSkeleton}
                identity={{ tier: "block", component: "BlogPostPage" }}
                body={() => (
                    <StackV gap={6} items={[backLink, () => articleTree]} />
                )}
            />
        </>
    )
}
