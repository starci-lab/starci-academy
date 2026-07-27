import type { ReactNode } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Avatar, AvatarFallback, Typography } from "@heroui/react"
import { CaretRightIcon, FolderOpenIcon } from "@phosphor-icons/react"
import { SurfaceCard, type SurfaceCardPressableGroupItem } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import type { VerdictBandVariant } from "@sb-components/composites/cards/verdict-band"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ⚠️ STATE SCOPE (teacher's call, 2026-07-25): `SurfaceCard.PressableGroup` does NOT
 * create new meaning per cell — it only LAYS OUT + rebuilds `SurfaceCard.Pressable`
 * from `items`. So the stories here ONLY render state that BELONGS TO THE GROUP:
 * `items` mapping · `columns` (container query) · group-level `gap` · the `icon` slot
 * whose size/colour the group owns · the 1–N keyboard shortcut · the verdict band ·
 * pinning a position in the grid · skeleton for the WHOLE GROUP.
 *
 * State PER CELL (`selected` · `isDisabled` · `href` vs `onPress`) lives in the
 * `SurfaceCard.Pressable` story — NOT repeated here.
 *
 * 2026-07-26 (teacher) — this member's own grid system (`SurfaceCardPressableGroupColumns`,
 * 7 tiers, HALF-SIZE container scale `@sm`/`@md`) was removed; `columns`/`gap` now use
 * the SHARED {@link GridColumns}/`SpaceScale` from `Grid.Base` (§13) — the FULL-SIZE
 * scale `@app-sm`/`@app-md`/`@app-lg`. The anatomy panel also changed: the `parts`/
 * `AnatomyNode` prop (the old path, structure declared by hand) → `annotate` (only
 * annotates WHY, structure is inferred from the DOM), keeping only entries with a REAL
 * `storyId`.
 *
 * 2026-07-27 (teacher, §8/§4a) — migrated every leaf below to the `states[]` API. Two
 * leaves (`Columns`, `Gap`) used to stack two renders side by side inside one `div` with
 * a hand-typed `Typography` label above each; those labels are gone now, their meaning
 * moved into each state's own `why`, and each render is its own selectable state tab.
 */
