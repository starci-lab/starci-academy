"use client"

import { ArrowRight, Cloud, Cube, Cup as Trophy, FaceRobot as Robot, Layers as Stack, Persons as UsersThree, ShieldCheck, Sparkles as Brain } from "@gravity-ui/icons"
import { motion } from "framer-motion"
import React from "react"


/** Container stagger. */
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15, delayChildren: 0.1 },
    },
}

/** Per-item rise + fade. */
const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { duration: 0.5, ease: "easeOut" as const },
    },
}

/** The four stages of the long-term path, in order. */
const ROADMAP = [
    { label: "Fullstack", icon: Stack },
    { label: "DevOps", icon: Cloud },
    { label: "Security", icon: ShieldCheck },
    { label: "Solution Architect", icon: Cube },
] as const

/** The differentiators, framed as capabilities rather than a feature list. */
const PILLARS = [
    {
        icon: Robot,
        title: "StarCi AI — mentor 24/7",
        body: "Chấm bài, review code và soi Red Flags trong CV. Một cộng sự không ngủ, không khoan nhượng với tư duy hời hợt.",
    },
    {
        icon: Brain,
        title: "Architecture Mindmap",
        body: "Học bản chất qua sơ đồ luồng dữ liệu thay vì nhồi nhét text. Bạn nhìn ra hệ thống trước khi viết dòng code đầu tiên.",
    },
    {
        icon: Trophy,
        title: "Leaderboard khốc liệt",
        body: "Lộ trình tự điều chỉnh theo trình độ từng người, và một bảng xếp hạng để bạn biết mình đang đứng ở đâu.",
    },
    {
        icon: UsersThree,
        title: "StarCi Underground",
        body: "Hội kín của những kỹ sư nghiêm túc với nghề. Nơi không có chỗ cho câu hỏi “học cái này ra làm gì”.",
    },
] as const

/**
 * Ambition section — the long-term path and what powers it.
 *
 * Lays out the Fullstack → DevOps → Security → Solution Architect roadmap, then
 * the platform's differentiators, and closes on an open-ended vision line (no
 * sale CTA — that lives in the closing section).
 */
export const AmbitionSection = () => {
    return (
        <motion.section
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="max-w-6xl mx-auto"
        >
            {/* Header */}
            <motion.div variants={itemVariants} className="max-w-2xl mx-auto text-center">
                <div className="flex items-center justify-center gap-2 text-accent mb-4">
                    <Cube width={22} height={22} />
                    <span className="font-mono uppercase tracking-[0.2em] text-xs">
                        Tham vọng
                    </span>
                </div>
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">
                    Một con đường — từ Junior tới người thiết kế hệ thống.
                </h2>
            </motion.div>

            {/* Roadmap rail */}
            <motion.div
                variants={itemVariants}
                className="mt-14 flex flex-col md:flex-row items-stretch md:items-center justify-center gap-4 md:gap-2"
            >
                {ROADMAP.map((stage, index) => {
                    const Icon = stage.icon
                    const isLast = index === ROADMAP.length - 1
                    return (
                        <React.Fragment key={stage.label}>
                            <div
                                className={`flex items-center gap-3 px-5 py-4 rounded-2xl border ${
                                    isLast
                                        ? "border-accent/40 bg-accent/5"
                                        : "border-border bg-default/40"
                                }`}
                            >
                                <Icon
                                    width={26} height={26}
                                    className={isLast ? "text-accent" : "text-muted"}
                                />
                                <span
                                    className={`font-semibold whitespace-nowrap ${
                                        isLast ? "text-accent" : "text-foreground"
                                    }`}
                                >
                                    {stage.label}
                                </span>
                            </div>
                            {!isLast && (
                                <ArrowRight
                                    className="text-muted rotate-90 md:rotate-0 mx-auto md:mx-1 shrink-0"
                                />
                            )}
                        </React.Fragment>
                    )
                })}
            </motion.div>

            {/* Pillars */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
                {PILLARS.map((pillar) => {
                    const Icon = pillar.icon
                    return (
                        <motion.div
                            key={pillar.title}
                            variants={itemVariants}
                            className="group p-8 rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-transparent backdrop-blur-sm shadow-xl hover:border-accent/40 hover:from-accent/[0.08] transition-all duration-300"
                        >
                            <Icon width={36} height={36} className="text-accent mb-5" />
                            <h3 className="text-xl font-semibold text-foreground">
                                {pillar.title}
                            </h3>
                            <p className="mt-3 text-muted leading-relaxed">{pillar.body}</p>
                        </motion.div>
                    )
                })}
            </div>

            {/* Open-ended vision — left hanging, no CTA */}
            <motion.p
                variants={itemVariants}
                className="mt-16 max-w-2xl mx-auto text-center text-lg md:text-xl text-muted leading-relaxed"
            >
                Chúng tôi không xây một khóa học. Chúng tôi đang dựng một thế hệ kỹ sư{" "}
                <span className="text-foreground font-semibold">
                    nghĩ bằng kiến trúc, không bằng cú pháp
                </span>
                .
            </motion.p>
        </motion.section>
    )
}
