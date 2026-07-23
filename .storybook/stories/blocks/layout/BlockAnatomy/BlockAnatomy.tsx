"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"
import type { ReactNode } from "react"
import { cn } from "@heroui/react"
import { SquaresFourIcon, TreeStructureIcon } from "@phosphor-icons/react"
import { AnatomyPanelContext, type AnatomyTier } from "../AnatomyOverlay/anatomy-context"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * STORYBOOK-LOCAL DESIGN SPEC — BlockAnatomy: the anatomy axis for ONE LEAF.
 *
 * ANATOMY IS PER-LEAF. A block has several LEAVES — distinct-composition
 * states/scenarios (a shape WITH ProgressMeter vs one WITHOUT · `loading` →
 * Skeleton · `error` → EmptyState · `empty` · `search-empty`). Each leaf is its
 * OWN Storybook story, and EACH wraps its render in its OWN BlockAnatomy — there
 * is NO single consolidated "Anatomy" story. This panel therefore describes ONE
 * leaf: the parts THAT leaf composes, nothing more.
 *
 * Two calm views, toggled by a segmented control:
 * - **Sơ đồ** — the leaf renders CLEAN; each part carries only a tiny numbered
 *   anchor (via {@link AnatomyOverlay} reading this panel's context). A legend
 *   maps number → name · tier · role. Content is never covered.
 * - **Cây** — no render: just this leaf's composition TREE (what contains what).
 *
 * Dev/spec only, NO `@/components` imports.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** One node of a leaf's composition. `children` nests a sub-block's own parts. */
export interface AnatomyNode {
    /** MUST match the `label` its {@link AnatomyOverlay} passes (e.g. `"TextField · Input"`). */
    name: string
    tier: AnatomyTier
    /** What this part does in this leaf. */
    role?: string
    /** Tone/state note for this part (e.g. `"warning"`). Shown as a chip. */
    state?: string
    children?: Array<AnatomyNode>
}

/** Props for the {@link BlockAnatomy} panel (ONE leaf). */
export interface BlockAnatomyProps {
    /** Block/design display name (header + tree root). */
    name: string
    tier: AnatomyTier
    /** THIS leaf's composed parts (children of the block root), in visual order. */
    parts: Array<AnatomyNode>
    /** THIS leaf's live render (pass the component in this exact state). */
    children: ReactNode
    /** Leaf label shown in the header (e.g. `"Đang tải"`, `"Có tiến độ"`). */
    leaf?: string
    /** Short one-liner: what makes THIS leaf's composition/shape what it is. */
    note?: ReactNode
    /** Optional fuller rationale for the whole composite (usually only on the main leaf). */
    reason?: ReactNode
}

type Mode = "diagram" | "tree"

const DOT: Record<AnatomyTier, string> = {
    primitive: "bg-accent",
    design: "bg-success",
    block: "bg-warning",
}
const BADGE: Record<AnatomyTier, string> = {
    primitive: "bg-accent text-accent-foreground",
    design: "bg-success text-success-foreground",
    block: "bg-warning text-warning-foreground",
}
const WORD: Record<AnatomyTier, string> = {
    primitive: "text-accent",
    design: "text-success",
    block: "text-warning",
}

/** A depth-first numbered part (root excluded). */
interface FlatPart {
    node: AnatomyNode
    n: number
}

/** Walk this leaf's parts depth-first: one number per unique name, in visual order. */
const buildIndex = (parts: Array<AnatomyNode>) => {
    const map = new Map<string, number>()
    const tierMap = new Map<string, AnatomyTier>()
    const flat: Array<FlatPart> = []
    let i = 0
    const walk = (nodes: Array<AnatomyNode>) => {
        nodes.forEach((node) => {
            if (!map.has(node.name)) {
                i += 1
                map.set(node.name, i)
                tierMap.set(node.name, node.tier)
                flat.push({ node, n: i })
            }
            if (node.children) {
                walk(node.children)
            }
        })
    }
    walk(parts)
    return { numberOf: (name: string) => map.get(name), tierOf: (name: string) => tierMap.get(name), flat }
}

/** A measured on-render badge — number + screen position relative to the render box. */
interface Mark {
    key: number
    n: number
    tier: AnatomyTier
    top: number
    left: number
}

/** Small numbered anchor chip — the SAME visual the overlay draws on the render. */
const NumBadge = ({ n, tier }: { n: number; tier: AnatomyTier }) => (
    <span
        className={cn(
            "flex h-[18px] min-w-[18px] shrink-0 items-center justify-center rounded-full px-1 font-mono text-xs leading-none",
            BADGE[tier],
        )}
    >
        {n}
    </span>
)

/** One tree row + its nested children (indented with a guide rail). */
const TreeRow = ({ node, numberOf }: { node: AnatomyNode; numberOf: (name: string) => number | undefined }) => {
    const n = numberOf(node.name)
    return (
        <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2 rounded-lg px-1.5 py-1 hover:bg-default-100">
                <span className={cn("size-2 shrink-0 rounded-full", DOT[node.tier])} />
                {n !== undefined ? <NumBadge n={n} tier={node.tier} /> : null}
                <span className="font-mono text-xs text-foreground">{node.name}</span>
                {node.role ? <span className="text-xs text-muted">{`· ${node.role}`}</span> : null}
                {node.state ? (
                    <span className="ml-auto rounded border border-default-200 px-1.5 py-0.5 text-xs text-muted">{node.state}</span>
                ) : null}
            </div>
            {node.children ? (
                <div className="ml-[11px] flex flex-col gap-0.5 border-l border-default-200 pl-3.5">
                    {node.children.map((child) => (
                        <TreeRow key={child.name} node={child} numberOf={numberOf} />
                    ))}
                </div>
            ) : null}
        </div>
    )
}

/**
 * BlockAnatomy — a two-tab (Sơ đồ / Cây) anatomy panel for ONE leaf. See the file
 * header for the per-leaf model.
 *
 * @param props - {@link BlockAnatomyProps}
 */
export const BlockAnatomy = ({ name, tier, parts, children, leaf, note, reason }: BlockAnatomyProps) => {
    const [mode, setMode] = useState<Mode>("diagram")
    const { numberOf, tierOf, flat } = useMemo(() => buildIndex(parts), [parts])
    const rootNode: AnatomyNode = { name, tier, role: leaf, children: parts }

    // Measured badges: the render box is `relative`; each part element the component
    // tags with `data-anat-part="Name"` gets a numbered badge drawn at its corner —
    // NO wrapper around the part, so nothing shifts. Recompute on layout changes.
    const boxRef = useRef<HTMLDivElement>(null)
    const [marks, setMarks] = useState<Array<Mark>>([])
    // Which part number is SELECTED — click a part (or legend row) to spotlight it, click
    // again to clear. Links render badges ↔ legend rows.
    const [selected, setSelected] = useState<number | null>(null)
    const itemsRef = useRef<Array<{ n: number; target: HTMLElement }>>([])

    // Changing leaf/mode clears the selection.
    useEffect(() => {
        setSelected(null)
    }, [mode, parts])
    useEffect(() => {
        if (mode !== "diagram") {
            setMarks([])
            return
        }
        const box = boxRef.current
        if (!box) {
            return
        }
        let raf = 0
        let unbind: Array<() => void> = []
        const measure = () => {
            unbind.forEach((fn) => fn())
            unbind = []
            const b = box.getBoundingClientRect()
            const next: Array<Mark> = []
            // Two ways a part is tagged: (a) `data-anat-part` directly on a visible element,
            // or (b) an inset-0 MARKER span (from AnatomyOverlay) whose PARENT is the visible
            // part. We badge at the tagged element's rect but DIM the visible `target`.
            const items = Array.from(box.querySelectorAll<HTMLElement>("[data-anat-part]"))
                .map((el) => ({ el, nm: el.getAttribute("data-anat-part") ?? "" }))
                .filter((it) => numberOf(it.nm) !== undefined)
                .map((it) => ({
                    el: it.el,
                    nm: it.nm,
                    n: numberOf(it.nm) as number,
                    target: it.el.hasAttribute("data-anat-marker") ? it.el.parentElement ?? it.el : it.el,
                }))
            itemsRef.current = items.map(({ n, target }) => ({ n, target }))
            // Nested parts share a top-left corner → nudge a colliding badge rightward so
            // they line up side by side instead of hiding each other.
            const placed: Array<{ top: number; left: number }> = []
            items.forEach(({ el, n, nm, target }) => {
                const r = el.getBoundingClientRect()
                let left = r.left - b.left - 9
                let top = r.top - b.top - 9
                while (placed.some((p) => Math.abs(p.left - left) < 20 && Math.abs(p.top - top) < 20)) {
                    left += 20
                }
                placed.push({ top, left })
                next.push({ key: next.length, n, tier: tierOf(nm) ?? "primitive", top, left })
                target.style.transition = "opacity .18s ease, filter .18s ease"
                unbind.push(() => {
                    target.style.opacity = ""
                    target.style.filter = ""
                })
            })
            setMarks(next)
        }
        const schedule = () => {
            cancelAnimationFrame(raf)
            raf = requestAnimationFrame(measure)
        }
        schedule()
        const ro = new ResizeObserver(schedule)
        ro.observe(box)
        window.addEventListener("resize", schedule)
        return () => {
            cancelAnimationFrame(raf)
            ro.disconnect()
            window.removeEventListener("resize", schedule)
            unbind.forEach((fn) => fn())
        }
    }, [mode, numberOf, tierOf, parts])

    // Spotlight (option B): the SELECTED part + its ancestors stay lit; everything else dims.
    useEffect(() => {
        const items = itemsRef.current
        if (selected === null) {
            items.forEach(({ target }) => {
                target.style.opacity = ""
                target.style.filter = ""
            })
            return
        }
        const chosen = items.filter((i) => i.n === selected).map((i) => i.target)
        items.forEach(({ target }) => {
            const lit = chosen.some((c) => c === target || target.contains(c))
            target.style.opacity = lit ? "" : "0.28"
            target.style.filter = lit ? "" : "saturate(0.55)"
        })
    }, [selected, marks])

    const tabClass = (active: boolean) =>
        cn(
            "flex items-center gap-1.5 px-3.5 py-1.5 text-xs transition-colors",
            active ? "bg-default-100 font-medium text-foreground" : "text-muted hover:text-foreground",
        )

    return (
        <div className="flex flex-col gap-4 rounded-2xl border border-default-200 p-4">
            {/* TOOLBAR — mode toggle + which leaf of which block. */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="inline-flex overflow-hidden rounded-lg border border-default-200">
                    <button type="button" onClick={() => setMode("diagram")} className={tabClass(mode === "diagram")}>
                        <SquaresFourIcon className="size-4" aria-hidden />
                        Sơ đồ
                    </button>
                    <button
                        type="button"
                        onClick={() => setMode("tree")}
                        className={cn("border-l border-default-200", tabClass(mode === "tree"))}
                    >
                        <TreeStructureIcon className="size-4" aria-hidden />
                        Cây
                    </button>
                </div>
                <span className="font-mono text-xs text-muted">{leaf ? `${name} · ${leaf}` : name}</span>
            </div>

            {/* TIER KEY — colours mean tier, always shown. */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-muted">
                {(["block", "design", "primitive"] as Array<AnatomyTier>).map((t) => (
                    <span key={t} className="flex items-center gap-1.5">
                        <span className={cn("size-2 rounded-full", DOT[t])} />
                        {t}
                    </span>
                ))}
            </div>

            {/* SƠ ĐỒ — this leaf's clean render (numbered anchors) + its legend. */}
            {mode === "diagram" ? (
                <>
                    <AnatomyPanelContext.Provider value={{ numberOf }}>
                        <div ref={boxRef} className="relative rounded-xl border border-dashed border-default-200 p-4">
                            {children}
                            {marks.map((m) => (
                                <button
                                    key={m.key}
                                    type="button"
                                    aria-label={`part ${m.n}`}
                                    onClick={() => setSelected((prev) => (prev === m.n ? null : m.n))}
                                    style={{ top: m.top, left: m.left }}
                                    className={cn(
                                        "absolute z-40 flex h-[18px] min-w-[18px] cursor-pointer items-center justify-center rounded-full px-1 font-mono text-xs leading-none transition-transform hover:scale-110",
                                        BADGE[m.tier],
                                        m.n === selected && "scale-125",
                                    )}
                                >
                                    {m.n}
                                </button>
                            ))}
                        </div>
                    </AnatomyPanelContext.Provider>
                    {note ? <p className="text-xs text-muted">{note}</p> : null}
                    <div className="flex flex-col">
                        {flat.map(({ node, n }) => (
                            <div
                                key={node.name}
                                onClick={() => setSelected((prev) => (prev === n ? null : n))}
                                className={cn(
                                    "flex cursor-pointer items-center gap-2.5 rounded-md border-t border-default-200 px-1 py-1.5 transition-colors",
                                    n === selected && "bg-default-100",
                                )}
                            >
                                <NumBadge n={n} tier={node.tier} />
                                <span className="w-32 shrink-0 font-mono text-xs text-foreground">{node.name}</span>
                                <span className="flex-1 text-xs text-muted">{node.role}</span>
                                <span className={cn("shrink-0 text-xs", WORD[node.tier])}>{node.tier}</span>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                /* CÂY — this leaf's composition structure only, no render. */
                <div>
                    {note ? <p className="mb-2 text-xs text-muted">{note}</p> : null}
                    <TreeRow node={rootNode} numberOf={numberOf} />
                </div>
            )}

            {/* RATIONALE — optional, usually only on the main leaf. */}
            {reason ? (
                <div className="border-t border-default-200 pt-3">
                    <p className="text-xs text-muted">
                        <span className="text-foreground">Vì sao composite này: </span>
                        {reason}
                    </p>
                </div>
            ) : null}
        </div>
    )
}
