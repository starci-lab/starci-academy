import type { Meta, StoryObj } from "@storybook/nextjs"
import { PlaygroundHubPage } from "@sb-components/starci/pages/PlaygroundHubPage/PlaygroundHubPage"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `PlaygroundHubPage` — the screen to land on the course's Playground hub, see
 * what it is for, and open a hands-on exercise. A screen owns a list of
 * functions: it calls blocks, places them in frames, and hands each typed data.
 * Two functions, in reading order: orient · browse the course's exercises and
 * open one. Only `isSkeleton` forks into its own leaf; having no exercises yet
 * is data handed to `PlaygroundExerciseGrid`, a state of the one `Default` leaf.
 */
const meta: Meta<typeof PlaygroundHubPage> = {
    title: "StarCi/Pages/PlaygroundHubPage/PlaygroundHubPage",
    component: PlaygroundHubPage,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof PlaygroundHubPage>

const EXERCISES = [
    { id: "docker-image", title: "Build and optimize a Docker image", stepCount: 6 },
    { id: "compose-stack", title: "Wire up services with Docker Compose", stepCount: 5 },
    { id: "k8s-deploy", title: "Deploy to a Kubernetes cluster", stepCount: 8 },
    { id: "k8s-debug", title: "Debug a Pod stuck in CrashLoop", stepCount: 4 },
]

const BASE = {
    title: "Playground",
    description: "Practice Docker and Kubernetes right in your browser, nothing to install.",
    onSelectExercise: () => {},
    exerciseGridAriaLabel: "Playground exercise list",
}

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "StackV": { tier: "frame", role: "the vertical frame owning the one seam on this screen, between the hub identity and the exercise grid", storyId: "frames-stack-stackv--default" },
    "PlaygroundHubHeader": { tier: "block", role: "orient: what this Playground hub is for", storyId: "starci-blocks-learn-playgroundhubheader-playgroundhubheader--default" },
    "PlaygroundExerciseGrid": { tier: "block", role: "browse the course's hands-on exercises and open one; its own empty-state branch covers having none yet", storyId: "starci-blocks-learn-playgroundexercisegrid-playgroundexercisegrid--default" },
}

/** LEAF — the screen's one shape: hub header, exercise grid. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="PlaygroundHubPage"
                tier="screen"
                leaf="Default"
                parts={[]}
                annotate={ANNOTATE}
                states={[
                    {
                        name: "exercises populated",
                        why: "The everyday shape: the hub identity sits above a full grid of the course's hands-on exercises, each tile ready to open. Every function of the screen is present, in the order the reader meets them.",
                        code: `<PlaygroundHubPage
    title="Playground"
    description="Practice Docker and Kubernetes right in your browser, nothing to install."
    exercises={exercises}
    onSelectExercise={handleSelect}
    exerciseGridAriaLabel="Playground exercise list"
/>`,
                        render: (
                            <PlaygroundHubPage
                                {...BASE}
                               
                                exercises={EXERCISES}
                            />
                        ),
                    },
                    {
                        name: "no exercises yet",
                        why: "The course has not published any Playground exercise yet. Nothing about the surrounding screen has to react to this; it is entirely `PlaygroundExerciseGrid`'s own empty-state branch — the header still orients the reader, it is only the grid underneath that swaps to a worded empty message.",
                        code: `<PlaygroundHubPage
    title="Playground"
    exercises={[]}
    onSelectExercise={handleSelect}
    exerciseGridAriaLabel="Playground exercise list"
/>`,
                        render: (
                            <PlaygroundHubPage
                                {...BASE}
                                exercises={[]}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — the caller flips `isSkeleton`; every block that can mirror itself does. */
export const Skeleton: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="PlaygroundHubPage"
                tier="screen"
                leaf="Prop `isSkeleton`"
                parts={[]}
                annotate={ANNOTATE}
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "Every block mirrors itself while the hub's first fetch is in flight — the header's title/description shimmer, and the exercise grid draws its own guessed four-tile mirror rather than showing an empty grid it has not confirmed yet.",
                        code: "<PlaygroundHubPage {...props} isSkeleton />",
                        render: (
                            <PlaygroundHubPage
                                {...BASE}
                               
                                isSkeleton
                                exercises={[]}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
