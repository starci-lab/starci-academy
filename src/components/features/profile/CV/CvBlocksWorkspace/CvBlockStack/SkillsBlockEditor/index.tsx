"use client"

import React, { useState } from "react"
import {
    Button,
    Chip,
    Input,
    Label,
    Link,
    TextField,
    Typography,
    cn,
} from "@heroui/react"
import { useTranslations } from "next-intl"
import { PlusIcon, XIcon } from "@phosphor-icons/react"
import type { WithClassNames } from "@/modules/types/base/class-name"
import type { CvBlock, CvBlockEditorProps, CvBlockItem } from "../../../types"

/**
 * Curated tech-stack suggestions — a stand-in for a future "course tags /
 * selectedLang on challenge submissions" source (no FE query for that exists
 * yet). Static suggestions are explicitly acceptable here per the frozen
 * contract ("luôn tự khai, rủi ro thấp, không cần nhãn").
 */
const SUGGESTED_SKILLS: Array<string> = [
    "TypeScript",
    "JavaScript",
    "React",
    "Next.js",
    "Node.js",
    "NestJS",
    "PostgreSQL",
    "Docker",
    "Kubernetes",
    "GraphQL",
    "Go",
    "Java",
    "C#",
    "AWS",
]

/** Reads the skill names currently on this block's items (`fields.name`). */
const namesOf = (block: CvBlock): Array<string> => block.items
    .map((item) => (typeof item.fields.name === "string" ? item.fields.name : undefined))
    .filter((name): name is string => Boolean(name))

/** Props for {@link SkillsBlockEditor}. */
export interface SkillsBlockEditorProps extends WithClassNames<undefined>, CvBlockEditorProps {}

/**
 * Skills block editor — one repeatable item PER skill (`fields.name`).
 * Suggested chips (tech-stack stand-in) tap to add; a free-text field adds
 * anything else. No AI affordance, no verified/self distinction (only
 * `project` items carry `source` — per `CV_BLOCK_TYPE_REGISTRY[Skills]`).
 *
 * @param props - {@link SkillsBlockEditorProps}
 */
export const SkillsBlockEditor = ({ className, block, onChange }: SkillsBlockEditorProps) => {
    const t = useTranslations()
    const [draft, setDraft] = useState("")
    const currentNames = namesOf(block)

    const setItems = (items: Array<CvBlockItem>) => onChange({ ...block, items } satisfies CvBlock)

    const onAddSkill = (name: string) => {
        const trimmed = name.trim()
        if (!trimmed || currentNames.some((existing) => existing.toLowerCase() === trimmed.toLowerCase())) {
            return
        }
        setItems([...block.items, { id: crypto.randomUUID(), fields: { name: trimmed } }])
    }

    const onRemoveSkill = (itemId: string) => setItems(block.items.filter((item) => item.id !== itemId))

    const remainingSuggestions = SUGGESTED_SKILLS.filter(
        (skill) => !currentNames.some((existing) => existing.toLowerCase() === skill.toLowerCase()),
    )

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
                                    aria-label={t("cv.blocks.skills.removeSkill", { name })}
                                    onPress={() => onRemoveSkill(item.id)}
                                >
                                    <XIcon aria-hidden className="size-4" />
                                </Link>
                            </Chip>
                        )
                    })}
                </div>
            ) : null}

            {remainingSuggestions.length > 0 ? (
                <div className="flex flex-col gap-2">
                    <Typography type="body-xs" color="muted">
                        {t("cv.blocks.skills.suggestedLabel")}
                    </Typography>
                    <div className="flex flex-wrap items-center gap-2">
                        {remainingSuggestions.map((skill) => (
                            <button
                                key={skill}
                                type="button"
                                onClick={() => onAddSkill(skill)}
                                className="cursor-pointer rounded-full border border-default bg-surface px-3 py-1 text-xs text-muted outline-none transition-colors hover:bg-default focus-visible:ring-2 focus-visible:ring-accent"
                            >
                                {skill}
                            </button>
                        ))}
                    </div>
                </div>
            ) : null}

            <div className="flex items-end gap-2">
                <TextField variant="secondary" className="flex-1">
                    <Label htmlFor="cv-skills-draft">{t("cv.blocks.skills.addLabel")}</Label>
                    <Input
                        id="cv-skills-draft"
                        placeholder={t("cv.blocks.skills.addPlaceholder")}
                        value={draft}
                        onChange={(event) => setDraft(event.target.value)}
                        onKeyDown={(event) => {
                            if (event.key === "Enter") {
                                event.preventDefault()
                                onAddSkill(draft)
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
                        onAddSkill(draft)
                        setDraft("")
                    }}
                >
                    <PlusIcon aria-hidden className="size-4" />
                    {t("cv.blocks.skills.addAction")}
                </Button>
            </div>
        </div>
    )
}
