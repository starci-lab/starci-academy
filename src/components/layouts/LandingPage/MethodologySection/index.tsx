import { motion } from "framer-motion"
import { 
    Article, 
    TerminalWindow, 
    Robot, 
    ArrowRight,
    ShieldCheck
} from "@phosphor-icons/react"
import React from "react"

// Định nghĩa các hiệu ứng chuyển động (Variants)
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.2, delayChildren: 0.1 }
    }
}

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
        y: 0, 
        opacity: 1, 
        transition: { duration: 0.5, ease: "easeOut" as const } 
    }
}

export const MethodologySection = () => {
    return (
        <motion.section
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="col-span-3 mt-24 space-y-20 w-full max-w-6xl mx-auto"
        >
            {/* Header của Section */}
            <motion.div variants={itemVariants} className="max-w-2xl">
                <div className="flex items-center gap-2 text-accent mb-4">
                    <ShieldCheck size={24} weight="fill" />
                    <span className="font-mono uppercase tracking-widest text-sm">Commitment</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
          Học thật, làm thực.<br /> 
          Nói không với <span className="text-accent italic">&quot;Lùa gà&quot;</span>.
                </h2>
                <p className="mt-6 text-muted text-lg">
          StarCi không bán những giấc mơ hồng về lương nghìn đô sau vài tháng. Chúng tôi tập trung vào <span className="font-bold">bản chất</span> và <span className="font-bold">áp lực thực tế</span> của một Solution Architect.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        
                {/* Card 1: Content Standard */}
                <motion.div 
                    variants={itemVariants} 
                    className="group p-8 rounded-2xl bg-secondary/10 border border-white/5 hover:border-accent/30 transition-all duration-300"
                >
                    <Article size={40} weight="duotone" className="text-accent mb-6" />
                    <h3 className="text-2xl font-semibold text-white">Tuyến nội dung chuẩn Solution Architect</h3>
                    <p className="mt-4 text-muted leading-relaxed">
            Mọi bài học tại StarCi không dừng lại ở &quot;chạy được&quot;. Chúng tôi mổ xẻ hệ thống dưới góc nhìn SA: Khả năng mở rộng, tính sẵn sàng cao và tối ưu chi phí.
                    </p>
                    <ul className="mt-6 space-y-3 text-sm text-muted">
                        <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-accent" />
              Insights rút tỉa từ 3+ năm gồng gánh Production.
                        </li>
                        <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-accent" />
              Thiết kế chuyên nghiệp, đầy đủ diagram và case study.
                        </li>
                    </ul>
                    <button className="mt-8 flex items-center gap-2 font-medium text-accent group-hover:gap-4 transition-all">
            Đọc thử nội dung <ArrowRight weight="bold" />
                    </button>
                </motion.div>

                {/* Card 2: Challenge System */}
                <motion.div 
                    variants={itemVariants} 
                    className="group p-8 rounded-2xl bg-secondary/10 border border-white/5 hover:border-accent/30 transition-all duration-300"
                >
                    <TerminalWindow size={40} weight="duotone" className="text-accent mb-6" />
                    <h3 className="text-2xl font-semibold text-white">Học qua Challenge, không qua Slide</h3>
                    <p className="mt-4 text-muted leading-relaxed">
            Thay vì xem video thụ động, bạn được ném vào một hệ thống Challenges phân cấp từ **Easy** đến **Production Ready**. 
                    </p>
                    <ul className="mt-6 space-y-3 text-sm text-muted">
                        <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-accent" />
              Build hệ thống thật, handle lỗi thật.
                        </li>
                        <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-accent" />
              Tư duy giải quyết vấn đề thay vì copy-paste.
                        </li>
                    </ul>
                    <button className="mt-8 flex items-center gap-2 font-medium text-accent group-hover:gap-4 transition-all">
            Làm thử Challenge <ArrowRight weight="bold" />
                    </button>
                </motion.div>

                {/* Card 3: AI & Career Support */}
                <motion.div 
                    variants={itemVariants} 
                    className="md:col-span-2 group p-8 rounded-2xl bg-gradient-to-br from-accent/10 via-transparent to-transparent border border-white/10"
                >
                    <div className="flex flex-col md:flex-row gap-8 items-center">
                        <div className="flex-1">
                            <Robot size={40} weight="duotone" className="text-accent mb-6" />
                            <h3 className="text-2xl font-semibold text-white text-balance">StarCi AI: Người cộng sự 24/7</h3>
                            <p className="mt-4 text-muted leading-relaxed max-w-xl">
                Không chỉ là khóa học, chúng tôi cung cấp bộ công cụ AI chuyên dụng để **Review CV**, tối ưu hóa Profile và hướng dẫn bạn hoàn thiện **Final Project** ở mức độ tinh xảo nhất.
                            </p>
                            <button className="mt-8 px-6 py-2 rounded-full border border-accent/50 text-accent hover:bg-accent hover:text-white transition-all font-medium text-sm">
                Trải nghiệm AI ngay
                            </button>
                        </div>
            
                        {/* Visual AI Placeholder */}
                        <div className="w-full md:w-1/3 p-6 rounded-xl bg-black/40 border border-white/5 space-y-4 shadow-2xl backdrop-blur-sm">
                            <div className="flex gap-2">
                                <div className="h-2 w-8 bg-accent/40 rounded animate-pulse" />
                                <div className="h-2 w-12 bg-white/10 rounded" />
                            </div>
                            <div className="h-2 w-3/4 bg-white/10 rounded" />
                            <div className="h-2 w-1/2 bg-white/10 rounded" />
                            <div className="py-4 px-2 w-full border border-dashed border-accent/30 rounded flex flex-col items-center justify-center gap-2">
                                <div className="flex gap-1">
                                    {[1,2,3].map(i => <div key={i} className="w-1 h-4 bg-accent/60 rounded-full animate-bounce" style={{animationDelay: `${i*0.1}s`}} />)}
                                </div>
                                <span className="text-[9px] text-accent/80 uppercase tracking-[0.2em] font-mono">
                    Analyzing Architecture...
                                </span>
                            </div>
                        </div>
                    </div>
                </motion.div>

            </div>
        </motion.section>
    )
}