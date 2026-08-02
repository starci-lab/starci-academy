import type { Meta, StoryObj } from "@storybook/nextjs"
import { PlaygroundSetupSteps, type PlaygroundSetupOs } from "@sb-components/starci/blocks/learn/PlaygroundSetupSteps/PlaygroundSetupSteps"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — `PlaygroundSetupSteps`: the ordered setup guide for a playground — pair
 * the local agent, install the engine (an OS-tabbed guide), and — Ollama flavor
 * only — pull the VRAM-sized models. Each step carries its own status chip,
 * why-it-matters line, runnable command(s), and re-check action.
 *
 * TWO LEAVES, ONE PER `flavor` (§14d.2 — see the component's file header for why
 * this differs from `ChallengeBrief`'s single "one leaf, N optional sections"):
 * `flavor` is chosen once per PLAYGROUND KIND, not per render, so a caller wired
 * to `"infra"` never even carries the model-readiness props the third step
 * needs — the third `SurfaceCard` is a structural fact of the ollama leaf, not a
 * data condition that could show up on the infra one.
 */
const meta: Meta<typeof PlaygroundSetupSteps> = {
    title: "StarCi/Blocks/Learn/PlaygroundSetupSteps/PlaygroundSetupSteps",
    component: PlaygroundSetupSteps,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof PlaygroundSetupSteps>

const DOCKER_GUIDES: Record<PlaygroundSetupOs, string> = {
    mac: [
        "Install Docker Desktop via Homebrew:",
        "",
        "```bash",
        "brew install --cask docker",
        "```",
        "",
        "Open the Docker Desktop app once to start the background daemon.",
    ].join("\n"),
    win: [
        "Install with winget:",
        "",
        "```powershell",
        "winget install Docker.DockerDesktop",
        "```",
        "",
        "Restart your machine if prompted to enable WSL2.",
    ].join("\n"),
    linux: [
        "Install with the official script:",
        "",
        "```bash",
        "curl -fsSL https://get.docker.com | sh",
        "```",
        "",
        "Add the current user to the `docker` group, then log back in:",
        "",
        "```bash",
        "sudo usermod -aG docker $USER",
        "```",
    ].join("\n"),
}

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
        "Install with winget:",
        "",
        "```powershell",
        "winget install Ollama.Ollama",
        "```",
    ].join("\n"),
    linux: [
        "Install with the official script:",
        "",
        "```bash",
        "curl -fsSL https://ollama.com/install.sh | sh",
        "```",
    ].join("\n"),
}

const PAIR_COMMAND = "npx @starci/playground-agent pair --code PLYG-7F2K"

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "StackV": { tier: "frame", role: "the vertical frame stacking the steps, and again inside each step's own body", storyId: "frames-stack-stackv--default" },
    "StackH": { tier: "frame", role: "each step's action row (re-check / rotate-code buttons)", storyId: "frames-stack-stackh--default" },
    "SurfaceCard": { tier: "composite", role: "one step's card face — `label`/`action` draw the title + status chip, this block builds the entire body itself", storyId: "composites-cards-surfacecard-surfacecard--with-action" },
    "EnumChip": { tier: "composite", role: "each step's ready/pending status, from this block's own `STEP_STATUS_MAP`", storyId: "composites-chips-enumchip--overview" },
    "MarkdownContent": { tier: "composite", role: "a runnable command (fenced ```bash) or the selected OS's install guide, both through the same viewer", storyId: "composites-viewers-markdowncontent--compact" },
    "TabsExtended": { tier: "atom", role: "the OS switcher choosing which install guide renders underneath — a single group, not Toolbar's two-group nav", storyId: "atoms-navigation-tabs-tabsextended--default" },
    "Button": { tier: "atom", role: "a step's re-check action, or the pairing step's rotate-code action", storyId: "atoms-buttons-button-button--default" },
    "Callout": { tier: "composite", role: "an informational aside once data confirms it — engine detail, models already installed, or device not yet known", storyId: "composites-feedback-callout--default" },
    "Typography": { tier: "atom", role: "a step's why-it-matters line, its pairing-code countdown, or a model row's label", storyId: "atoms-text-typography-typography--overview" },
}

