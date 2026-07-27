import type { ReactNode } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Avatar, AvatarFallback, Typography } from "@heroui/react"
import { CaretRightIcon, FolderOpenIcon } from "@phosphor-icons/react"
import { SurfaceCard, type SurfaceCardPressableGroupItem } from "@sb-components/layouts/cards/SurfaceCard/SurfaceCard"
import type { VerdictBandVariant } from "@sb-components/layouts/cards/verdict-band"
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
 */
const meta: Meta<typeof SurfaceCard.PressableGroup> = {
    title: "Layouts/Cards/SurfaceCard/SurfaceCard.PressableGroup",
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

/** Plain canvas for each leaf's anatomy panel. */
const shell = (node: ReactNode) => <div className="p-8"><div className="max-w-2xl">{node}</div></div>

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
        tier: "primitive",
        role: "SurfaceCard.Pressable repeated — its own story lives at SurfaceCard.Pressable/Default.",
        storyId: "layouts-cards-surfacecard-surfacecard-pressable--default",
    },
}

const VERDICTS: Array<VerdictBandVariant> = ["success", "warning", "danger", "accent"]

/** Default — `items` is DATA (a REPEATING list forbids children); the whole grid is ONE labelled unit. */
export const Default: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="SurfaceCard.PressableGroup"
                tier="primitive"
                leaf="Default"
                annotate={ITEM_ANNOTATE}
                reason="Grid of SurfaceCard.Pressable cards: the whole group is ONE labelled unit (role=group + aria-label), and each cell is a repeated Item. A REPEATING list → `items` must be DATA, never children (khung API law)."
                code={`<SurfaceCard.PressableGroup
  ariaLabel="Mentors"
  columns={{ base: 1, sm: 2 }}
  items={[
    { key: "SC", label: "StarCi Academy", onPress: () => {}, content: profileTile(…) },
    { key: "QN", label: "Quang Nguyen", onPress: () => {}, content: profileTile(…) },
  ]}
/>`}
            >
                <SurfaceCard.PressableGroup ariaLabel="Mentors" columns={{ base: 1, sm: 2 }} items={profileItems} showAnatomy />
            </BlockAnatomy>,
        ),
}

/**
 * `columns` — column count follows CONTAINER WIDTH (container query `@app-sm`/`@app-md`/
 * `@app-lg`…), NOT viewport: the same grid can sit in a wide page column or a 256px
 * rail. Narrow the window to see the two frames below reflow INDEPENDENTLY of each
 * other.
 */
export const Columns: Story = {
    render: () => (
        <div className="flex flex-col gap-6 p-8">
            <BlockAnatomy
                name="SurfaceCard.PressableGroup"
                tier="primitive"
                leaf="Columns"
                annotate={ITEM_ANNOTATE}
                note="Same composition as leaf Default — `columns` only swaps the grid-template by CONTAINER width, no new part."
                code={`<SurfaceCard.PressableGroup
  ariaLabel="Mentors"
  columns={{ base: 1, sm: 2, lg: 4 }}
  items={[…]}
/>`}
            >
                <div className="flex flex-col gap-4">
                    <div className="max-w-2xl">
                        <Typography type="body-xs" color="muted">wide container → up to 4 columns</Typography>
                        <SurfaceCard.PressableGroup
                            ariaLabel="Mentors (wide container)"
                            columns={{ base: 1, sm: 2, lg: 4 }}
                            items={profileItems}
                            showAnatomy
                        />
                    </div>
                    <div className="max-w-xs">
                        <Typography type="body-xs" color="muted">narrow container → still 1 column, even on a wide viewport</Typography>
                        <SurfaceCard.PressableGroup
                            ariaLabel="Mentors (narrow container)"
                            columns={{ base: 1, sm: 2, lg: 4 }}
                            items={profileItems.slice(0, 2)}
                        />
                    </div>
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/** `gap` — spacing between cells is set at the GROUP LEVEL (the grid is always even), items don't adjust it themselves. */
export const Gap: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="SurfaceCard.PressableGroup"
                tier="primitive"
                leaf="Gap"
                annotate={ITEM_ANNOTATE}
                note="`gap` is a prop of the GROUP (items don't have one) — the grid always keeps an even gap; `2` for a dense grid, `3` (default) for a normal one."
                code={`<SurfaceCard.PressableGroup gap={2} ariaLabel="Mentors" items={[…]} />
<SurfaceCard.PressableGroup gap={3} ariaLabel="Mentors" items={[…]} />  // default`}
            >
                <div className="flex flex-col gap-4">
                    <SurfaceCard.PressableGroup ariaLabel="Mentors (gap 2)" columns={{ base: 1, sm: 2 }} gap={2} items={profileItems.slice(0, 2)} showAnatomy />
                    <SurfaceCard.PressableGroup ariaLabel="Mentors (gap 3)" columns={{ base: 1, sm: 2 }} gap={3} items={profileItems.slice(2)} />
                </div>
            </BlockAnatomy>,
        ),
}

