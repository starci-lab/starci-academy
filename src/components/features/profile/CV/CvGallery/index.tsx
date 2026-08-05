"use client"

import React, { useState } from "react"
import type { ReactNode } from "react"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { pathConfig } from "@/resources/path"
import { useQueryMyCvBlocksSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyCvBlocksSwr"
import { useMutateCreateCvBlocksSwr } from "@/hooks/swr/api/graphql/mutations/useMutateCreateCvBlocksSwr"
import { useMutateDeleteCvBlocksSwr } from "@/hooks/swr/api/graphql/mutations/useMutateDeleteCvBlocksSwr"
import { useMutateSetCvBlocksPublicSwr } from "@/hooks/swr/api/graphql/mutations/useMutateSetCvBlocksPublicSwr"
import { DEFAULT_CV_STYLE } from "../types"
import { _CvGallery, type CvGalleryDocument } from "./component"

/** Props for {@link CvGallery}. */
export interface CvGalleryProps {
    /** Breadcrumb row rendered above the title (standalone page context). */
    breadcrumb?: ReactNode
}

/**
 * The CV GALLERY — the CONNECTED half: it fetches the user's CV documents, drives the
 * create/delete/public-toggle mutations, resolves every label, and hands them to the
 * presentational {@link _CvGallery}. See `tiers/split.md`. Creating a CV immediately
 * opens its editor; editing lives entirely in the dedicated editor route, so this stays
 * a light gallery.
 *
 * @param props - {@link CvGalleryProps}
 */
export const CvGallery = ({ breadcrumb }: CvGalleryProps) => {
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

    // Resolved per-card entities — labels, the interpolated cover aria-label, and
    // handlers already bound to this document's id (BLOCK-9: an entity, not loose fields).
    // Recomputed fresh every render (cheap, N ~ a handful of CVs) — same as the
    // pre-split file, which built this same row shape inline in JSX.
    const items: Array<CvGalleryDocument> = documents.map((doc, index) => {
        const label = doc.label || t("cv.builder.untitled", { number: index + 1 })
        return {
            id: doc.id,
            label,
            doc,
            isPublic: doc.isPublic,
            isTogglingPublic: pendingPublicId === doc.id,
            editAriaLabel: t("cv.builder.editCta", { name: label }),
            onOpen: () => openEditor(doc.id),
            onDelete: () => {
                if (pendingDeleteId === null) {
                    void onDelete(doc.id)
                }
            },
            onTogglePublic: (isPublic: boolean) => {
                if (pendingPublicId === null) {
                    void onTogglePublic(doc.id, isPublic)
                }
            },
        }
    })

    return (
        <_CvGallery
            breadcrumb={breadcrumb}
            // first load, nothing in hand → shimmer; settled (data OR error) stops it (loading-and-skeleton.md)
            isSkeleton={documentsSwr.isLoading && !documentsSwr.data}
            isEmpty={!documentsSwr.isLoading && documents.length === 0}
            error={documentsSwr.error}
            onRetry={() => { void documentsSwr.mutate() }}
            documents={items}
            onCreate={() => { void onCreate() }}
            isCreating={isCreating}
            coursesHref={coursesHref}
            labels={{
                pageTitle: t("cv.builder.title"),
                pageDescription: t("cv.builder.galleryDescription"),
                openEditor: t("cv.builder.openEditor"),
                deleteCta: t("cv.builder.deleteCta"),
                publicToggle: t("publicProfile.cv.publicToggle"),
                publicHint: t("publicProfile.cv.publicHint"),
                createCta: t("cv.builder.createCta"),
                emptyTitle: t("cv.builder.emptyTitle"),
                emptyHint: t("cv.builder.emptyHint"),
                emptyCoursesLinkCta: t("cv.builder.emptyCoursesLinkCta"),
                createFirst: t("cv.builder.createFirst"),
                errorTitle: t("cv.builder.errorTitle"),
                retry: t("cv.builder.retry"),
            }}
        />
    )
}
