import type { LocalizedGuide } from "./types"
import { DOCKER_MACOS_GUIDE } from "./docker-macos"
import { DOCKER_WINDOWS_GUIDE } from "./docker-windows"
import { DOCKER_LINUX_GUIDE } from "./docker-linux"
import { K8S_MACOS_GUIDE } from "./k8s-macos"
import { K8S_WINDOWS_GUIDE } from "./k8s-windows"
import { K8S_LINUX_GUIDE } from "./k8s-linux"
import { RAG_MACOS_GUIDE } from "./rag-macos"
import { RAG_WINDOWS_GUIDE } from "./rag-windows"
import { RAG_LINUX_GUIDE } from "./rag-linux"

export type { LocalizedGuide }

/** The OS an install guide is written for (one Setup tab each). */
export type PrepareOs = "mac" | "win" | "linux"

/** Which lab's engine the guide installs. */
export type GuideLab = "docker" | "k8s" | "rag"

/** Every install guide, keyed by lab then OS. */
const INSTALL_GUIDES: Record<GuideLab, Record<PrepareOs, LocalizedGuide>> = {
    docker: { mac: DOCKER_MACOS_GUIDE, win: DOCKER_WINDOWS_GUIDE, linux: DOCKER_LINUX_GUIDE },
    k8s: { mac: K8S_MACOS_GUIDE, win: K8S_WINDOWS_GUIDE, linux: K8S_LINUX_GUIDE },
    rag: { mac: RAG_MACOS_GUIDE, win: RAG_WINDOWS_GUIDE, linux: RAG_LINUX_GUIDE },
}

/**
 * Resolve one lab's install guides to the viewer's locale, ready to hand to
 * `PlaygroundPrepare`.
 *
 * @param lab - Which engine the Setup step installs.
 * @param locale - Active app locale; anything other than `vi` reads English.
 * @returns Markdown source per OS tab, already locale-resolved.
 */
export const resolveInstallGuides = (lab: GuideLab, locale: string): Record<PrepareOs, string> => {
    const guides = INSTALL_GUIDES[lab]
    const pick = (guide: LocalizedGuide): string => (locale === "vi" ? guide.vi : guide.en)
    return { mac: pick(guides.mac), win: pick(guides.win), linux: pick(guides.linux) }
}
