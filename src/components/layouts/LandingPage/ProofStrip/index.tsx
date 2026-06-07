"use client"

import { FaceRobot as Robot, Layers as Stack, Target, Thunderbolt as Lightning } from "@gravity-ui/icons"
import { motion } from "framer-motion"
import React from "react"


/** Container stagger so each proof cell snaps in one after another. */
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
}

/** Per-cell rise + fade. */
const itemVariants = {
    hidden: { y: 16, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { duration: 0.45, ease: "easeOut" as const },
    },
}

/**
 * Honest capability proofs — deliberately NOT student-count vanity metrics.
 * Each cell is a real platform fact that grounds the hero's bold claim before
 * the reader commits to the long narrative below.
 */
const PROOFS = [
    {
        icon: Stack,
        stat: "4 lộ trình",
        caption: "Fullstack · DevOps · Security · Solution Architect",
    },
    {
        icon: Lightning,
        stat: "Easy → Production",
        caption: "Challenge phân cấp, build hệ thống thật & handle lỗi thật",
    },
    {
        icon: Robot,
        stat: "AI chấm 24/7",
        caption: "StarCi AI review code, soi Red Flag trong CV",
    },
    {
        icon: Target,
        stat: "Headhunt thẳng",
        caption: "Mạng lưới đối tác tuyển dụng săn năng lực thật",
    },
] as const

/**
 * Proof strip sitting directly beneath the hero.
 *
 * A four-cell band of concrete, verifiable platform capabilities. It buys early
 * credibility for the hero's positioning so a skeptical reader keeps scrolling
 * into the narrative. No fabricated social proof — that would break the brand's
 * "we refuse to lie to you" promise.
 */
export const ProofStrip = () => {
    return (
        <motion.section
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-px rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden backdrop-blur-sm"
        >
            {PROOFS.map((proof) => {
                const Icon = proof.icon
                return (
                    <motion.div
                        key={proof.stat}
                        variants={itemVariants}
                        className="group flex flex-col gap-2 p-5 md:p-6 bg-background/40 hover:bg-accent/[0.04] transition-colors"
                    >
                        <Icon width={22} height={22} className="text-accent" />
                        <div className="text-lg md:text-xl font-bold tracking-tight text-foreground">
                            {proof.stat}
                        </div>
                        <p className="text-xs md:text-sm text-muted leading-snug">
                            {proof.caption}
                        </p>
                    </motion.div>
                )
            })}
        </motion.section>
    )
}
