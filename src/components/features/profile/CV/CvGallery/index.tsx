"use client"

import React, { useState } from "react"
import type { ReactNode } from "react"
import {
    Button,
    Switch,
    Typography,
    cn,
} from "@heroui/react"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
    PlusIcon,
    TrashIcon,
} from "@phosphor-icons/react"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { AsyncContent } from "@/components/blocks/async/AsyncContent"
import { MediaCard } from "@/components/blocks/cards/MediaCard"
import { PageHeader } from "@/components/blocks/layout/PageHeader"
import { pathConfig } from "@/resources/path"
import { useQueryMyCvBlocksSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyCvBlocksSwr"
import { useMutateCreateCvBlocksSwr } from "@/hooks/swr/api/graphql/mutations/useMutateCreateCvBlocksSwr"
import { useMutateDeleteCvBlocksSwr } from "@/hooks/swr/api/graphql/mutations/useMutateDeleteCvBlocksSwr"
import { useMutateSetCvBlocksPublicSwr } from "@/hooks/swr/api/graphql/mutations/useMutateSetCvBlocksPublicSwr"
import {
    DEFAULT_CV_STYLE,
    type CvDocument,
} from "../types"
import { CvHtmlDocument } from "../CvBlocksWorkspace/CvHtmlDocument"

/** Props for {@link CvGallery}. */
export interface CvGalleryProps extends WithClassNames<undefined> {
    /** Breadcrumb row rendered above the title (standalone page context). */
    breadcrumb?: ReactNode
}

/** One CV card — a scaled live thumbnail that opens the editor, plus delete. */
const CvGalleryCard = ({
    doc,
    label,
    onOpen,
    onDelete,
    onTogglePublic,
    isTogglingPublic,
}: {
    doc: CvDocument
    label: string
    onOpen: () => void
    onDelete: () => void
    onTogglePublic: (isPublic: boolean) => void
    isTogglingPublic: boolean
}) => {
    const t = useTranslations()
    return (
        <MediaCard
            className="group"
            cover={(
                <button
                    type="button"
                    onClick={onOpen}
                    aria-label={t("cv.builder.editCta", { name: label })}
                    className="relative block h-52 w-full cursor-pointer overflow-hidden bg-white outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent"
                >
                    {/* Scaled live render of the CV as a thumbnail. */}
                    <div
                        aria-hidden
                        className="pointer-events-none absolute inset-0"
                        style={{ transform: "scale(0.42)", transformOrigin: "top left", width: "238%" }}
                    >
                        <CvHtmlDocument doc={doc} />
                    </div>
                    <span className="absolute inset-0 flex items-end justify-center bg-foreground/0 pb-3 opacity-0 transition-opacity group-hover:bg-foreground/5 group-hover:opacity-100">
                        <span className="rounded-full bg-accent px-4 py-2 text-sm text-accent-foreground">
                            {t("cv.builder.openEditor")}
                        </span>
                    </span>
                </button>
            )}
            title={<span className="block truncate">{label}</span>}
            footer={(
                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between gap-2">
                        {/* "Công khai" toggle — flags this as the ONE public CV
                            (single-public-per-user, BE-enforced). Label is a
                            sibling (not inside Switch.Content) to dodge the
                            react-aria slot requirement. */}
                        <div className="flex items-center gap-2">
                            <Switch
                                isSelected={doc.isPublic}
                                isDisabled={isTogglingPublic}
                                onChange={(value) => onTogglePublic(value)}
                                aria-label={t("publicProfile.cv.publicToggle")}
                            >
                                <Switch.Content>
                                    <Switch.Control>
                                        <Switch.Thumb />
                                    </Switch.Control>
                                </Switch.Content>
                            </Switch>
                            <Typography type="body-sm" color="muted">
                                {t("publicProfile.cv.publicToggle")}
                            </Typography>
                        </div>
                        <Button
                            isIconOnly
                            size="sm"
                            variant="ghost"
                            aria-label={t("cv.builder.deleteCta")}
                            onPress={onDelete}
                        >
                            <TrashIcon aria-hidden className="size-4 text-muted" />
                        </Button>
                    </div>
                    {doc.isPublic ? (
                        <Typography type="body-xs" color="muted">
                            {t("publicProfile.cv.publicHint")}
                        </Typography>
                    ) : null}
                </div>
            )}
        />
    )
}

/**
 * The CV GALLERY — the profile `?tab=cv` surface (and the standalone
 * `/profile/cv` page). Renders the user's CV documents as live thumbnails; a
 * click opens the dedicated editor at `/profile/cv/[id]`. Creating a CV
 * immediately opens its editor. Editing lives entirely in {@link CvEditor} on
 * its own route, so this surface stays a light gallery (no cramped editor
 * inside the profile chrome).
 *
 * @param props - {@link CvGalleryProps}
 */
export const CvGallery = ({ className, breadcrumb }: CvGalleryProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const documentsSwr = useQueryMyCvBlocksSwr()
    const documents = documentsSwr.data ?? []
    const { trigger: createDocument, isMutating: isCreating } = useMutateCreateCvBlocksSwr()
    const { trigger: deleteDocument } = useMutateDeleteCvBlocksSwr()
    const { trigger: setPublic } = useMutateSetCvBlocksPublicSwr()
    const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)
    const [pendingPublicId, setPendingPublicId] = useState<string | null>(null)

    const openEditor = (id: string) => {
        router.push(pathConfig().locale(locale).profile().cv().document(id).build())
    }

    const coursesHref = pathConfig().locale(locale).course().build()

    const onCreate = async () => {
        const result = await createDocument({
            label: t("cv.builder.untitled", { number: documents.length + 1 }),
            blocks: [],
            style: DEFAULT_CV_STYLE,
        })
        const created = result.data?.createCvBlocks?.data
        await documentsSwr.mutate()
        if (created) {
            openEditor(created.id)
        }
    }

    const onDelete = async (id: string) => {
        setPendingDeleteId(id)
        try {
            await deleteDocument({ id })
            await documentsSwr.mutate()
        } finally {
            setPendingDeleteId(null)
        }
    }

    // Flag/unflag ONE CV as public. Single-public-per-user is BE-enforced (turning
    // one on turns any other off), so the refetch reflects the whole set.
    const onTogglePublic = async (id: string, isPublic: boolean) => {
        setPendingPublicId(id)
        try {
            await setPublic({ id, isPublic })
            await documentsSwr.mutate()
        } finally {
            setPendingPublicId(null)
        }
    }

    const isLoading = documentsSwr.isLoading && !documentsSwr.data
    const isEmpty = !documentsSwr.isLoading && documents.length === 0

    return (
        <div className={cn("flex flex-col gap-10", className)}>
            {breadcrumb ? (
                <PageHeader
                    breadcrumb={breadcrumb}
                    title={t("cv.builder.title")}
                    description={t("cv.builder.galleryDescription")}
                />
            ) : null}

            <AsyncContent
                isLoading={isLoading}
                skeleton={(
                    <div className="grid grid-cols-1 gap-6 @app-sm:grid-cols-2 @app-lg:grid-cols-3">
                        {[0, 1, 2].map((key) => (
                            <div key={key} className="h-[19rem] rounded-3xl border border-default bg-surface" />
                        ))}
                    </div>
                )}
                isEmpty={isEmpty}
                emptyContent={{
                    title: t("cv.builder.emptyTitle"),
                    description: (
                        <>
                            {t("cv.builder.emptyHint")}
                            {" "}
                            <Link
                                href={coursesHref}
                                className="text-accent-soft-foreground underline-offset-4 decoration-[var(--separator-tertiary)] hover:underline"
                            >
                                {t("cv.builder.emptyCoursesLinkCta")}
                            </Link>
                        </>
                    ),
                    onRetry: onCreate,
                    retryLabel: t("cv.builder.createFirst"),
                }}
                error={documentsSwr.error}
                errorContent={{
                    title: t("cv.builder.errorTitle"),
                    onRetry: () => documentsSwr.mutate(),
                    retryLabel: t("cv.builder.retry"),
                }}
            >
                <div className="grid grid-cols-1 gap-6 @app-sm:grid-cols-2 @app-lg:grid-cols-3">
                    {documents.map((doc, index) => (
                        <CvGalleryCard
                            key={doc.id}
                            doc={doc}
                            label={doc.label || t("cv.builder.untitled", { number: index + 1 })}
                            onOpen={() => openEditor(doc.id)}
                            onDelete={() => {
                                if (pendingDeleteId === null) {
                                    void onDelete(doc.id)
                                }
                            }}
                            onTogglePublic={(isPublic) => {
                                if (pendingPublicId === null) {
                                    void onTogglePublic(doc.id, isPublic)
                                }
                            }}
                            isTogglingPublic={pendingPublicId === doc.id}
                        />
                    ))}
                    <button
                        type="button"
                        onClick={onCreate}
                        disabled={isCreating}
                        className="flex h-[19rem] cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-default text-accent-soft-foreground outline-none transition-colors hover:bg-default focus-visible:ring-2 focus-visible:ring-accent disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <PlusIcon aria-hidden className="size-8" />
                        <span className="text-sm font-medium">{t("cv.builder.createCta")}</span>
                    </button>
                </div>
            </AsyncContent>
        </div>
    )
}
