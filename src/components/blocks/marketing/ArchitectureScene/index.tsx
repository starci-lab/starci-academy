"use client"

/* eslint-disable react/no-unknown-property -- react-three-fiber maps three.js
   properties (position, args, color, attach…) onto intrinsic JSX elements;
   eslint-plugin-react doesn't know them, so this rule must be off for R3F files. */

import React from "react"
import { cn, Typography } from "@heroui/react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Html, Line } from "@react-three/drei"
import { useReducedMotion } from "framer-motion"
import * as THREE from "three"
import type { ReactNode } from "react"
import type { WithClassNames } from "@/modules/types/base/class-name"
import type {
    ArchitectureBoard,
    ArchitectureEdge,
    ArchitectureNode,
    ArchitectureSceneData,
    SceneTone,
    StatusTone,
} from "./types"
import sceneJson from "./scene.json"

/**
 * Mini 3D architecture scene (real WebGL via react-three-fiber) for the landing hero, in a
 * flat isometric "tiles on a grid" style (à la isomer / FossFLOW): a square iso floor board
 * where every node is a flat-shaded slab centred on its own cell, wired into a small DAG.
 *
 * Fully DATA-DRIVEN: topology (nodes / edges / failures), board layout and camera come from a
 * JSON `data` object (default {@link sceneJson} = StarCi's real backend — the CQRS / CDC
 * write→read split, taught failure = CDC lag → stale read). Pass a different `data` to render
 * any other diagram. Just THREE tones, read from theme tokens: `normal`→`--foreground`,
 * `success`→`--success`, `danger`→`--danger` (a hot, about-to-burn aura). Pure WebGL, no
 * image; mounted client-only.
 */

/** Default scene (StarCi backend). JSON widens tuples/unions, so assert the schema. */
const DEFAULT_DATA = sceneJson as unknown as ArchitectureSceneData

/** Node FILL token per tone — HeroUI semantic colours (NOT the text `--foreground`, which
 *  is pure white/black and reads as a glaring slab): normal = `--default` (neutral surface),
 *  success = `--success`, danger = `--danger`. Theme-aware in both light & dark. */
const NODE_VAR: Record<SceneTone, string> = { normal: "--default", success: "--success", danger: "--danger" }
const NODE_FALLBACK: Record<SceneTone, string> = { normal: "#2b313d", success: "#34d399", danger: "#ef5a52" }

/** Wire / grid token per tone — `--muted` for the default neutral line (visible both themes). */
const EDGE_VAR: Record<SceneTone, string> = { normal: "--muted", success: "--success", danger: "--danger" }
const EDGE_FALLBACK: Record<SceneTone, string> = { normal: "#6b7382", success: "#34d399", danger: "#ef5a52" }

/** A node's flat 3-face shading (top / +x / +z) + its wire colour + label tint, from a base. */
interface Shade { top: THREE.Color; faceA: THREE.Color; faceB: THREE.Color; line: THREE.Color; label: string }

/** Resolved palette: node fills (shaded) + edge/grid line colours. */
interface Palette { node: Record<SceneTone, Shade>; edge: Record<SceneTone, THREE.Color> }

const WHITE = new THREE.Color("#ffffff")

/** Derive the flat-iso shading of a slab from one base colour. */
const toShade = (base: THREE.Color): Shade => ({
    top: base.clone().lerp(WHITE, 0.16),
    faceA: base.clone().multiplyScalar(0.82),
    faceB: base.clone().multiplyScalar(0.58),
    line: base.clone(),
    label: `#${base.clone().lerp(WHITE, 0.55).getHexString()}`,
})

/** Shared 2D context to normalise ANY CSS colour (incl. `oklch(...)`, which THREE.Color
 *  CANNOT parse — it would silently default to white) into an sRGB hex string. */
