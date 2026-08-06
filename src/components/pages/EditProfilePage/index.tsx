"use client"

import React from "react"
import {
    Button,
    Checkbox,
    Input,
    Label,
    Spinner,
    TextArea,
    TextField,
    Typography,
} from "@heroui/react"
import {
    useTranslations,
} from "next-intl"
import {
    SettingsBreadcrumb,
} from "@/components/blocks/settings/SettingsBreadcrumb"
import {
    AvatarUploadModal,
} from "./AvatarUploadModal"
import { useAppSelector } from "@/redux/hooks"
import { useAvatarUploadOverlayState } from "@/hooks/zustand/overlay/hooks"
import { useEditProfileForm } from "@/hooks/rhf/useEditProfileForm"
import { AvatarUploadButton } from "@/components/blocks/identity/AvatarUploadButton"
import { PageHeader } from "@/components/blocks/layout/PageHeader"
import { TabsCard } from "@/components/blocks/navigation/TabsCard"
import { StackH, StackV } from "@/components/frames/Stack"
import { WorkMode } from "@/modules/types/enums/work-mode"

/** Max length of the display name (mirrors the `display_name` column). */
const DISPLAY_NAME_MAX = 100
/** Max length of the bio (mirrors the `bio` column). */
const BIO_MAX = 280
/** Max length of the role title (mirrors the `role_title` column). */
const ROLE_TITLE_MAX = 80
/** Max length of the location (mirrors the `location` column). */
const LOCATION_MAX = 100
/** Max length of a URL field (mirrors the `linkedin_url` / `website_url` columns). */
const URL_MAX = 255
/** Sentinel key for the "no preference" work-mode option (maps to the empty form value). */
const WORK_MODE_NONE = "none"
/** Work-mode options + their i18n label keys (under `publicProfile.workMode`). */
const WORK_MODE_OPTIONS = [
    { value: WorkMode.Remote, labelKey: "publicProfile.workMode.remote" },
    { value: WorkMode.Hybrid, labelKey: "publicProfile.workMode.hybrid" },
    { value: WorkMode.Onsite, labelKey: "publicProfile.workMode.onsite" },
] as const

/**
 * Edit-profile feature container.
 *
 * Owns only the page chrome (breadcrumb + header) and the field markup — the form
 * itself (values, avatar file, validation, submit) lives in the `useEditProfileForm`
 * react-hook-form hook (per the form pattern; no scattered local state). On save the
 * hook uploads a freshly picked avatar then persists the text fields and pushes the
 * fresh user into redux. Mounted by `/profile/edit`. Profile-visibility controls
 * (lock + per-section) live on the dedicated Privacy settings page, not here.
 */
