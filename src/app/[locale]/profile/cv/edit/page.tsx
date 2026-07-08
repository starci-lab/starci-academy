import { redirect } from "next/navigation"

interface PageProps {
    params: Promise<{ locale: string }>
}

/**
 * `/profile/cv/edit` — LEGACY route (kept so old bookmarks/deep-links resolve).
 * The CV flow is now a GALLERY at `/profile/cv` (list) + a dedicated editor at
 * `/profile/cv/<id>`; there is no standalone "edit" surface, so this redirects
 * to the gallery.
 */
const Page = async ({ params }: PageProps) => {
    const { locale } = await params
    redirect(`/${locale}/profile/cv`)
}

export default Page
