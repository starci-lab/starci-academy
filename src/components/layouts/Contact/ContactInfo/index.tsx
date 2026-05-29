"use client"

import React from "react"
import {
    CONTACT_CHANNELS,
} from "../constants"
import {
    SupportHours,
} from "../SupportHours"
import {
    ContactInfoCard,
} from "./ContactInfoCard"

/**
 * Left column of the contact page: heading, intro copy, channel cards and the
 * support-hours panel.
 *
 * Self-contained section (single-use): reads its own static contact-channel
 * catalog from constants and composes the self-contained `SupportHours` panel,
 * so the container just renders `<ContactInfo />`.
 */
export const ContactInfo = () => {
    const channels = CONTACT_CHANNELS
    return (
        <>
            <h1 className="text-5xl md:text-6xl font-bold mb-8">
                Get in Touch
            </h1>
            <p className="text-white/50 text-lg mb-12 leading-relaxed">
                Have questions about our courses or need help with your learning
                journey? Our team is here to support you.
            </p>

            <div className="space-y-8">
                {channels.map((channel) => (
                    <ContactInfoCard
                        key={channel.kind}
                        channel={channel}
                    />
                ))}
            </div>

            <SupportHours />
        </>
    )
}
