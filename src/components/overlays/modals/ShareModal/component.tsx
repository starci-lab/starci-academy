import React from "react"
import type { ComponentType, SVGProps } from "react"
import { SiFacebook as FacebookLogoIcon, SiTelegram as TelegramLogoIcon, SiX as TwitterLogoIcon } from "@icons-pack/react-simple-icons"
import { FaLinkedin as LinkedinLogoIcon } from "react-icons/fa6"
import { ModalShell } from "@/components/composites/layout/ModalShell"
import { QRCode } from "@/components/atoms/media/QRCode"
import { SnippetIcon } from "@/components/atoms/display/SnippetIcon"
import { Typography } from "@/components/atoms/text/Typography"
import { StackH, StackV } from "@/components/frames/Stack"
import { Cluster } from "@/components/frames/Cluster"
import { Box } from "@/components/frames/Box"

/**
 * `_ShareModal` — the presentational half of `ShareModal`: a QR code + copyable
 * link + a fixed row of social share buttons, inside `ModalShell`. Composes
 * `ModalShell` + `QRCode` + `SnippetIcon` + `Cluster`; owns its own fixed
 * platform table (`SHARE_PLATFORMS`, §14d.1 — a caller states IT WANTS a share
 * surface, never which platforms to list).
 *
 * Presentational: `shareUrl`/`shareTitle` are already resolved by the connected
 * `ShareModal` (`./index.tsx`); `isEmpty` mirrors the original's "nothing to
 * share yet" silence — no content loaded means the body renders nothing, same
 * as before, rather than inventing new empty-state copy that never shipped.
 *
 * No atom/composite exists for an icon-only EXTERNAL link trigger (an `<a>`
 * with `href`/`target`/`rel`, as opposed to `Button`'s `onPress`-only
 * contract) — the social row below keeps a minimal raw `<a>` per platform;
 * see the file's `missingVocabulary` note in the conversion report.
 */

/** All display text, already localized by the connected `ShareModal`; a story passes i18n keys. */
export interface ShareModalLabels {
    /** Modal title (`t("content.share")`). */
    share: string
    /** Caption under the QR code (`t("content.scanQr")`). */
    scanQr: string
}

/** Props for {@link _ShareModal} — presentational; all data resolved, no fetch/store/i18n. */
export interface ShareModalProps {
    /** Whether the modal is currently open. */
    isOpen: boolean
    /** Open-state change handler. */
    onOpenChange: (open: boolean) => void
    /** The public URL being shared. Empty string when nothing is loaded yet. */
    shareUrl: string
    /** The shared content's title, interpolated into a couple of the platform share links. */
    shareTitle: string
    /** `true` → nothing to share yet (`!shareUrl`); the body renders nothing, matching the original. */
    isEmpty: boolean
    labels: ShareModalLabels
}

/** One row of the fixed {@link SHARE_PLATFORMS} table. */
interface SharePlatform {
    /** Stable row key. */
    key: string
    /** Proper noun — not translated. Doubles as the link's accessible name. */
    label: string
    /** Brand glyph, rendered at a fixed size + the brand's own colour. */
    icon: ComponentType<SVGProps<SVGSVGElement>>
    /** Brand colour class — fixed per platform, not a house token (brand marks keep their own colour). */
    colorClass: string
    /** Builds the platform's share-intent URL from the resolved `shareUrl`/`shareTitle`. */
    buildHref: (shareUrl: string, shareTitle: string) => string
}

/**
 * Fixed local vocabulary (§14d.1): which platforms this modal offers, and how
 * each one's share-intent URL is built. Not caller data — a caller only opens
 * the share overlay, it never picks which platforms show up.
 */
const SHARE_PLATFORMS: ReadonlyArray<SharePlatform> = [
    {
        key: "facebook",
        label: "Facebook",
        icon: FacebookLogoIcon,
        colorClass: "text-[#1877F2]",
        buildHref: (shareUrl) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    },
    {
        key: "twitter",
        label: "Twitter",
        icon: TwitterLogoIcon,
        colorClass: "text-[#1DA1F2]",
        buildHref: (shareUrl, shareTitle) => `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`,
    },
    {
        key: "telegram",
        label: "Telegram",
        icon: TelegramLogoIcon,
        colorClass: "text-[#0088cc]",
        buildHref: (shareUrl, shareTitle) => `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`,
    },
    {
        key: "linkedin",
        label: "LinkedIn",
        icon: LinkedinLogoIcon,
        colorClass: "text-[#0A66C2]",
        buildHref: (shareUrl) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    },
]

/**
 * Renders the share surface inside the shared modal scaffold. See the file
 * header for the full contract.
 *
 * @param props - {@link ShareModalProps}
 */
export const _ShareModal = ({
    isOpen,
    onOpenChange,
    shareUrl,
    shareTitle,
    isEmpty,
    labels,
}: ShareModalProps) => {
    const shareBody = [
        () => (
            <StackV
                gap={3}
                principle="sibling-stack"
                explain="Same-kind peer stack — not group-boundary, because these items are repeating siblings rather than section groups."
                align="center"
                items={[
                    () => (
                        <Box
                            className="rounded-xl border-default p-2"
                            principle="card-padding"
                            explain="QR mount inset — not cell-pad, because this frames a media tile rather than a dense list cell."
                        >
                            <QRCode size={160} data={shareUrl} />
                        </Box>
                    ),
                    () => <Typography size="xs" color="muted" text={labels.scanQr} />,
                ]}
            />
        ),
        () => (
            <StackH
                gap={2}
                principle="icon-text"
                explain="Icon beside its label — not name-handle, because this pairs a glyph with text rather than a name/handle identity."
                align="center"
                justify="center"
                items={[
                    () => <Typography size="sm" color="muted" text={shareUrl} />,
                    () => <SnippetIcon copyString={shareUrl} />,
                ]}
            />
        ),
        () => (
            <Cluster
                gap={3}
                principle="chip-row"
                explain="Lets chips share one wrapping row so related tags stay together without stacking as a column."
                justify="center"
                items={SHARE_PLATFORMS.map((platform) => () => (
                    <a
                        href={platform.buildHref(shareUrl, shareTitle)}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={platform.label}
                        className="inline-flex focus-visible:ring-2 ring-accent rounded-full"
                    >
                        <platform.icon className={`size-6 ${platform.colorClass}`} />
                    </a>
                ))}
            />
        ),
    ]

    return (
        <ModalShell
            identity={{ tier: "overlay", component: "ShareModal" }}
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            title={labels.share}
            size="md"
            // Matches the original's silence when nothing is loaded yet — no
            // empty-state copy ever shipped for this edge case, so none is
            // invented here (file header).
            body={isEmpty ? undefined : () => <StackV gap={6} principle="block-boundary" explain="Block-to-block spacing — not group-boundary, because this separates major blocks rather than nested section groups." align="center" items={shareBody} />}
        />
    )
}
