import { useMemo, useState } from "react"
import {
    Input,
    Label,
    ListBox,
    ScrollShadow,
    TextField,
    Typography,
    cn,
} from "@heroui/react"
import { useTranslations } from "next-intl"

import { PageHeader } from "@/components/blocks/layout/PageHeader"
import { CODING_DOMAIN_ORDER } from "@/modules/api/graphql/queries/types/coding"
import type { DomainFilter } from "@/components/features/practice/types"
import { ResizableRail } from "@/components/blocks/layout/ResizableRail"

/**
 * Topic search + ListBox — same markup as `PracticeRail` (problems mode),
 * without the Exercises / Leaderboard `TabsCard`.
 */
export const PracticeTopicsBody = ({ className }: { className?: string }) => {
    const t = useTranslations()
    const [query, setQuery] = useState("")
    const [domain, setDomain] = useState<DomainFilter>("all")

    const topicLabel = (value: DomainFilter): string =>
        value === "all"
            ? t("practice.filters.allDomains")
            : t(`codingPractice.domain.${value}`)

    const topics = useMemo<Array<DomainFilter>>(() => {
        const all: Array<DomainFilter> = ["all", ...CODING_DOMAIN_ORDER]
        const normalized = query.trim().toLowerCase()
        if (!normalized) {
            return all
        }
        return all.filter((item) => topicLabel(item).toLowerCase().includes(normalized))
    }, [query, t])

    return (
        <div className={cn("relative flex min-h-0 min-w-0 flex-col gap-3 p-6", className)}>
            <div className="flex flex-col gap-2">
                <Label className="px-1 text-xs text-muted">{t("practice.rail.topicsLabel")}</Label>
                <TextField>
                    <Input
                        type="search"
                        aria-label={t("practice.rail.searchTopic")}
                        placeholder={t("practice.rail.searchTopic")}
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                    />
                </TextField>
            </div>

            <ScrollShadow
                hideScrollBar
                className="-mx-1 min-h-0 min-w-0 flex-1 overflow-y-auto px-1"
            >
                {topics.length === 0 ? (
                    <Typography type="body-sm" color="muted" className="px-3 py-2">
                        {t("practice.rail.searchTopicEmpty", { query: query.trim() })}
                    </Typography>
                ) : (
                    <ListBox
                        aria-label={t("practice.rail.topicsAria")}
                        selectionMode="single"
                        disallowEmptySelection
                        selectedKeys={[domain]}
                        onSelectionChange={(keys) => {
                            const key = [...keys][0]
                            if (typeof key === "string") {
                                setDomain(key as DomainFilter)
                            }
                        }}
                        className="gap-1 p-0"
                    >
                        {topics.map((item) => (
                            <ListBox.Item
                                key={item}
                                id={item}
                                textValue={topicLabel(item)}
                                className="cursor-pointer rounded-2xl px-3 py-2 text-foreground data-[hovered=true]:bg-default-100 data-[selected=true]:bg-accent-soft data-[selected=true]:text-accent-soft-foreground"
                            >
                                <Typography type="body-sm" className="min-w-0 flex-1 truncate text-inherit">
                                    {topicLabel(item)}
                                </Typography>
                            </ListBox.Item>
                        ))}
                    </ListBox>
                )}
            </ScrollShadow>
        </div>
    )
}

/**
 * Shell mirrored from `Practice`: flex row, rail `relative shrink-0`, content
 * pane `flex-1` + PageHeader. No outer border — the resize handle IS the divider.
 */
export const PracticeShellDemo = ({
    storageKey,
    heightClassName,
    defaultWidth = 300,
}: {
    storageKey: string
    heightClassName: string
    defaultWidth?: number
}) => {
    const t = useTranslations()

    return (
        <div className={`flex w-full items-start ${heightClassName}`}>
            <ResizableRail
                className="relative flex h-full shrink-0 flex-col self-stretch"
                storageKey={storageKey}
                defaultWidth={defaultWidth}
                minWidth={256}
                maxWidth={420}
                ariaLabel={t("practice.rail.topicsAria")}
            >
                <PracticeTopicsBody className="min-h-0 flex-1" />
            </ResizableRail>

            <div className="min-h-0 min-w-0 flex-1 overflow-y-auto p-6">
                <div className="mx-auto flex max-w-5xl flex-col gap-10">
                    <PageHeader
                        title={t("codingPractice.title")}
                        description={t("codingPractice.subtitle")}
                    />
                </div>
            </div>
        </div>
    )
}