const meta: Meta<typeof SurfaceCard.PressableGroup> = {
    title: "Composites/Cards/SurfaceCard/SurfaceCard.PressableGroup",
    component: SurfaceCard.PressableGroup,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof SurfaceCard.PressableGroup>

/**
 * Standard mock content (C-fixture) for EVERY story: when the `content` cell is a card
 * with children inside, fill it with a ProfileCard — avatar + title + description. The
 * avatar goes INSIDE `content` (the `icon` slot is for plain icons only).
 */
const profileTile = (initials: string, title: string, description: string) => (
    <div className="flex flex-row items-center gap-3">
        <Avatar className="size-10 shrink-0">
            <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-medium">{title}</span>
            <span className="truncate text-xs text-muted">{description}</span>
        </div>
    </div>
)

const MENTORS = [
    { initials: "SC", title: "StarCi Academy", description: "Learn fullstack, system design, and DevOps on an interview-prep roadmap." },
    { initials: "QN", title: "Quang Nguyen", description: "Fullstack mentor — reviews projects and runs mock interviews." },
    { initials: "MM", title: "Mia Mia English", description: "Practice test sets and phrases with the SM-2 method." },
    { initials: "DV", title: "DevOps Lab", description: "Hands-on 4-cloud practice with real credentials." },
]

const profileItems: Array<SurfaceCardPressableGroupItem> = MENTORS.map((m) => ({
    key: m.initials,
    onPress: () => {},
    label: m.title,
    content: profileTile(m.initials, m.title, m.description),
}))

/** Canvas padding only. Bề ngang của chủ thể đi qua `renderClassName` của từng leaf, không bọc ở đây. */
const shell = (node: ReactNode) => <div className="p-8">{node}</div>

/**
 * Live grid leaf: each cell is a REPEATED `Item` — a `SurfaceCard.Pressable` whose
 * `content` the caller composes freely (a ProfileCard here). `Item` HAS its own story
 * (`SurfaceCard.Pressable/Default`), so it declares `storyId` to jump to it.
 *
 * 2026-07-26 (teacher): switched from a hand-written `parts: Array<AnatomyNode>` array
 * to the `annotate: Record<string, AnatomyAnnotation>` table — the tree structure is
 * now inferred from the DOM (`data-anat-part="Item"` attached by the story itself
 * below), and the hand-declared part is now only the WHY.
 */
const ITEM_ANNOTATE: Record<string, AnatomyAnnotation> = {
    Item: {
        tier: "composite",
        role: "SurfaceCard.Pressable repeated once per entry, with its own story at SurfaceCard.Pressable Default.",
        storyId: "composites-cards-surfacecard-surfacecard-pressable--default",
    },
}

const VERDICTS: Array<VerdictBandVariant> = ["success", "warning", "danger", "accent"]

/** Default — `items` is DATA (a REPEATING list forbids children); the whole grid is ONE labelled unit. */
export const Default: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="SurfaceCard.PressableGroup"
                tier="composite"
                leaf="Default"
                annotate={ITEM_ANNOTATE}
                renderClassName="max-w-2xl"
                reason="The whole group renders as one labelled unit through role group plus an aria-label, and each cell is a repeated Item. Because the list repeats, items must arrive as data rather than JSX children, so a caller can never let the row count drift from the item count."
                states={[
                    {
                        name: "items = 4 mentor entries",
                        why: "Each object in items produces one repeated SurfaceCard.Pressable tile, so the four mentors lay out as four cards under the chosen columns. What each tile shows stays free-form, here a profile row built from a shared fixture, because the group only owns layout, never a cell's content.",
                        code: `<SurfaceCard.PressableGroup
    ariaLabel="Mentors"
    columns={{ base: 1, sm: 2 }}
    items={[
        { key: "SC", label: "StarCi Academy", onPress: () => {}, content: profileTile(…) },
        { key: "QN", label: "Quang Nguyen", onPress: () => {}, content: profileTile(…) },
    ]}
/>`,
                        render: <SurfaceCard.PressableGroup ariaLabel="Mentors" columns={{ base: 1, sm: 2 }} items={profileItems} showAnatomy />,
                    },
                ]}
            />,
        ),
}

/**
 * `columns` — column count follows CONTAINER WIDTH (container query `@app-sm`/`@app-md`/
 * `@app-lg`…), NOT viewport: the same grid can sit in a wide page column or a 256px
 * rail. Pick a state below to see the SAME `columns` config settle at a different
 * column count purely from the container it stands in.
 */
export const Columns: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="SurfaceCard.PressableGroup"
                tier="composite"
                leaf="Columns"
                annotate={ITEM_ANNOTATE}
                reason="Column count answers to the container's own width, not the viewport, so the same grid config can sit in a wide page column or a narrow rail and reflow independently of everything else on the page."
                states={[
                    {
                        name: "container width = wide (max-w-2xl)",
                        why: "All four mentor tiles lay out across four columns because the surrounding container is wide enough to satisfy the @app-lg breakpoint. Reaching a real four-column arrangement needs a genuinely wide host, which is why this state pins the container to max-w-2xl rather than leaving it unconstrained.",
                        code: `<div className="max-w-2xl">
    <SurfaceCard.PressableGroup
        ariaLabel="Mentors (wide container)"
        columns={{ base: 1, sm: 2, lg: 4 }}
        items={[…]}
    />
</div>`,
                        render: (
                            <div className="max-w-2xl">
                                <SurfaceCard.PressableGroup
                                    ariaLabel="Mentors (wide container)"
                                    columns={{ base: 1, sm: 2, lg: 4 }}
                                    items={profileItems}
                                    showAnatomy
                                />
                            </div>
                        ),
                    },
                    {
                        name: "container width = narrow (max-w-xs)",
                        why: "The same columns config stays at a single column because the container never reaches the @app-sm breakpoint, even though the story runs on a wide viewport. Column count is a property of the box the grid stands in, not of the screen, so this state deliberately narrows only the container.",
                        code: `<div className="max-w-xs">
    <SurfaceCard.PressableGroup
        ariaLabel="Mentors (narrow container)"
        columns={{ base: 1, sm: 2, lg: 4 }}
        items={[…].slice(0, 2)}
    />
</div>`,
                        render: (
                            <div className="max-w-xs">
                                <SurfaceCard.PressableGroup
                                    ariaLabel="Mentors (narrow container)"
                                    columns={{ base: 1, sm: 2, lg: 4 }}
                                    items={profileItems.slice(0, 2)}
                                />
                            </div>
                        ),
                    },
                ]}
            />,
        ),
}

