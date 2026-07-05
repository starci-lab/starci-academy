import React from "react"
import {
    CvEditor,
} from "@/components/features/profile/CV/CvEditor"

interface PageProps {
    params: Promise<{ locale: string, cvId: string }>
}

/**
 * `/profile/cv/[cvId]` — the dedicated CV editor route (full-bleed app shell:
 * navbar-integrated toolbar + flush style sidebar + blocks + preview). The
 * gallery at `/profile/cv` opens this. Rendered full-bleed (no max-w wrapper);
 * the editor owns its own shell layout + padding.
 */
const Page = async ({ params }: PageProps) => {
    const { cvId } = await params
    return <CvEditor cvId={cvId} />
}

export default Page