export const EditProfilePage = () => {
    const t = useTranslations()
    const user = useAppSelector((state) => state.user.user)

    // the form (values + avatar file + submit) is owned by the RHF hook
    const {
        watch,
        setValue,
        onSubmit,
        formState: {
            isSubmitting,
            isValid,
            errors,
        },
        onAvatarFile,
        shownAvatar,
    } = useEditProfileForm()
    // avatar-upload modal (dropzone) open-state — shared zustand overlay
    const { open: openAvatarUpload } = useAvatarUploadOverlayState()

    // controlled bindings read straight from the form state (no component useState)
    const displayName = watch("displayName")
    const bio = watch("bio")
    const openToWork = watch("openToWork")
    const roleTitle = watch("roleTitle")
    const location = watch("location")
    const workMode = watch("workMode")
    const linkedinUrl = watch("linkedinUrl")
    const websiteUrl = watch("websiteUrl")

    // signed-out guard
    if (!user) {
        return (
            <div className="py-12">
                <StackV gap={3} principle="sibling-stack" align="center" items={[
                    () => (
                        <Typography type="h5" weight="semibold" align="center">
                            {t("profile.signedOut.title")}
                        </Typography>
                    ),
                    () => (
                        <Typography type="body-sm" color="muted" align="center">
                            {t("profile.signedOut.desc")}
                        </Typography>
                    ),
                ]} />
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-10">
            <PageHeader
                breadcrumb={<SettingsBreadcrumb current={t("profileEdit.title")} />}
                title={t("profileEdit.title")}
                description={t("profileEdit.subtitle")}
            />
            <StackV gap={6} principle="block-boundary" items={[
                () => (
                    <StackH gap={4} principle="identity" items={[
                        () => (
                            <AvatarUploadButton
                                avatar={shownAvatar}
                                displayName={user.displayName ?? user.username}
                                seed={user.email ?? user.username}
                                label={t("profileEdit.changeAvatar")}
                                onPress={openAvatarUpload}
                            />
                        ),
                        () => (
                            <StackV gap={3} principle="sibling-stack" items={[
                                () => (
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        onPress={openAvatarUpload}
                                    >
                                        {t("profileEdit.changeAvatar")}
                                    </Button>
                                ),
                                () => (
                                    <Typography type="body-xs" color="muted">
                                        {t("profileEdit.avatarHint")}
                                    </Typography>
                                ),
                            ]} />
                        ),
                    ]} />
                ),
                () => <AvatarUploadModal onFile={onAvatarFile} />,
                () => (
                    <TextField variant="secondary">
                        <Label htmlFor="profile-display-name">{t("profileEdit.displayName")}</Label>
                        <Input
                            id="profile-display-name"
                            placeholder={user.username}
                            maxLength={DISPLAY_NAME_MAX}
                            value={displayName}
                            onChange={(event) => setValue("displayName", event.target.value)}
                        />
                    </TextField>
                ),
                () => (
                    <TextField variant="secondary">
                        <Label htmlFor="profile-bio">{t("profileEdit.bio")}</Label>
                        <TextArea
                            id="profile-bio"
                            rows={3}
                            placeholder={t("profileEdit.bioPlaceholder")}
                            maxLength={BIO_MAX}
                            value={bio}
                            onChange={(event) => setValue("bio", event.target.value)}
                            className="resize-none"
                        />
                        <Typography slot="description" type="body-xs" color="muted" className="self-end">
                            {`${bio.length}/${BIO_MAX}`}
                        </Typography>
                    </TextField>
                ),
                () => (
                    <TextField variant="secondary">
                        <Label htmlFor="profile-role-title">{t("profileEdit.roleTitle")}</Label>
                        <Input
                            id="profile-role-title"
                            placeholder={t("profileEdit.roleTitlePlaceholder")}
                            maxLength={ROLE_TITLE_MAX}
                            value={roleTitle}
                            onChange={(event) => setValue("roleTitle", event.target.value)}
                        />
                    </TextField>
                ),
                () => (
                    <TextField variant="secondary">
                        <Label htmlFor="profile-location">{t("profileEdit.location")}</Label>
                        <Input
                            id="profile-location"
                            placeholder={t("profileEdit.locationPlaceholder")}
                            maxLength={LOCATION_MAX}
                            value={location}
                            onChange={(event) => setValue("location", event.target.value)}
                        />
                    </TextField>
                ),
                () => (
                    <StackV gap={4} principle="label-field" items={[
                        () => <Label htmlFor="profile-work-mode">{t("profileEdit.workMode")}</Label>,
                        () => (
                            <TabsCard
                                variant="primary"
                                leftTabs={{
                                    selectedKey: workMode === "" ? WORK_MODE_NONE : workMode,
                                    ariaLabel: t("profileEdit.workMode"),
                                    onSelectionChange: (key) => {
                                        const value = String(key)
                                        setValue("workMode", value === WORK_MODE_NONE ? "" : (value as WorkMode))
                                    },
                                    items: [
                                        { key: WORK_MODE_NONE, label: t("profileEdit.workModeNone") },
                                        ...WORK_MODE_OPTIONS.map((option) => ({
                                            key: option.value as string,
                                            label: t(option.labelKey),
                                        })),
                                    ],
                                }}
                            />
                        ),
                    ]} />
                ),
                () => (
                    <TextField variant="secondary">
                        <Label htmlFor="profile-linkedin">{t("profileEdit.linkedinUrl")}</Label>
                        <Input
                            id="profile-linkedin"
                            type="url"
                            inputMode="url"
                            placeholder={t("profileEdit.linkedinUrlPlaceholder")}
                            maxLength={URL_MAX}
                            value={linkedinUrl}
                            onChange={(event) => setValue("linkedinUrl", event.target.value)}
                        />
                        {errors.linkedinUrl ? (
                            <Typography slot="description" type="body-xs" className="text-danger-soft-foreground">
                                {t("profileEdit.invalidUrl")}
                            </Typography>
                        ) : null}
                    </TextField>
                ),
                () => (
                    <TextField variant="secondary">
                        <Label htmlFor="profile-website">{t("profileEdit.websiteUrl")}</Label>
                        <Input
                            id="profile-website"
                            type="url"
                            inputMode="url"
                            placeholder={t("profileEdit.websiteUrlPlaceholder")}
                            maxLength={URL_MAX}
                            value={websiteUrl}
                            onChange={(event) => setValue("websiteUrl", event.target.value)}
                        />
                        {errors.websiteUrl ? (
                            <Typography slot="description" type="body-xs" className="text-danger-soft-foreground">
                                {t("profileEdit.invalidUrl")}
                            </Typography>
                        ) : null}
                    </TextField>
                ),
                () => (
                    <StackH gap={4} principle="content-row" align="start" justify="between" items={[
                        () => (
                            <StackV gap={1} items={[
                                () => <Label htmlFor="profile-open-to-work">{t("profileEdit.openToWork")}</Label>,
                                () => (
                                    <Typography type="body-xs" color="muted">
                                        {t("profileEdit.openToWorkHint")}
                                    </Typography>
                                ),
                            ]} />
                        ),
                        () => (
                            <Checkbox
                                id="profile-open-to-work"
                                className="shrink-0"
                                isSelected={openToWork}
                                onChange={(selected) => setValue("openToWork", selected)}
                                aria-label={t("profileEdit.openToWork")}
                            >
                                <Checkbox.Content>
                                    <Checkbox.Control>
                                        <Checkbox.Indicator />
                                    </Checkbox.Control>
                                </Checkbox.Content>
                            </Checkbox>
                        ),
                    ]} />
                ),
                () => (
                    <Button
                        variant="primary"
                        size="lg"
                        className="h-12 self-end text-base"
                        isDisabled={isSubmitting || !isValid}
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
                ),
            ]} />
        </div>
    )
}
