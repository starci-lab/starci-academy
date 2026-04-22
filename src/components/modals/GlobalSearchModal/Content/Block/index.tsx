"use client"

import type { GlobalSearchItem } from "@/hooks/singleton"
import { ListBox } from "@heroui/react"
import type { IconProps } from "@phosphor-icons/react"
import React from "react"

type PhosphorIcon = React.ComponentType<IconProps>

/** Props for {@link GlobalSearchContentBlock}. */
interface GlobalSearchContentBlockProps {
    /** Section heading (translated). */
    label: string
    /** Leading icon for the section header. */
    icon: PhosphorIcon
    /** Result rows. */
    items: Array<GlobalSearchItem>
    /** Called when the user activates a row; parent resolves href and navigation. */
    onItemPress: (item: GlobalSearchItem) => void
}

/**
 * One grouped block of global search hits (header + list rows).
 * @param props.kind — Drives how `onItemPress` builds routes in the parent.
 * @param props.onItemPress — Invoked when a `ListBox.Item` is pressed.
 */
export const GlobalSearchContentBlock = (props: GlobalSearchContentBlockProps) => {
    const { icon: SectionIcon, label, items, onItemPress } = props

    /** Render text with `<em>...</em>` as emphasized spans. */
    const renderEmText = (text: string) => {
        const match = text.match(/<em>(.*?)<\/em>/)

        if (!match || match.index === undefined) {
            return text
        }

        const before = 10
        const after = 40

        const start = Math.max(0, match.index - before)
        const end = Math.min(text.length, match.index + match[0].length + after)

        const sliced = text.slice(start, end)

        const parts = sliced.split(/(<em>.*?<\/em>)/g)

        return (
            <>
                {start > 0 ? "…" : null}
                {parts.map((part, index) => {
                    if (part.startsWith("<em>") && part.endsWith("</em>")) {
                        const content = part.replace(/<\/?em>/g, "")
                        return (
                            <span key={index} className="font-semibold text-accent underline decoration-accent/60">
                                {content}
                            </span>
                        )
                    }
                    return <span key={index}>{part}</span>
                })}
                {end < text.length ? "…" : null}
            </>
        )
    }

    if (items.length === 0) {
        return null
    }

    return (
        <div className="mb-3 last:mb-0">
            <div className="flex items-center gap-2 text-accent">
                <SectionIcon className="size-5 shrink-0" aria-hidden />
                <div className="text-xs font-medium">{label}</div>
            </div>
            <ListBox aria-label={label} className="mt-1 gap-0">
                {items.map((item) => {
                    const titleLine = item.title ?? item.texts?.[0] ?? item.displayId
                    const textLines = item.texts ?? []
                    const textValue = [titleLine, ...textLines].join(" ").replace(/<[^>]*>/g, "")
                    return (
                        <ListBox.Item
                            key={item.id}
                            className="rounded-lg py-1 data-[hovered=true]:bg-default-100 data-[pressed=true]:bg-default-200"
                            id={item.id}
                            textValue={textValue}
                            onPress={() => onItemPress(item)}
                        >
                            <div className="py-1">
                                <div className="text-sm text-foreground">{titleLine}</div>
                                {textLines.length > 0 ? (
                                    <ul className="mt-1 list-none space-y-0.5 pl-0">
                                        {textLines.map((line) => (
                                            <li key={line}>
                                                <div className="text-xs text-default-500">{renderEmText(line)}</div>
                                            </li>
                                        ))}
                                    </ul>
                                ) : null}
                            </div>
                        </ListBox.Item>
                    )
                })}
            </ListBox>
        </div>
    )
}
