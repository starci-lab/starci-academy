import type { Meta, StoryObj } from "@storybook/nextjs"
import { PlaygroundReadinessChecklist } from "@sb-components/starci/blocks/learn/PlaygroundReadinessChecklist/PlaygroundReadinessChecklist"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — `PlaygroundReadinessChecklist`: the consolidated "Machine status" list
 * — every playground prerequisite at a glance, one row each.
 *
 * REUSE, NOT A NEW SHAPE — a near-direct port of the existing `ReadinessChecklist`
 * block onto today's composite catalog: `SurfaceCardList`'s fixed row shape
 * (leading tile · title · subtitle · trailing chip), `IconTile` for the leading
 * glyph, `EnumChip` for the trailing status. See the component's own file header
 * for the full reuse contract and the two judgement calls (the block now owns
 * its ready/pending wording, and `kind` is domain vocabulary the block maps to
 * an icon, not a caller-supplied glyph).
 *
 * 📐 TWO LEAVES: `Default` (N rows, real content) and `Prop \`isSkeleton\``.
 * Per `2-leaf-states.md` §1, `isSkeleton` is a leaf at every tier — the owner
 * of the shape owns the skeleton (§12c) — even though no node grows or
 * disappears: every atom the block composes per row (`IconTile`, `EnumChip`)
 * swaps to its own shimmer, while `SurfaceCardList` mirrors the title/subtitle
 * text itself.
 */
const meta: Meta<typeof PlaygroundReadinessChecklist> = {
    title: "StarCi/Blocks/Learn/PlaygroundReadinessChecklist/PlaygroundReadinessChecklist",
    component: PlaygroundReadinessChecklist,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof PlaygroundReadinessChecklist>

const ITEMS = [
    {
        key: "engine",
        kind: "engine" as const,
        label: "Docker engine",
        readyDescription: "Running · v29.5.2",
        pendingDescription: "Not checked yet.",
        ready: true,
    },
    {
        key: "agent",
        kind: "agent" as const,
        label: "StarCi Agent",
        readyDescription: "The agent has paired with this session.",
        pendingDescription: "Run the pairing command to connect the agent.",
        ready: true,
    },
    {
        key: "genModel",
        kind: "genModel" as const,
        label: "Generation model",
        readyDescription: "qwen2.5-coder:7b selected via Ollama.",
        pendingDescription: "No generation model chosen for this session yet.",
        ready: false,
    },
    {
        key: "embedModel",
        kind: "embedModel" as const,
        label: "Embedding model",
        readyDescription: "bge-m3 selected via Ollama.",
        pendingDescription: "No embedding model chosen for this session yet.",
        ready: false,
    },
]

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "SurfaceCardList": { tier: "composite", role: "the bounded surface holding one row per prerequisite, owning the card face, row dividers, and its own skeleton mirror", storyId: "composites-cards-surfacecard-surfacecardlist--default" },
    "IconTile": { tier: "atom", role: "each row's leading tile — a success-toned check when ready, the prerequisite's own icon in neutral tone while pending", storyId: "atoms-display-icontile-icontile--default" },
    "EnumChip": { tier: "composite", role: "each row's trailing status chip, mapping the ready/pending enum to this block's own fixed Vietnamese copy", storyId: "composites-chips-enumchip--overview" },
}

/** LEAF — the only shape this block draws: a bounded list, one row per prerequisite. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="PlaygroundReadinessChecklist"
                tier="block"
                leaf="Default"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-md"
                states={[
                    {
                        name: "mixed ready/pending",
                        why: "The engine and the agent already paired, but neither model is picked yet — the realistic mid-setup shot of a playground session. Ready rows carry a success tile and chip; pending rows keep their own kind icon and a neutral chip, so the two states read apart at a glance without scanning every subtitle.",
                        code: "<PlaygroundReadinessChecklist items={items} />",
                        render: (
                            <PlaygroundReadinessChecklist

                               
                                items={ITEMS}
                            />
                        ),
                    },
                    {
                        name: "all ready",
                        why: "Every prerequisite is satisfied — the shape a learner sees right before the playground unlocks. Same four rows, only the tone/chip/icon per row changes, which is why this stays a state of the same leaf instead of a separate one.",
                        code: "<PlaygroundReadinessChecklist items={allReadyItems} />",
                        render: (
                            <PlaygroundReadinessChecklist
                                items={ITEMS.map((item) => ({ ...item, ready: true }))}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — `isSkeleton` is a leaf at every tier (§12c: the owner of the shape owns the skeleton). */
export const Skeleton: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="PlaygroundReadinessChecklist"
                tier="block"
                leaf="Prop `isSkeleton`"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-md"
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "The session's readiness state hasn't loaded yet, so every row's tile and chip swap to shimmer while the list keeps the exact box it will hand back once the real check lands. The flag reaches the real `IconTile`/`EnumChip` atoms directly rather than a parallel skeleton tree.",
                        code: "<PlaygroundReadinessChecklist items={items} isSkeleton />",
                        render: (
                            <PlaygroundReadinessChecklist

                               
                                items={ITEMS}
                                isSkeleton
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
