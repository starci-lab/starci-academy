import React from "react"
import { Chip } from "@sb-components/atoms/chips/Chip/Chip"
import { Breadcrumbs } from "@sb-components/atoms/navigation/Breadcrumbs/Breadcrumbs"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { EnumChip, type EnumChipEntry } from "@sb-components/composites/chips/EnumChip/EnumChip"
import { PageHeader } from "@sb-components/composites/layout/Page/Page"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `FoundationHeader` — the identity cluster at the top of a foundation resource's
 * page: breadcrumb trail, title, description, and a meta row carrying the
 * resource's kind, its recommended flag, its tags, and its author attribution.
 * Two chips (kind and "recommended") both classify the resource. Every optional
 * part — recommended chip, tag row, author line, skeleton — is a data condition
 * on the same trail → title → description → meta shape.
 */

/** Resource kind of a foundation item — mirrors `src`'s `FoundationKind` enum (closed to 3 values). */
export enum FoundationKind {
    /** An external hyperlink (e.g. official docs, article on another site). */
    ExternalLink = "external_link",
    /** An embedded or linked video resource. */
    Video = "video",
    /** A document or written guide, rendered as markdown. */
    Document = "document",
}

/**
 * Kind → chip presentation. EXHAUSTIVE `Record` (not `Partial`, unlike the
 * type `EnumChip` itself accepts): the enum is closed to 3 values, so the
 * compiler must refuse a build that adds a kind and forgets its entry here.
 * The block owns this table (§14d.1: no caller-supplied color/label).
 */
const KIND_MAP: Record<FoundationKind, EnumChipEntry> = {
    [FoundationKind.ExternalLink]: { color: "accent", label: "External link" },
    [FoundationKind.Video]: { color: "accent", label: "Video" },
    [FoundationKind.Document]: { color: "accent", label: "Article" },
}

/** One breadcrumb link — plain data, the block builds the atom from it. */
export interface FoundationHeaderCrumb {
    /** Stable React key. */
    key: string
    /** Display label. */
    label: string
    /** Has a handler → the crumb is pressable; the current page leaves it out. */
    onPress?: () => void
}

/** One topic tag on a foundation resource — plain data, the block builds the chip. */
export interface FoundationHeaderTag {
    /** Stable React key. */
    key: string
    /** Display label. */
    label: string
}

/** Props for {@link FoundationHeader}. */
export interface FoundationHeaderProps {
    /** Breadcrumb trail as DATA — the block builds `Breadcrumbs` itself. A foundation resource is always reached through its category, so the trail is always required (same call `ModuleHeader` makes for its own always-present trail). */
    breadcrumbItems: Array<FoundationHeaderCrumb>
    /** Resource title. */
    title: string
    /** One-sentence summary of the resource. */
    description?: string
    /** Resource kind — the ONE required classifying fact, drives the `EnumChip` tone + label. */
    kind: FoundationKind
    /** `true` → the resource is editorially highlighted; renders a second, success-toned chip beside the kind chip. */
    isRecommended?: boolean
    /** Topic tags. Empty or omitted → no tag chips render. */
    tags?: Array<FoundationHeaderTag>
    /** Author or source attribution — the block adds "Author: " itself. Omit or empty → no author line. */
    author?: string
    /**
     * `true` → every composed atom switches to its own shimmer. The flag FLOWS
     * DOWN into the real atoms rather than building a parallel skeleton tree
     * (§12c).
     */
    isSkeleton?: boolean
}

/**
 * The foundation-resource identity cluster at the top of a resource's own
 * page. See the file header for the full contract and why this is a sibling
 * of `ContentHeader`/`ModuleHeader`/`CourseBrief` rather than an edit of any
 * of them.
 *
 * @param props - {@link FoundationHeaderProps}
 */
const FoundationHeader = ({
    breadcrumbItems,
    title,
    description,
    kind,
    isRecommended = false,
    tags,
    author,
    isSkeleton = false,
}: FoundationHeaderProps) => {
    const hasTags = (tags?.length ?? 0) > 0
    const hasAuthor = author != null && author.trim().length > 0

    const metaCluster = (
        <>
            <StackH
                gap={3}
                align="center"
                at="sm"
                isSkeleton={isSkeleton}
                items={[
                    () => (
                        <EnumChip
                            value={isSkeleton ? FoundationKind.Document : kind}
                            map={KIND_MAP}
                            isSkeleton={isSkeleton}

                        />
                    ),
                    ...(isSkeleton
                        ? [() => <Chip isSkeleton />]
                        : isRecommended
                            ? [() => <Chip tone="success" text="Recommended" />]
                            : []),
                    ...(isSkeleton
                        ? [() => <Chip isSkeleton />, () => <Chip isSkeleton />]
                        : hasTags
                            ? (tags ?? []).map((tag) => () => <Chip text={tag.label} />)
                            : []),
                ]}
            />
            {isSkeleton ? (
                <Typography size="xs" color="muted" isSkeleton classNames={["w-1/2"]} />
            ) : hasAuthor ? (
                <Typography
                    size="xs"
                    color="muted"
                    text={`Author: ${author}`}

                />
            ) : null}
        </>
    )

    return (
        <div>
            <PageHeader

                isSkeleton={isSkeleton}
                breadcrumb={() => (
                    <div className="w-fit">
                        <Breadcrumbs
                            collapseOnMobile
                            collapseFrom={4}
                            items={breadcrumbItems}
                            isSkeleton={isSkeleton}
                        />
                    </div>
                )}
                title={title}
                description={description}
                meta={() =>
                    <StackV gap={4} isSkeleton={isSkeleton} items={[() => metaCluster]} />
                }
            />
        </div>
    )
}

export { FoundationHeader }
