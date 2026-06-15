"use client"

import React from "react"
import { cn } from "@heroui/react"
import {
    CONTACT_CHANNEL_ICON_MAP,
} from "../../map"
import type {
    ContactChannel,
} from "../../types"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Props for {@link ContactInfoCard}. */
export interface ContactInfoCardProps extends WithClassNames<undefined> {
    /** The contact channel to render (icon resolved from its kind). */
    channel: ContactChannel
}

/**
 * Single contact-channel card: icon tile + label/value/description.
 *
 * Presentational: renders the supplied channel, resolving its icon from
 * {@link CONTACT_CHANNEL_ICON_MAP}. No logic.
 * @param props - the contact channel to display
 */
export const ContactInfoCard = ({
    channel,
    className,
}: ContactInfoCardProps) => {
    const Icon = CONTACT_CHANNEL_ICON_MAP[channel.kind]

    return (
        <div className={cn("flex gap-3 group", className)}>
            <div className="bg-brand-blue/10 w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border border-brand-blue/20 group-hover:bg-brand-blue group-hover:border-brand-blue transition-all duration-300">
                <Icon className="w-6 h-6 text-brand-blue group-hover:text-white transition-colors" />
            </div>
            <div>
                <h4 className="font-bold text-lg mb-1">{channel.label}</h4>
                <p className="text-white font-medium mb-1">{channel.value}</p>
                <p className="text-white/40 text-sm">{channel.desc}</p>
            </div>
        </div>
    )
}
