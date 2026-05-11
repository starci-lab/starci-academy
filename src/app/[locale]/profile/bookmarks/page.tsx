"use client"

import React from "react"
import { useQuerySavedContentsSwr } from "@/hooks/singleton"
import { Skeleton, Card, Button } from "@heroui/react"
import { ClockIcon, VideoIcon, SwordIcon, ArrowRightIcon } from "@phosphor-icons/react"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { pathConfig } from "@/resources/path"

const BookmarksPage = () => {
    const t = useTranslations()
    const router = useRouter()
    const { data: savedContents, isLoading, error } = useQuerySavedContentsSwr()

    if (isLoading) {
        return (
            <div className="flex flex-col gap-4 p-6 max-w-4xl mx-auto">
                <Skeleton className="h-8 w-1/3 rounded-lg" />
                <Skeleton className="h-32 w-full rounded-xl" />
                <Skeleton className="h-32 w-full rounded-xl" />
                <Skeleton className="h-32 w-full rounded-xl" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="p-6 text-center text-danger max-w-4xl mx-auto">
                Error loading bookmarks.
            </div>
        )
    }

    const contents = savedContents?.contents || []

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">{t("content.saved")}</h1>
            
            {contents.length === 0 ? (
                <div className="text-center text-muted p-12 border rounded-2xl bg-default-50">
                    <p>No saved contents yet.</p>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {contents.map((content) => (
                        <Card key={content.id} className="w-full hover:border-accent transition-colors cursor-pointer" onClick={() => {
                            if (content.displayId) {
                                router.push(pathConfig().locale().publicContent(content.displayId).build())
                            }
                        }}>
                            <div className="p-4 flex flex-row items-center gap-4 w-full text-left">
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-lg font-semibold truncate">{content.title}</h3>
                                    <p className="text-sm text-muted line-clamp-2 mt-1">{content.description}</p>
                                    <div className="flex items-center gap-4 mt-3 text-xs text-muted">
                                        <div className="flex items-center gap-1">
                                            <ClockIcon className="size-4" />
                                            <span>{content.minutesRead} min read</span>
                                        </div>
                                        {content.numLessons > 0 && (
                                            <div className="flex items-center gap-1">
                                                <VideoIcon className="size-4" />
                                                <span>{content.numLessons} lessons</span>
                                            </div>
                                        )}
                                        {content.numChallenges > 0 && (
                                            <div className="flex items-center gap-1">
                                                <SwordIcon className="size-4" />
                                                <span>{content.numChallenges} challenges</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="shrink-0 pl-2">
                                    <Button isIconOnly variant="ghost" className="rounded-full">
                                        <ArrowRightIcon className="size-5 text-muted" />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}

export default BookmarksPage
