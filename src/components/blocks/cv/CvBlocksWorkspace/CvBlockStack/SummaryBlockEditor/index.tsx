"use client"

import React from "react"
import { Label, TextArea, TextField } from "@heroui/react"
import { useTranslations } from "next-intl"
import type { CvBlockEditorProps } from "@/modules/types/entities/cv"
import { AiRewriteButton } from "../shared/AiRewriteButton"

/** Props for {@link SummaryBlockEditor}. */
export type SummaryBlockEditorProps = CvBlockEditorProps 

/**
 * Summary/objective paragraph editor — singleton, non-repeatable, holds its
 * one `text` field on `block.items[0]`. Has the "✨ AI write for me" affordance
 * (`onAiRewrite`, no `itemId` — the whole block's single fields set).
 *
 * @param props - {@link SummaryBlockEditorProps}
 */
export const SummaryBlockEditor = ({ block, onChange, onAiRewrite }: SummaryBlockEditorProps) => {
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
        <div className={"flex flex-col gap-3"}>
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
