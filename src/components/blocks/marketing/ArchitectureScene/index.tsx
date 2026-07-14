"use client"

/* eslint-disable react/no-unknown-property -- react-three-fiber maps three.js
   properties (position, args, color, attach…) onto intrinsic JSX elements;
   eslint-plugin-react doesn't know them, so this rule must be off for R3F files. */

import React from "react"
import { cn, Typography } from "@heroui/react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Edges, Html, Line, OrbitControls } from "@react-three/drei"
import { ArrowsSplitIcon, CheckCircleIcon, CubeIcon, DatabaseIcon, DesktopIcon, HexagonIcon, InfoIcon, StackIcon, UserIcon, WarningIcon, type Icon } from "@phosphor-icons/react"
import { useReducedMotion } from "framer-motion"
import * as THREE from "three"
import type { ReactNode } from "react"
import type { WithClassNames } from "@/modules/types/base/class-name"
import type {
    ArchitectureBoard,
    ArchitectureCamera,
    ArchitectureEdge,
    ArchitectureNode,
    ArchitectureSceneData,
    NodeKind,
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

/** A node's flat 3-face shading (top / +x / +z) + wire colour + label tint + edge ink + the
 *  instance `tint` (the vivid fill colour, used for the label border). */
interface Shade { top: THREE.Color; faceA: THREE.Color; faceB: THREE.Color; line: THREE.Color; label: string; outline: string; tint: string }

/** Resolved palette: node fills (shaded) + edge/grid line colours. */
interface Palette { node: Record<SceneTone, Shade>; edge: Record<SceneTone, THREE.Color> }

const WHITE = new THREE.Color("#ffffff")
const HSL_TMP = { h: 0, s: 0, l: 0 }

/** Outline ink, the flat-isometric convention (a tonal shade of the fill, never a hard black):
 *  - COLOURED node (has hue) → a darker shade of the SAME hue (red → dark-red, green → dark-green),
 *    which reads on either theme since the fills are mid-bright.
 *  - NEUTRAL/gray node (no hue) → contrast vs the PAGE: a light fill (light theme) → darker ink,
 *    a dark fill (dark theme) → lighter ink — so the gray box always has a crisp edge.
 *  Returns a CSS string for `<Edges>`. */
const toOutline = (base: THREE.Color): string => {
    base.getHSL(HSL_TMP)
    if (HSL_TMP.s > 0.15) return base.clone().multiplyScalar(0.5).getStyle()
    // neutral: light fill → darker ink; dark fill → a SOFT gray edge (not glaring white on the dark bg)
    const ink = HSL_TMP.l > 0.5 ? base.clone().multiplyScalar(0.45) : base.clone().lerp(WHITE, 0.32)
    return ink.getStyle()
}

/** Nudge a fill's contrast vs the page: darken a LIGHT fill (more presence in light mode) by
 *  `darken`, but lighten a DARK fill (dark mode) by only `lighten` — kept tiny so neutrals stay a
 *  subdued/deep gray and the coloured nodes (green/red) carry the accent. Hue unchanged. */
const nudgeContrast = (c: THREE.Color, darken: number, lighten: number): THREE.Color => {
    c.getHSL(HSL_TMP)
    return HSL_TMP.l > 0.5 ? c.clone().multiplyScalar(1 - darken) : c.clone().lerp(WHITE, lighten)
}

/** Derive the flat-iso shading of a slab from one base colour. */
const toShade = (base: THREE.Color): Shade => ({
    top: base.clone().lerp(WHITE, 0.16),
    faceA: base.clone().multiplyScalar(0.82),
    faceB: base.clone().multiplyScalar(0.58),
    line: base.clone(),
    label: `#${base.clone().lerp(WHITE, 0.55).getHexString()}`,
    outline: toOutline(base),
    tint: base.getStyle(),
})

/** Shared 2D context to normalise ANY CSS colour into a concrete sRGB `rgb(r, g, b)` string.
 *  HeroUI tokens are `oklch(...)`; Chrome's `getComputedStyle().color` / canvas `fillStyle`
 *  serialise those as `oklch(...)` / `color(srgb …)`, which THREE.Color CANNOT parse (it would
 *  silently default to WHITE). So we RASTERISE 1px and read the pixel back — that gamut-maps
 *  oklch/color() down to plain sRGB bytes THREE always parses. */
let normCtx: CanvasRenderingContext2D | null | undefined
const cssColorToRgb = (color: string): string | null => {
    if (!color) return null
    if (normCtx === undefined) normCtx = document.createElement("canvas").getContext("2d", { willReadFrequently: true })
    if (!normCtx) return null
    // validity probe: assign over two sentinels → an invalid/unsupported value leaves them differing
    normCtx.fillStyle = "#000000"
    normCtx.fillStyle = color
    const fromBlack = normCtx.fillStyle
    normCtx.fillStyle = "#ffffff"
    normCtx.fillStyle = color
    if (fromBlack !== normCtx.fillStyle) return null
    // rasterise 1px → read back true sRGB bytes (oklch/color() are gamut-mapped to sRGB here)
    normCtx.clearRect(0, 0, 1, 1)
    normCtx.fillStyle = color
    normCtx.fillRect(0, 0, 1, 1)
    const [r, g, b] = normCtx.getImageData(0, 0, 1, 1).data
    return `rgb(${r}, ${g}, ${b})`
}

/** Read a CSS colour token into a THREE.Color (oklch → sRGB via canvas), with fallback. */
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
    return new THREE.Color(cssColorToRgb(computed) ?? fallback)
}

