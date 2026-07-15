import type { Meta, StoryObj } from "@storybook/nextjs"
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
import { ResizableRail } from "./index"

const meta: Meta<typeof ResizableRail> = {
    title: "Core/Layout/ResizableRail",
    component: ResizableRail,
}
export default meta
type Story = StoryObj<typeof ResizableRail>

/**
 * Topic search + ListBox — same markup as `PracticeRail` (problems mode),
 * without the Bài tập / Bảng xếp hạng `TabsCard`.
 */
const PracticeTopicsBody = ({ className }: { className?: string }) => {
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
const PracticeShellDemo = ({
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

/** Dùng khi bề rộng rail là thứ NGƯỜI ĐỌC nên tự quyết chứ không phải mình chọn hộ — mục lục có bài tên dài ngắn khác nhau, ai muốn rộng để đọc đủ, ai muốn hẹp để lấy chỗ cho nội dung chính. Rail cố định bề rộng thì đừng dùng block này, chỉ cần một div thường. Chiều rộng người đọc kéo được nhớ lại theo storageKey, nên hai rail khác nhau phải có key khác nhau. */
export const Default: Story = {
    parameters: {
        usage: "Dùng khi bề rộng rail là thứ NGƯỜI ĐỌC nên tự quyết chứ không phải mình chọn hộ — mục lục có bài tên dài ngắn khác nhau, ai muốn rộng để đọc đủ, ai muốn hẹp để lấy chỗ cho nội dung chính. Rail cố định bề rộng thì đừng dùng block này, chỉ cần một div thường. Chiều rộng người đọc kéo được nhớ lại theo `storageKey`, nên hai rail khác nhau phải có key khác nhau. Body rail = search + ListBox topic như `PracticeRail` (không có tabs mode).",
    },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Rail kéo được</Label>
                <Typography type="body-sm" color="muted">
                    shell `/practice`: search + danh sách chủ đề trong `ResizableRail`, pane `PageHeader` bên phải. Kéo tay nắm ở mép phải; tải lại story thì bề rộng vừa kéo vẫn còn.
                </Typography>
            </div>
            <PracticeShellDemo
                storageKey="storybook.practice.rail.width"
                heightClassName="h-[32rem]"
            />
        </div>
    ),
}

/** Dùng để soi nhánh tràn: mục lục dài hơn shell thì phải cuộn BÊN TRONG rail, không được đẩy cao shell hay lòi ra ngoài. */
export const ScrollableContent: Story = {
    parameters: {
        usage: "Dùng để soi nhánh tràn: danh sách topic dài hơn shell thì phải cuộn BÊN TRONG rail (`ScrollShadow`), không được đẩy cao shell hay lòi ra ngoài.",
    },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Nội dung tràn, cuộn trong rail</Label>
                <Typography type="body-sm" color="muted">
                    shell thấp hơn danh sách topic — cuộn trong `ScrollShadow`, chiều cao shell giữ nguyên. Kéo rộng hẹp lúc đang cuộn vẫn phải mượt.
                </Typography>
            </div>
            <PracticeShellDemo
                storageKey="storybook.practice.rail.scroll.v2.width"
                heightClassName="h-80"
                defaultWidth={360}
            />
        </div>
    ),
}