let normCtx: CanvasRenderingContext2D | null | undefined
const cssColorToHex = (color: string): string | null => {
    if (!color) return null
    if (normCtx === undefined) normCtx = document.createElement("canvas").getContext("2d")
    if (!normCtx) return null
    // probe twice from different sentinels → if `color` is invalid/unsupported they differ → null
    normCtx.fillStyle = "#000000"
    normCtx.fillStyle = color
    const fromBlack = normCtx.fillStyle
    normCtx.fillStyle = "#ffffff"
    normCtx.fillStyle = color
    const fromWhite = normCtx.fillStyle
    return fromBlack === fromWhite ? fromBlack : null
}

/** Read a CSS colour token into a THREE.Color (oklch → hex via canvas), with fallback. */
const readToken = (cssVar: string, fallback: string): THREE.Color => {
    if (typeof document === "undefined") return new THREE.Color(fallback)
    const probe = document.createElement("span")
    probe.style.color = `var(${cssVar})`
    probe.style.position = "absolute"
    probe.style.opacity = "0"
    probe.style.pointerEvents = "none"
    document.body.appendChild(probe)
    const computed = getComputedStyle(probe).color
    document.body.removeChild(probe)
    return new THREE.Color(cssColorToHex(computed) ?? fallback)
}

/** Resolve the palette from HeroUI theme tokens once on mount (client-only). */
const usePalette = (): Palette => {
    const build = React.useCallback(
        (read: (cssVar: string, fallback: string) => THREE.Color): Palette => ({
            node: {
                normal: toShade(read(NODE_VAR.normal, NODE_FALLBACK.normal)),
                success: toShade(read(NODE_VAR.success, NODE_FALLBACK.success)),
                danger: toShade(read(NODE_VAR.danger, NODE_FALLBACK.danger)),
            },
            edge: {
                normal: read(EDGE_VAR.normal, EDGE_FALLBACK.normal),
                success: read(EDGE_VAR.success, EDGE_FALLBACK.success),
                danger: read(EDGE_VAR.danger, EDGE_FALLBACK.danger),
            },
        }),
        [],
    )
    const [palette, setPalette] = React.useState<Palette>(() => build((_cssVar, fallback) => new THREE.Color(fallback)))
    React.useEffect(() => {
        const read = () => setPalette(build((cssVar, fallback) => readToken(cssVar, fallback)))
        read()
        // re-read tokens when the theme flips (html class / data-theme) → live light↔dark
        const observer = new MutationObserver(read)
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-theme"] })
        return () => observer.disconnect()
    }, [build])
    return palette
}

/** Slab height/footprint; wires run along the floor (just above the grid). */
const BAR_H = 0.42
const BAR_FOOT = 1.7
const WIRE_Y = 0.02
/** Label frame floats at this fixed height above EVERY slab → even spacing, no overlap. */
const LABEL_Y = BAR_H + 1.2

/** Status text colour (HeroUI tokens — theme-aware via Tailwind, labels are real DOM). */
const STATUS_CLASS: Record<StatusTone, string> = {
    danger: "text-danger",
    warning: "text-warning",
    success: "text-success",
    info: "text-accent",
}

/** Status leading glyph by tone. */
const STATUS_ICON: Record<StatusTone, string> = { danger: "⚠", warning: "⚠", success: "✓", info: "•" }

/** Build node id → world centre (top of the floor, where wires attach). */
const buildCentres = (nodes: ArchitectureNode[], cell: number): Record<string, THREE.Vector3> =>
    Object.fromEntries(nodes.map((n) => [n.id, new THREE.Vector3(n.cell[0] * cell, WIRE_Y, n.cell[1] * cell)]))

/** Square iso floor board: lines on cell boundaries so each node sits centred in a cell. */
const buildGrid = (board: ArchitectureBoard): Array<[number, number, number]> => {
    const { cols: [cMin, cMax], rows: [rMin, rMax], cell } = board
    const GY = -0.005
    const xMin = (cMin - 0.5) * cell
    const xMax = (cMax + 0.5) * cell
    const zMin = (rMin - 0.5) * cell
    const zMax = (rMax + 0.5) * cell
    const pts: Array<[number, number, number]> = []
    for (let k = cMin - 1; k <= cMax; k += 1) {
        const x = (k + 0.5) * cell
        pts.push([x, GY, zMin], [x, GY, zMax])
    }
    for (let k = rMin - 1; k <= rMax; k += 1) {
        const z = (k + 0.5) * cell
        pts.push([xMin, GY, z], [xMax, GY, z])
    }
    return pts
}