/** `gap` — spacing between cells is set at the GROUP LEVEL (the grid is always even), items don't adjust it themselves. */
export const Gap: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="SurfaceCard.PressableGroup"
                tier="composite"
                leaf="Gap"
                annotate={ITEM_ANNOTATE}
                renderClassName="max-w-2xl"
                reason="gap is a prop of the group, never of an item, so the grid always keeps one even spacing across every cell instead of letting a single tile push its neighbours around."
                states={[
                    {
                        name: "gap = 2",
                        why: "Every cell sits closer to its neighbours because 2 is the dense end of the spacing scale. A dense grid reads well when the tiles are already visually distinct, such as short profile rows with an avatar.",
                        code: "<SurfaceCard.PressableGroup gap={2} ariaLabel=\"Mentors\" columns={{ base: 1, sm: 2 }} items={[…].slice(0, 2)} />",
                        render: <SurfaceCard.PressableGroup ariaLabel="Mentors (gap 2)" columns={{ base: 1, sm: 2 }} gap={2} items={profileItems.slice(0, 2)} showAnatomy />,
                    },
                    {
                        name: "gap = 3 (default)",
                        why: "Every cell stands with more breathing room than the gap 2 state, using the same repeated-Item composition. 3 is the default because it is the spacing the rest of the grid family already settles on.",
                        code: "<SurfaceCard.PressableGroup gap={3} ariaLabel=\"Mentors\" columns={{ base: 1, sm: 2 }} items={[…].slice(2)} />  // default",
                        render: <SurfaceCard.PressableGroup ariaLabel="Mentors (gap 3)" columns={{ base: 1, sm: 2 }} gap={3} items={profileItems.slice(2)} />,
                    },
                ]}
            />,
        ),
}

/** `item.icon` — a BARE icon slot: the group pins `size-5` + a muted colour in one place (§4/§5a), the call site never sets a class itself. */
export const WithIcon: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="SurfaceCard.PressableGroup"
                tier="composite"
                leaf="WithIcon"
                annotate={ITEM_ANNOTATE}
                renderClassName="max-w-2xl"
                reason="icon is passed bare, so the group owns its size and colour in one place; iconPosition only flips which side it sits on, and every cell in the grid still composes the exact same Item part."
                states={[
                    {
                        name: "item.icon set, iconPosition = leading (default) and trailing",
                        why: "Each tile shows a folder glyph beside its label, leading on the first item and trailing on the second, both drawn by the group at a fixed size and colour rather than a class the caller writes. The composition stays a single repeated Item either way, only the icon's side flips.",
                        code: `<SurfaceCard.PressableGroup
    ariaLabel="Resources"
    columns={{ base: 1, sm: 2 }}
    items={[
        { key: "docs", icon: <FolderOpenIcon />, content: <Typography type="body-sm">Docs</Typography>, onPress: () => {} },
        { key: "labs", icon: <FolderOpenIcon />, iconPosition: "trailing", content: <Typography type="body-sm">Labs</Typography>, onPress: () => {} },
    ]}
/>`,
                        render: (
                            <SurfaceCard.PressableGroup
                                ariaLabel="Resources"
                                columns={{ base: 1, sm: 2 }}
                                showAnatomy
                                items={[
                                    {
                                        key: "docs",
                                        icon: <FolderOpenIcon />,
                                        content: <Typography type="body-sm" weight="medium">Docs</Typography>,
                                        onPress: () => {},
                                    },
                                    {
                                        key: "labs",
                                        icon: <FolderOpenIcon />,
                                        iconPosition: "trailing",
                                        content: <Typography type="body-sm" weight="medium">Labs</Typography>,
                                        onPress: () => {},
                                    },
                                ]}
                            />
                        ),
                    },
                ]}
            />,
        ),
}

