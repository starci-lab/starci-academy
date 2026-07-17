"use client"
import { Chip, cn, ListBox, Typography } from "@heroui/react"
import {
    CaretRightIcon,
    CardsIcon,
    CheckSquareIcon,
    FileTextIcon,
    FlagIcon,
    GraduationCapIcon,
    LightbulbIcon,
    LockIcon,
    PuzzlePieceIcon,
    StackIcon,
} from "@phosphor-icons/react"
import type { Icon } from "@phosphor-icons/react"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import React, { useCallback } from "react"
import { AutocompleteGlobalSearchItem } from "@/modules/api/graphql/queries/types/autocomplete-global-search"
import { useSearchOverlayState } from "@/hooks/zustand/overlay/hooks"
import type { GlobalSearchKind } from "../index"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Props for {@link GlobalSearchContentBlock}. */
interface GlobalSearchContentBlockProps extends WithClassNames<undefined> {
    /** Bucket kind of these rows — drives the leading icon + course/content state affordances. */
    kind: GlobalSearchKind
    /** Result rows for this bucket section. */
    items: Array<AutocompleteGlobalSearchItem>
}

/**
 * Leading icon per result kind (phosphor, size-4). A required CLASSIFIER in a mixed
 * result list — lets the eye tell a course from a milestone-task at a glance.
 */
const KIND_ICON: Record<GlobalSearchKind, Icon> = {
    course: GraduationCapIcon,
    module: StackIcon,
    content: FileTextIcon,
    challenge: PuzzlePieceIcon,
    flashcardDeck: CardsIcon,
    milestone: FlagIcon,
    milestoneTask: CheckSquareIcon,
    foundation: LightbulbIcon,
}

/**
 * The list body of one global-search group (rows only). Each row shows a leading
 * kind icon; course rows add a state chip (enrolled / free) + a "view course" CTA
 * hint, and content rows add a free chip or a premium lock hint. The whole row is a
 * single click target navigating to the server-built `item.path` (no nested button —
 * react-aria forbids nested interactives inside a ListBox.Item).
 */
export const GlobalSearchContentBlock = (props: GlobalSearchContentBlockProps) => {
    const { kind, items, className } = props
    const locale = useLocale()
    const router = useRouter()
    const t = useTranslations()
    const { setOpen } = useSearchOverlayState()

    // Navigate to the canonical server-built route for the pressed hit, then close.
    const onItemPress = useCallback(
        (item: AutocompleteGlobalSearchItem) => {
            // ignore presses with no resolvable route (cache miss / unroutable kind)
            if (!item.path) return
            // server path is locale-agnostic → prepend the active locale
            router.push(`/${locale}${item.path}`)
            setOpen(false)
        }, [locale, router, setOpen])

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
                            <span key={index} className="font-semibold text-accent-soft-foreground underline underline-offset-4 decoration-[var(--separator-tertiary)] decoration-accent/60">
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

    const Icon = KIND_ICON[kind]

    return (
        <ListBox aria-label="search results" className={cn("gap-0", className)}>
            {items.map((item) => {
                const titleLine = item.title ?? item.texts?.[0] ?? item.displayId
                const textLines = item.texts ?? []
                const textValue = [titleLine, ...textLines].join(" ").replace(/<[^>]*>/g, "")

                // course state chip: enrolled → success "Đã đăng ký"; not-enrolled+free → success
                // "Miễn phí"; paid → no chip (absence implies paid).
                const showEnrolledChip = kind === "course" && item.isEnrolled === true
                const showCourseFreeChip = kind === "course" && item.isEnrolled !== true && item.isFree === true
                // content free chip vs premium lock hint (lock = needs enrollment, not a buy button).
                const showContentFreeChip = kind === "content" && item.isPremium === false
                const showPremiumLock = kind === "content" && item.isPremium === true

                return (
                    <ListBox.Item
                        key={item.id}
                        className="group rounded-lg py-1 data-[pressed=true]:bg-default"
                        id={item.id}
                        textValue={textValue}
                        onAction={() => onItemPress(item)}
                    >
                        <div className="flex items-start gap-2 py-1">
                            <Icon aria-hidden focusable="false" className="mt-0 size-4 shrink-0 text-foreground" />
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                    <Typography
                                        type="body-sm"
                                        truncate
                                        className="min-w-0 flex-1 underline-offset-4 decoration-[var(--separator-tertiary)] group-hover:underline"
                                    >
                                        {titleLine}
                                    </Typography>
                                    {showEnrolledChip ? (
                                        <Chip size="sm" className="shrink-0 bg-success-soft text-success-soft-foreground">
                                            <Chip.Label>{t("search.result.enrolled")}</Chip.Label>
                                        </Chip>
                                    ) : null}
                                    {showCourseFreeChip || showContentFreeChip ? (
                                        <Chip size="sm" className="shrink-0 bg-success-soft text-success-soft-foreground">
                                            <Chip.Label>{t("search.result.free")}</Chip.Label>
                                        </Chip>
                                    ) : null}
                                    {showPremiumLock ? (
                                        <LockIcon
                                            aria-label={t("learning.outline.premium")}
                                            focusable="false"
                                            className="size-4 shrink-0 text-muted"
                                        />
                                    ) : null}
                                    {kind === "course" ? (
                                        <span className="inline-flex shrink-0 items-center gap-1 text-xs text-accent-soft-foreground">
                                            {t("search.result.viewCourse")}
                                            <CaretRightIcon
                                                aria-hidden
                                                focusable="false"
                                                weight="bold"
                                                className="size-4 transition-transform group-hover:translate-x-1"
                                            />
                                        </span>
                                    ) : null}
                                </div>
                                {textLines.length > 0 ? (
                                    <ul className="mt-1 list-none space-y-2 pl-0">
                                        {textLines.map((line: string) => (
                                            <li key={line}>
                                                <Typography type="body-xs" color="muted">
                                                    {renderEmText(line)}
                                                </Typography>
                                            </li>
                                        ))}
                                    </ul>
                                ) : null}
                            </div>
                        </div>
                    </ListBox.Item>
                )
            })}
        </ListBox>
    )
}
