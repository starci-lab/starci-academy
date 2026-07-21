import React from "react"
import {
    ProfilePublicCv,
} from "@/components/features/profile/PublicProfile/ProfilePublicCv"

/**
 * Route `/[locale]/profile/[username]/cv` — the public, read-only "CV" tab of a
 * user's profile (the ONE résumé they flagged public, embedded as a PDF). The
 * shared shell (hero, tabs bar, loading/not-found/locked handling) lives in the
 * parent `layout.tsx`; this page only renders the tab's own panel. The owner's
 * private CV editor stays on the separate always-own `/profile/cv` route.
 */
const Page = () => {
    return (
        <div
            id="profile-panel-cv"
            role="tabpanel"
            aria-labelledby="cv"
            className="flex flex-col gap-6"
        >
            <ProfilePublicCv />
        </div>
    )
}

export default Page