/**
 * `keyboardShortcut` — the whole group is the screen's MAIN action: number keys `1`–`N`
 * pick a cell without the mouse. Press 1 through 4 to try it. Opt-in because the
 * listener lives on `window`.
 */
export const KeyboardShortcut: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="SurfaceCard.PressableGroup"
                tier="composite"
                leaf="KeyboardShortcut"
                annotate={ITEM_ANNOTATE}
                renderClassName="max-w-2xl"
                reason="keyboardShortcut is opt-in because its listener lives on window, so only the one group that is genuinely the screen's main action should claim the number keys."
                states={[
                    {
                        name: "keyboardShortcut = true",
                        why: "Each tile gains a visible number badge from 1 through 4 and pressing that key activates the matching card, on top of the exact same repeated-Item composition as the Default leaf. The group can carry this because it is the main action on the screen, not a secondary widget competing for the same keys.",
                        code: `<SurfaceCard.PressableGroup
    ariaLabel="Select a mentor by number key"
    keyboardShortcut
    columns={{ base: 1, sm: 2 }}
    items={[…]}
/>`,
                        render: (
                            <SurfaceCard.PressableGroup
                                ariaLabel="Select a mentor by number key"
                                columns={{ base: 1, sm: 2 }}
                                items={profileItems}
                                keyboardShortcut
                                showAnatomy
                            />
                        ),
                    },
                ]}
            />,
        ),
}

/**
 * `item.withVerdict` — a DATA SIGNAL band on the left edge of each tile (the same
 * canonical band as `SectionCard` / `SurfaceCard.List`), overlaid on the ProfileCard
 * content.
 */
export const Verdict: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="SurfaceCard.PressableGroup"
                tier="composite"
                leaf="Verdict"
                annotate={ITEM_ANNOTATE}
                renderClassName="max-w-2xl"
                reason="withVerdict overlays the same canonical status band used by SectionCard and SurfaceCard.List, so a status signal reads identically wherever a card family shows one, instead of every composite inventing its own colour."
                states={[
                    {
                        name: "item.withVerdict.enable = true, one variant per item",
                        why: "Each of the four tiles gains a coloured edge band, success, warning, danger, and accent in turn, layered on top of the same profile content as every other leaf. The band overlays the existing Item rather than replacing it, so it never changes what a tile's content can be.",
                        code: `<SurfaceCard.PressableGroup
    ariaLabel="Mentors by status"
    columns={{ base: 1, sm: 2 }}
    items={items.map((item, i) => ({ ...item, withVerdict: { enable: true, variant: VERDICTS[i] } }))}
/>`,
                        render: (
                            <SurfaceCard.PressableGroup
                                ariaLabel="Mentors by status"
                                columns={{ base: 1, sm: 2 }}
                                items={profileItems.map((item, index) => ({
                                    ...item,
                                    withVerdict: { enable: true, variant: VERDICTS[index] },
                                }))}
                                showAnatomy
                            />
                        ),
                    },
                ]}
            />,
        ),
}

