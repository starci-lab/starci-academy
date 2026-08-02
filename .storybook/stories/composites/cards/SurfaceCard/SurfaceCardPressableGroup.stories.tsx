import type { ReactNode } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Avatar, AvatarFallback, Typography } from "@heroui/react"
import { CaretRightIcon, FolderOpenIcon } from "@phosphor-icons/react"
import { SurfaceCardPressableGroup, type SurfaceCardPressableGroupItem } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"
/**
 * `SurfaceCardPressableGroup` — lays out and rebuilds a `SurfaceCard` tile per `items` entry.
 * Owns group-level state: `items` mapping, `columns` (container query) and `gap` (shared
 * {@link GridColumns}/`AllowedGap` from `Grid`), the icon slot's size/colour, the 1–N keyboard
 * shortcut, the verdict band, pinning a grid position, and the whole-group skeleton. Per-cell
 * state (`selected`/`isDisabled`/`href` vs `onPress`) lives in `SurfaceCard`.
 */
const meta: Meta<typeof SurfaceCardPressableGroup> = {
    title: "Composites/Cards/SurfaceCard/SurfaceCardPressableGroup",
    component: SurfaceCardPressableGroup,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}
export default meta
type Story = StoryObj<typeof SurfaceCardPressableGroup>
/**
 * Standard mock content (C-fixture) for EVERY story: when the `content` cell is a card
 * with children inside, fill it with a ProfileCard — avatar + title + description. The
 * avatar goes INSIDE `content` (the `icon` slot is for plain icons only).
 */
const profileTile = (initials: string, title: string, description: string) => (
    <div data-tier="fixture" className="flex flex-row items-center gap-3">
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
    // A component reference (COMPOSITE-8), not a built node — the group calls this itself.
    content: () => profileTile(m.initials, m.title, m.description),
}))
/** Canvas padding only. Each leaf's own width goes through its own `renderClassName`, not wrapped here. */
const shell = (node: ReactNode) => <div data-tier="fixture" className="p-8">{node}</div>
/**
 * Live grid leaf: each cell is a REPEATED `SurfaceCard` (pressable — `onPress`/
 * `href` set) whose `content` the caller composes freely (a ProfileCard here). It
 * HAS its own story (`SurfaceCard/Pressable`), so it declares `storyId` to jump
 * to it.
 *
 * The tree structure is inferred from the DOM (`data-anat-part` attached by the
 * story itself below), and the hand-declared part is only the WHY.
 */
const ITEM_ANNOTATE: Record<string, AnatomyAnnotation> = {
    "SurfaceCard": {
        tier: "composite",
        role: "SurfaceCard repeated once per entry, each with onPress/href — its own pressable states live at SurfaceCard Pressable.",
        storyId: "composites-cards-surfacecard-surfacecard--pressable",
    },
    "Grid": {
        tier: "frame",
        role: "the responsive grid the group lays its cells on, built from Grid.",
        storyId: "frames-grid-grid--default",
    },
}
/**
 * Loading-only dep: the skeleton mirror tile has no story of its own (an internal
 * helper), so it stays undeclared as before — but the `Avatar.Base` it renders DOES
 * have a real story, and it has no `anatPart` of its own to self-name, so the frame
 * wraps it in a node named after the real component, `"Avatar"`.
 */
