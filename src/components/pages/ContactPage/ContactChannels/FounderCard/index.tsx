"use client"

import React from "react"
import { Link, Typography } from "@heroui/react"
import { FaFacebook, FaLinkedin, FaGithub } from "react-icons/fa6"
import { useTranslations } from "next-intl"
import { FOUNDER_FACEBOOK, FOUNDER_GITHUB, FOUNDER_LINKEDIN } from "@/resources/contact"

/** Human face of the founder-led brand, using the existing founder portrait. */
export const FounderCard = () => {
    const t = useTranslations()
    const socials = [
        { key: "facebook", href: FOUNDER_FACEBOOK, icon: FaFacebook },
        { key: "linkedin", href: FOUNDER_LINKEDIN, icon: FaLinkedin },
        { key: "github", href: FOUNDER_GITHUB, icon: FaGithub },
    ] as const

    return (
        <section className="overflow-hidden rounded-[1.5rem] bg-[#17121f] text-white shadow-xl">
            <div className="grid @app-sm:grid-cols-[0.7fr_1.3fr]">
                <div className="relative min-h-56 overflow-hidden @app-sm:min-h-full">
                    <img src="/landing/founder.jpg" alt="Stacy Nguyen, founder of StarCi Academy" className="absolute inset-0 size-full object-cover object-top grayscale-[15%]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#17121f] via-transparent to-transparent" />
                </div>
                <div className="flex flex-col justify-between gap-6 p-5 @app-sm:p-7">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-fuchsia-300">{t("contact.founder.title")}</p>
                        <Typography.Heading level={2} className="mt-3 text-2xl font-bold text-white">Stacy Nguyen</Typography.Heading>
                        <Typography className="mt-2 text-sm leading-6 text-white/65">Founder · StarCi Academy. Người trực tiếp xây sản phẩm và đọc những tin nhắn gửi về đây.</Typography>
                    </div>
                    <div className="flex items-center gap-4 border-t border-white/10 pt-4">
                        {socials.map(({ key, href, icon: Icon }) => <Link key={key} href={href} target="_blank" rel="noreferrer" aria-label={t(`contact.founder.${key}`)} className="text-white/65 transition hover:text-white"><Icon className="size-5" aria-hidden /></Link>)}
                    </div>
                </div>
            </div>
        </section>
    )
}
