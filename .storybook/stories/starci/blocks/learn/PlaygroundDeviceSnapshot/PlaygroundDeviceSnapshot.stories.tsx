import type { Meta, StoryObj } from "@storybook/nextjs"
import { PlaygroundDeviceSnapshot, type PlaygroundDeviceInfo } from "@sb-components/starci/blocks/learn/PlaygroundDeviceSnapshot/PlaygroundDeviceSnapshot"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `PlaygroundDeviceSnapshot` — "Your machine": the paired agent's raw hardware
 * report turned into the same 4-cell `StatRibbon` the Lab route shows, so setup and
 * the live lab agree about what the machine can run. Reuses `StatRibbon`; the block
 * owns the domain judgement — bytes → GB rounding, the `win32`/`darwin`/`linux` →
 * "Windows"/"macOS"/"Linux" table, and the three sentences a GPU cell can say
 * depending on which of `gpu`/`vramTotalMb`/`vramFreeMb` came back. Every
 * `deviceInfo` combination and `isSkeleton` are states of the 4-cell shape.
 */
const meta: Meta<typeof PlaygroundDeviceSnapshot> = {
    title: "StarCi/Blocks/Learn/PlaygroundDeviceSnapshot/PlaygroundDeviceSnapshot",
    component: PlaygroundDeviceSnapshot,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof PlaygroundDeviceSnapshot>

const NVIDIA_DEVICE: PlaygroundDeviceInfo = {
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

const NO_GPU_DEVICE: PlaygroundDeviceInfo = {
    platform: "darwin",
    arch: "arm64",
    hostname: "stacy-macbook",
    cpuModel: "Apple M2",
    cpuCores: 8,
    totalMemBytes: 17_179_869_184,
    freeMemBytes: 5_368_709_120,
    gpu: null,
}

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "StatRibbon": { tier: "composite", role: "the 4-cell divider row this block feeds computed OS/CPU/RAM/GPU pairs into — the same composite the Lab route's stat panel renders", storyId: "composites-stats-statribbon--four-stats" },
    "Typography": { tier: "atom", role: "one of the block's own value/detail lines, real text or its own shimmer bar while isSkeleton", storyId: "atoms-text-typography-typography--loading" },
}

/** LEAF — the 4-cell ribbon: OS · CPU · RAM · GPU. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="PlaygroundDeviceSnapshot"
                tier="block"
                leaf="Default"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                states={[
                    {
                        name: "NVIDIA GPU, real data",
                        why: "The most common paired machine: a discrete NVIDIA card the agent could read via nvidia-smi, so the GPU cell carries both total and free VRAM. This is the shape the model-recommendation step downstream depends on to size the pull command.",
                        code: `<PlaygroundDeviceSnapshot deviceInfo={{
    platform: "win32",
    arch: "x64",
    hostname: "STACY-DESKTOP",
    cpuModel: "AMD Ryzen 7 7800X3D",
    cpuCores: 16,
    totalMemBytes: 34359738368,
    freeMemBytes: 18253611008,
    gpu: "NVIDIA GeForce RTX 5060",
    vramTotalMb: 8192,
    vramFreeMb: 6820,
}} />`,
                        render: (
                            <PlaygroundDeviceSnapshot

                               
                                deviceInfo={NVIDIA_DEVICE}
                            />
                        ),
                    },
                    {
                        name: "no GPU detected",
                        why: "A machine with no discrete card still gets all 4 cells — the GPU cell falls back to an em-dash value and the unknown-GPU sentence, never a missing cell. This is the CPU-only fallback the model recommendation reads as \"lightest tier\".",
                        code: `<PlaygroundDeviceSnapshot deviceInfo={{
    platform: "darwin",
    arch: "arm64",
    hostname: "stacy-macbook",
    cpuModel: "Apple M2",
    cpuCores: 8,
    totalMemBytes: 17179869184,
    freeMemBytes: 5368709120,
    gpu: null,
}} />`,
                        render: <PlaygroundDeviceSnapshot deviceInfo={NO_GPU_DEVICE} />,
                    },
                    {
                        name: "isSkeleton = true",
                        why: "The agent has paired but device:info hasn't landed yet. Every value/detail line shimmers while the fixed category words (\"CPU\", \"RAM\"…) stay real text, so the ribbon reads as loading its numbers rather than as a blank panel.",
                        code: "<PlaygroundDeviceSnapshot deviceInfo={nvidiaDevice} isSkeleton />",
                        render: <PlaygroundDeviceSnapshot deviceInfo={NVIDIA_DEVICE} isSkeleton />,
                    },
                ]}
            />
        </div>
    ),
}