const SKELETON_ANNOTATE: Record<string, AnatomyAnnotation> = {
    "Avatar": {
        tier: "atom",
        role: "the leading avatar mirror inside each generic skeleton tile.",
        storyId: "atoms-display-avatar-avatar--default",
    },
}
/** Default — `items` is DATA (a REPEATING list forbids children); the whole grid is ONE labelled unit. */
export const Default: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="SurfaceCardPressableGroup"
                tier="composite"
                leaf="Default"
                annotate={ITEM_ANNOTATE}
                renderClassName="max-w-2xl"
                reason="The whole group renders as one labelled unit through role group plus an aria-label, and each cell is a repeated Item. Because the list repeats, items must arrive as data rather than JSX children, so a caller can never let the row count drift from the item count."
                states={[
                    {
                        name: "items = 4 mentor entries",
                        why: "Each object in items produces one repeated SurfaceCardPressable tile, so the four mentors lay out as four cards under the chosen columns. What each tile shows stays free-form, here a profile row built from a shared fixture, because the group only owns layout, never a cell's content.",
                        code: `<SurfaceCardPressableGroup
    ariaLabel="Mentors"
    columns={{ base: 1, sm: 2 }}
    items={[
        { key: "SC", label: "StarCi Academy", onPress: () => {}, content: profileTile(…) },
        { key: "QN", label: "Quang Nguyen", onPress: () => {}, content: profileTile(…) },
    ]}
/>`,
                        render: <SurfaceCardPressableGroup ariaLabel="Mentors" columns={{ base: 1, sm: 2 }} items={profileItems} />,
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
                name="SurfaceCardPressableGroup"
                tier="composite"
                leaf="Columns"
                annotate={ITEM_ANNOTATE}
                reason="Column count answers to the container's own width, not the viewport, so the same grid config can sit in a wide page column or a narrow rail and reflow independently of everything else on the page."
                states={[
                    {
                        name: "container width = wide (max-w-2xl)",
                        why: "All four mentor tiles lay out across four columns because the surrounding container is wide enough to satisfy the @app-lg breakpoint. Reaching a real four-column arrangement needs a genuinely wide host, which is why this state pins the container to max-w-2xl rather than leaving it unconstrained.",
                        code: `<div className="max-w-2xl">
    <SurfaceCardPressableGroup
        ariaLabel="Mentors (wide container)"
        columns={{ base: 1, sm: 2, lg: 4 }}
        items={[…]}
    />
</div>`,
                        render: (
                            <div data-tier="fixture" className="max-w-2xl">
                                <SurfaceCardPressableGroup
                                    ariaLabel="Mentors (wide container)"
                                    columns={{ base: 1, sm: 2, lg: 4 }}
                                    items={profileItems}
                                   
                                />
                            </div>
                        ),
                    },
                    {
                        name: "container width = narrow (max-w-xs)",
                        why: "The same columns config stays at a single column because the container never reaches the @app-sm breakpoint, even though the story runs on a wide viewport. Column count is a property of the box the grid stands in, not of the screen, so this state deliberately narrows only the container.",
                        code: `<div className="max-w-xs">
    <SurfaceCardPressableGroup
        ariaLabel="Mentors (narrow container)"
        columns={{ base: 1, sm: 2, lg: 4 }}
        items={[…].slice(0, 2)}
    />
</div>`,
                        render: (
                            <div data-tier="fixture" className="max-w-xs">
                                <SurfaceCardPressableGroup
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
                name="SurfaceCardPressableGroup"
                tier="composite"
                leaf="Gap"
                annotate={ITEM_ANNOTATE}
                renderClassName="max-w-2xl"
                reason="gap is a prop of the group, never of an item, so the grid always keeps one even spacing across every cell instead of letting a single tile push its neighbours around."
                states={[
                    {
                        name: "peers in one set",
                        why: "The cells sit close enough to read as members of one set rather than separate cards, which works when each tile is already visually distinct on its own, as a short profile row with an avatar is. Pick this step from the relationship and not from how full the grid looks.",
                        code: "<SurfaceCardPressableGroup gap={3} ariaLabel=\"Mentors\" columns={{ base: 1, sm: 2 }} items={[…].slice(0, 2)} />",
                        render: <SurfaceCardPressableGroup ariaLabel="Mentors (gap step 3)" columns={{ base: 1, sm: 2 }} gap={3} items={profileItems.slice(0, 2)} />,
                    },
                    {
                        name: "rows inside one surface",
                        why: "Each cell stands as its own surface inside the group, which is the default because a pressable tile is a thing a reader acts on separately. The composition is identical to the state above, so the only difference a reader sees is the claim the seam makes.",
                        code: "<SurfaceCardPressableGroup gap={4} ariaLabel=\"Mentors\" columns={{ base: 1, sm: 2 }} items={[…].slice(2)} />  // default",
                        render: <SurfaceCardPressableGroup ariaLabel="Mentors (gap step 4)" columns={{ base: 1, sm: 2 }} gap={4} items={profileItems.slice(2)} />,
                    },
                ]}
            />,
        ),
}
/** `icon`/`content` slot fixtures for {@link WithIcon} — component references (COMPOSITE-8), not built nodes. */
const FolderIcon = () => <FolderOpenIcon data-tier="fixture" />
const DocsContent = () => <Typography data-tier="fixture" type="body-sm" weight="medium">Docs</Typography>
const LabsContent = () => <Typography data-tier="fixture" type="body-sm" weight="medium">Labs</Typography>
/** `item.icon` — a BARE icon slot: the group pins `size-5` + a muted colour in one place (§4/§5a), the call site never sets a class itself. */
export const WithIcon: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="SurfaceCardPressableGroup"
                tier="composite"
                leaf="WithIcon"
                annotate={ITEM_ANNOTATE}
                renderClassName="max-w-2xl"
                reason="icon is passed bare, so the group owns its size and colour in one place; iconPosition only flips which side it sits on, and every cell in the grid still composes the exact same Item part."
                states={[
                    {
                        name: "item.icon set, iconPosition = leading (default) and trailing",
                        why: "Each tile shows a folder glyph beside its label, leading on the first item and trailing on the second, both drawn by the group at a fixed size and colour rather than a class the caller writes. The composition stays a single repeated Item either way, only the icon's side flips.",
                        code: `<SurfaceCardPressableGroup
    ariaLabel="Resources"
    columns={{ base: 1, sm: 2 }}
    items={[
        { key: "docs", icon: <FolderOpenIcon />, content: <Typography type="body-sm">Docs</Typography>, onPress: () => {} },
        { key: "labs", icon: <FolderOpenIcon />, iconPosition: "trailing", content: <Typography type="body-sm">Labs</Typography>, onPress: () => {} },
    ]}
/>`,
                        render: (
                            <SurfaceCardPressableGroup
                                ariaLabel="Resources"
                                columns={{ base: 1, sm: 2 }}
                               
                                items={[
                                    {
                                        key: "docs",
                                        icon: FolderIcon,
                                        content: DocsContent,
                                        onPress: () => {},
                                    },
                                    {
                                        key: "labs",
                                        icon: FolderIcon,
                                        iconPosition: "trailing",
                                        content: LabsContent,
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
                name="SurfaceCardPressableGroup"
                tier="composite"
                leaf="KeyboardShortcut"
                annotate={ITEM_ANNOTATE}
                renderClassName="max-w-2xl"
                reason="keyboardShortcut is opt-in because its listener lives on window, so only the one group that is genuinely the screen's main action should claim the number keys."
                states={[
                    {
                        name: "keyboardShortcut = true",
                        why: "Each tile gains a visible number badge from 1 through 4 and pressing that key activates the matching card, on top of the exact same repeated-Item composition as the Default leaf. The group can carry this because it is the main action on the screen, not a secondary widget competing for the same keys.",
                        code: `<SurfaceCardPressableGroup
    ariaLabel="Select a mentor by number key"
    keyboardShortcut
    columns={{ base: 1, sm: 2 }}
    items={[…]}
/>`,
                        render: (
                            <SurfaceCardPressableGroup
                                ariaLabel="Select a mentor by number key"
                                columns={{ base: 1, sm: 2 }}
                                items={profileItems}
                                keyboardShortcut
                               
                            />
                        ),
                    },
                ]}
            />,
        ),
}
/**
 * `item.withVerdict` — a DATA SIGNAL band on the left edge of each tile (the same
 * canonical band as `SectionCard` / `SurfaceCardList`), overlaid on the ProfileCard
 * content.
 */
export const Verdict: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="SurfaceCardPressableGroup"
                tier="composite"
                leaf="Verdict"
                annotate={ITEM_ANNOTATE}
                renderClassName="max-w-2xl"
                reason="withVerdict overlays the same canonical status band used by SectionCard and SurfaceCardList, so a status signal reads identically wherever a card family shows one, instead of every composite inventing its own colour."
                states={[
                    {
                        name: "item.withVerdict.variant = \"success\"",
                        why: "Both tiles gain a green left-edge band layered on top of the same profile content as every other leaf. A caller reaches for success when the group itself, not a decoration on top, needs to say a mentor is confirmed and in good standing.",
                        code: "<SurfaceCardPressableGroup ariaLabel=\"Mentors by status\" columns={{ base: 1, sm: 2 }} items={[…].map((item) => ({ ...item, withVerdict: { enable: true, variant: \"success\" } }))} />",
                        render: (
                            <SurfaceCardPressableGroup
                                ariaLabel="Mentors (status success)"
                                columns={{ base: 1, sm: 2 }}
                                items={profileItems.slice(0, 2).map((item) => ({
                                    ...item,
                                    withVerdict: { enable: true, variant: "success" },
                                }))}
                               
                            />
                        ),
                    },
                    {
                        name: "item.withVerdict.variant = \"warning\"",
                        why: "Both tiles gain an amber left-edge band instead, still overlaid on the identical profile content. Warning is the tone a caller reaches for when a mentor needs a second look, not the outright block that danger would signal.",
                        code: "<SurfaceCardPressableGroup ariaLabel=\"Mentors by status\" columns={{ base: 1, sm: 2 }} items={[…].map((item) => ({ ...item, withVerdict: { enable: true, variant: \"warning\" } }))} />",
                        render: (
                            <SurfaceCardPressableGroup
                                ariaLabel="Mentors (status warning)"
                                columns={{ base: 1, sm: 2 }}
                                items={profileItems.slice(0, 2).map((item) => ({
                                    ...item,
                                    withVerdict: { enable: true, variant: "warning" },
                                }))}
                            />
                        ),
                    },
                    {
                        name: "item.withVerdict.variant = \"danger\"",
                        why: "Both tiles gain a red left-edge band, the strongest tone in the set. A caller reaches for danger when a mentor is unavailable or flagged, a state a reader must notice before pressing the tile.",
                        code: "<SurfaceCardPressableGroup ariaLabel=\"Mentors by status\" columns={{ base: 1, sm: 2 }} items={[…].map((item) => ({ ...item, withVerdict: { enable: true, variant: \"danger\" } }))} />",
                        render: (
                            <SurfaceCardPressableGroup
                                ariaLabel="Mentors (status danger)"
                                columns={{ base: 1, sm: 2 }}
                                items={profileItems.slice(0, 2).map((item) => ({
                                    ...item,
                                    withVerdict: { enable: true, variant: "danger" },
                                }))}
                            />
                        ),
                    },
                    {
                        name: "item.withVerdict.variant = \"accent\"",
                        why: "Both tiles gain the brand accent band, the neutral highlight of the set rather than a pass or fail read. A caller reaches for accent to call attention to a mentor, for example a featured pick, without claiming any status judgement.",
                        code: "<SurfaceCardPressableGroup ariaLabel=\"Mentors by status\" columns={{ base: 1, sm: 2 }} items={[…].map((item) => ({ ...item, withVerdict: { enable: true, variant: \"accent\" } }))} />",
                        render: (
                            <SurfaceCardPressableGroup
                                ariaLabel="Mentors (status accent)"
                                columns={{ base: 1, sm: 2 }}
                                items={profileItems.slice(0, 2).map((item) => ({
                                    ...item,
                                    withVerdict: { enable: true, variant: "accent" },
                                }))}
                            />
                        ),
                    },
                ]}
            />,
        ),
}
/**
 * A single leftover pager card, spanning the full row — `span={2}` (via
 * `classNames: ["col-span-2"]`) is the only placement lever `Grid` exposes
 * (§13z on `Grid.tsx`). A raw column-start class (the old `@app-sm:col-start-2`,
 * reached through `item.className`) used to pin a lone card to the right column
 * instead — that was the exact escape hatch that broke mobile in the old
 * `GroupPressableCard` (the mentor's call, recorded in `Grid.tsx`), and it is
 * doubly unavailable now: `Grid` never grew a start-position prop, and
 * `SurfaceCardPressableGroupItem.className` is gone too (COMPOSITE-4 —
 * `classNames: Array<AllowedClassName>`, a closed union with no column-start
 * member). A lone card now spans the row instead of being pinned to one side of it.
 */
/** `content` slot fixture for {@link PagerFullWidth} — a component reference (COMPOSITE-8), not a built node. */
const NextContent = () => (
    <div data-tier="fixture" className="flex items-center justify-between gap-3">
        <Typography type="body-sm" weight="medium">Next content</Typography>
        {/* Navigation caret: phosphor CaretRightIcon size-3 muted, does NOT slide (§5a/§5b). */}
        <CaretRightIcon className="size-3 shrink-0 text-muted" aria-hidden focusable="false" />
    </div>
)
export const PagerFullWidth: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="SurfaceCardPressableGroup"
                tier="composite"
                leaf="PagerFullWidth"
                annotate={ITEM_ANNOTATE}
                renderClassName="max-w-md"
                reason="Grid's only placement lever is span (col-span-2, capped there on purpose) — a raw column-start class doesn't exist in the closed classNames union, so a lone leftover card spans the full row instead of pinning to one side of it."
                states={[
                    {
                        name: "items.length = 1, classNames = [\"col-span-2\"]",
                        why: "The single next-content card spans both grid tracks once the container reaches two columns, and stays full width below that too, because it is the only item and carries the span class itself. This is still one repeated Item, so the same composition covers a full grid or a lone pager card.",
                        code: `<SurfaceCardPressableGroup
    ariaLabel="Go to previous or next content"
    columns={{ base: 1, sm: 2 }}
    items={[{ key: "next", href: "#", classNames: ["col-span-2"], content: <…/> }]}
/>`,
                        render: (
                            <SurfaceCardPressableGroup
                                ariaLabel="Go to previous or next content"
                                columns={{ base: 1, sm: 2 }}
                                items={[
                                    {
                                        key: "next",
                                        href: "#",
                                        classNames: ["col-span-2"],
                                        content: NextContent,
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
 * Loading — `isSkeleton` draws its own GENERIC mirror grid, keeping the same
 * columns/gap/tile-chrome. No separate Skeleton outside it. `SkeletonTile` itself has no
 * story of its own (an internal mirror), so it stays undeclared — but the `Avatar.Base`
 * it renders inside DOES have a real story, so that ONE part is declared.
 */
export const Loading: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="SurfaceCardPressableGroup"
                tier="composite"
                leaf="Loading"
                annotate={SKELETON_ANNOTATE}
                renderClassName="max-w-2xl"
                reason="Whoever owns a shape owns its resting state, so the group draws its own generic shimmer instead of pulling in a shared skeleton component that would need to be kept in sync by hand."
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "Every Item is replaced by a generic SkeletonTile that keeps the same columns, gap, and tile chrome as the real grid. The mirror stays generic rather than copying the real content's shape, because the group never assumes what a cell will eventually hold.",
                        code: `<SurfaceCardPressableGroup
    ariaLabel="Mentors"
    columns={{ base: 1, sm: 2 }}
    items={[…]}
    isSkeleton
/>`,
                        render: (
                            <SurfaceCardPressableGroup
                                ariaLabel="Mentors"
                                columns={{ base: 1, sm: 2 }}
                                items={profileItems}
                                isSkeleton
                               
                            />
                        ),
                    },
                ]}
            />,
        ),
}