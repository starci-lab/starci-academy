"use client"

import { CircleQuestion as Question, Minus, Plus } from "@gravity-ui/icons"
import { motion } from "framer-motion"
import React, { useState, useCallback } from "react"


/** Container stagger for the header + rows. */
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
}

/** Per-row rise + fade. */
const itemVariants = {
    hidden: { y: 16, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { duration: 0.45, ease: "easeOut" as const },
    },
}

/**
 * The five hardest objections, answered head-on. The voice is confident and
 * direct — the brand earns authority by facing the skeptical question instead
 * of dodging it, never by attacking anyone.
 */
const FAQS: { q: string; a: React.ReactNode }[] = [
    {
        q: "Đây có phải một bootcamp cam kết “lương nghìn đô sau 3 tháng” không?",
        a: (
            <>
                Không. Chúng tôi không bán giấc mơ và không bán cột mốc lương. Năng lực
                được đo bằng những challenge bạn tự giải, không bằng một lời hứa in trên
                banner. Nếu bạn cần một con số để yên tâm, đây không phải chỗ dành cho bạn.
            </>
        ),
    },
    {
        q: "Tôi mới đi làm vài năm, chỉ quen CRUD — học có theo nổi không?",
        a: (
            <>
                Đó chính xác là người StarCi sinh ra để phục vụ. Lộ trình đi từ nền tảng
                và challenge phân cấp từ Easy đến Production-Ready — bạn không bị ném vào
                vùng nước sâu, nhưng cũng không được phép đứng yên ở chỗ cạn.
            </>
        ),
    },
    {
        q: "AI viết được code rồi, học tư duy hệ thống còn đáng giá không?",
        a: (
            <>
                Đáng giá hơn bao giờ hết. AI viết được hàm, nhưng không chịu trách nhiệm
                khi production sập lúc 2 giờ sáng. Thứ quyết định bạn bị thay thế hay được
                trả lương cao chính là{" "}
                <span className="text-foreground font-medium">tư duy kiến trúc</span> — và
                đó là toàn bộ thứ chúng tôi dạy.
            </>
        ),
    },
    {
        q: "Học xong tôi có việc không?",
        a: (
            <>
                Chúng tôi không rải lời hứa, chúng tôi vận hành một mạng lưới đối tác tuyển
                dụng. Hồ sơ của bạn được đưa thẳng tới họ dựa trên năng lực thật đã đo qua
                challenge — không phải vài từ khoá đẹp trong CV. Phần còn lại là bản lĩnh
                của bạn.
            </>
        ),
    },
    {
        q: "Khác gì hàng trăm khoá học IT đầy rẫy trên mạng?",
        a: (
            <>
                Hầu hết dạy bạn cho “chạy được” rồi dừng. Chúng tôi mổ xẻ tới scalability,
                availability và chi phí — rồi bắt bạn tự build và tự gánh lỗi. Chúng tôi
                dạy bản chất để bạn tự research mọi stack, thay vì khoá cứng bạn vào một
                công nghệ sẽ lỗi thời ngay năm sau.
            </>
        ),
    },
]

/** A single expandable FAQ row. */
const FaqRow = ({ q, a }: { q: string; a: React.ReactNode }) => {
    const [open, setOpen] = useState(false)
    const toggle = useCallback(() => setOpen((prev) => !prev), [])

    return (
        <motion.div
            variants={itemVariants}
            className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden transition-colors hover:border-accent/30"
        >
            <button
                type="button"
                onClick={toggle}
                aria-expanded={open}
                className="flex w-full items-center justify-between gap-4 p-5 md:p-6 text-left"
            >
                <span className="text-base md:text-lg font-semibold text-foreground">
                    {q}
                </span>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-accent/30 bg-accent/5 text-accent">
                    {open ? <Minus width={16} height={16} /> : <Plus width={16} height={16} />}
                </span>
            </button>
            <motion.div
                initial={false}
                animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="overflow-hidden"
            >
                <p className="px-5 md:px-6 pb-5 md:pb-6 text-sm md:text-base text-muted leading-relaxed">
                    {a}
                </p>
            </motion.div>
        </motion.div>
    )
}

/**
 * Objection-handling FAQ — the confidence section.
 *
 * Sits just before the closing CTA so the last doubt is cleared before the ask.
 * Facing the hardest questions directly is how the page signals authority
 * without bragging or attacking competitors.
 */
export const FaqSection = () => {
    return (
        <motion.section
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="max-w-3xl mx-auto"
        >
            {/* Header */}
            <motion.div variants={itemVariants} className="text-center mb-12">
                <div className="flex items-center justify-center gap-2 text-accent mb-4">
                    <Question width={22} height={22} />
                    <span className="font-mono uppercase tracking-[0.2em] text-xs">
                        Hỏi thẳng — đáp thật
                    </span>
                </div>
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">
                    Những câu bạn ngại hỏi,
                    <br />
                    <span className="text-accent">chúng tôi trả lời trước.</span>
                </h2>
            </motion.div>

            {/* Rows */}
            <div className="space-y-3">
                {FAQS.map((faq) => (
                    <FaqRow key={faq.q} q={faq.q} a={faq.a} />
                ))}
            </div>
        </motion.section>
    )
}
