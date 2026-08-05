import React, { useCallback } from "react"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useLinkGithubOverlayState } from "@/hooks/zustand/overlay/hooks"
import { githubRedirect } from "@/modules/api/redirect/github"
import { _LinkGithubModal } from "./component"

/**
 * GitHub-linking prompt — the CONNECTED half: reads the overlay open-state
 * (`useLinkGithubOverlayState`), resolves i18n, and builds the OAuth redirect
 * URL, handing everything to the presentational {@link _LinkGithubModal}.
 * Mounted prop-less by `ModalContainer`. See `tiers/split.md`.
 */
export const LinkGithubModal = () => {
    const { isOpen, setOpen } = useLinkGithubOverlayState()
    const t = useTranslations()
    const router = useRouter()

    /** Builds the GitHub OAuth redirect URL (current page as the return target) and navigates. */
    const onLinkPress = useCallback(
        () => {
            const url = githubRedirect.redirect
            url.searchParams.set("redirectUri", window.location.href)
            router.push(url.toString())
        },
        [router],
    )

    return (
        <_LinkGithubModal
            isOpen={isOpen}
            onOpenChange={setOpen}
            onLinkPress={onLinkPress}
            labels={{
                title: t("linkGithub.title"),
                description: t("linkGithub.description"),
                button: t("linkGithub.button"),
            }}
        />
    )
}