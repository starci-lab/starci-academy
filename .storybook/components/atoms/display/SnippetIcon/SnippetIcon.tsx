"use client"

import { CheckCircleIcon, CopyIcon } from "@phosphor-icons/react"
import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@heroui/react"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — ported faithfully from
 * `@/components/blocks/identity/SnippetIcon`. Authored in Storybook (not `src`);
 * synced to `src` later.
 *
 * ⚠️ Sửa 2026-07-26 (canon §4 + §12): xoá cửa hậu `classNames.copyIcon` /
 * `classNames.checkIcon` — nó cho caller bôi class thẳng vào icon NỘI BỘ, trái
 * §4 (atom sở hữu style bên trong, không mở lỗ cho ngoài chọc vào). Atom chỉ còn
 * `className` cho gốc trigger. Đồng thời thêm anatomy (§12e) — atom DUY NHẤT
 * trong 36 atom trước đó chưa có — và `isCopied` để ghim hình ✓ từ ngoài (§12f):
 * hình đó chỉ sinh từ `useState`/`setTimeout` nội bộ nên không story nào ghim
 * được nếu thiếu prop này.
 */

/** Props for {@link SnippetIcon}. */
export interface SnippetIconProps {
    /** The exact string written to the clipboard on click. */
    copyString: string
    /**
     * Ghim hình đã-copy (glyph ✓) từ bên ngoài — dùng cho preview/story. Không
     * truyền ⇒ atom tự quản trạng thái này như cũ bằng `useState`/`setTimeout`
     * (hành vi mặc định KHÔNG đổi). Truyền `true`/`false` sẽ ĐÈ state nội bộ.
     */
    isCopied?: boolean
    /** `true` → gắn `data-anat-part` cho từng part để `BlockAnatomy` badge. */
    showAnatomy?: boolean
    /**
     * Tên `data-anat-part` gắn ở GỐC trigger. Component bọc nó truyền xuống để
     * cây deps nhận ra "chỗ này là một SnippetIcon" và cho bấm sang story của nó.
     */
    anatPart?: string
    className?: string
}

/**
 * One-tap copy affordance for a single line (an install command, an API key, a
 * short URL): a copy icon that swaps to a check for 350ms on click, confirming the
 * clipboard write, then returns to the copy icon. Place it next to the text to
 * copy — not inside a multi-line code block (there a separate Toast is needed).
 *
 * @param props - {@link SnippetIconProps}
 */
const SnippetIconBase = ({
    copyString,
    isCopied,
    showAnatomy = false,
    anatPart,
    className,
}: SnippetIconProps) => {
    const [copiedState, setCopiedState] = useState(false)
    // `isCopied` ghim từ ngoài thắng state nội bộ (dùng cho preview); không truyền ⇒ atom tự quản như cũ.
    const copied = isCopied ?? copiedState

    const handleCopy = async () => {
        await navigator.clipboard.writeText(copyString)
        setCopiedState(true)
        setTimeout(() => setCopiedState(false), 350)
    }

    return (
        // The root (trigger) is a plain element with no reusable name/story of its own
        // (§13z internal geometry) — only `anatPart` from a PARENT names it as one
        // opaque node, no self-badge fallback. `Icon` DOES get a self-badge: it has its
        // own dedicated leaf/story in this same file (`Copied`) showing the exact
        // copy↔check swap, so linking there is a real jump, not a circular one.
        <motion.div
            onClick={handleCopy}
            className={cn("cursor-pointer", className)}
            whileTap={{ scale: 0.9 }}
            data-anat-part={anatPart}
        >
            <AnimatePresence mode="wait">
                {copied ? (
                    <motion.span
                        key="check"
                        initial={{ scale: 0.85, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.85, opacity: 0 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        data-anat-part={showAnatomy ? "Icon" : undefined}
                    >
                        <CheckCircleIcon className="w-5 h-5" />
                    </motion.span>
                ) : (
                    <motion.span
                        key="copy"
                        initial={{ scale: 0.85, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.85, opacity: 0 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        data-anat-part={showAnatomy ? "Icon" : undefined}
                    >
                        <CopyIcon className="w-5 h-5" />
                    </motion.span>
                )}
            </AnimatePresence>
        </motion.div>
    )
}

/** `SnippetIcon.*` — one-tap copy affordance namespace. */
export { SnippetIconBase as SnippetIcon }
