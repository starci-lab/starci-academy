"use client"

import { Camera as CameraIcon } from "@gravity-ui/icons"
import React, {
    useCallback,
    useMemo,
    useRef,
    useState,
} from "react"
import {
    Breadcrumbs,
    Button,
    Input,
    Label,
    Spinner,
    TextField,
    cn,
} from "@heroui/react"
import {
    useLocale,
    useTranslations,
} from "next-intl"
import {
    useRouter,
} from "next/navigation"
import {
    useAppDispatch,
    useAppSelector,
} from "@/redux"
import {
    setUser,
} from "@/redux/slices"
import {
    useMutateUpdateProfileSwr,
    useMutateGenerateAvatarPresignUrlSwr,
    useMutateVerifyAvatarPresignUrlSwr,
} from "@/hooks"
import axios from "axios"
import type {
    UpdateProfileRequest,
} from "@/modules/api"
import {
    pathConfig,
} from "@/resources"
import {
    SubPageHeader,
    UserAvatar,
} from "@/components/reuseable"

/** Max length of the display name (mirrors the `display_name` column). */
const DISPLAY_NAME_MAX = 100
/** Max length of the bio (mirrors the `bio` column). */
const BIO_MAX = 280

/** Inline save status shown under the form. */
interface SaveStatus {
    /** Whether the save succeeded or failed. */
    kind: "success" | "error"
    /** Human-readable status text. */
    text: string
}

/**
 * Edit-profile feature container.
 *
 * Owns the page chrome (breadcrumb + header) and a small local form for the
 * three editable fields (avatar, display name, bio). On save it first uploads a
 * freshly picked avatar (multipart REST), then persists the text fields via the
 * `updateProfile` mutation, and pushes the returned fresh user into redux so the
 * header / navbar update instantly. Mounted by `/profile/edit`.
 */
