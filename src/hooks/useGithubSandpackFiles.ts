"use client"

import useSWR from "swr"
import type { SandpackFiles } from "@codesandbox/sandpack-react"

const ALLOWED_EXTS = new Set([".tsx", ".ts", ".jsx", ".js", ".css"])
const SKIP_FILES = new Set(["package-lock.json", "yarn.lock", "pnpm-lock.yaml", "next-env.d.ts"])

export interface GithubSandpackResult {
    files: SandpackFiles
    dependencies: Record<string, string>
}

/** A single entry from the GitHub git-trees API. */
interface GitTreeEntry {
    /** Repo-relative path, e.g. "0-lesson/frontend/src/App.tsx". */
    path: string
    /** "blob" = file, "tree" = directory. */
    type: "blob" | "tree"
}

/** Parse owner/repo from a github.com base URL. */
const parseRepo = (baseUrl: string): { owner: string; repo: string } => {
    const [owner, repo] = baseUrl.replace("https://github.com/", "").split("/")
    return { owner, repo }
}

/**
 * Fetches an entire lesson frontend from GitHub in ONE git-trees API call
 * (recursive — every depth, no per-folder requests, so we never hit the
 * unauthenticated rate limit), then pulls each file's content from the raw CDN.
 */
const fetchGithubSandpack = async (
    githubBaseUrl: string,
    githubDir: string,
): Promise<GithubSandpackResult> => {
    const { owner, repo } = parseRepo(githubBaseUrl)
    const ref = "main"
    const dir = githubDir.replace(/^\/|\/$/g, "")

    // one recursive tree call returns the whole repo file list at every depth
    const treeUrl = `https://api.github.com/repos/${owner}/${repo}/git/trees/${ref}?recursive=1`
    const treeRes = await fetch(treeUrl, {
        headers: { Accept: "application/vnd.github+json" },
        cache: "no-store",
    })
    if (!treeRes.ok) throw new Error(`GitHub trees API ${treeRes.status}`)
    const tree: Array<GitTreeEntry> = (await treeRes.json()).tree ?? []

    // keep only files under the lesson dir, with an allowed extension
    const prefix = `${dir}/`
    const blobs = tree.filter(
        (entry) =>
            entry.type === "blob"
            && entry.path.startsWith(prefix)
            && !entry.path.includes("/node_modules/"),
    )

    const files: SandpackFiles = {}
    let dependencies: Record<string, string> = {}

    // fetch every file's content from the raw CDN (not the rate-limited API)
    await Promise.all(
        blobs.map(async (entry) => {
            const name = entry.path.slice(entry.path.lastIndexOf("/") + 1)
            const ext = name.slice(name.lastIndexOf("."))
            // sandbox-relative path (strip the lesson dir prefix)
            const relPath = entry.path.slice(prefix.length)
            const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${ref}/${entry.path}`

            // root package.json → merge deps + devDeps for Sandpack customSetup
            if (relPath === "package.json") {
                try {
                    const pkg = await (await fetch(rawUrl, { cache: "no-store" })).json()
                    dependencies = { ...(pkg.dependencies ?? {}), ...(pkg.devDependencies ?? {}) }
                } catch { /* ignore */ }
                return
            }

            if (!ALLOWED_EXTS.has(ext) || SKIP_FILES.has(name)) return

            const code = await (await fetch(rawUrl, { cache: "no-store" })).text()
            files[`/${relPath}`] = { code }
        }),
    )

    return { files, dependencies }
}

export const useGithubSandpackFiles = (
    githubBaseUrl: string | null | undefined,
    githubDir: string | null | undefined,
) => {
    const enabled = !!githubBaseUrl && !!githubDir
    const { data, isLoading, error } = useSWR<GithubSandpackResult>(
        enabled ? ["github-sandpack", githubBaseUrl, githubDir] : null,
        () => fetchGithubSandpack(githubBaseUrl!, githubDir!),
        { revalidateOnFocus: false, revalidateOnReconnect: false },
    )
    return { files: data?.files ?? {}, dependencies: data?.dependencies ?? {}, isLoading, error }
}
