"use client"

import { Check, TriangleExclamation as Warning, Xmark as X } from "@gravity-ui/icons"
import { cn } from "@heroui/react"
import { motion } from "framer-motion"
import React from "react"
import { type WithClassNames } from "@/modules/types"


/** Container stagger for the two columns + rows. */
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.12, delayChildren: 0.1 },
    },
}

/** Per-row rise + fade. */
const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { duration: 0.5, ease: "easeOut" as const },
    },
}

/**
 * Each row contrasts a common (un-named) industry practice with the StarCi way.
 * Phrased as habits, never as a named competitor — safe controversy only.
 */
const ROWS: { other: string; starci: string }[] = [
    {
        other: "Cam kết “lương nghìn đô sau 3 tháng”",
        starci: "Không bán giấc mơ — bán năng lực thật, đo bằng challenge",
    },
    {
        other: "Học cho “chạy được” rồi dừng lại",
        starci: "Mổ xẻ tới scalability, availability và tối ưu chi phí",
    },
    {
        other: "Xem video thụ động, tua cho hết bài",
        starci: "Bị ném vào challenge từ Easy đến Production-Ready",
    },
    {
        other: "Phát chứng chỉ để treo tường",
        starci: "Hệ thống thật bạn tự build, tự handle lỗi thật",
    },
    {
        other: "Dạy đúng một stack — lỗi thời ngay năm sau",
        starci: "Dạy bản chất & keyword để bạn tự research mọi stack",
    },
    {
        other: "Học xong tự rải CV, chờ email không bao giờ tới",
        starci: "Được đối tác tuyển dụng của StarCi headhunt thẳng",
    },
]

/**
 * "The truth no one tells you" — a side-by-side that contrasts widespread
 * teaching habits with StarCi's approach. Sharp but sober: no competitor is
 * named, and the closing line reframes it as honesty, not attack.
 */
export type ContrastSectionProps = WithClassNames<undefined>

/**
 * @param {ContrastSectionProps} props Optional wrapper styling props.
 */
export const ContrastSection = ({ className }: ContrastSectionProps) => {
    return (
        <motion.section
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className={cn("max-w-4xl mx-auto", className)}
        >
            {/* Header */}
            <motion.div variants={itemVariants} className="max-w-2xl mb-12">
                <div className="flex items-center gap-1.5 text-accent mb-4">
                    <Warning width={22} height={22} />
                    <span className="font-mono uppercase tracking-[0.2em] text-xs">
                        Sự thật
                    </span>
                </div>
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">
                    Vì sao “lương nghìn đô sau 3 tháng” là{" "}
                    <span className="text-accent italic">lời nói dối tử tế</span>?
                </h2>
            </motion.div>

            {/* Two-column compare */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
                {/* Column labels */}
                <motion.div
                    variants={itemVariants}
                    className="hidden md:block text-sm font-semibold uppercase tracking-wide text-muted"
                >
                    Nơi khác thường dạy
                </motion.div>
                <motion.div
                    variants={itemVariants}
                    className="hidden md:block text-sm font-semibold uppercase tracking-wide text-accent"
                >
                    Cách StarCi làm
                </motion.div>

                {/* Rows — each pair animates together */}
                {ROWS.map((row) => (
                    <React.Fragment key={row.starci}>
                        <motion.div
                            variants={itemVariants}
                            className="flex items-start gap-3 p-4 rounded-xl border border-white/5 bg-white/[0.02]"
                        >
                            <X
                                width={20} height={20}
                                className="text-danger shrink-0 mt-0.5"
                            />
                            <span className="text-sm md:text-base text-muted line-through decoration-danger/40">
                                {row.other}
                            </span>
                        </motion.div>
                        <motion.div
                            variants={itemVariants}
                            className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-accent/[0.10] to-transparent border border-accent/25"
                        >
                            <Check
                                width={20} height={20}
                                className="text-accent shrink-0 mt-0.5"
                            />
                            <span className="text-sm md:text-base text-foreground">
                                {row.starci}
                            </span>
                        </motion.div>
                    </React.Fragment>
                ))}
            </div>

            {/* Closing line — reframes the whole section as honesty, not attack */}
            <motion.p
                variants={itemVariants}
                className="mt-12 text-lg md:text-xl text-center text-muted"
            >
                Chúng tôi không chê ai.{" "}
                <span className="text-foreground font-semibold">
                    Chúng tôi chỉ từ chối nói dối bạn.
                </span>
            </motion.p>
        </motion.section>
    )
}
