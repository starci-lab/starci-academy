import React from "react"
import type { ReactNode } from "react"
import { TrashIcon } from "@phosphor-icons/react"
import type { ComponentTypeWithSkeleton } from "@/components/frames/_slot"
import { AsyncContentEmpty, AsyncContentError } from "@/components/composites/async/AsyncContent"
import { SurfaceCardPlaceholder } from "@/components/composites/cards/SurfaceCard"
import { MediaCard } from "@/components/blocks/cards/MediaCard"
import { PageHeader } from "@/components/blocks/layout/PageHeader"
import { Button } from "@/components/atoms/buttons/Button"
import { ChoiceSwitch } from "@/components/atoms/forms"
import { Typography } from "@/components/atoms/text/Typography"
import { Box } from "@/components/frames/Box"
import { Grid, type GridItem } from "@/components/frames/Grid"
import { StackH, StackV } from "@/components/frames/Stack"
import type { CvDocument } from "@/modules/types/entities/cv"
import { CvHtmlDocument } from "@/components/blocks/cv/CvBlocksWorkspace/CvHtmlDocument"

/**
 * `_CvGallery` — the SRC TWIN, presentational half of the CvGalleryPage gallery block
 * (see `tiers/split.md`): typed props, already resolved; no fetch/store/i18n
 * (that's the connected half, `./index.tsx`). Renders the user's CvGalleryPage documents
 * as live scaled thumbnails; a click opens the dedicated editor. Layout:
 * optional {@link PageHeader} (standalone-page context only, gated on
 * `breadcrumb`) above a state switch — error → {@link AsyncContentError},
 * settled-empty → {@link AsyncContentEmpty}, otherwise the responsive card
 * grid (one {@link SurfaceCardPlaceholder} "create new" tile trailing the
 * real documents).
 */

/** How the open-editor overlay + delete/public-toggle row reads on one CvGalleryPage card. */
export interface CvGalleryDocument {
    /** Stable id — React key, delete/toggle targets. */
    id: string
    /** Already-resolved display label (the connected file falls back to "Untitled N"). */
    label: string
    /** Full block/style payload — feeds the scaled live thumbnail preview. */
    doc: CvDocument
    /** Whether this is the user's ONE public CvGalleryPage (single-public-per-user, BE-enforced). */
    isPublic: boolean
    /** `true` while this card's own public-toggle mutation is in flight. */
    isTogglingPublic: boolean
    /** Accessible name for the cover press target — already interpolated with the label. */
    editAriaLabel: string
    /** Opens this CvGalleryPage in the editor. */
    onOpen: () => void
    /** Removes this CvGalleryPage. */
    onDelete: () => void
    /** Flags/unflags this CvGalleryPage as the public one. */
    onTogglePublic: (isPublic: boolean) => void
}

/** All display text, already localized by the connected {@link CvGallery}; a story passes i18n keys. */
export interface CvGalleryLabels {
    /** Page title — only shown when {@link CvGalleryProps.breadcrumb} is passed. */
    pageTitle: string
    /** Page description under the title. */
    pageDescription: string
    /** Hover-reveal CTA pill printed over a card's thumbnail. */
    openEditor: string
    /** Accessible name for the per-card delete button. */
    deleteCta: string
    /** Label beside the per-card public-toggle switch. */
    publicToggle: string
    /** Hint line shown under a card's switch row while it IS the public CvGalleryPage. */
    publicHint: string
    /** Label on the trailing "create new" dashed tile. */
    createCta: string
    emptyTitle: string
    emptyHint: string
    /** Secondary link out of the empty state, toward the learner's courses. */
    emptyCoursesLinkCta: string
    /** Primary empty-state action label (same handler as the dashed tile). */
    createFirst: string
    errorTitle: string
    retry: string
}

/** Props for {@link _CvGallery} — presentational; all data resolved, no fetch/store/i18n. */
export interface CvGalleryProps {
    /** Breadcrumb row rendered above the title (standalone page context); omitted → no header at all. */
    breadcrumb?: ReactNode
    /** First load, nothing in hand → the grid shimmers in place (co-located). Owned by the connected file. */
    isSkeleton?: boolean
    /** Settled with zero documents → the empty state. */
    isEmpty?: boolean
    /** Truthy → the error message (beats loading + empty). */
    error?: unknown
    /** Retry the failed fetch. */
    onRetry?: () => void
    /** The CvGalleryPage documents, in display order. */
    documents: Array<CvGalleryDocument>
    /** Creates a new CvGalleryPage — the dashed tile's press handler AND the empty state's primary action. */
    onCreate: () => void
    /** `true` while the create mutation is in flight — disables the dashed tile. */
    isCreating?: boolean
    /** Courses browse link — the empty state's secondary action. */
    coursesHref: string
    labels: CvGalleryLabels
}

/** How many placeholder tiles the loading grid shows — mirrors the real grid's usual row. */
const SKELETON_TILE_COUNT = 3

const CvGalleryCardCover = ({ item, labels }: CvGalleryCardCoverProps) => (
    <button
        type="button"
        onClick={item.onOpen}
        aria-label={item.editAriaLabel}
        className="group relative block h-52 w-full cursor-pointer overflow-hidden bg-white outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent"
    >
        <Box
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{ transform: "scale(0.42)", transformOrigin: "top left", width: "238%" }}
        >
            <CvHtmlDocument doc={item.doc} />
        </Box>
        <Box
            as="span"
            className="absolute inset-0 flex items-end justify-center bg-foreground/0 pb-3 opacity-0 transition-opacity group-hover:bg-foreground/5 group-hover:opacity-100"
        >
            <Box as="span" principle="pill-pad" className="rounded-full bg-accent px-4 py-2 text-sm text-accent-foreground"
                explain="Pill/chip inset — not control-pad, because this pads a compact badge shape rather than a form control.">
                {labels.openEditor}
            </Box>
        </Box>
    </button>
)

