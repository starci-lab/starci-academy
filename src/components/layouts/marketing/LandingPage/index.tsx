"use client"
import { motion } from "framer-motion"
import { Courses } from "@/components/layouts/Courses"
import { Spacer } from "@/components/reuseable"
import { useTranslations } from "next-intl"
import React from "react"
import { HeroSection } from "./HeroSection"
import { ProofStrip } from "./ProofStrip"
import { FaqSection } from "./FaqSection"
import { TrapSection } from "./TrapSection"
import { RealityCheckSection } from "./RealityCheckSection"
import { ManifestoSection } from "./ManifestoSection"
import { ContrastSection } from "./ContrastSection"
import { MethodologySection } from "./MethodologySection"
import { AmbitionSection } from "./AmbitionSection"
import { OutcomeSection } from "./OutcomeSection"

/**
 * Landing page layout for the public homepage.
 *
 * Narrative arc: hook the trap (Hero) → name it (Trap/RealityCheck) → earn trust
 * (Manifesto) → draw the line vs. common practice (Contrast) → prove the method
 * (Methodology) → show the ambition/roadmap (Ambition) → convert (Courses) →
 * leave them thinking (closing). Each block is its own client section.
 */
export const LandingPage = () => {
    const t = useTranslations()

    return (
        <div className="relative">
            {/* Atmospheric background — fixed teal glow + faint technical grid */}
            <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[600px] w-[900px] rounded-full bg-accent/15 blur-[140px]" />
                <div className="absolute top-[40%] -right-40 h-[400px] w-[400px] rounded-full bg-accent/10 blur-[120px]" />
                <div
                    className="absolute inset-0 opacity-[0.07] [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]"
                    style={{
                        backgroundImage:
                            "linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)",
                        backgroundSize: "56px 56px",
                    }}
                />
            </div>

            <div className="p-3 max-w-[1280px] mx-auto">
                <Spacer y={24} />
                <HeroSection />
                <Spacer y={20} />
                <ProofStrip />
                <Spacer y={40} />
                <TrapSection />
                <Spacer y={16} />
                <RealityCheckSection />
                <Spacer y={48} />
                <ManifestoSection />
                <Spacer y={48} />
                <ContrastSection />
                <Spacer y={48} />
                <motion.div
                    className="flex items-center justify-center"
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
                >
                    <div className="text-2xl font-bold flex gap-1 text-center">{t("home.diff.title")}</div>
                </motion.div>
                <Spacer y={48} />
                <MethodologySection />
                <Spacer y={48} />
                <AmbitionSection />
                <Spacer y={48} />
                <OutcomeSection />
                <Spacer y={48} />
                <motion.div
                    id="courses"
                    className="scroll-mt-24"
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5, delay: 0.35, ease: "easeOut" }}
                >
                    <Courses />
                </motion.div>
                <Spacer y={48} />
                <FaqSection />
                <Spacer y={48} />

                {/* Closing — open-ended, no sale language */}
                <motion.section
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="max-w-2xl mx-auto text-center"
                >
                    <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-foreground leading-tight">
                    Bạn có thể code CRUD thêm 3 năm nữa.
                        <br />
                        <span className="text-accent">Hoặc bắt đầu nghĩ như một người thiết kế hệ thống — hôm nay.</span>
                    </h2>
                    <div className="mt-8 flex justify-center">
                        <a
                            href="#courses"
                            className="px-7 py-3 rounded-full bg-accent text-accent-foreground font-semibold hover:opacity-90 transition-opacity"
                        >
                            {t("courses.viewCourse")}
                        </a>
                    </div>
                </motion.section>
                <Spacer y={24} />
            </div>
        </div>
    )
}
