"use client"

import React from "react"
import {
    motion,
} from "framer-motion"
import {
    ContactInfo,
} from "./ContactInfo"
import {
    ContactForm,
} from "./ContactForm"

/**
 * Contact page container for `/[locale]/contact`.
 *
 * Composes the two animated columns: the self-contained contact info on the
 * left and the self-contained form on the right — each reads its own static
 * catalog from constants, so this container passes no props. `"use client"`
 * for the Framer Motion entrance animations.
 */
export const Contact = () => {
    return (
        <div className="pt-32 pb-32">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <ContactInfo />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="glass p-8 md:p-12 rounded-[40px] border-white/10"
                    >
                        <ContactForm />
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
