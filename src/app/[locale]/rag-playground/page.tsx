"use client"

import { useEffect } from "react"
import { useLocale } from "next-intl"
import { useRouter } from "next/navigation"
import { pathConfig } from "@/resources/path"

/**
 * Route `/[locale]/rag-playground` — MOVED 2026-07-11 into the course-scoped
 * `learn/playground/rag` (thầy chốt: unify the 3 Playground accordion
 * children under one `learn/playground/<slug>` URL shape). Redirects here so
 * old bookmarks/links don't dead-end; the AI & LLM Mastery course hosts it.
 */
const Page = () => {
    const router = useRouter()
    const locale = useLocale()
    useEffect(() => {
        router.replace(pathConfig().locale(locale).course("ai-llm-mastery").learn().playground("rag").build())
    }, [router, locale])
    return null
}

export default Page
