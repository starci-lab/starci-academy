"use client"

import React from "react"
import { Chip, Typography } from "@heroui/react"
import { useTranslations } from "next-intl"
import { Cluster } from "@/components/frames/Cluster"

/**
 * Real backend subsystems the blog writes about — a curated framing strip (NOT a filter, so it
 * never points at empty buckets). Proper technical nouns → not translated.
 */
const BACKEND_TOPICS = ["CQRS", "Kafka", "RAG · Qdrant", "CDC", "Keycloak", "Judge0", "Media", "Mount"]

/** "Topics we write about" — names the real subsystems, replacing the dead editorial-pillar filter. */
export const TopicsStrip = () => {
    const t = useTranslations("blog")
    return (
        <Cluster gap={3} principle="chip-row" items={[
            () => (
                <Typography type="body-sm" color="muted">
                    {t("topics")}
                </Typography>
            ),
            ...BACKEND_TOPICS.map((topic) => () => (
                <Chip key={topic} size="sm" variant="soft" className="font-mono">
                    {topic}
                </Chip>
            )),
        ]} />
    )
}
