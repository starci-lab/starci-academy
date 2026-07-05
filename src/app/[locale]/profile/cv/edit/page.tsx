import { redirect } from "next/navigation"

interface PageProps {
    params: Promise<{ locale: string }>
}

/**
 * `/profile/cv/edit` — LEGACY route (kept only so old bookmarks/deep-links
 * still resolve). CV compose (upload/generate/revise) is no longer a separate
 * page/layout — it's the `?edit=true` MODE of `/profile/cv` itself (same shell
 * as the review surface), so every new navigation should build
 * `pathConfig().profile().cv().edit().build()` (which already returns
 * `/profile/cv?edit=true`) instead of linking here.
 */
const Page = async ({ params }: PageProps) => {
    const { locale } = await params
    redirect(`/${locale}/profile/cv?edit=true`)
}

export default Page
