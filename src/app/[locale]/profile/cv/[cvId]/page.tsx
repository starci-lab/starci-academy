import React from "react"
import { CvEditorPage } from "@/components/pages/CvEditorPage"

interface PageProps {
    params: Promise<{ locale: string, cvId: string }>
}

/**
 * `/profile/cv/[cvId]` — the CV editor, opened from the gallery at `/profile/cv`.
 * Rendered full-bleed: the editor owns its own shell layout and padding.
 */
const Page = async ({ params }: PageProps) => {
    const { cvId } = await params
    return <CvEditorPage cvId={cvId} />
}

export default Page