/** Resolve the palette from HeroUI theme tokens once on mount (client-only). */
const usePalette = (): Palette => {
    const build = React.useCallback(
        (read: (cssVar: string, fallback: string) => THREE.Color): Palette => ({
            node: {
                // neutral: darken a touch in LIGHT mode (presence), barely lift in DARK mode so it
                // stays a subdued deep gray — the green/red nodes stay the accents
                normal: toShade(nudgeContrast(read(NODE_VAR.normal, NODE_FALLBACK.normal), 0.16, 0.04)),
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

/** Wires run along the floor (just above the grid). */
const WIRE_Y = 0.02
/** Label floats this high above EVERY node — lifted clear of the shape so the 3D form stays visible. */
const LABEL_Y = 2.5

/** Status text colour (HeroUI tokens — theme-aware via Tailwind, labels are real DOM). */
const STATUS_CLASS: Record<StatusTone, string> = {
    danger: "text-danger",
    warning: "text-warning",
    success: "text-success",
    info: "text-accent",
}

/** Status leading icon by tone (phosphor, not a glyph). */
const STATUS_ICON: Record<StatusTone, Icon> = { danger: WarningIcon, warning: WarningIcon, success: CheckCircleIcon, info: InfoIcon }

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

/**
 * Auto-fits the isometric camera to a scene's ACTUAL node bounding box, instead
 * of trusting a fixed `data.camera` — a scene with 2 nodes and a scene with 8+
 * nodes both need a different zoom/position to frame correctly. Keeps the same
 * isometric VIEWING ANGLE (the unit direction of the authored `data.camera`
 * position) and only rescales the distance + orthographic zoom to the content's
 * footprint, so every scene still reads as "the same camera", just reframed.
 *
 * `zoom` (orthographic) is inversely proportional to the world-space span the
 * camera must cover — bigger bounding box → smaller zoom. `FIT_PADDING` leaves
 * headroom for the floating `<Html>` labels (which sit above the node meshes
 * and extend past their footprint), so labels at the scene's edge don't clip
 * against the canvas border.
 */
const FIT_PADDING = 1.6
const FIT_MIN_ZOOM = 10
const FIT_MAX_ZOOM = 46
const FIT_MIN_SPAN = 6 // a 1-2 node scene shouldn't zoom in absurdly tight
const REFERENCE_SPAN = 8 // world units a zoom of `REFERENCE_ZOOM` frames comfortably
const REFERENCE_ZOOM = 34

interface CameraFitResult {
    position: [number, number, number]
    zoom: number
    /** World point the camera should look at — the node bounding box's centroid. */
    lookAt: [number, number, number]
}

const computeCameraFit = (nodes: ArchitectureNode[], cell: number, authored: ArchitectureCamera): CameraFitResult => {
    if (nodes.length === 0) return { position: authored.position, zoom: authored.zoom, lookAt: [0, 0, 0] }
    let minX = Infinity
    let maxX = -Infinity
    let minZ = Infinity
    let maxZ = -Infinity
    for (const node of nodes) {
        const x = node.cell[0] * cell
        const z = node.cell[1] * cell
        if (x < minX) minX = x
        if (x > maxX) maxX = x
        if (z < minZ) minZ = z
        if (z > maxZ) maxZ = z
    }
    const spanX = Math.max(maxX - minX, FIT_MIN_SPAN)
    const spanZ = Math.max(maxZ - minZ, FIT_MIN_SPAN)
    // the world span an iso camera must cover ~ the larger of the two axes'
    // footprint (both project onto the screen in an isometric view), padded
    // for the floating labels that extend past each node's mesh
    const span = Math.max(spanX, spanZ) * FIT_PADDING
    const fitZoom = THREE.MathUtils.clamp((REFERENCE_ZOOM * REFERENCE_SPAN) / span, FIT_MIN_ZOOM, FIT_MAX_ZOOM)
    const cx = (minX + maxX) / 2
    const cz = (minZ + maxZ) / 2
    const [ax, ay, az] = authored.position
    const authoredLen = Math.hypot(ax, ay, az) || 1
    // scale the camera's DISTANCE with the footprint too (orthographic zoom
    // alone can't compensate for a very off-centre/huge board), then recentre
    // it over the bounding box's centroid so large scenes don't clip a corner
    const distanceScale = THREE.MathUtils.clamp(span / REFERENCE_SPAN, 0.7, 2.4)
    const distance = authoredLen * distanceScale
    return {
        position: [
            cx + (ax / authoredLen) * distance,
            (ay / authoredLen) * distance,
            cz + (az / authoredLen) * distance,
        ],
        zoom: fitZoom,
        lookAt: [cx, 0, cz],
    }
}

/** Sits inside the `<Canvas>` and imperatively re-frames the orthographic
 *  camera whenever the scene's node bounding box changes (drilling into a pod,
 *  switching layouts, …) — the generic fix for "camera doesn't fit the scene"
 *  that benefits every scene builder, not a per-scene hardcoded position.
 *
 *  `<OrbitControls makeDefault>` OWNS the camera every frame (it recomputes
 *  `camera.position` each tick from its OWN internal spherical state —
 *  distance-from-target/azimuth/polar — captured when it mounted). Setting
 *  `camera.position`/`lookAt` here alone would get silently snapped back on
 *  the very next frame. `useThree().controls` is the live OrbitControls
 *  instance (drei registers it there under `makeDefault`) — retargeting it
 *  + calling `.update()` re-derives that internal state from the NEW camera
 *  position/target, so the fit actually sticks instead of fighting the rig. */
const CameraFit = ({ nodes, cell, authored }: { nodes: ArchitectureNode[]; cell: number; authored: ArchitectureCamera }) => {
    const { camera, controls } = useThree()
    React.useEffect(() => {
        const fit = computeCameraFit(nodes, cell, authored)
        camera.position.set(...fit.position)
        const ortho = camera as THREE.OrthographicCamera
        if (ortho.isOrthographicCamera) {
            ortho.zoom = fit.zoom
            ortho.updateProjectionMatrix()
        }
        camera.lookAt(...fit.lookAt)
        camera.updateMatrixWorld()
        // retarget the OrbitControls rig so it stops fighting the manual fit
        // on the next `useFrame` tick (see doc comment above)
        const rig = controls as { target?: THREE.Vector3; update?: () => void } | null
        if (rig?.target && rig.update) {
            rig.target.set(...fit.lookAt)
            rig.update()
        }
        // `authored`/`camera` are stable per scene mount; re-fit on node/cell identity change only
    }, [nodes, cell, controls])
    return null
}

/** Ember tint a `danger` node pulses toward — "running hot, about to burn". */
const EMBER = new THREE.Color("#ff7a3c")

/** Crisp edge linework (crease/boundary edges) drawn as screen-space lines → the flat-iso
 *  "vector" read. `threshold` keeps smooth cylinders clean (only the rim rings draw, not every
 *  facet). `color` is the node's tonal outline ink (see {@link toOutline}); `key` forces a
 *  remount on change — drei `<Edges>` doesn't re-apply `color` on its own. Child of a `<mesh>`. */
const Ink = ({ color }: { color: string }) => <Edges key={color} threshold={22} color={color} lineWidth={1} />

/** Tri-tone faces for a box (BoxGeometry material order 0:+x 1:-x 2:top 3:-y 4:+z 5:-z) — the
 *  flat-iso read: lit top + two side tones, no lighting. */
const BoxFaces = ({ shade }: { shade: Shade }) => (
    <>
        <meshBasicMaterial attach="material-0" color={shade.faceA} />
        <meshBasicMaterial attach="material-1" color={shade.faceB} />
        <meshBasicMaterial attach="material-2" color={shade.top} />
        <meshBasicMaterial attach="material-3" color={shade.faceB} />
        <meshBasicMaterial attach="material-4" color={shade.faceB} />
        <meshBasicMaterial attach="material-5" color={shade.faceA} />
    </>
)

/** Tri-tone faces for a cylinder/cone (CylinderGeometry group order 0:side 1:top 2:bottom). */
const CylFaces = ({ shade }: { shade: Shade }) => (
    <>
        <meshBasicMaterial attach="material-0" color={shade.faceA} />
        <meshBasicMaterial attach="material-1" color={shade.top} />
        <meshBasicMaterial attach="material-2" color={shade.faceB} />
    </>
)

/** Five rib offsets (fraction of width) for the container grooves. */
const RIBS = [-0.62, -0.31, 0, 0.31, 0.62]

/** `container` — a ribbed shipping-container cube (app / service / worker). Grooves run on ALL
 *  FOUR vertical faces so it reads as a container from any orbit angle. Each face's ribs take a
 *  contrasting tone (darker ribs on a light face, lighter ribs on a dark face). */
const ContainerMesh = ({ shade }: { shade: Shade }) => {
    const w = 1.5
    const h = 1.05
    const faces: Array<{ ax: "x" | "z"; sign: number; color: THREE.Color }> = [
        { ax: "x", sign: 1, color: shade.faceB }, // +x (light face → dark ribs)
        { ax: "x", sign: -1, color: shade.faceA }, // -x (dark face → light ribs)
        { ax: "z", sign: 1, color: shade.faceA }, // +z (dark face → light ribs)
        { ax: "z", sign: -1, color: shade.faceB }, // -z (light face → dark ribs)
    ]
    return (
        <group>
            <mesh position={[0, h / 2, 0]}>
                <boxGeometry args={[w, h, w]} />
                <BoxFaces shade={shade} />
                <Ink color={shade.outline} />
            </mesh>
            {faces.map(({ ax, sign, color }) =>
                RIBS.map((f) => {
                    const off = sign * (w / 2 + 0.006)
                    const pos: [number, number, number] = ax === "x" ? [off, h / 2, (f * w) / 2] : [(f * w) / 2, h / 2, off]
                    const size: [number, number, number] = ax === "x" ? [0.02, h * 0.84, 0.06] : [0.06, h * 0.84, 0.02]
                    return (
                        <mesh key={`${ax}${sign}${f}`} position={pos}>
                            <boxGeometry args={size} />
                            <meshBasicMaterial color={color} />
                        </mesh>
                    )
                }),
            )}
        </group>
    )
}

/** Three ring heights, evenly dividing the drum (body spans y 0→1) into 4 equal bands. */
const DB_RINGS = [0.25, 0.5, 0.75]

/** `database` — a cylinder drum with 3 ink rings (the classic stacked-disc look). */
const DatabaseMesh = ({ shade }: { shade: Shade }) => (
    <group>
        <mesh position={[0, 0.5, 0]}>
            <cylinderGeometry args={[0.8, 0.8, 1, 48]} />
            <CylFaces shade={shade} />
            <Ink color={shade.outline} />
        </mesh>
        {DB_RINGS.map((y) => (
            <mesh key={y} position={[0, y, 0]}>
                <cylinderGeometry args={[0.805, 0.805, 0.022, 48]} />
                <meshBasicMaterial color={shade.outline} />
            </mesh>
        ))}
    </group>
)

/** `broker` — three stacked log plates (a message broker / queue, e.g. Kafka). */
const BrokerMesh = ({ shade }: { shade: Shade }) => {
    const ph = 0.24
    const gap = 0.1
    return (
        <group>
            {[0, 1, 2].map((i) => (
                <mesh key={i} position={[0, ph / 2 + i * (ph + gap), 0]}>
                    <boxGeometry args={[1.45, ph, 1.45]} />
                    <BoxFaces shade={shade} />
                    <Ink color={shade.outline} />
                </mesh>
            ))}
        </group>
    )
}

/** Member-node "bumps" on a pod's top face (fraction of the hex radius) — a small
 *  cluster that reads as "this cell HOLDS nodes". */
const POD_MEMBERS: Array<[number, number]> = [[-0.4, 0.22], [0.4, 0.22], [0, -0.44]]
/** Pod hex radius + prism height (bigger + taller than the loadBalancer puck so it
 *  reads as a container cell, not a gateway). */
const POD_R = 1.16
const POD_H = 0.66

/** `pod` — a hexagonal honeycomb CELL: a flat-top hex prism (tri-tone flat shading)
 *  with a small cluster of light member-node cubes on its top face. Represents a
 *  functional GROUP (payment, ai, data…) that drills into its own sub-scene; the hex
 *  tiles into a honeycomb around the Core. */
const PodMesh = ({ shade }: { shade: Shade }) => (
    <group>
        <mesh position={[0, POD_H / 2, 0]} rotation={[0, Math.PI / 6, 0]}>
            <cylinderGeometry args={[POD_R, POD_R, POD_H, 6]} />
            <CylFaces shade={shade} />
            <Ink color={shade.outline} />
        </mesh>
        {POD_MEMBERS.map(([mx, mz], i) => (
            <mesh key={i} position={[mx, POD_H + 0.13, mz]}>
                <boxGeometry args={[0.32, 0.26, 0.32]} />
                <meshBasicMaterial attach="material-0" color="#d7dbe2" />
                <meshBasicMaterial attach="material-1" color="#c2c7d0" />
                <meshBasicMaterial attach="material-2" color="#eef0f4" />
                <meshBasicMaterial attach="material-3" color="#c2c7d0" />
                <meshBasicMaterial attach="material-4" color="#c2c7d0" />
                <meshBasicMaterial attach="material-5" color="#d7dbe2" />
                <Ink color={shade.outline} />
            </mesh>
        ))}
    </group>
)

/** `loadBalancer` — a hex puck (an edge gateway that fans out). */
const LoadBalancerMesh = ({ shade }: { shade: Shade }) => (
    <mesh position={[0, 0.32, 0]} rotation={[0, Math.PI / 6, 0]}>
        <cylinderGeometry args={[0.92, 0.92, 0.64, 6]} />
        <CylFaces shade={shade} />
        <Ink color={shade.outline} />
    </mesh>
)

/** `user` — a person silhouette: tapered body + head sphere (the client / end user). */
const UserMesh = ({ shade }: { shade: Shade }) => (
    <group>
        <mesh position={[0, 0.4, 0]}>
            <cylinderGeometry args={[0.46, 0.32, 0.8, 40]} />
            <CylFaces shade={shade} />
            <Ink color={shade.outline} />
        </mesh>
        <mesh position={[0, 1.02, 0]}>
            <sphereGeometry args={[0.32, 32, 24]} />
            <meshBasicMaterial color={shade.top} />
        </mesh>
    </group>
)

/** `client` — a monitor on a stand (a web / mobile client device). */
const ClientMesh = ({ shade }: { shade: Shade }) => (
    <group>
        {/* base foot */}
        <mesh position={[0, 0.05, 0]}>
            <boxGeometry args={[0.62, 0.1, 0.4]} />
            <BoxFaces shade={shade} />
            <Ink color={shade.outline} />
        </mesh>
        {/* neck */}
        <mesh position={[0, 0.27, 0]}>
            <boxGeometry args={[0.16, 0.36, 0.12]} />
            <BoxFaces shade={shade} />
            <Ink color={shade.outline} />
        </mesh>
        {/* monitor body */}
        <mesh position={[0, 0.84, 0]}>
            <boxGeometry args={[1.35, 0.92, 0.14]} />
            <BoxFaces shade={shade} />
            <Ink color={shade.outline} />
        </mesh>
        {/* screen display inset on the front (+z) face */}
        <mesh position={[0, 0.86, 0.08]}>
            <boxGeometry args={[1.12, 0.66, 0.02]} />
            <meshBasicMaterial color={shade.faceB} />
            <Ink color={shade.outline} />
        </mesh>
    </group>
)

/** Pick the shape for a node's {@link NodeKind} (default `container`). */
const KindMesh = ({ kind, shade }: { kind: NodeKind | undefined; shade: Shade }) => {
    switch (kind) {
    case "database": return <DatabaseMesh shade={shade} />
    case "broker": return <BrokerMesh shade={shade} />
    case "loadBalancer": return <LoadBalancerMesh shade={shade} />
    case "client": return <ClientMesh shade={shade} />
    case "user": return <UserMesh shade={shade} />
    case "pod": return <PodMesh shade={shade} />
    default: return <ContainerMesh shade={shade} />
    }
}

/** Phosphor icon per kind — the 3rd label line, a quiet type glyph. */
const KIND_ICON: Record<NodeKind, Icon> = {
    client: DesktopIcon,
    loadBalancer: ArrowsSplitIcon,
    container: CubeIcon,
    database: DatabaseIcon,
    broker: StackIcon,
    user: UserIcon,
    pod: HexagonIcon,
}

/** A node rendered as its {@link NodeKind} shape (flat-iso, token tones) + its floating label.
 *  Danger nodes "run hot": every FILL material pulses uniformly toward {@link EMBER} (snapshotted
 *  by traversing the group, so it works for any geometry — box / cylinder / sphere), breathing hot
 *  without the lopsided wash an additive camera-facing glow would leave on just the front faces.
 *  Outline lines (Edges) are skipped so the ink stays one uniform, theme-aware colour.
 *
 *  Optionally clickable (`onClick`) with a `selected` ring under the label — both opt-in so a
 *  purely-decorative scene (the default) renders exactly as before. */
const Bar = ({ node, cell, shade, reduce, selected, onClick }: {
    node: ArchitectureNode
    cell: number
    shade: Shade
    reduce: boolean
    selected?: boolean
    onClick?: () => void
}) => {
    const [cx, cz] = node.cell
    const group = React.useRef<THREE.Group>(null)
    const isDanger = (node.tone ?? "normal") === "danger"
    // snapshot each FILL material's BASE colour so the danger pulse lerps from it every frame
    const bases = React.useRef<Array<{ mat: THREE.MeshBasicMaterial; base: THREE.Color }>>([])
    React.useEffect(() => {
        const acc: Array<{ mat: THREE.MeshBasicMaterial; base: THREE.Color }> = []
        group.current?.traverse((obj) => {
            const mesh = obj as THREE.Mesh
            if (!mesh.isMesh || !mesh.material) return // skip Edges (LineSegments) → outline stays uniform
            const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
            mats.forEach((mm) => {
                const basic = mm as THREE.MeshBasicMaterial
                if (basic.isMeshBasicMaterial) acc.push({ mat: basic, base: basic.color.clone() })
            })
        })
        bases.current = acc
    }, [shade, node.kind])
    useFrame(({ clock }) => {
        if (!isDanger || reduce) return
        const p = (Math.sin(clock.getElapsedTime() * 2.6) + 1) / 2 // 0..1 breathe
        bases.current.forEach(({ mat, base }) => mat.color.copy(base).lerp(EMBER, p * 0.4))
    })
    // 3-line label: name (normal) · sub (muted, lowercase, smaller) · a phosphor type icon.
    const TypeIcon = KIND_ICON[node.kind ?? "container"]
    const StatusIcon = node.status ? STATUS_ICON[node.status.tone] : null
    return (
        <group
            ref={group}
            position={[cx * cell, 0, cz * cell]}
            onClick={onClick ? (event) => { event.stopPropagation(); onClick() } : undefined}
            onPointerOver={onClick ? (event) => { event.stopPropagation(); document.body.style.cursor = "pointer" } : undefined}
            onPointerOut={onClick ? () => { document.body.style.cursor = "auto" } : undefined}
        >
            <KindMesh kind={node.kind} shade={shade} />
            {/* label = a surface chip with a border in the node's own colour; selected → thicker
                accent ring so the click ↔ rail sync reads at a glance */}
            <Html position={[0, LABEL_Y, 0]} center zIndexRange={[120, 0]} style={{ pointerEvents: "none" }}>
                <div
                    className={cn(
                        // `whitespace-normal` + a fixed `max-width` (rather than `nowrap`) so a
                        // long name/sub (e.g. "elasticsearch") WRAPS onto a second line instead of
                        // running wide enough to visually clip against/overlap a neighbouring
                        // node's mesh when several nodes sit close together (a tight fan/chain)
                        "flex w-max max-w-28 select-none flex-col items-center gap-0 whitespace-normal break-words rounded-md border px-2 py-1 text-center",
                        selected && "ring-2 ring-accent ring-offset-1 ring-offset-transparent",
                    )}
                    style={{ backgroundColor: "var(--surface)", borderColor: shade.tint }}
                >
                    <span className="font-mono text-[11px] font-medium leading-tight text-foreground">{node.name}</span>
                    {node.sub ? <span className="font-mono text-[9px] lowercase leading-tight text-muted">{node.sub}</span> : null}
                    <TypeIcon className="size-3 text-muted" aria-hidden />
                    {node.status && StatusIcon ? (
                        <span className={cn("mt-0 flex items-center gap-1 font-mono text-[9px] leading-tight", STATUS_CLASS[node.status.tone])}>
                            <StatusIcon className="size-3 shrink-0" aria-hidden />
                            {node.status.text}
                        </span>
                    ) : null}
                </div>
            </Html>
        </group>
    )
}

/** A floor wire between two nodes. `congested` = a traffic jam: 3 fast packets running at once
 *  (the danger colour); `flow` = a single slow packet; otherwise a static wire. */
const Edge = ({ edge, centres, color, reduce }: { edge: ArchitectureEdge; centres: Record<string, THREE.Vector3>; color: THREE.Color; reduce: boolean }) => {
    const a = centres[edge.from]
    const b = centres[edge.to]
    const isDanger = edge.congested || (edge.tone ?? "normal") === "danger"
    const dots = edge.congested ? 3 : edge.flow ? 1 : 0
    const speed = edge.congested ? 0.9 : 0.4 // congested wires run FAST (the jam pouring through)
    const packets = React.useRef<Array<THREE.Mesh | null>>([])

    useFrame(({ clock }) => {
        if (reduce || !a || !b) return
        const t = clock.getElapsedTime() * speed
        for (let i = 0; i < dots; i += 1) {
            const m = packets.current[i]
            if (m) m.position.lerpVectors(a, b, (t + i / dots) % 1) // evenly staggered → all 3 at once
        }
    })

    if (!a || !b) return null
    return (
        <group>
            <Line
                points={[a, b]}
                color={color}
                lineWidth={isDanger ? 2.4 : 1.5}
                dashed
                dashSize={0.26}
                gapSize={0.16}
                transparent
                opacity={edge.eventual ? 0.5 : 0.85}
            />
            {Array.from({ length: dots }).map((_, i) => (
                <mesh key={i} ref={(el) => { packets.current[i] = el }} position={a}>
                    <sphereGeometry args={[edge.congested ? 0.13 : 0.11, 16, 16]} />
                    <meshBasicMaterial color={color} />
                </mesh>
            ))}
        </group>
    )
}

/** Whole scene (inside the Canvas). The camera orbits via OrbitControls, so no group drift here. */
const Scene = ({ data, palette, reduce, selectedId, onSelectNode }: {
    data: ArchitectureSceneData
    palette: Palette
    reduce: boolean
    selectedId?: string
    onSelectNode?: (id: string) => void
}) => {
    const centres = React.useMemo(() => buildCentres(data.nodes, data.board.cell), [data])
    const grid = React.useMemo(() => buildGrid(data.board), [data.board])
    return (
        <group>
            {/* re-frames the camera to this scene's ACTUAL node bounding box on every
                data change (drilling into a pod, switching layout, …) — a 2-node scene
                and an 8+-node scene both get a fit that shows every label uncropped */}
            <CameraFit nodes={data.nodes} cell={data.board.cell} authored={data.camera} />
            <Line points={grid} segments color={palette.edge.normal} lineWidth={1} transparent opacity={0.22} />
            {data.edges.map((edge) => (
                <Edge
                    key={`${edge.from}-${edge.to}`}
                    edge={edge}
                    centres={centres}
                    color={edge.congested ? palette.edge.danger : palette.edge[edge.tone ?? "normal"]}
                    reduce={reduce}
                />
            ))}
            {data.nodes.map((node) => (
                <Bar
                    key={node.id}
                    node={node}
                    cell={data.board.cell}
                    shade={palette.node[node.tone ?? "normal"]}
                    reduce={reduce}
                    selected={selectedId === node.id}
                    onClick={onSelectNode ? () => onSelectNode(node.id) : undefined}
                />
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
    /**
     * Id of the node to highlight (a ring under its label) — opt-in, for a
     * master-detail atlas that syncs the map selection with a sidebar/URL.
     */
    selectedId?: string
    /**
     * When provided, nodes become clickable (cursor + click), calling back
     * with the clicked node's id — lets a caller sync the map ⇄ a rail/panel.
     */
    onSelectNode?: (id: string) => void
}

/**
 * Hero architecture illustration in real 3D, flat-isometric "tiles on a grid" style, driven
 * entirely by a JSON `data` object and three theme-token tones (normal / success / danger —
 * the danger node runs hot with an ember aura). Honours `prefers-reduced-motion`.
 *
 * @param props - {@link ArchitectureSceneProps}
 */
export const ArchitectureScene = ({ data = DEFAULT_DATA, caption, className, selectedId, onSelectNode }: ArchitectureSceneProps) => {
    const reduce = Boolean(useReducedMotion())
    const palette = usePalette()
    return (
        <div className={cn("w-full", className)}>
            <div className="h-[440px] w-full sm:h-[560px]">
                <Canvas
                    flat
                    orthographic
                    camera={{ position: data.camera.position, zoom: data.camera.zoom, near: -50, far: 100 }}
                    gl={{ alpha: true, antialias: true }}
                    style={{ background: "transparent" }}
                    dpr={[2, 3]}
                >
                    <Scene data={data} palette={palette} reduce={reduce} selectedId={selectedId} onSelectNode={onSelectNode} />
                    {/* drag to orbit (no zoom/pan, no auto-spin — keeps the labels in a stable
                        order). Polar clamped so the camera can't dip under the floor or top-down. */}
                    <OrbitControls
                        makeDefault
                        enableZoom={false}
                        enablePan={false}
                        enableDamping
                        minPolarAngle={Math.PI / 6}
                        maxPolarAngle={Math.PI / 2.2}
                    />
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
