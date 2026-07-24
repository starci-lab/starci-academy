"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"
import type { ReactNode } from "react"
import { Chip, Table, Tabs, cn } from "@heroui/react"
import { CircleIcon, SquaresFourIcon, TreeStructureIcon } from "@phosphor-icons/react"
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
 * Two calm views, toggled by HeroUI `Tabs` (variant="primary" — the segmented
 * pill for a panel-content switch):
 * - **Sơ đồ** — the leaf renders CLEAN; each part carries only a small numbered
 *   {@link Chip} anchor (via {@link AnatomyOverlay} reading this panel's context).
 *   A {@link Table} legend maps number → name · role · tier. Content is never covered.
 * - **Cây** — no render: just this leaf's composition TREE (what contains what).
 *
 * Rendered with HeroUI (Tabs · Chip · Table) + Phosphor icons. Dev/spec only,
 * NO `@/components` imports (HeroUI + storybook-local ports only).
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
    /**
     * Storybook story/docs id of THIS part's own component (e.g.
     * `"design-cards-continuecard-plain--progress"`). When set, clicking the
     * part's numbered chip (or legend #) jumps to that story so you can inspect
     * the ref directly. Absent → the chip toggles the spotlight instead.
     */
    storyId?: string
    children?: Array<AnatomyNode>
}

/** Storybook manager route for a story id (breaks out of the preview iframe). */
const storyHref = (storyId: string) => `/?path=/story/${storyId}`

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

/** Tier → HeroUI Chip/text colour (the SINGLE source for anatomy tier colour). */
const TIER_COLOR: Record<AnatomyTier, "warning" | "success" | "accent"> = {
    block: "warning",
    design: "success",
    primitive: "accent",
}
const TIER_TEXT: Record<AnatomyTier, string> = {
    block: "text-warning",
    design: "text-success",
    primitive: "text-accent",
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
    const storyMap = new Map<string, string>()
    const flat: Array<FlatPart> = []
    let i = 0
    const walk = (nodes: Array<AnatomyNode>) => {
        nodes.forEach((node) => {
            if (!map.has(node.name)) {
                i += 1
                map.set(node.name, i)
                tierMap.set(node.name, node.tier)
                if (node.storyId) {
                    storyMap.set(node.name, node.storyId)
                }
                flat.push({ node, n: i })
            }
            if (node.children) {
                walk(node.children)
            }
        })
    }
    walk(parts)
    return {
        numberOf: (name: string) => map.get(name),
        tierOf: (name: string) => tierMap.get(name),
        storyIdOf: (name: string) => storyMap.get(name),
        flat,
    }
}

/** A measured on-render badge — number + screen position relative to the render box. */
interface Mark {
    key: number
    n: number
    name: string
    tier: AnatomyTier
    top: number
    left: number
}

/** Small numbered anchor — a HeroUI {@link Chip} tinted by tier. */
const NumChip = ({ n, tier, className }: { n: number; tier: AnatomyTier; className?: string }) => (
    <Chip color={TIER_COLOR[tier]} variant="soft" size="sm" className={cn("min-w-[22px] justify-center px-1.5 font-mono", className)}>
        <Chip.Label className="text-xs">{n}</Chip.Label>
    </Chip>
)

