"use client"

import React from "react"
import { cn, Typography } from "@heroui/react"
import { WarningIcon } from "@phosphor-icons/react"
import { motion, useReducedMotion, type Variants } from "framer-motion"
import type { CSSProperties, ReactNode } from "react"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** One node in the curated topology. */
interface DiagramNode {
    /** Node name (e.g. "API Gateway"). */
    name: string
    /** Sub-label (mono caps, e.g. "RATE-LIMIT · AUTHZ"). */
    sub: string
    /** Visual tone: `accent` = focal · `danger` = failure point · `data` = a data store. */
    tone?: "accent" | "danger" | "data"
}

/** Curated microservices topology (a marketing illustration, not live data). */
const TIERS: ReadonlyArray<ReadonlyArray<DiagramNode>> = [
    [{ name: "Client", sub: "WEB · MOBILE" }],
    [{ name: "Load Balancer", sub: "ROUND-ROBIN" }],
    [{ name: "API Gateway", sub: "RATE-LIMIT · AUTHZ", tone: "accent" }],
    [
        { name: "Auth", sub: "JWT" },
        { name: "Order", sub: "gRPC" },
        { name: "Payment", sub: "SYNC", tone: "danger" },
    ],
    [
        { name: "Postgres", sub: "1 NODE", tone: "danger" },
        { name: "Redis", sub: "CACHE", tone: "data" },
        { name: "Kafka", sub: "EVENTS", tone: "data" },
    ],
]

/**
 * Failure annotations — each floats next to the TIER whose weakness it names, top→bottom
 * along the request path, so the content reads as one coherent "what's wrong with this
 * naive v2" story (System Design teaches you to spot + fix these):
 *  - EDGE  (Load Balancer / single gateway funnel, no surge protection) → a spike overloads it.
 *  - SERVICE (Payment's SYNC call blocks the thread) → the failure cascades upstream.
 *  - DATA  (one Postgres node = single writer) → it becomes the bottleneck + SPOF.
 */
const FAILURES: ReadonlyArray<{ text: string; pos: string }> = [
    // sits right beside the entry wire (Client → LB) where the red spike pours in
    { text: "spike → overload", pos: "left-[53%] top-[14%]" },
    { text: "sync call → cascade", pos: "right-3 top-[60%]" },
    // tucked tight against Postgres's top-left (mirrors the cascade chip on Payment)
    { text: "single DB → bottleneck", pos: "left-3 bottom-16" },
]

/** Props for {@link MicroservicesDiagram}. */
export interface MicroservicesDiagramProps extends WithClassNames<undefined> {
    /** Caption under the diagram (i18n string from the feature). */
    caption?: ReactNode
}

/** Node box class by tone (semi-transparent fill + tone-aware border; glow added inline). */
const nodeClass = (tone?: DiagramNode["tone"]) => cn(
    "flex min-w-24 flex-col items-center rounded-xl border px-3 py-2 text-center backdrop-blur-sm",
    tone === "accent"
        ? "border-accent/80 bg-accent/[0.08]"
        : tone === "danger"
            ? "border-danger/70 bg-danger/[0.08]"
            : tone === "data"
                ? "border-success/40 bg-success/[0.05]"
                : "border-foreground/15 bg-foreground/[0.03]",
)

/** Static tone-coloured glow (theme-aware via color-mix): the accent focal node, and
 * a stronger fallback glow for danger nodes when reduced-motion is preferred (their
 * throbbing pulse — see the `DangerPulse` overlay — is suppressed then). */
const nodeGlow = (tone: DiagramNode["tone"], reduce: boolean): CSSProperties | undefined => {
    if (tone === "accent") {
        return { boxShadow: "0 0 22px -6px color-mix(in oklch, var(--accent) 65%, transparent)" }
    }
    if (tone === "danger" && reduce) {
        return { boxShadow: "0 0 24px -5px color-mix(in oklch, var(--danger) 75%, transparent)" }
    }
    return undefined
}

/** A throbbing red glow overlaid on a bottleneck node — a swelling box-shadow that
 * reads as "under pressure, about to boil over". Pure Framer (matches the rest of
 * the diagram's motion); rendered only when motion is allowed. */
const DangerPulse = () => (
    <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-xl"
        animate={{
            boxShadow: [
                "0 0 11px -8px color-mix(in oklch, var(--danger) 36%, transparent)",
                "0 0 30px -3px color-mix(in oklch, var(--danger) 88%, transparent)",
                "0 0 11px -8px color-mix(in oklch, var(--danger) 36%, transparent)",
            ],
        }}
        transition={{ repeat: Infinity, duration: 1.35, ease: "easeInOut" }}
    />
)

