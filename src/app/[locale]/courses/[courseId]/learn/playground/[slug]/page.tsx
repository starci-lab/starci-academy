"use client"

import React from "react"
import { useParams } from "next/navigation"
import { PlaygroundSession } from "@/components/features/learn/Playground/PlaygroundSession"
import { RagPlayground } from "@/components/features/rag-playground/RagPlayground"

/**
 * Learn / playground / [slug] — the full-bleed hands-on work surface for one
 * Playground exercise. `slug === "rag"` is special-cased to the existing
 * `RagPlayground` feature (its own chat-style UI + backend, unrelated to the
 * `PlaygroundEntity`/step-verify system Docker/K8s use) — RAG moved here from
 * its old standalone public `/rag-playground` route so all 3 Playground
 * entries (Docker/Kubernetes/RAG) share one URL shape under the sidebar
 * accordion; thầy chốt 2026-07-11. Every other slug reads its steps from the
 * route itself via `PlaygroundSession`. The learn layout drops the course
 * rails + reading padding for this route (see `isPlaygroundSession` in
 * `learn/layout.tsx`).
 */
const Page = () => {
    const params = useParams()
    const slug = String(params.slug ?? "")
    if (slug === "rag") {
        return <RagPlayground />
    }
    return <PlaygroundSession />
}

export default Page
