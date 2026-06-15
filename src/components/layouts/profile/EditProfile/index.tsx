"use client"

import { Camera as CameraIcon } from "@gravity-ui/icons"
import React, {
    useCallback,
} from "react"
import {
    Breadcrumbs,
    Button,
    Input,
    Label,
    Spinner,
    TextField,
} from "@heroui/react"
import {
    useLocale,
    useTranslations,
} from "next-intl"
import {
    useRouter,
} from "next/navigation"
import {
    useAppSelector,
} from "@/redux"
import {
    useEditProfileForm,
} from "@/hooks"
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

/**
 * Edit-profile feature container.
 *
 * Owns only the page chrome (breadcrumb + header) and the field markup — the form
 * itself (values, avatar file, validation, submit) lives in the `useEditProfileForm`
 * react-hook-form hook (per the form pattern; no scattered local state). On save the
 * hook uploads a freshly picked avatar then persists the text fields + lock flag and
 * pushes the fresh user into redux. Mounted by `/profile/edit`.
 */
export const EditProfile = () => {
    const t = useTranslations()
    const router = useRouter()
    const locale = useLocale()
    const user = useAppSelector((state) => state.user.user)

    // the form (values + avatar file + submit) is owned by the RHF hook
    const {
        watch,
        setValue,
        onSubmit,
        formState: {
            isSubmitting,
        },
        fileInputRef,
        onPickAvatar,
        onAvatarChange,
        shownAvatar,
    } = useEditProfileForm()

    // controlled bindings read straight from the form state (no component useState)
    const displayName = watch("displayName")
    const bio = watch("bio")
    const profileLocked = watch("profileLocked")
    const openToWork = watch("openToWork")

    /** Navigate to the home page (breadcrumb root). */
    const onNavigateHome = useCallback(
        () => router.push(pathConfig().locale().build()),
        [
            router,
        ],
    )
    /** Navigate to the profile (breadcrumb parent + back target). */
    const onNavigateProfile = useCallback(
        () => router.push(pathConfig().locale(locale).profile().build()),
        [
            router,
            locale,
        ],
    )

    // signed-out guard
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
                    onChange={(event) => setValue("displayName", event.target.value)}
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
                    onChange={(event) => setValue("bio", event.target.value)}
                    className="w-full resize-none rounded-large bg-default/40 p-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-accent"
                />
                <span className="self-end text-xs text-muted">{`${bio.length}/${BIO_MAX}`}</span>
            </div>

            {/* privacy: lock profile (FB-style) */}
            <div className="flex items-start justify-between gap-3 rounded-large bg-default/40 p-3">
                <div className="flex flex-col gap-0">
                    <Label htmlFor="profile-locked">{t("profileEdit.lockProfile")}</Label>
                    <span className="text-xs text-muted">{t("profileEdit.lockProfileHint")}</span>
                </div>
                <input
                    id="profile-locked"
                    type="checkbox"
                    checked={profileLocked}
                    onChange={(event) => setValue("profileLocked", event.target.checked)}
                    className="mt-1 size-4 shrink-0"
                />
            </div>

            {/* hiring: open to work */}
            <div className="flex items-start justify-between gap-3 rounded-large bg-default/40 p-3">
                <div className="flex flex-col gap-0">
                    <Label htmlFor="profile-open-to-work">{t("profileEdit.openToWork")}</Label>
                    <span className="text-xs text-muted">{t("profileEdit.openToWorkHint")}</span>
                </div>
                <input
                    id="profile-open-to-work"
                    type="checkbox"
                    checked={openToWork}
                    onChange={(event) => setValue("openToWork", event.target.checked)}
                    className="mt-1 size-4 shrink-0"
                />
            </div>

            <Button
                variant="primary"
                fullWidth
                isDisabled={isSubmitting}
                isPending={isSubmitting}
                onPress={() => onSubmit()}
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
