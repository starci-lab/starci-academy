"use client"

import { PaperPlane as PaperPlaneTiltIcon } from "@gravity-ui/icons"
import React from "react"
import {
    CONTACT_SUBJECTS,
} from "../constants"

/**
 * Contact form card: name/email/subject/message fields and the submit button.
 *
 * Self-contained section (single-use): reads its own static subject catalog from
 * constants and renders the static form (no submit wiring yet, matching the
 * current product behavior), so the container just renders `<ContactForm />`.
 */
export const ContactForm = () => {
    const subjects = CONTACT_SUBJECTS
    return (
        <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-white/60 ml-1">
                        First Name
                    </label>
                    <input
                        type="text"
                        placeholder="John"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-brand-blue transition-colors"
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-white/60 ml-1">
                        Last Name
                    </label>
                    <input
                        type="text"
                        placeholder="Doe"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-brand-blue transition-colors"
                    />
                </div>
            </div>

            <div className="space-y-1.5">
                <label className="text-sm font-semibold text-white/60 ml-1">
                    Email Address
                </label>
                <input
                    type="email"
                    placeholder="john@example.com"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-brand-blue transition-colors"
                />
            </div>

            <div className="space-y-1.5">
                <label className="text-sm font-semibold text-white/60 ml-1">
                    Subject
                </label>
                <select className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-brand-blue transition-colors appearance-none">
                    {subjects.map((subject) => (
                        <option
                            key={subject}
                            className="bg-brand-dark"
                        >
                            {subject}
                        </option>
                    ))}
                </select>
            </div>

            <div className="space-y-1.5">
                <label className="text-sm font-semibold text-white/60 ml-1">
                    Message
                </label>
                <textarea
                    rows={5}
                    placeholder="How can we help you?"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-brand-blue transition-colors resize-none"
                ></textarea>
            </div>

            <button className="w-full bg-brand-blue hover:bg-blue-600 text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-1.5 transition-all duration-300 shadow-xl shadow-blue-500/20 active:scale-[0.98]">
                Send Message
                <PaperPlaneTiltIcon className="w-5 h-5" />
            </button>
        </form>
    )
}
