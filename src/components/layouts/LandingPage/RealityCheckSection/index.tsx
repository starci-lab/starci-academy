import { motion } from "framer-motion"
import { QuotesIcon, BedIcon, RobotIcon } from "@phosphor-icons/react" // Thêm icon phù hợp
import React from "react"

// Tái sử dụng các patterns variants tương tự như TrapSection
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.3, // Slow down staggering slightly for distinct points
            delayChildren: 0.2, // Small initial delay after parent fade-in
        },
    },
}

const childVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.5,
            ease: "easeOut" as const,
        },
    },
}

export const RealityCheckSection = () => {
    // Data cho 3 điểm, bao gồm các paragraph hoàn chỉnh
    const realityPoints = [
        {
            id: "education",
            title: "Tuân thủ nền giáo dục lỗi thời",
            body: "Hầu hết dev chỉ học từ trường đại học, vốn một giáo trình không có sức nặng trong thị trường lao động. Họ bám víu vào kiến thức cơ bản mà không nhận ra sự phát triển chóng mặt của công nghệ thực tế. Và nếu có đi làm cũng chỉ bắt đầu từ các công việc nhàm chán.",
            icon: <QuotesIcon size={28} className="text-accent" />, // placeholder icon
            imagePrompt: "A close-up photograph of a vintage university lecture hall, dusty. One student is hunched over a very old, bulky CRT monitor. In the foreground, out-of-focus, a sleek, modern, multi-monitor coding setup is visible. Focus on outdated versus modern. Low-key lighting, cool tones.",
        },
        {
            id: "stability",
            title: "Tư duy \"ổn định\" quá sớm",
            body: "Bằng lòng với những kiến thức cơ bản và một vị trí công việc lặp đi lặp lại chỉ vì nó cho cảm giác an toàn. Họ sợ thay đổi, sợ rủi ro khi học công nghệ mới, dẫn đến việc bỏ lỡ cơ hội bứt phá và mở rộng kỹ năng khi còn trẻ và tràn đầy năng lượng.",
            icon: <BedIcon size={28} className="text-accent" />, // placeholder icon
            imagePrompt: "An office cubicle scene. A developer is lounging in an ergonomically advanced, plush office chair, looking contented, a single, simple coding screen active. On their desk are old technology items like a floppy disk. On a neighboring, empty desk, a dynamic digital screen shows complex system architecture and modern tools. Focus on comfort and stagnancy. Warmer, slightly stagnant tones.",
        },
        {
            id: "ai",
            title: "AI đang thay thế",
            body: "Sự tiến bộ chóng mặt của trí tuệ nhân tạo, đặc biệt là trong việc viết code, kiểm thử, và tự động hóa. AI đã thực hiện tốt các tác vụ cơ bản, và nếu bạn không nâng cấp bản thân lên cấp độ cao hơn (kiến trúc, tư duy hệ thống, giải quyết vấn đề phức tạp), bạn sẽ trở thành một phần của 'trình độ trung bình' dễ bị thay thế.",
            icon: <RobotIcon size={28} className="text-accent" />, // placeholder icon
            imagePrompt: "A sleek, futuristic workspace. A complex, multi-jointed robot arm with a small screen is rapidly typing on a holographic keyboard, writing code. Behind it, a programmer looks on with a look of concern and exhaustion, holding a simple code printout. Focus on speed and displacement. Cool, high-tech, futuristic tones.",
        },
    ]

    return (
        <motion.section
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="col-span-3 mt-16 max-w-2xl" // Re-use col-span and max-width for alignment, add margin-top
        >
            <motion.div variants={childVariants} className="space-y-12"> {/* Stack points vertically */}
                {realityPoints.map((point) => (
                    <motion.div key={point.id} className="relative pl-10"> {/* Add relative and pl for the custom icon list feel */}
            
                        {/* Custom Icon/Indicator (Placeholder) */}
                        <motion.div
                            variants={{
                                hidden: { y: 20, opacity: 0 },
                                visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut", delay: 0.2 } }, // Add delay for icon b/w points
                            }}
                            className="absolute -left-2 top-0 bg-background p-2 rounded-full shadow-sm"
                        >
                            {point.icon}
                            {/* * VỊ TRÍ HÌNH ẢNH / ILLUSTRATION
              * Đây là nơi bạn sẽ đặt một <img> hoặc illustrative <svg> dựa trên gợi ý prompt.
              * Bạn nên thay thế element placeholder icon bằng hình ảnh thực tế của mình tại đây.
              * Gợi ý style hình ảnh: Một clean vector illustration hoặc một highly stylized 'digital' art painting, tích hợp như một small circular/hex graphic.
            */}
                        </motion.div>

                        {/* Subtitle H3 */}
                        <motion.h3
                            variants={childVariants}
                            className="text-2xl md:text-3xl font-semibold tracking-tight"
                        >
                            {point.title}
                        </motion.h3>

                        {/* Body Text P */}
                        <motion.p
                            variants={childVariants}
                            className="mt-6 text-base md:text-lg text-muted leading-relaxed"
                        >
                            {point.body}
                        </motion.p>
                    </motion.div>
                ))}
            </motion.div>
        </motion.section>
    )
}   