/** One tree row + its nested children (indented with a guide rail). */
const TreeRow = ({ node, numberOf }: { node: AnatomyNode; numberOf: (name: string) => number | undefined }) => {
    const n = numberOf(node.name)
    return (
        <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2 rounded-lg px-1.5 py-1 hover:bg-default-100">
                <CircleIcon weight="fill" className={cn("size-2 shrink-0", TIER_TEXT[node.tier])} aria-hidden />
                {n !== undefined ? <NumChip n={n} tier={node.tier} /> : null}
                <span className="font-mono text-xs text-foreground">{node.name}</span>
                {node.role ? <span className="text-xs text-muted">{`· ${node.role}`}</span> : null}
                {node.state ? (
                    <Chip color="default" variant="soft" size="sm" className="ml-auto">
                        <Chip.Label>{node.state}</Chip.Label>
                    </Chip>
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
 * BlockAnatomy — a two-tab (Sơ đồ / Cây) anatomy panel for ONE leaf, rendered
 * with HeroUI (Tabs · Chip · Table). See the file header for the per-leaf model.
 *
 * @param props - {@link BlockAnatomyProps}
 */
export const BlockAnatomy = ({ name, tier, parts, children, leaf, note, reason }: BlockAnatomyProps) => {
    const [mode, setMode] = useState<Mode>("diagram")
    const { numberOf, tierOf, flat } = useMemo(() => buildIndex(parts), [parts])
    const rootNode: AnatomyNode = { name, tier, role: leaf, children: parts }

    // Measured badges: the render box is `relative`; each part element the component
    // tags with `data-anat-part="Name"` gets a numbered chip drawn at its corner —
    // NO wrapper around the part, so nothing shifts. Recompute on layout changes.
    const boxRef = useRef<HTMLDivElement>(null)
    const [marks, setMarks] = useState<Array<Mark>>([])
    // Which part number is SELECTED — click a chip to spotlight it, click again to clear.
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
                const top = r.top - b.top - 9
                while (placed.some((p) => Math.abs(p.left - left) < 24 && Math.abs(p.top - top) < 20)) {
                    left += 24
                }
                placed.push({ top, left })
                next.push({ key: next.length, n, name: nm, tier: tierOf(nm) ?? "primitive", top, left })
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

    // Spotlight: the SELECTED part + its ancestors stay lit (everything else dims),
    // and the chosen part itself gets an accent ring so it POPS. Ring classes are
    // string literals here so Tailwind's JIT keeps them: "ring-2" "ring-accent" "ring-offset-2".
    useEffect(() => {
        const items = itemsRef.current
        const clearRing = (el: HTMLElement) => el.classList.remove("ring-2", "ring-accent", "rounded-none")
        if (selected === null) {
            items.forEach(({ target }) => {
                target.style.opacity = ""
                target.style.filter = ""
                clearRing(target)
            })
            return
        }
        const chosen = items.filter((i) => i.n === selected).map((i) => i.target)
        items.forEach(({ target }) => {
            const isChosen = chosen.includes(target)
            const lit = chosen.some((c) => c === target || target.contains(c))
            target.style.opacity = lit ? "" : "0.28"
            target.style.filter = lit ? "" : "saturate(0.55)"
            if (isChosen) {
                target.classList.add("ring-2", "ring-accent", "rounded-none")
            } else {
                clearRing(target)
            }
        })
    }, [selected, marks])

    const toggle = (n: number) => setSelected((prev) => (prev === n ? null : n))

    return (
        <div className="flex flex-col gap-3 p-4">
            {/* TOOLBAR — which leaf of which block + the HeroUI primary Tabs mode switch. */}
            <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-mono text-sm text-muted">{leaf ? `${name} · ${leaf}` : name}</span>
            </div>
            <Tabs
                variant="primary"
                selectedKey={mode}
                onSelectionChange={(key) => setMode(String(key) as Mode)}
                className="w-fit whitespace-nowrap"
            >
                <Tabs.ListContainer>
                    <Tabs.List aria-label="Chế độ xem anatomy">
                        <Tabs.Tab id="diagram">
                            <span className="flex items-center gap-1.5">
                                <SquaresFourIcon className="size-5" aria-hidden />
                                Sơ đồ
                            </span>
                            <Tabs.Indicator />
                        </Tabs.Tab>
                        <Tabs.Tab id="tree">
                            <span className="flex items-center gap-1.5">
                                <TreeStructureIcon className="size-5" aria-hidden />
                                Cây
                            </span>
                            <Tabs.Indicator />
                        </Tabs.Tab>
                    </Tabs.List>
                </Tabs.ListContainer>
            </Tabs>

            {/* TIER KEY — HeroUI Chips; colour means tier, always shown. */}
            <div className="flex flex-wrap items-center gap-2">
                {(["block", "design", "primitive"] as Array<AnatomyTier>).map((t) => (
                    <Chip key={t} color={TIER_COLOR[t]} variant="soft" size="sm">
                        <CircleIcon weight="fill" className="size-2.5" aria-hidden />
                        <Chip.Label className="text-xs">{t}</Chip.Label>
                    </Chip>
                ))}
            </div>

            {mode === "diagram" ? (
                <>
                    {/* SƠ ĐỒ — this leaf's clean render with numbered Chip anchors. */}
                    <AnatomyPanelContext.Provider value={{ numberOf }}>
                        <div ref={boxRef} className="relative">
                            {children}
                            {/* Badge click = SPOTLIGHT this part (highlight); jumping to the
                                part's own story is the LEGEND link's job, not the badge's. */}
                            {marks.map((m) => (
                                <span
                                    key={m.key}
                                    role="button"
                                    tabIndex={0}
                                    aria-label={`Làm nổi part ${m.n}`}
                                    onClick={() => toggle(m.n)}
                                    style={{ top: m.top, left: m.left }}
                                    className="absolute z-40 cursor-pointer transition-transform hover:scale-110"
                                >
                                    <Chip
                                        color={TIER_COLOR[m.tier]}
                                        variant="soft"
                                        size="sm"
                                        className={cn(
                                            "min-w-[22px] justify-center px-1.5 font-mono shadow-md",
                                            m.n === selected && "scale-125",
                                        )}
                                    >
                                        <Chip.Label className="text-xs">{m.n}</Chip.Label>
                                    </Chip>
                                </span>
                            ))}
                        </div>
                    </AnatomyPanelContext.Provider>
                    {note ? <p className="text-sm text-muted">{note}</p> : null}

                    {/* LEGEND — HeroUI Table: # · Part · Vai trò · Tier. */}
                    <Table variant="primary">
                        <Table.ScrollContainer>
                            <Table.Content aria-label={`Chú giải anatomy — ${name}`}>
                                <Table.Header>
                                    <Table.Column isRowHeader>#</Table.Column>
                                    <Table.Column>Part</Table.Column>
                                    <Table.Column>Vai trò</Table.Column>
                                    <Table.Column>Tier</Table.Column>
                                </Table.Header>
                                <Table.Body>
                                    {flat.map(({ node, n }) => (
                                        <Table.Row key={node.name}>
                                            <Table.Cell>
                                                {node.storyId ? (
                                                    <a href={storyHref(node.storyId)} target="_top" title={`Mở story: ${node.name}`} className="no-underline">
                                                        <NumChip n={n} tier={node.tier} />
                                                    </a>
                                                ) : (
                                                    <NumChip n={n} tier={node.tier} />
                                                )}
                                            </Table.Cell>
                                            <Table.Cell className="font-mono text-sm text-foreground">
                                                {node.storyId ? (
                                                    <a href={storyHref(node.storyId)} target="_top" className="text-foreground underline-offset-4 hover:underline">
                                                        {node.name}
                                                    </a>
                                                ) : (
                                                    node.name
                                                )}
                                            </Table.Cell>
                                            <Table.Cell className="text-sm text-muted">{node.role}</Table.Cell>
                                            <Table.Cell className={cn("text-sm font-medium", TIER_TEXT[node.tier])}>{node.tier}</Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table.Content>
                        </Table.ScrollContainer>
                    </Table>
                </>
            ) : (
                /* CÂY — this leaf's composition structure only, no render. */
                <div>
                    {note ? <p className="mb-2 text-sm text-muted">{note}</p> : null}
                    <TreeRow node={rootNode} numberOf={numberOf} />
                </div>
            )}

            {/* RATIONALE — optional, usually only on the main leaf. */}
            {reason ? (
                <div className="border-t border-default-200 pt-3">
                    <p className="text-sm text-muted">
                        <span className="text-foreground">Vì sao composite này: </span>
                        {reason}
                    </p>
                </div>
            ) : null}
        </div>
    )
}
