import { motion } from "framer-motion"
import { QuotesIcon } from "@phosphor-icons/react"
import React from "react"

export const TrapSection = () => {
    return (
        <motion.section 
            variants={{
                hidden: { opacity: 0 },
                visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.2, delayChildren: 0.3 }
                }
            }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="col-span-3 max-w-2xl"
        >
            <motion.h2 
                variants={{
                    hidden: { y: 20, opacity: 0 },
                    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" as const } }
                }} 
                className="text-3xl md:text-4xl tracking-tight leading-tight"
            >
        Bẫy “trình độ” trung bình là gì mà <span className="text-accent font-bold">99% lập trình viên</span> gặp phải?
            </motion.h2>

            <div className="mt-8 relative pl-6 border-l-2">
                <motion.div 
                    variants={{
                        hidden: { y: 20, opacity: 0 },
                        visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" as const } }
                    }}
                    className="absolute -left-[10px] top-0 bg-background p-1"
                >
                    <QuotesIcon size={20} className="text-muted" />
                </motion.div>
                <motion.blockquote 
                    variants={{
                        hidden: { y: 20, opacity: 0 },
                        visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" as const } }
                    }}
                    className="text-base md:text-lg text-muted leading-relaxed italic"
                >
          Không thiếu năng lực để có một công việc ổn định, nhưng thiếu cơ hội và môi trường để phát triển, nên ngày qua ngày chỉ lặp lại những công việc quen thuộc (ví dụ như đa số lập trình viên sau vài năm đi làm chỉ biết CRUD).
                </motion.blockquote>
            </div>
        </motion.section>
    )
}