"use client"
import { useSearchOverlayState } from "@/hooks"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import React, { useCallback } from "react"
import { GlobalSearchContentBlock } from "./Block"
import { GlobalSearchEmpty } from "./Empty"
import { useAppSelector } from "@/redux"
import { Accordion, ScrollShadow } from "@heroui/react"
import { pathConfig } from "@/resources/path"
import type { AutocompleteGlobalSearchItem } from "@/modules/api"


/** Entity bucket a pressed search item belongs to — drives how its href is built. */
type GlobalSearchKind = "course" | "module" | "content" | "challenge" | "flashcardDeck" | "milestone" | "milestoneTask"

/** One grouped, collapsible section of the results (header label + hit count + rows). */
interface GlobalSearchSection {
    /** Bucket kind — also the accordion item key and the `onItemPress` discriminator. */
    kind: GlobalSearchKind
    /** Translated section heading. */
    label: string
    /** Hits in this bucket (already deduped + parent-path enriched by the API). */
    items?: Array<AutocompleteGlobalSearchItem>
}

/**
 * Grouped command-palette results for global search, rendered as an accordion: one collapsible
 * section per non-empty bucket, each titled `Label (count)` (no icons). Sections start expanded so
 * hits are visible immediately; learners can collapse the ones they don't care about.
 *
 * Each result carries a `parentPath` (resolved from the indexer parent-index cache) holding the
 * course slug + module/content/task ids needed to build the deep-link learn URL.
 */
export const GlobalSearchContent = () => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const { setOpen } = useSearchOverlayState()

    const courses = useAppSelector((state) => state.socketIo.globalSearchResults?.data?.courses)
    const modules = useAppSelector((state) => state.socketIo.globalSearchResults?.data?.modules)
    const challenges = useAppSelector((state) => state.socketIo.globalSearchResults?.data?.challenges)
    const contents = useAppSelector((state) => state.socketIo.globalSearchResults?.data?.contents)
    const flashcardDecks = useAppSelector((state) => state.socketIo.globalSearchResults?.data?.flashcardDecks)
    const milestones = useAppSelector((state) => state.socketIo.globalSearchResults?.data?.milestones)
    const milestoneTasks = useAppSelector((state) => state.socketIo.globalSearchResults?.data?.milestoneTasks)
    const query = useAppSelector((state) => state.search.query).trim()

    // Build the deep-link URL for a pressed hit from its kind + resolved ancestor chain.
    // Returns null when the data needed for that kind is missing so we can no-op safely.
    const buildHref = useCallback(
        (kind: GlobalSearchKind, item: AutocompleteGlobalSearchItem): string | null => {
            const parent = item.parentPath
            const root = pathConfig().locale(locale)
            switch (kind) {
            // a course links to its own public course page (slug = the item's displayId)
            case "course": {
                if (!item.displayId) return null
                return root.course(item.displayId).build()
            }
            // a module needs the owning course slug; the module segment uses its UUID
            case "module": {
                const courseSlug = parent?.course?.displayId
                if (!courseSlug) return null
                return root.course(courseSlug).learn().module(item.id).build()
            }
            // a content needs course slug + module UUID; the content segment uses its UUID
            case "content": {
                const courseSlug = parent?.course?.displayId
                const moduleId = parent?.module?.id
                if (!courseSlug || !moduleId) return null
                return root.course(courseSlug).learn().module(moduleId).content(item.id).build()
            }
            // a challenge has no standalone route → land on its parent content page
            case "challenge": {
                const courseSlug = parent?.course?.displayId
                const moduleId = parent?.module?.id
                const contentId = parent?.content?.id
                if (!courseSlug || !moduleId || !contentId) return null
                return root.course(courseSlug).learn().module(moduleId).content(contentId).build()
            }
            // a flashcard deck lives on the course-level flashcards tab (needs only the course slug)
            case "flashcardDeck": {
                const courseSlug = parent?.course?.displayId
                if (!courseSlug) return null
                return root.course(courseSlug).learn().flashcards().build()
            }
            // a milestone has no standalone page → deep-link to its first task, falling back to
            // the personal-project root when the milestone has no tasks (task id absent)
            case "milestone": {
                const courseSlug = parent?.course?.displayId
                if (!courseSlug) return null
                const taskId = parent?.task?.id
                return root.course(courseSlug).learn().personalProject(taskId).build()
            }
            // a task deep-links to its own personal-project page (task id = the hit's own id)
            case "milestoneTask": {
                const courseSlug = parent?.course?.displayId
                if (!courseSlug) return null
                return root.course(courseSlug).learn().personalProject(item.id).build()
            }
            default:
                return null
            }
        }, [locale])

    // Resolve the href for the pressed item, navigate to it, then close the palette.
    const onItemPress = useCallback(
        (kind: GlobalSearchKind) => (item: AutocompleteGlobalSearchItem) => {
            const href = buildHref(kind, item)
            // ignore presses we cannot resolve a destination for (missing ancestors)
            if (!href) return
            router.push(href)
            setOpen(false)
        }, [buildHref, router, setOpen])

    // One section per bucket, in display order; only non-empty buckets are shown.
    const allSections: Array<GlobalSearchSection> = [
        {
            kind: "course",
            label: t("search.suggestions.courses"),
            items: courses,
        },
        {
            kind: "module",
            label: t("search.suggestions.modules"),
            items: modules,
        },
        {
            kind: "content",
            label: t("search.suggestions.contents"),
            items: contents,
        },
        {
            kind: "challenge",
            label: t("search.suggestions.challenges"),
            items: challenges,
        },
        {
            kind: "flashcardDeck",
            label: t("search.suggestions.flashcards"),
            items: flashcardDecks,
        },
        {
            kind: "milestone",
            label: t("search.suggestions.milestones"),
            items: milestones,
        },
        {
            kind: "milestoneTask",
            label: t("search.suggestions.milestoneTasks"),
            items: milestoneTasks,
        },
    ]
    const sections = allSections.filter((section) => (section.items?.length ?? 0) > 0)

    return (
        <ScrollShadow hideScrollBar className="max-h-[300px] py-3">
            {sections.length === 0 ? (
                <GlobalSearchEmpty hasQuery={query.length > 0} />
            ) : (
                <Accordion
                    variant="default"
                    hideSeparator
                    className="px-0"
                    defaultExpandedKeys={sections.map((section) => section.kind)}
                >
                    {sections.map((section) => (
                        <Accordion.Item
                            key={section.kind}
                            id={section.kind}
                            aria-label={section.label}
                        >
                            <Accordion.Heading>
                                <Accordion.Trigger className="w-full p-0">
                                    <div className="flex w-full items-center justify-between gap-1.5">
                                        <span className="text-sm font-medium text-foreground">
                                            {`${section.label} (${section.items?.length ?? 0})`}
                                        </span>
                                        <Accordion.Indicator />
                                    </div>
                                </Accordion.Trigger>
                            </Accordion.Heading>
                            <Accordion.Panel>
                                <Accordion.Body className="p-3 pt-0">
                                    <GlobalSearchContentBlock
                                        items={section.items ?? []}
                                        onItemPress={onItemPress(section.kind)}
                                    />
                                </Accordion.Body>
                            </Accordion.Panel>
                        </Accordion.Item>
                    ))}
                </Accordion>
            )}
        </ScrollShadow>
    )
}