/** A soft radial-glow texture (white → transparent) for the danger aura sprite. */
const makeGlowTexture = (): THREE.Texture | null => {
    if (typeof document === "undefined") return null
    const size = 128
    const canvas = document.createElement("canvas")
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext("2d")
    if (!ctx) return null
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
    g.addColorStop(0, "rgba(255,255,255,1)")
    g.addColorStop(0.4, "rgba(255,255,255,0.35)")
    g.addColorStop(1, "rgba(255,255,255,0)")
    ctx.fillStyle = g
    ctx.fillRect(0, 0, size, size)
    return new THREE.CanvasTexture(canvas)
}

/** A throbbing ember aura for a danger node — "running hot, about to burn". */
const HotAura = ({ texture, reduce }: { texture: THREE.Texture | null; reduce: boolean }) => {
    const sprite = React.useRef<THREE.Sprite>(null)
    const mat = React.useRef<THREE.SpriteMaterial>(null)
    useFrame(({ clock }) => {
        if (reduce || !sprite.current || !mat.current) return
        const p = (Math.sin(clock.getElapsedTime() * 3.1) + 1) / 2 // 0..1 flicker
        const s = 3.3 + p * 0.6
        sprite.current.scale.set(s, s, s)
        mat.current.opacity = 0.32 + p * 0.3
        mat.current.color.setRGB(1, 0.32 + p * 0.34, 0.14) // red → orange ember
    })
    if (!texture) return null
    return (
        <sprite ref={sprite} position={[0, 0.35, 0]} scale={3.4}>
            <spriteMaterial ref={mat} map={texture} color="#ff5a32" transparent opacity={0.4} depthWrite={false} blending={THREE.AdditiveBlending} />
        </sprite>
    )
}

/** A flat-shaded isometric slab (3 visible face tones, no lighting) + its floating label. */
const Bar = ({ node, cell, shade, glow, reduce }: { node: ArchitectureNode; cell: number; shade: Shade; glow: THREE.Texture | null; reduce: boolean }) => {
    const [cx, cz] = node.cell
    return (
        <group position={[cx * cell, 0, cz * cell]}>
            {node.tone === "danger" ? <HotAura texture={glow} reduce={reduce} /> : null}
            <mesh position={[0, BAR_H / 2, 0]}>
                <boxGeometry args={[BAR_FOOT, BAR_H, BAR_FOOT]} />
                {/* BoxGeometry face order: 0:+x 1:-x 2:+y(top) 3:-y 4:+z 5:-z */}
                <meshBasicMaterial attach="material-0" color={shade.faceA} />
                <meshBasicMaterial attach="material-1" color={shade.faceB} />
                <meshBasicMaterial attach="material-2" color={shade.top} />
                <meshBasicMaterial attach="material-3" color={shade.faceB} />
                <meshBasicMaterial attach="material-4" color={shade.faceB} />
                <meshBasicMaterial attach="material-5" color={shade.faceA} />
            </mesh>
            {/* label frame floats UPRIGHT at a fixed height above every slab — even, no overlap */}
            <Html position={[0, LABEL_Y, 0]} center zIndexRange={[20, 0]} style={{ pointerEvents: "none" }}>
                <div className="flex select-none flex-col items-center whitespace-nowrap rounded-md border border-white/10 bg-black/45 px-2 py-1 text-center backdrop-blur-sm">
                    <span className="font-mono text-[11px] font-medium leading-tight" style={{ color: shade.label }}>{node.name}</span>
                    {node.sub ? <span className="font-mono text-[9px] leading-tight text-white/45">{node.sub}</span> : null}
                    {node.status ? (
                        <span className={cn("mt-0.5 flex items-center gap-1 font-mono text-[9px] leading-tight", STATUS_CLASS[node.status.tone])}>
                            <span aria-hidden>{STATUS_ICON[node.status.tone]}</span>
                            {node.status.text}
                        </span>
                    ) : null}
                </div>
            </Html>
        </group>
    )
}