export const EditProfile = () => {
    const t = useTranslations()
    const router = useRouter()
    const locale = useLocale()
    const dispatch = useAppDispatch()
    const user = useAppSelector((state) => state.user.user)

    const { trigger: triggerUpdate } = useMutateUpdateProfileSwr()
    // avatar upload is a presigned-URL flow: generate → PUT to MinIO → verify
    const { trigger: triggerGenerateAvatarPresign } = useMutateGenerateAvatarPresignUrlSwr()
    const { trigger: triggerVerifyAvatarPresign } = useMutateVerifyAvatarPresignUrlSwr()

    // hidden <input type=file>, opened by the avatar button
    const fileInputRef = useRef<HTMLInputElement>(null)
    // the freshly picked avatar file (null until the user chooses one)
    const [file, setFile] = useState<File | null>(null)
    // object-URL preview for the picked file (revoked-on-replace is cheap, skip it)
    const [preview, setPreview] = useState<string | null>(null)
    // controlled text fields, seeded from the redux user once on mount
    const [displayName, setDisplayName] = useState(user?.displayName ?? "")
    const [bio, setBio] = useState(user?.bio ?? "")
    // whole-flow in-flight flag (upload + mutate) + inline result
    const [submitting, setSubmitting] = useState(false)
    const [status, setStatus] = useState<SaveStatus | null>(null)

    /** Navigate to the home page (breadcrumb root). */
    const onNavigateHome = useCallback(
        () => router.push(pathConfig().locale().build()),
        [
            router,
        ],
    )
    /** Navigate to the profile hub (breadcrumb parent + back target). */
    const onNavigateProfile = useCallback(
        () => router.push(pathConfig().locale(locale).profile().build()),
        [
            router,
            locale,
        ],
    )

    /** Open the native file picker. */
    const onPickAvatar = useCallback(
        () => fileInputRef.current?.click(),
        [],
    )

    /** Capture the chosen file and build a local preview URL. */
    const onAvatarChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const next = event.target.files?.[0]
            // ignore an empty pick (user cancelled the dialog)
            if (!next) {
                return
            }
            setFile(next)
            setPreview(URL.createObjectURL(next))
            // clear any stale status from a previous attempt
            setStatus(null)
        },
        [],
    )

    // the face shown: local preview while a new file is staged, else the saved avatar
    const shownAvatar = useMemo(
        () => preview ?? user?.avatar ?? null,
        [
            preview,
            user?.avatar,
        ],
    )

    /** Upload the avatar (if any) then persist the text fields. */
    const onSave = useCallback(
        async () => {
            setSubmitting(true)
            setStatus(null)
            try {
                // 1) upload the new avatar first (presigned-URL flow) so the BE
                // already has the URL persisted before re-reading the user
                if (file) {
                    // 1a) mint a presigned PUT URL for the picked image's type
                    const presign = await triggerGenerateAvatarPresign({
                        request: {
                            contentType: file.type,
                        },
                    })
                    const presignData = presign?.data?.generateAvatarPresignUrl?.data
                    if (!presignData?.url) {
                        throw new Error(t("profileEdit.uploadFailed"))
                    }
                    // 1b) upload the bytes straight to MinIO (no API round-trip for
                    // the file); the Content-Type must match the presigned signature
                    await axios.put(presignData.url, file, {
                        headers: {
                            "Content-Type": file.type,
                        },
                    })
                    // 1c) confirm → BE validates the key owner + persists the avatar URL
                    const verify = await triggerVerifyAvatarPresign({
                        request: {
                            key: presignData.key,
                        },
                    })
                    if (!verify?.data?.verifyAvatarPresignUrl?.data?.uploaded) {
                        throw new Error(t("profileEdit.uploadFailed"))
                    }
                }

                // 2) persist the text fields; empty string clears the column (null)
                const request: UpdateProfileRequest = {
                    displayName: displayName.trim() ? displayName.trim() : null,
                    bio: bio.trim() ? bio.trim() : null,
                }
                const result = await triggerUpdate(request)
                const payload = result?.data?.updateProfile

                // 3) on success the resolver re-reads the user (incl. the new avatar) —
                // push it into redux so the header + navbar reflect changes instantly
                if (payload?.success && payload.data) {
                    dispatch(setUser(payload.data))
                    setFile(null)
                    setPreview(null)
                    setStatus({
                        kind: "success",
                        text: t("profileEdit.saved"),
                    })
                } else {
                    setStatus({
                        kind: "error",
                        text: payload?.message ?? t("profileEdit.error"),
                    })
                }
            } catch (error) {
                setStatus({
                    kind: "error",
                    text: (error as Error)?.message ?? t("profileEdit.error"),
                })
            } finally {
                setSubmitting(false)
            }
        },
        [
            file,
            displayName,
            bio,
            triggerGenerateAvatarPresign,
            triggerVerifyAvatarPresign,
            triggerUpdate,
            dispatch,
            t,
        ],
    )

    // signed-out guard mirrors the profile hub
    if (!user) {
        return (
            <div className="mx-auto flex max-w-3xl flex-col items-center gap-1.5 p-12 text-center">
                <div className="text-lg font-semibold text-foreground">{t("profile.signedOut.title")}</div>
                <div className="text-sm text-muted">{t("profile.signedOut.desc")}</div>
            </div>
        )
    }

    return (
        <div className="mx-auto flex max-w-3xl flex-col gap-6 p-6">
            <Breadcrumbs>
                <Breadcrumbs.Item onPress={onNavigateHome}>
                    {t("nav.home")}
                </Breadcrumbs.Item>
                <Breadcrumbs.Item onPress={onNavigateProfile}>
                    {t("nav.profile")}
                </Breadcrumbs.Item>
                <Breadcrumbs.Item>
                    <span>{t("profileEdit.title")}</span>
                </Breadcrumbs.Item>
            </Breadcrumbs>
            <SubPageHeader
                title={t("profileEdit.title")}
                description={t("profileEdit.subtitle")}
                onBack={onNavigateProfile}
            />

            {/* avatar picker — large face + change button */}
            <div className="flex items-center gap-3">
                <button
                    type="button"
                    onClick={onPickAvatar}
                    aria-label={t("profileEdit.changeAvatar")}
                    className="relative shrink-0 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                    <UserAvatar
                        username={user.displayName ?? user.username}
                        avatar={shownAvatar}
                        seed={user.email ?? user.username}
                        size="lg"
                        className="size-20 text-2xl"
                    />
                    <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity hover:opacity-100">
                        <CameraIcon className="size-6 text-white" />
                    </span>
                </button>
                <div className="flex flex-col gap-1.5">
                    <Button
                        variant="secondary"
                        size="sm"
                        onPress={onPickAvatar}
                    >
                        {t("profileEdit.changeAvatar")}
                    </Button>
                    <span className="text-xs text-muted">{t("profileEdit.avatarHint")}</span>
                </div>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/gif"
                    className="hidden"
                    onChange={onAvatarChange}
                />
            </div>

            {/* display name */}
            <TextField>
                <Label htmlFor="profile-display-name">{t("profileEdit.displayName")}</Label>
                <Input
                    id="profile-display-name"
                    placeholder={user.username}
                    maxLength={DISPLAY_NAME_MAX}
                    value={displayName}
                    onChange={(event) => setDisplayName(event.target.value)}
                />
            </TextField>

            {/* bio */}
            <div className="flex flex-col gap-1.5">
                <Label htmlFor="profile-bio">{t("profileEdit.bio")}</Label>
                <textarea
                    id="profile-bio"
                    rows={3}
                    placeholder={t("profileEdit.bioPlaceholder")}
                    maxLength={BIO_MAX}
                    value={bio}
                    onChange={(event) => setBio(event.target.value)}
                    className="w-full resize-none rounded-large bg-default/40 p-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-accent"
                />
                <span className="self-end text-xs text-muted">{`${bio.length}/${BIO_MAX}`}</span>
            </div>

            {status ? (
                <div
                    className={cn(
                        "text-sm",
                        status.kind === "success" ? "text-accent" : "text-danger",
                    )}
                >
                    {status.text}
                </div>
            ) : null}

            <Button
                variant="primary"
                fullWidth
                isDisabled={submitting}
                isPending={submitting}
                onPress={onSave}
            >
                {({ isPending }) => (
                    <>
                        {isPending ? (
                            <Spinner
                                color="current"
                                size="sm"
                            />
                        ) : null}
                        {t("profileEdit.save")}
                    </>
                )}
            </Button>
        </div>
    )
}
