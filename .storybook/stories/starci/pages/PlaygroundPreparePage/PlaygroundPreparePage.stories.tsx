import type { Meta, StoryObj } from "@storybook/nextjs"
import { PlaygroundPreparePage } from "@sb-components/starci/pages/PlaygroundPreparePage/PlaygroundPreparePage"
import type { PlaygroundReadinessChecklistItem } from "@sb-components/starci/blocks/learn/PlaygroundReadinessChecklist/PlaygroundReadinessChecklist"
import type { PlaygroundDeviceInfo } from "@sb-components/starci/blocks/learn/PlaygroundDeviceSnapshot/PlaygroundDeviceSnapshot"
import type { PlaygroundSetupOs } from "@sb-components/starci/blocks/learn/PlaygroundSetupSteps/PlaygroundSetupSteps"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `PlaygroundPreparePage` — the screen to get one playground exercise ready
 * before entering it: pair the local agent, install the engine, pull models
 * when the flavor needs them, then press one CTA once every step is done. A
 * screen owns a list of functions: it calls blocks, places them in frames, and
 * hands each typed data. Five functions, in reading order: what exercise this
 * is and how to leave · the one primary decision (enter, once ready) · what
 * machine this runs on · the ordered setup work · a glance-back checklist.
 * `checklistItems` is the single source of truth — the enter banner's readiness
 * and each step's per-kind status are all derived from it. Uses
 * `AsyncContentEmpty` as a whole-screen swap, never the four-branch `.Base`.
 */
const meta: Meta<typeof PlaygroundPreparePage> = {
    title: "StarCi/Pages/PlaygroundPreparePage/PlaygroundPreparePage",
    component: PlaygroundPreparePage,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof PlaygroundPreparePage>

const OLLAMA_GUIDES: Record<PlaygroundSetupOs, string> = {
    mac: [
        "Install via Homebrew:",
        "",
        "```bash",
        "brew install ollama",
        "```",
        "",
        "Start the service:",
        "",
        "```bash",
        "ollama serve",
        "```",
    ].join("\n"),
    win: [
        "Install via winget:",
        "",
        "```powershell",
        "winget install Ollama.Ollama",
        "```",
    ].join("\n"),
    linux: [
        "Install via the official script:",
        "",
        "```bash",
        "curl -fsSL https://ollama.com/install.sh | sh",
        "```",
    ].join("\n"),
}

const PAIR_COMMAND = "npx @starci/playground-agent pair --code PLYG-7F2K"

const DEVICE: PlaygroundDeviceInfo = {
    platform: "win32",
    arch: "x64",
    hostname: "STACY-DESKTOP",
    cpuModel: "AMD Ryzen 7 7800X3D",
    cpuCores: 16,
    totalMemBytes: 34_359_738_368,
    freeMemBytes: 18_253_611_008,
    gpu: "NVIDIA GeForce RTX 5060",
    vramTotalMb: 8192,
    vramFreeMb: 6820,
}

const MIXED_ITEMS: Array<PlaygroundReadinessChecklistItem> = [
    {
        key: "agent",
        kind: "agent",
        label: "StarCi Agent",
        readyDescription: "The agent has paired with this session.",
        pendingDescription: "Run the pairing command to connect the agent.",
        ready: true,
    },
    {
        key: "engine",
        kind: "engine",
        label: "Ollama",
        readyDescription: "Running · v0.3.6",
        pendingDescription: "Ollama isn't installed yet.",
        ready: true,
    },
    {
        key: "genModel",
        kind: "genModel",
        label: "Generation model",
        readyDescription: "qwen2.5:7b downloaded.",
        pendingDescription: "The generation model for this session hasn't been downloaded yet.",
        ready: false,
    },
    {
        key: "embedModel",
        kind: "embedModel",
        label: "Embedding model",
        readyDescription: "bge-m3 downloaded.",
        pendingDescription: "The embedding model for this session hasn't been downloaded yet.",
        ready: false,
    },
]

const ALL_READY_ITEMS: Array<PlaygroundReadinessChecklistItem> = MIXED_ITEMS.map((item) => ({ ...item, ready: true }))

const BASE = {
    breadcrumbLabel: "Playground",
    onBack: () => {},
    title: "Debug a CrashLooping Pod",
    description: "Pair your machine, install Ollama, then enter the lab to diagnose a real Pod.",
    onEnter: () => {},
    flavor: "ollama" as const,
    engineName: "Ollama",
    osGuides: OLLAMA_GUIDES,
    pairCommand: PAIR_COMMAND,
    pairingCodeSecondsLeft: 298,
    onRefreshPairingCode: () => {},
    recommendedGenModel: "qwen2.5:7b",
    onVerify: () => {},
}

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "StackV": { tier: "frame", role: "the vertical frames owning every seam on this screen — between the identity header and the body, and between each block inside the body", storyId: "frames-stack-stackv--default" },
    "PlaygroundSetupHeader": { tier: "block", role: "what exercise is this and how to leave it — a back link to the Playground hub, title, one-line intro", storyId: "starci-blocks-learn-playgroundsetupheader-playgroundsetupheader--default" },
    "PlaygroundEnterBanner": { tier: "block", role: "the one primary decision — enter the room, reachable only once every checklist item is ready", storyId: "starci-blocks-learn-playgroundenterbanner-playgroundenterbanner--default" },
    "PlaygroundDeviceSnapshot": { tier: "block", role: "\"Your machine\" — the paired agent's hardware report as a 4-cell ribbon; a conditional leaf, only rendered once a snapshot exists", storyId: "starci-blocks-learn-playgrounddevicesnapshot-playgrounddevicesnapshot--default" },
    "PlaygroundSetupSteps": { tier: "block", role: "the ordered setup work itself — pair, install, and (ollama only) pull models, each with its own status/command/re-check", storyId: "starci-blocks-learn-playgroundsetupsteps-playgroundsetupsteps--ollama" },
    "PlaygroundReadinessChecklist": { tier: "block", role: "a glance-back list of every prerequisite this screen also derives the enter banner and setup steps' readiness from", storyId: "starci-blocks-learn-playgroundreadinesschecklist-playgroundreadinesschecklist--default" },
}