/** LEAF — infra flavor: 2 steps (pair, install). */
export const Infra: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="PlaygroundSetupSteps"
                tier="block"
                leaf="Infra flavor"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-2xl"
                states={[
                    {
                        name: "not paired yet, engine not installed",
                        why: "The starting point: nothing is done yet. Both steps show a \"Not done\" chip, the pairing code is still fresh (has a countdown), and the install step defaults to the macOS guide.",
                        code: `<PlaygroundSetupSteps
    flavor="infra"
    engineName="Docker Desktop"
    osGuides={dockerGuides}
    pairCommand={pairCommand}
    pairingCodeSecondsLeft={298}
    agentReady={false}
    engineReady={false}
    onVerify={onVerify}
    onRefreshPairingCode={onRefreshPairingCode}
/>`,
                        render: (
                            <PlaygroundSetupSteps

                               
                                flavor="infra"
                                engineName="Docker Desktop"
                                osGuides={DOCKER_GUIDES}
                                pairCommand={PAIR_COMMAND}
                                pairingCodeSecondsLeft={298}
                                agentReady={false}
                                engineReady={false}
                                onVerify={() => {}}
                                onRefreshPairingCode={() => {}}
                            />
                        ),
                    },
                    {
                        name: "paired, old code expired, engine installing",
                        why: "The agent is now paired (chip flips to \"Ready\"), so pressing \"Get a new code\" would gate through the confirm dialog instead of firing immediately. The old code has also expired, switching the countdown line to a danger prompt. The install step is still pending.",
                        code: `<PlaygroundSetupSteps
    flavor="infra"
    engineName="Docker Desktop"
    osGuides={dockerGuides}
    pairCommand={pairCommand}
    pairingCodeExpired
    agentReady
    engineReady={false}
    onVerify={onVerify}
    onRefreshPairingCode={onRefreshPairingCode}
/>`,
                        render: (
                            <PlaygroundSetupSteps
                                flavor="infra"
                                engineName="Docker Desktop"
                                osGuides={DOCKER_GUIDES}
                                pairCommand={PAIR_COMMAND}
                                pairingCodeExpired
                                agentReady
                                engineReady={false}
                                onVerify={() => {}}
                                onRefreshPairingCode={() => {}}
                            />
                        ),
                    },
                    {
                        name: "both steps ready",
                        why: "Both steps read ready. The install step now also shows a success callout with the detected engine detail — only possible once `engineReady` is true, never guessed ahead of it.",
                        code: `<PlaygroundSetupSteps
    flavor="infra"
    engineName="Docker Desktop"
    osGuides={dockerGuides}
    pairCommand={pairCommand}
    agentReady
    engineReady
    engineDetail="Docker Desktop 4.31 · detected at /usr/local/bin/docker"
    onVerify={onVerify}
/>`,
                        render: (
                            <PlaygroundSetupSteps
                                flavor="infra"
                                engineName="Docker Desktop"
                                osGuides={DOCKER_GUIDES}
                                pairCommand={PAIR_COMMAND}
                                agentReady
                                engineReady
                                engineDetail="Docker Desktop 4.31 · detected at /usr/local/bin/docker"
                                onVerify={() => {}}
                            />
                        ),
                    },
                    {
                        name: "isSkeleton = true",
                        why: "Both steps render their shimmer mirror — chip, why-line, command/OS-tab placeholders, and skeleton buttons — before any readiness data has loaded.",
                        code: "<PlaygroundSetupSteps flavor=\"infra\" osGuides={dockerGuides} pairCommand={pairCommand} agentReady={false} engineReady={false} isSkeleton />",
                        render: (
                            <PlaygroundSetupSteps
                                flavor="infra"
                                osGuides={DOCKER_GUIDES}
                                pairCommand={PAIR_COMMAND}
                                agentReady={false}
                                engineReady={false}
                                isSkeleton
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — ollama flavor: 3 steps (pair, install, pull models). */
export const Ollama: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="PlaygroundSetupSteps"
                tier="block"
                leaf="Ollama flavor"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-2xl"
                states={[
                    {
                        name: "just starting — not paired yet, machine spec unknown",
                        why: "Nothing is done yet AND the device isn't known: the third step shows the device-unknown callout instead of a model recommendation, since there is nothing to recommend without a VRAM reading yet.",
                        code: `<PlaygroundSetupSteps
    flavor="ollama"
    engineName="Ollama"
    osGuides={ollamaGuides}
    pairCommand={pairCommand}
    pairingCodeSecondsLeft={298}
    agentReady={false}
    engineReady={false}
    deviceKnown={false}
    onVerify={onVerify}
    onRefreshPairingCode={onRefreshPairingCode}
/>`,
                        render: (
                            <PlaygroundSetupSteps

                               
                                flavor="ollama"
                                engineName="Ollama"
                                osGuides={OLLAMA_GUIDES}
                                pairCommand={PAIR_COMMAND}
                                pairingCodeSecondsLeft={298}
                                agentReady={false}
                                engineReady={false}
                                deviceKnown={false}
                                onVerify={() => {}}
                                onRefreshPairingCode={() => {}}
                            />
                        ),
                    },
                    {
                        name: "engine ready, pulling models based on VRAM",
                        why: "Agent and engine are both ready, the device is now known, and a generation model has been recommended for this machine's VRAM. Neither model is pulled yet, so the third step shows the two runnable `ollama pull` commands — one for the recommended generation model, one for the fixed embedding model this block always offers.",
                        code: `<PlaygroundSetupSteps
    flavor="ollama"
    engineName="Ollama"
    osGuides={ollamaGuides}
    pairCommand={pairCommand}
    agentReady
    engineReady
    engineDetail="Ollama 0.3.6 · GPU 8GB VRAM"
    deviceKnown
    recommendedGenModel="qwen2.5:7b"
    onVerify={onVerify}
/>`,
                        render: (
                            <PlaygroundSetupSteps
                                flavor="ollama"
                                engineName="Ollama"
                                osGuides={OLLAMA_GUIDES}
                                pairCommand={PAIR_COMMAND}
                                agentReady
                                engineReady
                                engineDetail="Ollama 0.3.6 · GPU 8GB VRAM"
                                deviceKnown
                                recommendedGenModel="qwen2.5:7b"
                                onVerify={() => {}}
                            />
                        ),
                    },
                    {
                        name: "everything ready",
                        why: "All three steps read ready, including both models — the third step now shows the models-already-installed callout instead of the pull commands.",
                        code: `<PlaygroundSetupSteps
    flavor="ollama"
    engineName="Ollama"
    osGuides={ollamaGuides}
    pairCommand={pairCommand}
    agentReady
    engineReady
    engineDetail="Ollama 0.3.6 · GPU 8GB VRAM"
    deviceKnown
    recommendedGenModel="qwen2.5:7b"
    genModelReady
    embedModelReady
    onVerify={onVerify}
/>`,
                        render: (
                            <PlaygroundSetupSteps
                                flavor="ollama"
                                engineName="Ollama"
                                osGuides={OLLAMA_GUIDES}
                                pairCommand={PAIR_COMMAND}
                                agentReady
                                engineReady
                                engineDetail="Ollama 0.3.6 · GPU 8GB VRAM"
                                deviceKnown
                                recommendedGenModel="qwen2.5:7b"
                                genModelReady
                                embedModelReady
                                onVerify={() => {}}
                            />
                        ),
                    },
                    {
                        name: "isSkeleton = true",
                        why: "All three steps render their shimmer mirror at once, including the pull-models step's two command placeholders — the block cannot yet know whether either model will turn out ready.",
                        code: "<PlaygroundSetupSteps flavor=\"ollama\" osGuides={ollamaGuides} pairCommand={pairCommand} agentReady={false} engineReady={false} isSkeleton />",
                        render: (
                            <PlaygroundSetupSteps
                                flavor="ollama"
                                osGuides={OLLAMA_GUIDES}
                                pairCommand={PAIR_COMMAND}
                                agentReady={false}
                                engineReady={false}
                                isSkeleton
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
