"use client"

import { ArrowRight, ArrowsRotateLeft as ArrowsClockwise, Cube, Database, Layers as Stack, Thunderbolt as Bolt, Thunderbolt as Lightning } from "@gravity-ui/icons"
import { motion } from "framer-motion"
import { useTranslations } from "next-intl"
import React from "react"


/** Container stagger for the hero intro. */
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.12, delayChildren: 0.1 },
    },
}

/** Per-line rise + fade used by every hero element. */
const itemVariants = {
    hidden: { y: 24, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { duration: 0.6, ease: "easeOut" as const },
    },
}

/** Technical keywords shown as a filter strip — jargon is the audience gate. */
const KEYWORDS = [
    "microservices",
    "eventual consistency",
    "CAP theorem",
    "idempotency",
]

/** A single node row inside the architecture diagram visual. */
const FLOW_NODES = [
    { label: "API Gateway", icon: ArrowsClockwise, hint: "routing · auth" },
    { label: "Service Mesh", icon: Stack, hint: "microservices" },
    { label: "Cache", icon: Bolt, hint: "redis · low latency" },
    { label: "Database", icon: Database, hint: "replicated · sharded" },
] as const

/**
 * Opening hero for the public homepage.
 *
 * Two-column on desktop: a left-aligned positioning statement and CTAs, beside a
 * glassmorphism "architecture diagram" visual that signals the System-Design
 * subject matter. Stacks on mobile. `"use client"` only for framer-motion.
 */
export const HeroSection = () => {
    const t = useTranslations("landing.hero")
    return (
        <motion.section
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-10 items-center"
        >
            {/* Left column — the message */}
            <div className="flex flex-col items-start text-left">
                {/* Eyebrow */}
                <motion.div
                    variants={itemVariants}
                    className="flex items-center gap-2 text-accent mb-6 rounded-full border border-accent/20 bg-accent/5 px-3 py-1"
                >
                    <Cube width={16} height={16} />
                    <span className="font-mono uppercase tracking-[0.18em] text-[11px]">
                        {t("eyebrow")}
                    </span>
                </motion.div>

                {/* Headline */}
                <motion.h1
                    variants={itemVariants}
                    className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.05] text-foreground"
                >
                    {t.rich("headline", {
                        crud: (chunks) => <span className="text-muted line-through decoration-danger/60">{chunks}</span>,
                        accent: (chunks) => <span className="text-accent">{chunks}</span>,
                        br: () => <br />,
                    })}
                </motion.h1>

                {/* Subline */}
                <motion.p
                    variants={itemVariants}
                    className="mt-7 text-base md:text-lg text-muted leading-relaxed max-w-xl"
                >
                    {t.rich("subline", {
                        b: (chunks) => <span className="text-foreground font-medium">{chunks}</span>,
                    })}
                </motion.p>

                {/* CTAs */}
                <motion.div
                    variants={itemVariants}
                    className="mt-9 flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
                >
                    <a
                        href="#courses"
                        className="group flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-accent text-accent-foreground font-semibold shadow-lg shadow-accent/20 hover:gap-3 hover:shadow-accent/30 transition-all"
                    >
                        {t("ctaRoadmap")}
                        <ArrowRight />
                    </a>
                    <a
                        href="#manifesto"
                        className="flex items-center justify-center gap-2 px-7 py-3 rounded-full border border-border text-foreground font-medium hover:border-accent/50 hover:bg-accent/5 transition-all"
                    >
                        {t("ctaFounder")}
                    </a>
                </motion.div>

                {/* Keyword strip */}
                <motion.div
                    variants={itemVariants}
                    className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-2"
                >
                    <Lightning width={15} height={15} className="text-accent" />
                    {KEYWORDS.map((keyword, index) => (
                        <React.Fragment key={keyword}>
                            {index > 0 && <span className="text-border select-none">·</span>}
                            <span className="font-mono text-xs text-muted">{keyword}</span>
                        </React.Fragment>
                    ))}
                </motion.div>
            </div>

            {/* Right column — the architecture diagram visual */}
            <motion.div
                variants={itemVariants}
                className="relative"
            >
                {/* Glow behind the card */}
                <div className="absolute -inset-4 bg-accent/10 blur-3xl rounded-full pointer-events-none" />

                <div className="relative rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-transparent backdrop-blur-sm p-5 shadow-2xl">
                    {/* Window chrome */}
                    <div className="flex items-center gap-2 pb-4 border-b border-white/5">
                        <span className="w-3 h-3 rounded-full bg-danger/70" />
                        <span className="w-3 h-3 rounded-full bg-warning/70" />
                        <span className="w-3 h-3 rounded-full bg-success/70" />
                        <span className="ml-3 font-mono text-xs text-muted">
                            system-design.ts
                        </span>
                    </div>

                    {/* Entry node */}
                    <div className="mt-5 flex justify-center">
                        <div className="flex items-center gap-2 px-4 py-2 rounded-lg border border-accent/30 bg-accent/10 text-accent text-sm font-medium">
                            <ArrowsClockwise width={16} height={16} />
                            10M requests / day
                        </div>
                    </div>

                    {/* Connector */}
                    <div className="flex justify-center">
                        <div className="w-px h-5 bg-gradient-to-b from-accent/50 to-border" />
                    </div>

                    {/* Flow nodes */}
                    <div className="space-y-2.5">
                        {FLOW_NODES.map((node, index) => {
                            const Icon = node.icon
                            return (
                                <motion.div
                                    key={node.label}
                                    initial={{ opacity: 0, x: 12 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.6 + index * 0.12, duration: 0.4 }}
                                    className="flex items-center gap-3 px-4 py-3 rounded-lg border border-white/5 bg-white/[0.03] hover:border-accent/30 transition-colors"
                                >
                                    <div className="flex items-center justify-center w-9 h-9 rounded-md bg-accent/10 text-accent shrink-0">
                                        <Icon width={18} height={18} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-medium text-foreground">{node.label}</div>
                                        <div className="font-mono text-[11px] text-muted truncate">{node.hint}</div>
                                    </div>
                                    <span className="font-mono text-[11px] text-success">healthy</span>
                                </motion.div>
                            )
                        })}
                    </div>

                    {/* Footer metric */}
                    <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between font-mono text-[11px]">
                        <span className="text-muted">p99 latency</span>
                        <span className="text-accent">42ms</span>
                    </div>
                </div>
            </motion.div>
        </motion.section>
    )
}