/** LEAF — the screen's everyday shape: identity, decision, device, steps, checklist. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="PlaygroundPreparePage"
                tier="screen"
                leaf="Default"
                parts={[]}
                annotate={ANNOTATE}
                states={[
                    {
                        name: "mid-setup — agent + engine ready, models still pending",
                        why: "The realistic mid-setup shot: the learner has already paired their machine and installed Ollama (both read \"Ready\" everywhere they appear — the enter banner, the setup steps, and the checklist all agree because they are derived from the same one list), but neither model is pulled yet, so the enter CTA stays disabled with a \"2 steps left\" status line.",
                        code: `<PlaygroundPreparePage
    title="Debug a CrashLooping Pod"
    checklistItems={items}
    deviceInfo={device}
    flavor="ollama"
    osGuides={ollamaGuides}
    pairCommand={pairCommand}
    onEnter={handleEnter}
    …
/>`,
                        render: (
                            <PlaygroundPreparePage
                                {...BASE}
                               
                                checklistItems={MIXED_ITEMS}
                                deviceInfo={DEVICE}
                                engineDetail="Ollama 0.3.6 · GPU 8GB VRAM"
                            />
                        ),
                    },
                    {
                        name: "everything is ready",
                        why: "Every checklist item reads ready. The enter banner flips to its success line and its CTA becomes pressable, the setup steps' status chips all read \"Ready\", and the pull-models step shows its models-already-installed callout instead of commands — four blocks agreeing off one array.",
                        code: `<PlaygroundPreparePage
    {...props}
    checklistItems={allReadyItems}
/>`,
                        render: (
                            <PlaygroundPreparePage
                                {...BASE}
                                checklistItems={ALL_READY_ITEMS}
                                deviceInfo={DEVICE}
                                engineDetail="Ollama 0.3.6 · GPU 8GB VRAM"
                            />
                        ),
                    },
                    {
                        name: "no device snapshot yet",
                        why: "Right after opening the screen, before the paired agent has reported a hardware snapshot: `PlaygroundDeviceSnapshot` is a conditional leaf, so it is simply absent rather than rendered empty, and the setup steps' pull-models step reads `deviceKnown = false` (derived from the same missing `deviceInfo`), showing its device-unknown callout instead of a model recommendation.",
                        code: `<PlaygroundPreparePage
    {...props}
    deviceInfo={undefined}
/>`,
                        render: (
                            <PlaygroundPreparePage
                                {...BASE}
                                checklistItems={MIXED_ITEMS}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — an INFRA-flavor exercise ⇒ two setup steps, no model checklist rows. */
export const InfraFlavor: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="PlaygroundPreparePage"
                tier="screen"
                leaf="Prop `flavor`"
                parts={[]}
                annotate={ANNOTATE}
                states={[
                    {
                        name: "flavor = \"infra\"",
                        why: "An infra exercise never carries model-readiness data at all — the checklist has only two rows (agent, engine), the setup steps block draws only its pair/install cards, and the enter banner's pending count reflects just those two.",
                        code: `<PlaygroundPreparePage
    {...props}
    flavor="infra"
    engineName="Docker Desktop"
    osGuides={dockerGuides}
    checklistItems={[agentItem, engineItem]}
/>`,
                        render: (
                            <PlaygroundPreparePage
                                {...BASE}
                               
                                flavor="infra"
                                engineName="Docker Desktop"
                                recommendedGenModel={undefined}
                                checklistItems={MIXED_ITEMS.filter((item) => item.kind === "agent" || item.kind === "engine")}
                                deviceInfo={DEVICE}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — the exercise id resolved to nothing ⇒ the ENTIRE screen is replaced. */
export const Empty: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="PlaygroundPreparePage"
                tier="screen"
                leaf="Empty"
                parts={[]}
                annotate={{
                    "Container": { tier: "frame", role: "the reading-width frame around the empty message, badged separately from the message it holds", storyId: "frames-container-container--default" },
                    "AsyncContentEmpty": { tier: "composite", role: "the whole-screen empty message shown when the exercise id resolved to nothing — this screen's one documented composite exception", storyId: "composites-async-asynccontent-asynccontentempty--basic" },
                }}
                states={[
                    {
                        name: "isEmpty = true",
                        why: "There is no header, no banner, no steps — the whole spine is swapped for one empty message, because an exercise id that resolved to nothing has nothing to prepare for either.",
                        code: "<PlaygroundPreparePage {...props} isEmpty />",
                        render: <PlaygroundPreparePage {...BASE} checklistItems={MIXED_ITEMS} isEmpty />,
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
                name="PlaygroundPreparePage"
                tier="screen"
                leaf="Prop `isSkeleton`"
                parts={[]}
                annotate={ANNOTATE}
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "Every composed block mirrors itself while the exercise's first fetch is in flight — the header's title/description, the enter banner's status line and CTA, the device ribbon's four cells, every setup step, and every checklist row all shimmer at once, with the exact box each will hand back once real data lands.",
                        code: "<PlaygroundPreparePage {...props} isSkeleton />",
                        render: (
                            <PlaygroundPreparePage
                                {...BASE}
                               
                                isSkeleton
                                checklistItems={MIXED_ITEMS}
                                deviceInfo={DEVICE}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