/**
 * `item.className` with a CONTAINER variant (`@app-sm:col-start-2`) — a single leftover
 * pager card pinned to the right column (the previous card is missing). Must use the
 * container variant at the SAME tier `Grid.Base` uses for `columns` (`@app-sm`/`@app-md`/
 * `@app-lg`, NOT Tailwind's HALF-SIZE `@sm`/`@md`/`@lg`) so it kicks in AT THE RIGHT
 * MOMENT the grid reaches 2 columns. Narrow the window: it stays full-width while still
 * at 1 column.
 *
 * 2026-07-26 (teacher): changed from `@sm:col-start-2` → `@app-sm:col-start-2` —
 * `.PressableGroup` now builds its grid with `Grid.Base` (the FULL-SIZE `@app-*`
 * container scale), so the column-pin variant must match the SAME scale, otherwise it
 * fires at the wrong tier compared to when the grid actually switches to 2 columns.
 */
export const PagerPinRight: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="SurfaceCard.PressableGroup"
                tier="composite"
                leaf="PagerPinRight"
                annotate={ITEM_ANNOTATE}
                renderClassName="max-w-md"
                reason="The pin class must match the same container-query tier that columns itself uses, @app-sm rather than Tailwind's half-size @sm, otherwise the card would jump to the right column at a different moment than the grid actually reaches two columns."
                states={[
                    {
                        name: "items.length = 1, className = \"@app-sm:col-start-2\"",
                        why: "The single next-content card sits in the right-hand column once the container reaches two columns, and stays full width below that, because it is the only item and carries the column-start class itself. This is still one repeated Item, so the same composition covers a full grid or a lone pager card.",
                        code: `<SurfaceCard.PressableGroup
    ariaLabel="Go to previous or next content"
    columns={{ base: 1, sm: 2 }}
    items={[{ key: "next", href: "#", className: "@app-sm:col-start-2", content: <…/> }]}
/>`,
                        render: (
                            <SurfaceCard.PressableGroup
                                ariaLabel="Go to previous or next content"
                                columns={{ base: 1, sm: 2 }}
                                items={[
                                    {
                                        key: "next",
                                        href: "#",
                                        className: "@app-sm:col-start-2",
                                        content: (
                                            <div className="flex items-center justify-between gap-3">
                                                <Typography type="body-sm" weight="medium">Next content</Typography>
                                                {/* Navigation caret: phosphor CaretRightIcon size-3 muted, does NOT slide (§5a/§5b). */}
                                                <CaretRightIcon className="size-3 shrink-0 text-muted" aria-hidden focusable="false" />
                                            </div>
                                        ),
                                    },
                                ]}
                                showAnatomy
                            />
                        ),
                    },
                ]}
            />,
        ),
}

/**
 * Loading — `isSkeleton` draws its own GENERIC mirror grid, keeping the same
 * columns/gap/tile-chrome. No separate Skeleton outside it. `SkeletonTile` has no
 * story of its own (an internal mirror), so there's NO `storyId` to point at — the
 * panel drops the deps prop entirely for this leaf.
 */
export const Loading: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="SurfaceCard.PressableGroup"
                tier="composite"
                leaf="Loading"
                renderClassName="max-w-2xl"
                reason="Whoever owns a shape owns its resting state, so the group draws its own generic shimmer instead of pulling in a shared skeleton component that would need to be kept in sync by hand."
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "Every Item is replaced by a generic SkeletonTile that keeps the same columns, gap, and tile chrome as the real grid. The mirror stays generic rather than copying the real content's shape, because the group never assumes what a cell will eventually hold.",
                        code: `<SurfaceCard.PressableGroup
    ariaLabel="Mentors"
    columns={{ base: 1, sm: 2 }}
    items={[…]}
    isSkeleton
/>`,
                        render: (
                            <SurfaceCard.PressableGroup
                                ariaLabel="Mentors"
                                columns={{ base: 1, sm: 2 }}
                                items={profileItems}
                                isSkeleton
                                showAnatomy
                            />
                        ),
                    },
                ]}
            />,
        ),
}
