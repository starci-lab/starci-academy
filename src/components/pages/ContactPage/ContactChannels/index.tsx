"use client"

import React from "react"
import { Link, Typography } from "@heroui/react"
import { EnvelopeSimpleIcon, PhoneIcon } from "@phosphor-icons/react"
import { FaFacebook, FaLinkedin } from "react-icons/fa6"
import { FounderCard } from "./FounderCard"
import { CONTACT_EMAIL, CONTACT_PHONE, CONTACT_PHONE_TEL, FOUNDER_FACEBOOK, FOUNDER_LINKEDIN } from "@/resources/contact"

/** Direct channels stay visible independently from form and chat state. */
export const ContactChannels = () => {
    const channels = [
        { label: "Zalo", value: CONTACT_PHONE, href: `tel:${CONTACT_PHONE_TEL}`, icon: PhoneIcon, tone: "bg-emerald-50 text-emerald-700" },
        { label: "Email", value: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}`, icon: EnvelopeSimpleIcon, tone: "bg-fuchsia-50 text-fuchsia-700" },
        { label: "Facebook", value: "facebook.com/starci183", href: FOUNDER_FACEBOOK, icon: FaFacebook, tone: "bg-blue-50 text-blue-700" },
        { label: "LinkedIn", value: "linkedin.com/in/stacy-nguyen", href: FOUNDER_LINKEDIN, icon: FaLinkedin, tone: "bg-sky-50 text-sky-700" },
    ] as const

    return (
        <div className="flex flex-col gap-6">
            <section>
                <div className="mb-3 flex items-end justify-between gap-4">
                    <div>
                        <Typography type="body-sm" weight="semibold" className="uppercase tracking-[0.14em] text-fuchsia-600">Kết nối trực tiếp</Typography>
                        <Typography.Heading level={2} className="mt-1 text-2xl font-bold tracking-tight">Chọn kênh bạn quen dùng</Typography.Heading>
                    </div>
                    <span className="hidden text-xs text-muted @app-sm:block">4 kênh chính thức</span>
                </div>
                <div className="grid gap-3 @app-sm:grid-cols-2">
                    {channels.map(({ label, value, href, icon: Icon, tone }) => (
                        <Link key={label} href={href} target={label === "Zalo" || label === "Email" ? undefined : "_blank"} rel="noreferrer" className="contact-channel group flex min-w-0 items-center gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-md">
                            <span className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${tone}`}><Icon className="size-5" aria-hidden /></span>
                            <span className="min-w-0"><span className="block text-xs font-semibold uppercase tracking-wider text-black/45">{label}</span><span className="block truncate text-sm font-semibold text-black/80 group-hover:text-fuchsia-700">{value}</span></span>
                        </Link>
                    ))}
                </div>
            </section>
            <FounderCard />
        </div>
    )
}