/** A floor wire between two slabs; optionally a glowing packet flows along it. */
const Edge = ({ edge, centres, color, reduce }: { edge: ArchitectureEdge; centres: Record<string, THREE.Vector3>; color: THREE.Color; reduce: boolean }) => {
    const a = centres[edge.from]
    const b = centres[edge.to]
    const isDanger = (edge.tone ?? "normal") === "danger"
    const packet = React.useRef<THREE.Mesh>(null)

    useFrame(({ clock }) => {
        if (!packet.current || reduce || !a || !b) return
        packet.current.position.lerpVectors(a, b, (clock.getElapsedTime() * 0.45) % 1)
    })

    if (!a || !b) return null
    return (
        <group>
            <Line
                points={[a, b]}
                color={color}
                lineWidth={isDanger ? 2.2 : 1.5}
                dashed
                dashSize={0.26}
                gapSize={0.16}
                transparent
                opacity={edge.eventual ? 0.5 : 0.8}
            />
            {edge.flow ? (
                <mesh ref={packet} position={a}>
                    <sphereGeometry args={[0.11, 16, 16]} />
                    <meshBasicMaterial color={color} />
                </mesh>
            ) : null}
        </group>
    )
}

/** Whole scene (inside the Canvas). Gentle drift gated by reduced-motion. */
const Scene = ({ data, palette, reduce }: { data: ArchitectureSceneData; palette: Palette; reduce: boolean }) => {
    const group = React.useRef<THREE.Group>(null)
    const centres = React.useMemo(() => buildCentres(data.nodes, data.board.cell), [data])
    const grid = React.useMemo(() => buildGrid(data.board), [data.board])
    const glow = React.useMemo(() => makeGlowTexture(), [])
    useFrame(({ clock }) => {
        if (!group.current || reduce) return
        group.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.16) * 0.05
    })
    return (
        <group ref={group}>
            <Line points={grid} segments color={palette.edge.normal} lineWidth={1} transparent opacity={0.22} />
            {data.edges.map((edge) => (
                <Edge key={`${edge.from}-${edge.to}`} edge={edge} centres={centres} color={palette.edge[edge.tone ?? "normal"]} reduce={reduce} />
            ))}
            {data.nodes.map((node) => (
                <Bar key={node.id} node={node} cell={data.board.cell} shade={palette.node[node.tone ?? "normal"]} glow={glow} reduce={reduce} />
            ))}
        </group>
    )
}

/** Props for {@link ArchitectureScene}. */
export interface ArchitectureSceneProps extends WithClassNames<undefined> {
    /** Scene topology/layout/camera as data (default = StarCi backend {@link sceneJson}). */
    data?: ArchitectureSceneData
    /** Caption under the scene (i18n string from the feature). */
    caption?: ReactNode
}

/**
 * Hero architecture illustration in real 3D, flat-isometric "tiles on a grid" style, driven
 * entirely by a JSON `data` object and three theme-token tones (normal / success / danger —
 * the danger node runs hot with an ember aura). Honours `prefers-reduced-motion`.
 *
 * @param props - {@link ArchitectureSceneProps}
 */
export const ArchitectureScene = ({ data = DEFAULT_DATA, caption, className }: ArchitectureSceneProps) => {
    const reduce = Boolean(useReducedMotion())
    const palette = usePalette()
    return (
        <div className={cn("w-full", className)}>
            <div className="h-[360px] w-full sm:h-[440px]">
                <Canvas
                    orthographic
                    camera={{ position: data.camera.position, zoom: data.camera.zoom, near: -50, far: 100 }}
                    gl={{ alpha: true, antialias: true }}
                    style={{ background: "transparent" }}
                    dpr={[1, 2]}
                >
                    <Scene data={data} palette={palette} reduce={reduce} />
                </Canvas>
            </div>
            {caption ? (
                <Typography type="body-sm" color="muted" align="center" className="px-5">
                    {caption}
                </Typography>
            ) : null}
        </div>
    )
}
