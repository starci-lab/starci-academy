"use client"

import React from "react"
import { Chip, Link, Typography } from "@heroui/react"
import { useTranslations } from "next-intl"
import { ContactChannels } from "./ContactChannels"
import { ContactForm } from "./ContactForm"
import { ContactFaq } from "./ContactFaq"
import { PageContainer } from "@/components/blocks/layout/PageContainer"

/** Founder-led contact page. Keeps the real form and chat-ready surface intact while giving the route a stronger brand presence. */
export const ContactPage = () => {
    const t = useTranslations()

    return (
        <PageContainer>
            <div className="contact-page flex flex-col gap-8 @app-lg:gap-12">
                <section className="contact-hero relative overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,#17121f_0%,#2b1630_55%,#581c3d_100%)] px-6 py-8 text-white shadow-2xl @app-sm:px-10 @app-sm:py-10 @app-lg:px-14 @app-lg:py-14">
                    <div className="pointer-events-none absolute -right-20 -top-24 size-80 rounded-full bg-fuchsia-400/20 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-32 left-1/3 size-96 rounded-full bg-rose-500/20 blur-3xl" />
                    <div className="relative max-w-3xl">
                        <Chip color="warning" variant="soft" size="sm">STARCI ACADEMY · FOUNDER-LED</Chip>
                        <div className="mt-6 flex flex-col gap-4">
                            <Typography.Heading level={1} className="max-w-2xl text-4xl font-bold tracking-[-0.04em] text-white @app-sm:text-6xl">
                                {t("contact.title")}
                            </Typography.Heading>
                            <Typography className="max-w-2xl text-base leading-7 text-white/75 @app-sm:text-lg">
                                {t("contact.intro")}
                            </Typography>
                        </div>
                        <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-white/70">
                            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2"><span className="size-2 rounded-full bg-emerald-400" />{t("contact.responseTime")}</span>
                            <Link href="#contact-form" className="font-semibold text-white underline decoration-white/30 underline-offset-4 hover:decoration-white">Gửi tin nhắn <span aria-hidden>↗</span></Link>
                        </div>
                    </div>
                </section>

                <div className="grid gap-8 @app-lg:grid-cols-[0.85fr_1.15fr] @app-lg:items-start">
                    <ContactChannels />
                    <section id="contact-form" className="contact-form-shell rounded-[1.5rem] bg-white p-5 shadow-xl ring-1 ring-black/5 @app-sm:p-8">
                        <div className="mb-6 flex items-start justify-between gap-4">
                            <div>
                                <Typography.Heading level={2} className="text-2xl font-bold tracking-tight">{t("contact.form.title")}</Typography.Heading>
                                <Typography type="body-sm" color="muted" className="mt-2">Tin nhắn sẽ được gửi thẳng tới Stacy Nguyen.</Typography>
                            </div>
                            <span className="hidden rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 @app-sm:inline-flex">Phản hồi trong 24 giờ</span>
                        </div>
                        <ContactForm />
                    </section>
                </div>

                <ContactFaq />
            </div>
        </PageContainer>
    )
}
