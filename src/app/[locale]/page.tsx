"use client"
import { motion } from "framer-motion"
import { Courses } from "@/components/layouts"
import { Image, Link, Spacer } from "@heroui/react"
import { FacebookLogoIcon, GithubLogoIcon, QuotesIcon } from "@phosphor-icons/react"
import { useTranslations } from "next-intl"

const fadeInUp = {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: "easeOut" as const },
}

const Page = () => {
    const t = useTranslations()
    return (
        <div>
            <Spacer y={20} />
            <motion.div
                className="grid grid-cols-1 md:grid-cols-5 gap-6"
                {...fadeInUp}
            >
                <div className="col-span-3">
                    <div className="text-4xl font-bold flex gap-1">StarCi Academy</div>
                    <Spacer y={6} />
                    <div>
                        <QuotesIcon size={20} className="text-foreground-500" />
                        <Spacer y={2} />
                        <div className="text-sm text-foreground-500 flex flex-col gap-1 italic text-justify">
                            <div>{t("home.intro")}</div>
                            <div>{t("home.intro2")}</div>
                            <div>{t("home.intro3")}</div>
                        </div >
                        <Spacer y={2} />
                        <div className="text-sm text-secondary italic">Nguyen Van Tu Cuong, Founder & Core Instructor </div>
                        <Spacer y={2} />
                        <div className="flex items-center gap-2">
                            <Link href="https://www.facebook.com/starci183"><FacebookLogoIcon size={20} className="text-secondary" /></Link>
                            <Link href="https://github.com/starci183"><GithubLogoIcon size={20} className="text-secondary" /></Link>
                        </div>
                    </div>
                </div>
                <iframe
                    className="w-full h-full rounded-medium col-span-2"
                    src="https://www.youtube.com/watch?v=KlkRLUpHDPc"
                    title="YouTube video"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                />
            </motion.div>
            <Spacer y={48} />
            <motion.div
                className="flex items-center justify-center"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            >
                <div className="text-2xl font-bold flex gap-1">{t("home.diff.title")}</div>
            </motion.div>
            <Spacer y={6} />
            <motion.div
                className="text-sm text-foreground-500 text-center max-w-[600px] mx-auto italic"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
            >
                {t("home.diff.des1")}
            </motion.div>
            <Spacer y={24} />
            <motion.div
                className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            >
                <Image removeWrapper src="/1.png" alt="1" className="col-span-2"/>
                <div className="col-span-3">
                    <div className="text-xl font-bold flex gap-1">{t("home.diff.des2")}</div>
                    <Spacer y={4} />
                    <div className="text-sm text-foreground-500 text-justify">
                    {t("home.diff.des3")}
                    </div>
                </div>
            </motion.div>
            <Spacer y={24} />
            <motion.div
                className="grid grid-cols-1 sm:grid-cols-5 gap-6 items-center"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25, ease: "easeOut" }}
            >
                <Image
                    removeWrapper
                    src="/2.png"
                    alt="2"
                    className="col-span-1 sm:col-span-2 order-1 sm:order-2"
                />
                <div className="col-span-1 sm:col-span-3 order-2 sm:order-1">
                    <div className="text-xl font-bold">
      {t("home.diff.des4")}
                    </div>
                    <Spacer y={4} />
                    <div className="text-sm text-foreground-500 text-justify">
      {t("home.diff.des5")}
                    </div>
                </div>
            </motion.div>
            <Spacer y={24} />
            <motion.div
                className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
            >
                <Image removeWrapper src="/3.png" alt="1" className="col-span-2"/>
                <div className="col-span-3">
                    <div className="text-xl font-bold flex gap-1">From Code to Career</div>
                    <Spacer y={4} />
                    <div className="text-sm text-foreground-500 text-justify">
                    {t("home.diff.des6")}
                    </div>
                </div>
            </motion.div>
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

export default Page