/** `item.icon` — a BARE icon slot: the group pins `size-5` + a muted colour in one place (§4/§5a), the call site never sets a class itself. */
export const WithIcon: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="SurfaceCard.PressableGroup"
                tier="primitive"
                leaf="WithIcon"
                annotate={ITEM_ANNOTATE}
                note="`icon` is passed BARE, the group owns its size/color; `iconPosition` only flips the side (leading default / trailing) — still one Item part."
                code={`<SurfaceCard.PressableGroup
  ariaLabel="Resources"
  items={[
    { key: "docs", icon: <FolderOpenIcon />, content: <Typography type="body-sm">Docs</Typography>, onPress: () => {} },
    { key: "labs", icon: <FolderOpenIcon />, iconPosition: "trailing", content: <Typography type="body-sm">Labs</Typography>, onPress: () => {} },
  ]}
/>`}
            >
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
            </BlockAnatomy>,
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
                tier="primitive"
                leaf="KeyboardShortcut"
                annotate={ITEM_ANNOTATE}
                note="Same composition as leaf Default — `keyboardShortcut` only adds a GROUP-level 1–N shortcut, no change to the parts tree."
                code={`<SurfaceCard.PressableGroup
  ariaLabel="Select a mentor by number key"
  keyboardShortcut
  items={[…]}
/>`}
            >
                <SurfaceCard.PressableGroup
                    ariaLabel="Select a mentor by number key"
                    columns={{ base: 1, sm: 2 }}
                    items={profileItems}
                    keyboardShortcut
                    showAnatomy
                />
            </BlockAnatomy>,
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
                tier="primitive"
                leaf="Verdict"
                annotate={ITEM_ANNOTATE}
                note="Same composition as leaf Default — `withVerdict` only overlays a DATA color band on each Item's edge, no new part."
                code={`<SurfaceCard.PressableGroup
  ariaLabel="Mentors by status"
  items={items.map((item, i) => ({ ...item, withVerdict: { enable: true, variant: VERDICTS[i] } }))}
/>`}
            >
                <SurfaceCard.PressableGroup
                    ariaLabel="Mentors by status"
                    columns={{ base: 1, sm: 2 }}
                    items={profileItems.map((item, index) => ({
                        ...item,
                        withVerdict: { enable: true, variant: VERDICTS[index] },
                    }))}
                    showAnatomy
                />
            </BlockAnatomy>,
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
    render: () => (
        <div className="p-8">
            <div className="max-w-md">
                <BlockAnatomy
                    name="SurfaceCard.PressableGroup"
                    tier="primitive"
                    leaf="PagerPinRight"
                    annotate={ITEM_ANNOTATE}
                    note="Only 1 Item pinned via `@app-sm:col-start-2` — still the same Item part; the pin class must be the CONTAINER variant matching `columns` (`@app-sm:`), not a viewport one."
                    code={`<SurfaceCard.PressableGroup
  ariaLabel="Go to previous or next content"
  columns={{ base: 1, sm: 2 }}
  items={[{ key: "next", href: "#", className: "@app-sm:col-start-2", content: <…/> }]}
/>`}
                >
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
                </BlockAnatomy>
            </div>
        </div>
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
                tier="primitive"
                leaf="Loading"
                note="`isSkeleton` swaps every Item for a GENERIC SkeletonTile (avatar + 2 lines), keeping columns/gap/tile-chrome — it does not assume the real content's shape."
                code={`<SurfaceCard.PressableGroup
  ariaLabel="Mentors"
  columns={{ base: 1, sm: 2 }}
  items={[…]}
  isSkeleton
/>`}
            >
                <SurfaceCard.PressableGroup
                    ariaLabel="Mentors"
                    columns={{ base: 1, sm: 2 }}
                    items={profileItems}
                    isSkeleton
                    showAnatomy
                />
            </BlockAnatomy>,
        ),
}
