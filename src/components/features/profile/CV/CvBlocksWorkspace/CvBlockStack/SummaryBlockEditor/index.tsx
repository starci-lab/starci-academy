"use client"

import React from "react"
import {
    Label,
    TextArea,
    TextField,
    cn,
} from "@heroui/react"
import { useTranslations } from "next-intl"
import type { WithClassNames } from "@/modules/types/base/class-name"
import type { CvBlockEditorProps } from "../../../types"
import { AiRewriteButton } from "../shared/AiRewriteButton"

/** Props for {@link SummaryBlockEditor}. */
export interface SummaryBlockEditorProps extends WithClassNames<undefined>, CvBlockEditorProps {}

/**
 * Summary/objective paragraph editor — singleton, non-repeatable, holds its
 * one `text` field on `block.items[0]`. Has the "✨ AI viết giúp" affordance
 * (`onAiRewrite`, no `itemId` — the whole block's single fields set).
 *
 * @param props - {@link SummaryBlockEditorProps}
 */
export const SummaryBlockEditor = ({ className, block, onChange, onAiRewrite }: SummaryBlockEditorProps) => {
    const t = useTranslations()
    const text = typeof block.items[0]?.fields.text === "string" ? (block.items[0].fields.text as string) : ""

    const onTextChange = (value: string) => {
        const item = block.items[0] ?? { id: crypto.randomUUID(), fields: {} }
        onChange({ ...block, items: [{ ...item, fields: { ...item.fields, text: value } }] })
    }

    const onRewrite = async () => {
        if (!onAiRewrite) {
            return
        }
        const rewritten = await onAiRewrite(undefined)
        const value = typeof rewritten.text === "string" ? rewritten.text : text
        onTextChange(value)
    }

    return (
        <div className={cn("flex flex-col gap-3", className)}>
            <TextField variant="secondary">
                <Label htmlFor="cv-summary-text">{t("cv.blocks.summary.fields.text")}</Label>
                <TextArea
                    id="cv-summary-text"
                    rows={4}
                    className="resize-none"
                    placeholder={t("cv.blocks.summary.placeholders.text")}
                    value={text}
                    onChange={(event) => onTextChange(event.target.value)}
                />
            </TextField>

            {onAiRewrite ? (
                <AiRewriteButton className="w-fit self-start" onRewrite={onRewrite} />
            ) : null}
        </div>
    )
}
