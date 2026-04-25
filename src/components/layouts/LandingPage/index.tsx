"use client"
import { motion } from "framer-motion"
import { Courses } from "@/components/layouts"
import { Spacer } from "@/components/reuseable"
import { useTranslations } from "next-intl"
import React from "react"
import { TrapSection } from "./TrapSection"
import { RealityCheckSection } from "./RealityCheckSection"
import { MethodologySection } from "./MethodologySection"
/**
 * Landing page layout for the public homepage.
 *
 * @param props - Component props.
 */
export const LandingPage = () => {
    const t = useTranslations()

    return (
        <div className="p-3 max-w-[1280px] mx-auto">
            <Spacer y={20} />
            <TrapSection />
            <Spacer y={16} />
            <RealityCheckSection />
            <Spacer y={48} />
            <motion.div
                className="flex items-center justify-center"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            >
                <div className="text-2xl font-bold flex gap-1">{t("home.diff.title")}</div>
            </motion.div>
            <Spacer y={48} />
            <MethodologySection />
            <Spacer y={48} />
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.35, ease: "easeOut" }}
            >
                <Courses />
            </motion.div>
        </div>
    )
}
