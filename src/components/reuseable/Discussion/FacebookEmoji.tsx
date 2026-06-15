"use client"

import React from "react"
import { cn } from "@heroui/react"
import type { WithClassNames } from "@/modules/types"
import "./facebook-emoji.css"

/** Supported reaction types (mirrors the original react-facebook-emoji API). */
export type FacebookEmojiType = "like" | "love" | "haha" | "yay" | "wow" | "sad" | "angry"

/** Visual size of the emoji (mirrors the original react-facebook-emoji API). */
export type FacebookEmojiSize = "xxs" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl" | "xxxl"

export interface FacebookEmojiProps extends WithClassNames<undefined> {
    /** The reaction type to display. Defaults to `"like"`. */
    type?: FacebookEmojiType
    /** The visual size. Defaults to `"md"`. */
    size?: FacebookEmojiSize
}

/**
 * Self-contained Facebook-style animated emoji (pure CSS, no assets).
 * Reimplements the react-facebook-emoji component from extracted source
 * since the npm package was published without its built dist folder.
 */
export const FacebookEmoji = ({ type = "like", size = "md", className }: FacebookEmojiProps) => {
    const sizeClass = size
    const baseClass = `zama-emoji emoji--${type} ${sizeClass}`

    switch (type) {
    case "like":
        return (
            <div id="zama-emoji" className={cn(className)}>
                <div className={baseClass}>
                    <div className="emoji__hand">
                        <div className="emoji__thumb" />
                    </div>
                </div>
            </div>
        )
    case "love":
        return (
            <div id="zama-emoji" className={cn(className)}>
                <div className={baseClass}>
                    <div className="emoji__heart" />
                </div>
            </div>
        )
    case "haha":
        return (
            <div id="zama-emoji" className={cn(className)}>
                <div className={baseClass}>
                    <div className="emoji__face">
                        <div className="emoji__eyes" />
                        <div className="emoji__mouth">
                            <div className="emoji__tongue" />
                        </div>
                    </div>
                </div>
            </div>
        )
    case "yay":
        return (
            <div id="zama-emoji" className={cn(className)}>
                <div className={baseClass}>
                    <div className="emoji__face">
                        <div className="emoji__eyebrows" />
                        <div className="emoji__mouth" />
                    </div>
                </div>
            </div>
        )
    case "wow":
    case "sad":
    case "angry":
    default:
        return (
            <div id="zama-emoji" className={cn(className)}>
                <div className={baseClass}>
                    <div className="emoji__face">
                        <div className="emoji__eyebrows" />
                        <div className="emoji__eyes" />
                        <div className="emoji__mouth" />
                    </div>
                </div>
            </div>
        )
    }
}

export default FacebookEmoji
