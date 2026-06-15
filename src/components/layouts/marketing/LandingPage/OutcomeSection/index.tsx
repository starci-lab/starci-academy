"use client"

import { ArrowRight, House as Buildings, Magnifier as MagnifyingGlass, SealCheck, Target } from "@gravity-ui/icons"
import { motion } from "framer-motion"
import { useLocale } from "next-intl"
import { useRouter } from "next/navigation"
import React, { useCallback, useMemo } from "react"
import { pathConfig } from "@/resources/path"


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

/**
 * Outcome section — StarCi's real output is being head-hunted, not a certificate.
 *
 * Frames the two-sided business model: trained engineers get sourced by StarCi's
 * recruiting partners, and partner companies tap a pool of production-ready
 * architects. The enterprise CTA routes to `/contact`; the engineer CTA scrolls
 * to the course grid. `"use client"` for the locale-aware router push.
 */
export const OutcomeSection = () => {
    const locale = useLocale()
    const router = useRouter()

    /** Locale-aware path to the contact page for recruiting partners. */
    const contactHref = useMemo(
        () => pathConfig().locale(locale).contact().build(),
        [locale],
    )

    const onContact = useCallback(
        () => router.push(contactHref),
        [router, contactHref],
    )

    return (
        <motion.section
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="max-w-5xl mx-auto"
        >
            {/* Header */}
            <motion.div variants={itemVariants} className="max-w-2xl mx-auto text-center">
                <div className="flex items-center justify-center gap-1.5 text-accent mb-4">
                    <Target width={22} height={22} />
                    <span className="font-mono uppercase tracking-[0.2em] text-xs">
                        Đầu ra
                    </span>
                </div>
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">
                    Đích đến không phải tấm chứng chỉ.
                    <br />
                    <span className="text-accent">Là khi doanh nghiệp săn bạn.</span>
                </h2>
                <p className="mt-6 text-muted text-lg">
                    StarCi không kết thúc ở bài học cuối. Chúng tôi vận hành một mạng lưới
                    đối tác tuyển dụng IT — biến năng lực bạn rèn được thành lời mời làm việc.
                </p>
            </motion.div>

            {/* Two-sided cards */}
            <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* For engineers */}
                <motion.div
                    variants={itemVariants}
                    className="group p-8 rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-transparent backdrop-blur-sm shadow-xl hover:border-accent/40 transition-all duration-300 flex flex-col"
                >
                    <MagnifyingGlass width={36} height={36} className="text-accent mb-5" />
                    <h3 className="text-2xl font-semibold text-foreground">
                        Dành cho kỹ sư
                    </h3>
                    <p className="mt-3 text-muted leading-relaxed">
                        Hồ sơ của bạn được đưa thẳng tới đối tác tuyển dụng của StarCi — thay
                        vì rải CV vào hư không và chờ một email không bao giờ đến.
                    </p>
                    <ul className="mt-6 space-y-3 text-sm text-muted">
                        <li className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                            Được headhunt dựa trên năng lực thật, không phải từ khoá đẹp trong CV.
                        </li>
                        <li className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                            StarCi AI soi Red Flags trong hồ sơ trước khi nó tới tay nhà tuyển dụng.
                        </li>
                    </ul>
                    <a
                        href="#courses"
                        className="mt-8 flex items-center gap-1.5 font-medium text-accent group-hover:gap-4 transition-all"
                    >
                        Bắt đầu lộ trình <ArrowRight />
                    </a>
                </motion.div>

                {/* For enterprises */}
                <motion.div
                    variants={itemVariants}
                    className="group relative p-8 rounded-2xl border border-accent/30 bg-gradient-to-br from-accent/[0.12] via-white/[0.03] to-transparent backdrop-blur-sm shadow-xl shadow-accent/5 hover:border-accent/50 transition-all duration-300 flex flex-col overflow-hidden"
                >
                    <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-accent/15 blur-3xl pointer-events-none" />
                    <Buildings width={36} height={36} className="text-accent mb-5" />
                    <h3 className="text-2xl font-semibold text-foreground">
                        Dành cho doanh nghiệp
                    </h3>
                    <p className="mt-3 text-muted leading-relaxed">
                        Tiếp cận nguồn kỹ sư đã qua hệ thống challenge production-ready. Bạn
                        không cần kiểm tra lại tư duy nền tảng — chúng tôi đã làm điều đó.
                    </p>
                    <ul className="mt-6 space-y-3 text-sm text-muted">
                        <li className="flex items-center gap-1.5">
                            <SealCheck width={16} height={16} className="text-accent shrink-0" />
                            Ứng viên được đánh giá qua bài thật, không phải bằng cấp.
                        </li>
                        <li className="flex items-center gap-1.5">
                            <SealCheck width={16} height={16} className="text-accent shrink-0" />
                            Rút ngắn vòng tuyển — tập trung vào fit văn hoá và chuyên môn sâu.
                        </li>
                    </ul>
                    <button
                        type="button"
                        onClick={onContact}
                        className="mt-8 w-fit px-6 py-2 rounded-full bg-accent text-accent-foreground font-medium text-sm hover:opacity-90 transition-opacity"
                    >
                        Trở thành đối tác tuyển dụng
                    </button>
                </motion.div>
            </div>
        </motion.section>
    )
}
