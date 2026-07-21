import type { Meta, StoryObj } from "@storybook/nextjs"
import { TagChips } from "./TagChips"

const meta: Meta<typeof TagChips> = {
    title: "Primitives/Chip/TagChips",
    component: TagChips,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof TagChips>

/**
 * Empty: no tags → renders NOTHING (not even the +N counter, which only appears
 * when the overflow count > 0). This is the component's real empty behaviour — a
 * tag row simply collapses, so no EmptyState primitive is used.
 */
export const Empty: Story = {
    render: () => (
        <div className="p-8">
            <TagChips tags={[]} />
        </div>
    ),
}

/** Single tag: e.g. a post that just got its first topic label. */
export const SingleTag: Story = {
    render: () => (
        <div className="p-8">
            <TagChips tags={["nestjs"]} />
        </div>
    ),
}

/** At maxVisible (no overflow): exactly the default 3 — every tag shows, no +N chip. */
export const AtMaxVisible: Story = {
    render: () => (
        <div className="p-8">
            <TagChips tags={["typescript", "nodejs", "postgresql"]} />
        </div>
    ),
}

/**
 * Overflow: a long tag list — only the first 3 show, the rest collapse into a +N chip;
 * hover the +N chip to open a tooltip listing every tag.
 */
export const Overflow: Story = {
    render: () => (
        <div className="p-8">
            <TagChips
                tags={[
                    "system-design",
                    "microservices",
                    "docker",
                    "kubernetes",
                    "graphql",
                    "keycloak",
                    "rag",
                ]}
            />
        </div>
    ),
}

/** Custom maxVisible: a roomier area (a big card) → raise maxVisible to 5 before collapsing. */
export const CustomMaxVisible: Story = {
    render: () => (
        <div className="p-8">
            <TagChips
                tags={[
                    "javascript",
                    "react",
                    "nextjs",
                    "tailwindcss",
                    "heroui",
                    "vitest",
                    "playwright",
                    "ci-cd",
                ]}
                maxVisible={5}
            />
        </div>
    ),
}

/**
 * Base-chip variants: `variant` is passed straight down to each `Chip`. `soft`
 * (default) for tags over a surface; `tertiary`/`primary` when the cluster should
 * blend in more softly or stand out more, per surrounding context.
 */
export const Variants: Story = {
    render: () => (
        <div className="flex flex-col gap-3 p-8">
            <TagChips tags={["frontend", "backend", "ai", "vector-db"]} variant="soft" />
            <TagChips tags={["frontend", "backend", "ai", "vector-db"]} variant="tertiary" />
            <TagChips tags={["frontend", "backend", "ai", "vector-db"]} variant="primary" />
        </div>
    ),
}
