import React from "react"
import { Chip } from "@sb-components/atoms/chips/Chip/Chip"
import { Breadcrumbs } from "@sb-components/atoms/navigation/Breadcrumbs/Breadcrumbs"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { EnumChip, type EnumChipEntry } from "@sb-components/composites/chips/EnumChip/EnumChip"
import { PageHeader } from "@sb-components/composites/layout/Page/Page"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `FoundationHeader`: the FOUNDATION-RESOURCE IDENTITY block, answering
 * "what is this resource" at the top of a foundation item's own page (ported
 * from `src` `FoundationResourceLayout` + `FoundationMeta`).
 *
 * FOURTH SIBLING of `ContentHeader` (lesson identity), `ModuleHeader` (module
 * identity) and `CourseBrief` (course identity) — NOT a copy of any of them.
 * All four place identity into the same `PageHeader` frame with a `Breadcrumbs`
 * trail, but each answers a different question with different domain fields: a
 * lesson header carries read state / minutes / challenge count / outcomes, a
 * module header carries a tier plus three counts, this block carries a
 * foundation resource's KIND, its recommended flag, its tags, and its author
 * attribution — none of which exist on the other three. Same frame, different
 * domain — see `ContentHeader`'s file header for why that makes each of these
 * a new block rather than a prop bolted onto an existing one.
 *
 * KIND IS A CLOSED 3-VALUE ENUM (mirrors `src`'s `FoundationKind`: external
 * link / video / document), so its map is an EXHAUSTIVE `Record`, not the
 * `Partial<Record<…>>` `EnumChip` itself accepts — the compiler must refuse a
 * build that adds a fourth kind and forgets its chip entry, the same
 * discipline `ModuleHeader` applies to `CourseContentTier`. `kind` is
 * REQUIRED (no "no chip" case): a foundation resource with no chosen kind
 * cannot exist in `src`, unlike a lesson's optional read state.
 *
 * TWO CHIPS CAN BE TRUE TOGETHER, `src` shows them side by side (kind chip +
 * a green "Nên xem" pill), so this block keeps that shape rather than folding
 * to `no-adjacent-chip`'s "one chip, rest as text" idiom — see `ModuleHeader`'s
 * file header for the same call on its tier + count chips. Both KIND and
 * RECOMMENDED classify the resource (what it is / whether it is singled out),
 * so both earn a chip; TAGS are also classifying facts (topic labels a reader
 * filters by in `src`), so they render as chips too, just untoned (`Chip`
 * with no `tone` → `neutral`) so they read as a lower tier than kind/recommended.
 *
 * AUTHOR IS TEXT, NOT A CHIP — `src`'s `FoundationMeta` renders it as a plain
 * muted line below the chip row ("Tác giả: {author}"), never inside a pill.
 * It is attribution, not a classifying fact, so a chip would overstate it.
 *
 * CONTRACT — the block takes DATA, never a pre-formatted string (§14d.1):
 * `author` is the raw name, the block owns the "Tác giả: " prefix itself; a
 * caller that could pass `authorLabel="Tác giả: Rob Pike"` would own the
 * join and the block would stop owning its own wording.
 *
 * SKELETON — kind is skeletonised through `EnumChip`'s own `isSkeleton` (same
 * move as `ModuleHeader`'s tier chip). `isRecommended`/`tags`/`author` are
 * OPTIONAL and their real count is unknown before data lands, so the skeleton
 * renders a fixed placeholder shape (one recommended-shaped pill + two tag-shaped
 * pills + one author-line bar) rather than trying to pre-measure the real
 * list — a deliberate "typical shape" placeholder, the same reasoning
 * `ContentHeader` uses for its skeleton meta row, not a promise that exactly
 * that many chips will land.
 * ─────────────────────────────────────────────────────────────────────────────
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
    [FoundationKind.ExternalLink]: { color: "accent", label: "Liên kết ngoài" },
    [FoundationKind.Video]: { color: "accent", label: "Video" },
    [FoundationKind.Document]: { color: "accent", label: "Bài viết" },
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
    /** Author or source attribution — the block adds "Tác giả: " itself. Omit or empty → no author line. */
    author?: string
    /**
     * `true` → every composed atom switches to its own shimmer. The flag FLOWS
     * DOWN into the real atoms rather than building a parallel skeleton tree
     * (§12c).
     */
    isSkeleton?: boolean
    /** When on, each composed part emits `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy?: boolean
    /** Anatomy tag: names this block so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
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
    showAnatomy = false,
    anatPart,
}: FoundationHeaderProps) => {
    const hasTags = (tags?.length ?? 0) > 0
    const hasAuthor = author != null && author.trim().length > 0

    const metaCluster = (
        <>
            <StackH
                gap="related"
                align="center"
                wrap
                anatPart={showAnatomy ? "StackH" : undefined}
                body={
                    <>
                        <EnumChip
                            value={isSkeleton ? FoundationKind.Document : kind}
                            map={KIND_MAP}
                            isSkeleton={isSkeleton}
                            anatPart={showAnatomy ? "EnumChip" : undefined}
                        />
                        {isSkeleton ? (
                            <Chip isSkeleton anatPart={showAnatomy ? "Chip" : undefined} />
                        ) : isRecommended ? (
                            <Chip tone="success" text="Nên xem" anatPart={showAnatomy ? "Chip" : undefined} />
                        ) : null}
                        {isSkeleton ? (
                            <>
                                <Chip isSkeleton anatPart={showAnatomy ? "Chip" : undefined} />
                                <Chip isSkeleton anatPart={showAnatomy ? "Chip" : undefined} />
                            </>
                        ) : hasTags ? (
                            (tags ?? []).map((tag) => (
                                <Chip key={tag.key} text={tag.label} anatPart={showAnatomy ? "Chip" : undefined} />
                            ))
                        ) : null}
                    </>
                }
            />
            {isSkeleton ? (
                <Typography size="xs" color="muted" isSkeleton classNames={["w-1/2"]} anatPart={showAnatomy ? "Typography" : undefined} />
            ) : hasAuthor ? (
                <Typography
                    size="xs"
                    color="muted"
                    text={`Tác giả: ${author}`}
                    anatPart={showAnatomy ? "Typography" : undefined}
                />
            ) : null}
        </>
    )

    return (
        <div data-anat-part={anatPart}>
            <PageHeader
                anatPart={showAnatomy ? "PageHeader" : undefined}
                breadcrumb={
                    <div className="w-fit" data-anat-part={showAnatomy ? "Breadcrumbs" : undefined}>
                        <Breadcrumbs
                            collapseOnMobile
                            collapseFrom={4}
                            items={breadcrumbItems}
                            isSkeleton={isSkeleton}
                        />
                    </div>
                }
                title={
                    isSkeleton ? (
                        // `PageHeader` has no `isSkeleton` of its own, so the block calls the
                        // atom directly with the EXACT size/weight the frame uses for a title
                        // and feeds the result into the slot.
                        <Typography size="h3" weight="bold" isSkeleton anatPart={showAnatomy ? "Typography" : undefined} />
                    ) : (
                        <span data-anat-part={showAnatomy ? "Typography" : undefined}>{title}</span>
                    )
                }
                description={
                    isSkeleton ? (
                        <Typography size="sm" color="muted" isSkeleton anatPart={showAnatomy ? "Typography" : undefined} />
                    ) : (
                        description
                    )
                }
                meta={
                    <StackV gap="grouped" anatPart={showAnatomy ? "StackV" : undefined} body={metaCluster} />
                }
            />
        </div>
    )
}

export { FoundationHeader }
