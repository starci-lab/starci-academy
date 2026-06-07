"use client"

import { QuoteOpen as Quotes, Thunderbolt as Lightning } from "@gravity-ui/icons"
import { motion } from "framer-motion"
import React from "react"


/** Container stagger so each paragraph lands one after another. */
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.18, delayChildren: 0.1 },
    },
}

/** Per-line rise + fade. */
const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { duration: 0.5, ease: "easeOut" as const },
    },
}

/**
 * Founder manifesto — "The Alpha Architect".
 *
 * First-person, cold, battle-tested. Establishes personality and credibility
 * without selling. The avatar + name block below the quote is a deliberate
 * placeholder — drop in the real photo at `public/founder.jpg` and the real
 * name/handle before launch.
 */
export const ManifestoSection = () => {
    return (
        <motion.section
            id="manifesto"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="max-w-3xl mx-auto"
        >
            {/* Eyebrow */}
            <motion.div
                variants={itemVariants}
                className="flex items-center gap-2 text-accent mb-6"
            >
                <Lightning width={20} height={20} />
                <span className="font-mono uppercase tracking-[0.2em] text-xs">
                    Người dựng StarCi
                </span>
            </motion.div>

            {/* The cold opener — a real moment, specific time */}
            <motion.h2
                variants={itemVariants}
                className="text-3xl md:text-5xl font-bold tracking-tight leading-tight text-foreground"
            >
                2 giờ 47 phút sáng. Production sập.
                <br />
                <span className="text-muted">Không có ai để gọi.</span>
            </motion.h2>

            {/* The struggle → turning point → insight, in first person */}
            <div className="mt-10 space-y-6 text-base md:text-lg text-muted leading-relaxed">
                <motion.p variants={itemVariants}>
                    Tôi đi lên từ đống bùn. Những năm đầu, tôi cày 16 tiếng một ngày,
                    không lễ không Tết, gồng gánh những hệ thống có người dùng thật. Tôi
                    đã đứng nhìn dashboard đỏ rực lúc nửa đêm và hiểu ra một điều: lúc đó,
                    không một tấm chứng chỉ nào cứu được tôi.
                </motion.p>
                <motion.p variants={itemVariants}>
                    Thứ cứu tôi là{" "}
                    <span className="text-foreground font-medium">tư duy kiến trúc</span> —
                    khả năng nhìn ra điểm thắt cổ chai trước khi nó nổ, biết khi nào
                    chấp nhận <span className="text-foreground font-medium">eventual consistency</span>,
                    và đủ tỉnh táo để thiết kế cho lúc hệ thống <em>sập</em>, chứ không
                    phải cho lúc nó chạy.
                </motion.p>
                <motion.p variants={itemVariants}>
                    Tôi không dạy bạn cách qua một vòng phỏng vấn. Tôi dạy bạn cách không
                    gục khi hệ thống của bạn thật sự có người dùng. StarCi ra đời vì 5 năm
                    trước không ai chỉ tôi những điều này — tôi đã tự trả giá bằng những
                    đêm trắng.
                </motion.p>
            </div>

            {/* Signature block — replace placeholders before launch */}
            <motion.div
                variants={itemVariants}
                className="mt-12 flex items-center gap-4 pl-6 border-l-2 border-accent"
            >
                {/* TODO: replace with the real photo — <img src="/founder.jpg" ... /> */}
                <div className="w-14 h-14 rounded-full bg-default flex items-center justify-center shrink-0">
                    <Quotes width={22} height={22} className="text-muted" />
                </div>
                <div>
                    {/* TODO: fill in the founder's real name */}
                    <div className="font-semibold text-foreground">Founder · StarCi Academy</div>
                    <div className="text-sm text-muted">Solution Architect · Battle-tested builder</div>
                </div>
            </motion.div>
        </motion.section>
    )
}
