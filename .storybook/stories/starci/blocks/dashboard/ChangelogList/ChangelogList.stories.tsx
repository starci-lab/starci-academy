import type { Meta, StoryObj } from "@storybook/nextjs"
import { ChangelogList, type ChangelogListEntry } from "@sb-components/starci/blocks/dashboard/ChangelogList/ChangelogList"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — `ChangelogList`: the dashboard right-rail "What's new" list — dated
 * rows (optional category, a title that opens the entry when it has a
 * destination, an optional one-line body).
 *
 * REUSE, NOT A NEW SHAPE: `SurfaceCardNested` owns the card-in-card frame,
 * its own header bar and the divided row column; `AsyncContent` owns the
 * error/loading/empty/content switch. This block only decides the meta-line
 * wording (date + category label), which rows become links, and the retry
 * copy — see `ChangelogList.tsx`'s file header for the full judgement-call
 * list (meta-line is TEXT not a chip, whole-row link, no outer label
 * wrapper, plain-text body).
 *
 * 📐 LEAF BOUNDARY (canon `2-leaf-states.md` §0 R0 — "who flips the prop that
 * changes the tree?"): `isLoading` and `error` are CALLER-set switches that
 * swap the whole region ⇒ each its own leaf. `entries.length === 0` is DATA
 * returning `0` (R0's own worked example) ⇒ a STATE inside `Default`, not a
 * leaf of its own — `AsyncContent`'s own silent-empty contract (no
 * `emptyContent` passed) renders nothing at all, the same "hide the whole
 * block" behaviour the real `src` component hand-rolled with its own
 * `return null` guard.
 */
const meta: Meta<typeof ChangelogList> = {
    title: "StarCi/Blocks/Dashboard/ChangelogList/ChangelogList",
    component: ChangelogList,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof ChangelogList>

const ENTRIES: Array<ChangelogListEntry> = [
    {
        id: "ai-review-v2",
        title: "New AI grading version, 2x faster",
        body: "Cuts code-grading wait time from about 40 seconds down to under 20 seconds.",
        category: "feature",
        publishedAt: "2026-07-24T03:00:00.000Z",
        linkUrl: "https://starci.example/changelog/ai-review-v2",
    },
    {
        id: "streak-timezone-fix",
        title: "Fixed streak resetting in the wrong timezone",
        body: "Streaks are now calculated in your own timezone instead of UTC.",
        category: "fix",
        publishedAt: "2026-07-20T03:00:00.000Z",
    },
    {
        id: "maintenance-window",
        title: "System maintenance 02:00 - 03:00 on July 15",
        category: "announcement",
        publishedAt: "2026-07-14T03:00:00.000Z",
    },
]

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "SurfaceCardNested": { tier: "composite", role: "the card-in-card frame — its own header bar carries the section label, its divided row column carries the entries, and its own row-for-row mirror covers the loading branch", storyId: "composites-cards-surfacecard-surfacecardnested--default" },
    "AsyncContentError": { tier: "composite", role: "the failed-fetch message, with an optional retry action when the caller passed `onRetry`", storyId: "composites-async-asynccontent-asynccontenterror--basic" },
}

/** LEAF — the region once loading has finished and nothing errored: silently hidden (empty) or a populated list. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ChangelogList"
                tier="block"
                leaf="Default"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-sm"
                reason="isLoading = false, error unset — the only prop left to vary is `entries`, which is DATA (R0), so it renders as states of this one leaf."
                states={[
                    {
                        name: "entries = []",
                        why: "No changelog entries loaded, and nothing errored — the block renders NOTHING at all (not even the card or the section label), reusing `AsyncContent`'s own silent-empty branch instead of a second `return null` guard. This is the exact behaviour the real `src` component hand-rolled.",
                        code: `<ChangelogList
    entries={[]}
    isLoading={false}
/>`,
                        render: (
                            <ChangelogList

                               
                                entries={[]}
                                isLoading={false}
                            />
                        ),
                    },
                    {
                        name: "entries.length = 3, mixed category/link/body",
                        why: "Three rows, newest first: a feature entry with both a category and a link (the whole row becomes pressable), a fix entry with a category but no link, and an announcement entry with neither a link nor a body — showing the meta line and the optional third line both degrade cleanly.",
                        code: `<ChangelogList
    entries={entries}
    isLoading={false}
/>`,
                        render: (
                            <ChangelogList
                                entries={ENTRIES}
                                isLoading={false}
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
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ChangelogList"
                tier="block"
                leaf="Prop `isLoading`"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-sm"
                states={[
                    {
                        name: "isLoading = true",
                        why: "The list's own fetch hasn't resolved yet, so it draws a fixed-count row mirror inside the same card frame — meta line, title and body all shimmer, matching the real 3-line row shape so the loaded list does not jump.",
                        code: `<ChangelogList
    entries={[]}
    isLoading
/>`,
                        render: (
                            <ChangelogList

                               
                                entries={[]}
                                isLoading
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
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ChangelogList"
                tier="block"
                leaf="Prop `error`"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-sm"
                states={[
                    {
                        name: "error set, onRetry set",
                        why: "The fetch failed, which `AsyncContent` ranks above even a stale loading flag or an empty list — the reader sees why nothing is listed. `onRetry` is set here, so a \"Try again\" button rides the message.",
                        code: `<ChangelogList
    entries={[]}
    isLoading={false}
    error={fetchError}
    onRetry={() => mutate()}
/>`,
                        render: (
                            <ChangelogList

                               
                                entries={[]}
                                isLoading={false}
                                error={new globalThis.Error("network")}
                                onRetry={() => {}}
                            />
                        ),
                    },
                    {
                        name: "error set, onRetry unset",
                        why: "Same failed fetch, but the caller passed no `onRetry` — the message renders bare, with no action, instead of a button wired to nothing.",
                        code: `<ChangelogList
    entries={[]}
    isLoading={false}
    error={fetchError}
/>`,
                        render: (
                            <ChangelogList
                                entries={[]}
                                isLoading={false}
                                error={new globalThis.Error("network")}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
