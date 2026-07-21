"use client"

import React, { useCallback, useEffect, useState } from "react"
import {
    Button,
    Label,
    Spinner,
    Switch,
    Typography,
} from "@heroui/react"
import {
    useTranslations,
} from "next-intl"
import {
    SettingsBreadcrumb,
} from "../Settings/SettingsBreadcrumb"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { setUser } from "@/redux/slices/user"
import { useMutateUpdateProfileSwr } from "@/hooks/swr/api/graphql/mutations/useMutateUpdateProfileSwr"
import { useGraphQLWithToast } from "@/modules/toast/hooks"
import { PageHeader } from "@/components/blocks/layout/PageHeader"
import type { SectionVisibility } from "@/modules/types/entities/user"

/**
 * The four gateable profile sections + their reused tab labels (Overview + CV are
 * never gated here). Each row toggles `sectionVisibility.<key>`; the label reuses
 * the existing `publicProfile.tabs.*` keys so it always matches the tab it hides.
 */
const SECTION_VISIBILITY_OPTIONS = [
    { key: "projects", labelKey: "publicProfile.tabs.projects", descKey: "profileEdit.sectionVisibilityDesc.projects" },
    { key: "challenges", labelKey: "publicProfile.tabs.challenges", descKey: "profileEdit.sectionVisibilityDesc.challenges" },
    { key: "skills", labelKey: "publicProfile.tabs.skills", descKey: "profileEdit.sectionVisibilityDesc.skills" },
    { key: "activity", labelKey: "publicProfile.tabs.activity", descKey: "profileEdit.sectionVisibilityDesc.activity" },
] as const

/** Seed the per-section visibility from the redux user (absent flags default to visible). */
const seedSectionVisibility = (
    visibility: SectionVisibility | undefined,
): SectionVisibility => ({
    projects: visibility?.projects ?? true,
    challenges: visibility?.challenges ?? true,
    skills: visibility?.skills ?? true,
    activity: visibility?.activity ?? true,
})

/**
 * Privacy settings feature container.
 *
 * The profile-VISIBILITY controls — "Khoá hồ sơ" (lock) + the per-section
 * "Hiển thị hồ sơ" group — moved out of the edit-profile form into their own
 * settings page. Owns a small local form state seeded from the redux user; on save
 * it persists ONLY `{ profileLocked, sectionVisibility }` via `updateProfile` and
 * pushes the fresh user into redux. Mounted by `/profile/settings/privacy`.
 */
export const ProfilePrivacySettings = () => {
    const t = useTranslations()
    const dispatch = useAppDispatch()
    const user = useAppSelector((state) => state.user.user)

    const runGraphQL = useGraphQLWithToast()
    const updateProfileSwr = useMutateUpdateProfileSwr()

    // small local form state (this page only touches two fields, no RHF needed)
    const [profileLocked, setProfileLocked] = useState<boolean>(user?.profileLocked ?? false)
    const [sectionVisibility, setSectionVisibility] = useState<SectionVisibility>(
        seedSectionVisibility(user?.sectionVisibility),
    )
    const [isSubmitting, setIsSubmitting] = useState(false)

    // re-seed when the redux user changes (mirrors RHF `values` reinit)
    useEffect(() => {
        if (!user) {
            return
        }
        setProfileLocked(user.profileLocked ?? false)
        setSectionVisibility(seedSectionVisibility(user.sectionVisibility))
    }, [user])

    /** Persist ONLY the visibility fields, then push the fresh user into redux. */
    const onSubmit = useCallback(async () => {
        setIsSubmitting(true)
        await runGraphQL(
            async () => {
                const result = await updateProfileSwr.trigger({
                    profileLocked,
                    sectionVisibility,
                })
                const env = result?.data?.updateProfile
                if (!env) {
                    throw new Error(t("profileEdit.error"))
                }
                if (env.success && env.data) {
                    dispatch(setUser(env.data))
                }
                return env
            },
            {
                showErrorToast: true,
                showSuccessToast: true,
            },
        )
        setIsSubmitting(false)
    }, [runGraphQL, updateProfileSwr, profileLocked, sectionVisibility, dispatch, t])

    // signed-out guard
    if (!user) {
        return (
            <div className="flex flex-col items-center gap-2 py-12">
                <Typography type="h5" weight="semibold" align="center">
                    {t("profile.signedOut.title")}
                </Typography>
                <Typography type="body-sm" color="muted" align="center">
                    {t("profile.signedOut.desc")}
                </Typography>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-10">
            <PageHeader
                breadcrumb={<SettingsBreadcrumb current={t("profileSettings.privacy.title")} />}
                title={t("profileSettings.privacy.title")}
                description={t("profileSettings.privacy.description")}
            />
            <div className="flex flex-col gap-6">

                {/* privacy: lock profile (FB-style) */}
                <div className="flex items-start justify-between gap-3 my-2">
                    <div className="flex flex-col gap-0">
                        <Label htmlFor="profile-locked">{t("profileEdit.lockProfile")}</Label>
                        <Typography type="body-xs" color="muted">
                            {t("profileEdit.lockProfileHint")}
                        </Typography>
                    </div>
                    <Switch
                        className="shrink-0"
                        isSelected={profileLocked}
                        onChange={(selected) => setProfileLocked(selected)}
                        aria-label={t("profileEdit.lockProfile")}
                    >
                        <Switch.Content>
                            <Switch.Control>
                                <Switch.Thumb />
                            </Switch.Control>
                        </Switch.Content>
                    </Switch>
                </div>

                {/* per-section visibility — one toggle row per gateable tab, mirroring
                    the lock row above. "Khoá hồ sơ" OVERRIDES this whole group (it
                    already hides everything from visitors), so when the lock is on the
                    group is greyed + disabled. Overview + CV are never listed here
                    (Overview always shows; CV keeps its own public gate). */}
                <div className="flex flex-col gap-6" aria-disabled={profileLocked}>
                    <div className="flex flex-col gap-0">
                        <Label htmlFor="profile-section-visibility">
                            {t("profileEdit.sectionVisibility")}
                        </Label>
                        <Typography type="body-xs" color="muted">
                            {profileLocked
                                ? t("profileEdit.sectionVisibilityLockedHint")
                                : t("profileEdit.sectionVisibilityHint")}
                        </Typography>
                    </div>
                    <div
                        id="profile-section-visibility"
                        className={`flex flex-col gap-3${profileLocked ? " pointer-events-none opacity-50" : ""}`}
                    >
                        {SECTION_VISIBILITY_OPTIONS.map((option) => (
                            <div
                                key={option.key}
                                className="flex items-start justify-between gap-3 my-2"
                            >
                                <div className="flex min-w-0 flex-col gap-0">
                                    <Label htmlFor={`profile-section-${option.key}`}>
                                        {t(option.labelKey)}
                                    </Label>
                                    <Typography type="body-xs" color="muted">
                                        {t(option.descKey)}
                                    </Typography>
                                </div>
                                <Switch
                                    className="shrink-0"
                                    isSelected={sectionVisibility[option.key]}
                                    isDisabled={profileLocked}
                                    onChange={(selected) => setSectionVisibility((prev) => ({
                                        ...prev,
                                        [option.key]: selected,
                                    }))}
                                    aria-label={t(option.labelKey)}
                                >
                                    <Switch.Content>
                                        <Switch.Control>
                                            <Switch.Thumb />
                                        </Switch.Control>
                                    </Switch.Content>
                                </Switch>
                            </div>
                        ))}
                    </div>
                </div>

                <Button
                    variant="primary"
                    size="lg"
                    className="h-12 self-end px-8 text-base"
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
        </div>
    )
}