const CvGalleryCardFooter = ({ item, labels }: CvGalleryCardFooterProps) => (
    <StackV
        gap={3}
        principle="sibling-stack"
        explain="Same-kind peer stack — not group-boundary, because these items are repeating siblings rather than section groups."
        items={[
            () => (
                <StackH
                    gap={3}
                    principle="flex-action"
                    explain="Groups action controls on one horizontal peer row so they share a single hit baseline."
                    justify="between"
                    items={[
                        () => (
                            <ChoiceSwitch
                                isSelected={item.isPublic}
                                isDisabled={item.isTogglingPublic}
                                onValueChange={item.onTogglePublic}
                                label={labels.publicToggle}
                            />
                        ),
                        () => (
                            <Button
                                isIconOnly
                                size="sm"
                                variant="ghost"
                                ariaLabel={labels.deleteCta}
                                prefixIcon={TrashIcon}
                                onPress={item.onDelete}
                            />
                        ),
                    ]}
                />
            ),
            ...(item.isPublic ? [() => (
                <Typography size="xs" color="muted" text={labels.publicHint} />
            )] : []),
        ]}
    />
)

/**
 * One CvGalleryPage card — a scaled live thumbnail that opens the editor, plus a
 * public-toggle switch and a delete button in the footer.
 */
const CvGalleryCard = ({ item, labels }: CvGalleryCardProps) => (
    <MediaCard
        cover={() => <CvGalleryCardCover item={item} labels={labels} />}
        title={item.label}
        footer={() => <CvGalleryCardFooter item={item} labels={labels} />}
    />
)

/** One dashed "add new" tile mirroring {@link SKELETON_TILE_COUNT} placeholder cards while loading. */
const SkeletonTile = () => <Box className="h-[19rem] rounded-3xl border border-default bg-surface" />

/**
 * The CvGalleryPage GALLERY (presentational) — the profile `?tab=cv` surface (and the standalone
 * `/profile/cv` page). See {@link CvGalleryProps} for the full state contract; the
 * connected `./index.tsx` owns the fetch, the mutations, and every `t()` call.
 *
 * @param props - {@link CvGalleryProps}
 */
export const _CvGallery = ({
    breadcrumb,
    isSkeleton = false,
    isEmpty = false,
    error,
    onRetry,
    documents,
    onCreate,
    isCreating = false,
    coursesHref,
    labels,
}: CvGalleryProps) => {
    // The empty state's own action slot: the same "create" handler as the dashed
    // tile, plus a secondary link out to the courses catalog — `AsyncContentEmpty`'s
    // `description` is a plain string (COMPOSITE-8), so the courses link can no
    // longer live INSIDE that sentence the way it used to; it now sits as its own
    // line below the primary button instead (missingVocabulary).
    const emptyAction: ComponentTypeWithSkeleton = () => (
        <StackV
            gap={3}
            principle="sibling-stack"
            explain="Same-kind peer stack — not group-boundary, because these items are repeating siblings rather than section groups."
            align="center"
            items={[
                () => <Button label={labels.createFirst} variant="tertiary" size="sm" onPress={onCreate} />,
                () => <Typography size="sm" isLink href={coursesHref} text={labels.emptyCoursesLinkCta} />,
            ]}
        />
    )

    const gridItems: Array<GridItem> = isSkeleton
        ? Array.from({ length: SKELETON_TILE_COUNT }, (_unused, index) => ({
            key: `skeleton-${index}`,
            content: SkeletonTile,
        }))
        : [
            ...documents.map((item): GridItem => ({
                key: item.id,
                content: () => <CvGalleryCard item={item} labels={labels} />,
            })),
            {
                key: "__create",
                content: () => (
                    <SurfaceCardPlaceholder
                        label={labels.createCta}
                        onPress={onCreate}
                        isDisabled={isCreating}
                    />
                ),
            },
        ]

    let body: ReactNode
    if (error) {
        body = <AsyncContentError title={labels.errorTitle} onRetry={onRetry} retryLabel={labels.retry} />
    } else if (!isSkeleton && isEmpty) {
        body = <AsyncContentEmpty title={labels.emptyTitle} description={labels.emptyHint} action={emptyAction} />
    } else {
        body = <Grid columns={{ base: 1, sm: 2, lg: 3 }} principle="block-boundary" explain="Block-to-block spacing — not group-boundary, because this separates major blocks rather than nested section groups." items={gridItems} />
    }

    return (
        <StackV
            gap={7}
            principle="layout-split"
            explain="Major layout split — not block-boundary, because this separates primary page regions rather than adjacent blocks."
            identity={{ tier: "block", component: "CvGallery" }}
            items={[
                ...(breadcrumb ? [() => (
                    <PageHeader
                        breadcrumb={breadcrumb}
                        title={labels.pageTitle}
                        description={labels.pageDescription}
                    />
                )] : []),
                () => body,
            ]}
        />
    )
}

type CvGalleryCardCoverProps = { item: CvGalleryDocument; labels: CvGalleryLabels }
type CvGalleryCardFooterProps = { item: CvGalleryDocument; labels: CvGalleryLabels }
type CvGalleryCardProps = { item: CvGalleryDocument; labels: CvGalleryLabels }