/**
 * Coded hero illustration: a microservices topology (`order-service.v2`) framed in a
 * window over a blueprint dot-grid, with the focal node in accent (glow) + the failure
 * points (cascade / bottleneck / overload) floating beside the area they threaten. Nodes
 * stagger in, the failure chips float gently, and a data "packet" flows down each wire —
 * all via Framer Motion / CSS, honouring `prefers-reduced-motion`. Pure CSS surface, no
 * image. Topology is a curated marketing illustration; `caption` is i18n from the feature.
 *
 * @param props - {@link MicroservicesDiagramProps}
 */
export const MicroservicesDiagram = ({ caption, className }: MicroservicesDiagramProps) => {
    const reduce = useReducedMotion()

    // node entrance: stagger fade-rise (no transform when reduced motion is preferred)
    const containerVariants: Variants = {
        show: { transition: { staggerChildren: reduce ? 0 : 0.05, delayChildren: reduce ? 0 : 0.1 } },
    }
    const nodeVariants: Variants = reduce
        ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
        : { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }

    return (
        <div className={cn("w-full overflow-hidden rounded-3xl border border-default bg-surface", className)}>
            {/* window chrome */}
            <div className="flex items-center gap-2 border-b border-default px-4 py-2.5">
                <span aria-hidden className="size-2.5 rounded-full bg-foreground/15" />
                <span aria-hidden className="size-2.5 rounded-full bg-foreground/15" />
                <span aria-hidden className="size-2.5 rounded-full bg-foreground/15" />
                <Typography type="code" className="ml-2 text-xs text-muted">order-service.v2</Typography>
            </div>

            {/* content over a blueprint dot-grid; relative so failure chips can float */}
            <motion.div
                className="relative flex flex-col items-center gap-2 p-5"
                style={{
                    backgroundImage: "radial-gradient(color-mix(in oklch, var(--foreground) 7%, transparent) 1px, transparent 1px)",
                    backgroundSize: "18px 18px",
                }}
                variants={containerVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
            >
                {TIERS.map((tier, index) => (
                    <React.Fragment key={tier.map((node) => node.name).join("-")}>
                        {index > 0 ? (
                            // vertical wire + a data "packet" flowing down it (orthogonal, staggered).
                            // the ENTRY wire (Client → LB, from the FE) carries a RED packet — the
                            // traffic spike pouring in that overloads the edge.
                            <span
                                aria-hidden
                                className={cn("relative h-6 w-px", index === 1 ? "bg-danger/25" : "bg-foreground/12")}
                            >
                                <span
                                    className={cn(
                                        "absolute left-1/2 top-0 rounded-full",
                                        index === 1
                                            ? "size-2 bg-danger shadow-[0_0_9px_var(--danger)]"
                                            : "size-1.5 bg-accent shadow-[0_0_6px_var(--accent)]",
                                    )}
                                    style={{ animation: reduce ? undefined : `wireFlow ${index === 1 ? "0.75s" : "1.6s"} linear ${index * 0.18}s infinite` }}
                                />
                            </span>
                        ) : null}
                        <div className="flex flex-wrap items-stretch justify-center gap-2">
                            {tier.map((node) => (
                                <motion.div
                                    key={node.name}
                                    variants={nodeVariants}
                                    className={cn("relative", nodeClass(node.tone))}
                                    style={nodeGlow(node.tone, Boolean(reduce))}
                                >
                                    {/* bottlenecks throb (Framer) — "about to boil over" */}
                                    {node.tone === "danger" && !reduce ? <DangerPulse /> : null}
                                    {/* font-mono spans (NOT Typography type="code", whose
                                        `bg-default` adds an unwanted pill behind the text) */}
                                    <span className="font-mono text-xs font-medium text-foreground">{node.name}</span>
                                    <span className="font-mono text-[10px] text-muted">{node.sub}</span>
                                </motion.div>
                            ))}
                        </div>
                    </React.Fragment>
                ))}

                {/* failure points — floated beside the area they threaten, drifting gently */}
                {FAILURES.map((failure, index) => (
                    <motion.span
                        key={failure.text}
                        className={cn(
                            "absolute inline-flex items-center gap-1 rounded-md border border-danger/40 bg-danger/10 px-2 py-1 backdrop-blur-sm",
                            failure.pos,
                        )}
                        style={{ boxShadow: "0 0 14px -7px color-mix(in oklch, var(--danger) 55%, transparent)" }}
                        animate={reduce ? undefined : { y: [0, -4, 0] }}
                        transition={reduce ? undefined : { repeat: Infinity, duration: 3 + index * 0.5, ease: "easeInOut" }}
                    >
                        <WarningIcon aria-hidden focusable="false" className="size-3 text-danger" />
                        <span className="font-mono text-[10px] text-danger">{failure.text}</span>
                    </motion.span>
                ))}
            </motion.div>

            {caption ? (
                <Typography type="body-sm" color="muted" align="center" className="px-5 pb-5">
                    {caption}
                </Typography>
            ) : null}
        </div>
    )
}
