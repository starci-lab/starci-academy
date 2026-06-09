"use client"
import { CurlyBrackets as BracketsCurlyIcon, FileText as ArticleIcon, Flag as SwordIcon, GraduationCap as GraduationCapIcon } from "@gravity-ui/icons"
import { useSearchOverlayState } from "@/hooks"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import React, { useCallback } from "react"
import { GlobalSearchContentBlock } from "./Block"
import { GlobalSearchEmpty } from "./Empty"
import { useAppSelector } from "@/redux"
import { ScrollShadow } from "@heroui/react"
import { pathConfig } from "@/resources/path"
import type { AutocompleteGlobalSearchItem } from "@/modules/api"


/** Entity bucket a pressed search item belongs to — drives how its href is built. */
type GlobalSearchKind = "course" | "module" | "content" | "challenge"

/**
 * Grouped command-palette style results for global search (courses, modules, contents, challenges).
 *
 * Each result carries a `parentPath` (resolved from the indexer parent-index cache) holding the
 * course slug + module/content UUIDs needed to build the deep-link learn URL.
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
    const query = useAppSelector((state) => state.search.query).trim()

    // No group has any hit → show the idle hint (blank query) or the no-match message.
    const isEmpty =
        (courses?.length ?? 0) === 0 &&
        (modules?.length ?? 0) === 0 &&
        (contents?.length ?? 0) === 0 &&
        (challenges?.length ?? 0) === 0

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

    return (
        <ScrollShadow hideScrollBar className="max-h-[300px] p-3">
            {isEmpty ? <GlobalSearchEmpty hasQuery={query.length > 0} /> : null}
            <GlobalSearchContentBlock
                icon={GraduationCapIcon}
                label={t("search.suggestions.courses")}
                items={courses ?? []}
                onItemPress={onItemPress("course")}
            />
            <GlobalSearchContentBlock
                icon={BracketsCurlyIcon}
                label={t("search.suggestions.modules")}
                items={modules ?? []}
                onItemPress={onItemPress("module")}
            />
            <GlobalSearchContentBlock
                icon={ArticleIcon}
                label={t("search.suggestions.contents")}
                items={contents ?? []}
                onItemPress={onItemPress("content")}
            />
            <GlobalSearchContentBlock
                icon={SwordIcon}
                label={t("search.suggestions.challenges")}
                items={challenges ?? []}
                onItemPress={onItemPress("challenge")}
            />
        </ScrollShadow>
    )
}
