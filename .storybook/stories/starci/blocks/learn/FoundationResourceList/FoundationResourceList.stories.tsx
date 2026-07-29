import type { Meta, StoryObj } from "@storybook/nextjs"
import { FoundationResourceList, type FoundationResourceItem } from "@sb-components/starci/blocks/learn/FoundationResourceList/FoundationResourceList"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — `FoundationResourceList`: the resource browse list — numbered rows
 * of supplementary material the learner can search and page through.
 *
 * REUSE, NOT A NEW SHAPE: `AsyncContent` owns the error/loading/empty/content
 * switch, `SurfaceCardList` owns the bounded row surface and its own loading
 * mirror, `IconTile` already falls back from a cover image to a glyph on its
 * own, `EnumChip`/`Chip` own the two chip shapes, `Pagination` owns the page
 * nav. This block only decides which of them fire and what their words mean —
 * the numbering, the kind labels, the recommended text, and the choice
 * between "no resources yet" and `no matches for "X"`.
 *
 * 📐 LEAF BOUNDARY (canon `2-leaf-states.md` §0 R0 — "who flips the prop that
 * changes the tree?"): `isLoading` and `error` are CALLER-set switches that
 * swap the whole region ⇒ each its own leaf. `resources.length === 0` is DATA
 * returning `0` (R0's own worked example) ⇒ a STATE inside `Default`, not a
 * leaf of its own — even though `AsyncContent` still swaps the rendered
 * branch for it, the thing deciding the swap is the `resources` array the
 * caller was already required to pass, not a prop flipped on purpose.
 */
const meta: Meta<typeof FoundationResourceList> = {
    title: "StarCi/Blocks/Learn/FoundationResourceList/FoundationResourceList",
    component: FoundationResourceList,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof FoundationResourceList>

const RESOURCES: Array<FoundationResourceItem> = [
    {
        id: "docker-cheatsheet",
        title: "Docker command cheatsheet",
        description: "Mọi lệnh Docker hay dùng nhất, gom lại một trang để tra nhanh.",
        thumbnailUrl: "https://images.unsplash.com/photo-1605745341112-85968b19335b?w=200",
        kind: "reference",
        isRecommended: true,
        onPress: () => {},
    },
    {
        id: "multistage-video",
        title: "Multi-stage build trong 8 phút",
        description: "Video ngắn giải thích vì sao stage build giữ compiler còn stage cuối thì không.",
        kind: "video",
        onPress: () => {},
    },
    {
        id: "cache-article",
        title: "Image layer và cache hoạt động ra sao",
        description: "Mỗi lệnh trong Dockerfile đẻ một layer, thứ tự lệnh quyết định cache còn dùng được không.",
        thumbnailUrl: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=200",
        kind: "article",
        onPress: () => {},
    },
    {
        id: "registry-exercise",
        title: "Đẩy image lên registry và ghim tag",
        kind: "exercise",
        isRecommended: true,
        onPress: () => {},
    },
]

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "SurfaceCardList": { tier: "composite", role: "the bounded row surface — dividers, row box, and its own row-for-row mirror while loading; the block only hands it resource rows as data", storyId: "composites-cards-surfacecard-surfacecardlist--default" },
    "IconTile": { tier: "atom", role: "each row's leading thumbnail — already falls back from `src` to a `StackIcon` glyph on its own, so no separate thumbnail component exists", storyId: "atoms-display-icontile-icontile--default" },
    "EnumChip": { tier: "composite", role: "the kind chip, built from the block's own kind→label/color table", storyId: "composites-chips-enumchip--gallery" },
    "Chip": { tier: "atom", role: "the plain 'Đề xuất' recommended chip, riding beside the kind chip", storyId: "atoms-chips-chip-chip--default" },
    "Cluster": { tier: "frame", role: "the row's meta slot, holding the kind chip and the optional recommended chip", storyId: "frames-cluster-cluster--default" },
    "StackV": { tier: "frame", role: "stacks the row surface above the pager inside the content branch", storyId: "frames-stack-stackv--default" },
    "Pagination": { tier: "atom", role: "the page nav — only reachable once the content branch is showing, i.e. results exist", storyId: "atoms-navigation-pagination-pagination--default" },
    "AsyncContentEmpty": { tier: "composite", role: "the empty message — wording chosen by the block from `searchQuery`", storyId: "composites-async-asynccontent-asynccontentempty--basic" },
    "AsyncContentError": { tier: "composite", role: "the failed-fetch message", storyId: "composites-async-asynccontent-asynccontenterror--basic" },
}

/** LEAF — the region once loading has finished and nothing errored: empty (with/without a search query) or a populated, paged list. */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="FoundationResourceList"
                tier="block"
                leaf="Default"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                reason="isLoading = false, error unset — the only two required props left to vary are `resources` and `searchQuery`, both DATA (R0), so they render as states of this one leaf."
                states={[
                    {
                        name: "resources = [], searchQuery unset",
                        why: "The course simply has nothing filed here yet, so the region shows one quiet message and nothing else — no pager, no row box. Nothing in the message hints at a search that never happened.",
                        code: `<FoundationResourceList
    resources={[]}
    isLoading={false}
    currentPage={1}
    totalPages={1}
    onPageChange={setPage}
/>`,
                        render: (
                            <FoundationResourceList
                                anatPart="FoundationResourceList"
                                showAnatomy
                                ariaLabel="Tài nguyên khoá học"
                                resources={[]}
                                isLoading={false}
                                currentPage={1}
                                totalPages={1}
                                onPageChange={() => {}}
                            />
                        ),
                    },
                    {
                        name: "resources = [], searchQuery = \"terraform\"",
                        why: "A search ran and found nothing, so the message names the exact query back to the reader and suggests trying another word — the block reads this off `searchQuery`, the caller never hands over a pre-built empty-state string.",
                        code: `<FoundationResourceList
    resources={[]}
    isLoading={false}
    searchQuery="terraform"
    currentPage={1}
    totalPages={1}
    onPageChange={setPage}
/>`,
                        render: (
                            <FoundationResourceList
                                ariaLabel="Tài nguyên khoá học"
                                resources={[]}
                                isLoading={false}
                                searchQuery="terraform"
                                currentPage={1}
                                totalPages={1}
                                onPageChange={() => {}}
                            />
                        ),
                    },
                    {
                        name: "resources.length = 4, totalPages = 3",
                        why: "Four rows, numbered locally from 1 on this page, each carrying its thumbnail-or-glyph, its kind chip, and a recommended chip where it applies — with the pager right below, reachable only because results exist.",
                        code: `<FoundationResourceList
    resources={resources}
    isLoading={false}
    currentPage={1}
    totalPages={3}
    onPageChange={setPage}
/>`,
                        render: (
                            <FoundationResourceList
                                ariaLabel="Tài nguyên khoá học"
                                resources={RESOURCES}
                                isLoading={false}
                                currentPage={1}
                                totalPages={3}
                                onPageChange={() => {}}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — the caller's own fetch is in flight; the region swaps for a row-shaped mirror. */
export const Loading: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="FoundationResourceList"
                tier="block"
                leaf="Prop `isLoading`"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                states={[
                    {
                        name: "isLoading = true",
                        why: "The list's own fetch hasn't resolved yet, so it draws a fixed-count row mirror — thumbnail box and two shimmer lines per row — instead of the empty message. There is no pager here: the content branch that carries it is not the one rendering.",
                        code: `<FoundationResourceList
    resources={[]}
    isLoading
    currentPage={1}
    totalPages={1}
    onPageChange={setPage}
/>`,
                        render: (
                            <FoundationResourceList
                                anatPart="FoundationResourceList"
                                showAnatomy
                                ariaLabel="Tài nguyên khoá học"
                                resources={[]}
                                isLoading
                                currentPage={1}
                                totalPages={1}
                                onPageChange={() => {}}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — the fetch failed; the region swaps for a message, outranking loading/empty. */
export const Error: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="FoundationResourceList"
                tier="block"
                leaf="Prop `error`"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                states={[
                    {
                        name: "error set",
                        why: "The fetch failed, which `AsyncContent` ranks above even a stale loading flag, so the reader sees why nothing is listed instead of a mirror that never resolves. No retry action rides along — this block's own prop surface carries no `onRetry`, a caller that needs one wraps the block at the screen tier.",
                        code: `<FoundationResourceList
    resources={[]}
    isLoading={false}
    error={fetchError}
    currentPage={1}
    totalPages={1}
    onPageChange={setPage}
/>`,
                        render: (
                            <FoundationResourceList
                                anatPart="FoundationResourceList"
                                showAnatomy
                                ariaLabel="Tài nguyên khoá học"
                                resources={[]}
                                isLoading={false}
                                error={new globalThis.Error("network")}
                                currentPage={1}
                                totalPages={1}
                                onPageChange={() => {}}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
