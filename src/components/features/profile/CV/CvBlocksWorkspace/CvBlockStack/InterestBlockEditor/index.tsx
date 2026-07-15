"use client"

import React, { useState } from "react"
import {
    Button,
    Chip,
    Input,
    Label,
    Link,
    TextField,
    cn,
} from "@heroui/react"
import { useTranslations } from "next-intl"
import { PlusIcon, XIcon } from "@phosphor-icons/react"
import type { WithClassNames } from "@/modules/types/base/class-name"
import type { CvBlock, CvBlockEditorProps, CvBlockItem } from "../../../types"

/** Reads the interest names currently on this block's items (`fields.name`). */
const namesOf = (block: CvBlock): Array<string> => block.items
    .map((item) => (typeof item.fields.name === "string" ? item.fields.name : undefined))
    .filter((name): name is string => Boolean(name))

/** Props for {@link InterestBlockEditor}. */
export interface InterestBlockEditorProps extends WithClassNames<undefined>, CvBlockEditorProps {}

/**
 * Interests block editor — one repeatable item PER interest (`fields.name`),
 * mirrors `SkillsBlockEditor` minus the curated tech-stack suggestions (an
 * interest has no course-tag stand-in). No AI affordance, no verified/self
 * distinction (per `CV_BLOCK_TYPE_REGISTRY[Interest]`).
 *
 * @param props - {@link InterestBlockEditorProps}
 */
export const InterestBlockEditor = ({ className, block, onChange }: InterestBlockEditorProps) => {
    const t = useTranslations()
    const [draft, setDraft] = useState("")
    const currentNames = namesOf(block)

    const setItems = (items: Array<CvBlockItem>) => onChange({ ...block, items } satisfies CvBlock)

    const onAddInterest = (name: string) => {
        const trimmed = name.trim()
        if (!trimmed || currentNames.some((existing) => existing.toLowerCase() === trimmed.toLowerCase())) {
            return
        }
        setItems([...block.items, { id: crypto.randomUUID(), fields: { name: trimmed } }])
    }

    const onRemoveInterest = (itemId: string) => setItems(block.items.filter((item) => item.id !== itemId))

    return (
        <div className={cn("flex flex-col gap-3", className)}>
            {block.items.length > 0 ? (
                <div className="flex flex-wrap items-center gap-2">
                    {block.items.map((item) => {
                        const name = typeof item.fields.name === "string" ? item.fields.name : ""
                        return (
                            <Chip key={item.id} size="sm" className="bg-accent-soft text-accent-soft-foreground">
                                <Chip.Label>{name}</Chip.Label>
                                <Link
                                    className="text-accent-soft-foreground no-underline opacity-60 transition-opacity hover:opacity-100 hover:no-underline"
                                    aria-label={t("cv.blocks.interest.removeInterest", { name })}
                                    onPress={() => onRemoveInterest(item.id)}
                                >
                                    <XIcon aria-hidden className="size-4" />
                                </Link>
                            </Chip>
                        )
                    })}
                </div>
            ) : null}

            <div className="flex items-end gap-2">
                <TextField variant="secondary" className="flex-1">
                    <Label htmlFor="cv-interest-draft">{t("cv.blocks.interest.addLabel")}</Label>
                    <Input
                        id="cv-interest-draft"
                        placeholder={t("cv.blocks.interest.addPlaceholder")}
                        value={draft}
                        onChange={(event) => setDraft(event.target.value)}
                        onKeyDown={(event) => {
                            if (event.key === "Enter") {
                                event.preventDefault()
                                onAddInterest(draft)
                                setDraft("")
                            }
                        }}
                    />
                </TextField>
                <Button
                    variant="tertiary"
                    size="sm"
                    isDisabled={!draft.trim()}
                    onPress={() => {
                        onAddInterest(draft)
                        setDraft("")
                    }}
                >
                    <PlusIcon aria-hidden className="size-4" />
                    {t("cv.blocks.interest.addAction")}
                </Button>
            </div>
        </div>
    )
}
