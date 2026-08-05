/** The three OS guides a `flavor="infra"`/`"ollama"` engine install can offer. */
export type PlaygroundSetupOs = "mac" | "win" | "linux"

/** Which playground kind this setup guide is for — decides the STEP COUNT (see file header). */
export type PlaygroundSetupFlavor = "infra" | "ollama"

/** Props for {@link PlaygroundSetupSteps}. */
export interface PlaygroundSetupStepsProps {
    /** `"infra"` → 2 steps (pair, install). `"ollama"` → 3 (+ pull models). */
    flavor: PlaygroundSetupFlavor
    /** Display name of the engine being installed (e.g. `"Ollama"`, `"Docker Desktop"`). Falls back to a generic "engine" when absent. */
    engineName?: string
    /** Install guide markdown, one document per OS. */
    osGuides: Record<PlaygroundSetupOs, string>
    /** The command a learner runs on their machine to pair the local agent. */
    pairCommand: string
    /** Seconds left before the current pairing code expires. `null` → no expiry countdown to show. */
    pairingCodeSecondsLeft?: number | null
    /** `true` → the code has already expired; the countdown note switches to a "get a new code" prompt. */
    pairingCodeExpired?: boolean
    /** Requests a fresh pairing code. Omit to hide the rotate action entirely. */
    onRefreshPairingCode?: () => void
    /** `true` → the rotate button shows a spinner and blocks further presses. */
    isRefreshingPairingCode?: boolean
    /** Whether the local agent is currently paired. Drives the pairing step's chip AND the rotate-code confirm gate. */
    agentReady: boolean
    /** Whether the engine is installed and reachable. */
    engineReady: boolean
    /** Ollama only: whether the recommended generation model is pulled. */
    genModelReady?: boolean
    /** Ollama only: whether the fixed embedding model is pulled. */
    embedModelReady?: boolean
    /** Ollama only: the generation model chosen for this device's VRAM. Absent while the device isn't known yet. */
    recommendedGenModel?: string
    /** Ollama only: `false` → the pull-models step shows a "device configuration not yet detected" callout instead of commands. Defaults `true`. */
    deviceKnown?: boolean
    /** Extra detail shown once the engine is ready (e.g. detected version/path). */
    engineDetail?: string
    /** Re-checks every step's readiness. Shared by every step's own re-check button — omit to hide all of them. */
    onVerify?: () => void
    /** `true` → every step renders its shimmer mirror (see file header). */
    isSkeleton?: boolean
}
