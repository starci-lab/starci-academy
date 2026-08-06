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
} from "@/components/blocks/settings/SettingsBreadcrumb"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { setUser } from "@/redux/slices/user"
import { useMutateUpdateProfileSwr } from "@/hooks/swr/api/graphql/mutations/useMutateUpdateProfileSwr"
import { useGraphQLWithToast } from "@/modules/toast/hooks"
import { PageHeader } from "@/components/blocks/layout/PageHeader"
import { StackH, StackV } from "@/components/frames/Stack"
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
 * The profile-VISIBILITY controls — "Lock profile" (lock) + the per-section
 * "Profile visibility" group — moved out of the edit-profile form into their own
 * settings page. Owns a small local form state seeded from the redux user; on save
 * it persists ONLY `{ profileLocked, sectionVisibility }` via `updateProfile` and
 * pushes the fresh user into redux. Mounted by `/profile/settings/privacy`.
 */
export const PrivacySettingsPage = () => {
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
            <div className="flex flex-col items-center py-12">
                <StackV
                    gap={3}
                    align="center"
                    principle="sibling-stack"
                    explain="Same-kind peer stack — not group-boundary, because these items are repeating siblings rather than section groups."
                    items={[
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
                    ]}
                />
            </div>
        )
    }

    const lockRow = () => (
        <div className="my-2">
            <StackH
                gap={4}
                align="start"
                justify="between"
                principle="content-row"
                explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
                items={[
                    () => (
                        <div className="flex flex-col gap-0">
                            <Label htmlFor="profile-locked">{t("profileEdit.lockProfile")}</Label>
                            <Typography type="body-xs" color="muted">
                                {t("profileEdit.lockProfileHint")}
                            </Typography>
                        </div>
                    ),
                    () => (
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
                    ),
                ]}
            />
        </div>
    )

    const sectionRows = SECTION_VISIBILITY_OPTIONS.map((option) => () => (
        <div key={option.key} className="my-2">
            <StackH
                gap={4}
                align="start"
                justify="between"
                principle="content-row"
                explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
                items={[
                    () => (
                        <div className="flex min-w-0 flex-col gap-0">
                            <Label htmlFor={`profile-section-${option.key}`}>
                                {t(option.labelKey)}
                            </Label>
                            <Typography type="body-xs" color="muted">
                                {t(option.descKey)}
                            </Typography>
                        </div>
                    ),
                    () => (
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
                    ),
                ]}
            />
        </div>
    ))

    const sectionGroupItems = [
        () => (
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
        ),
        () => (
            <div
                id="profile-section-visibility"
                className={profileLocked ? "pointer-events-none opacity-50" : undefined}
            >
                <StackV gap={4} items={sectionRows} />
            </div>
        ),
    ]

    const formItems = [
        lockRow,
        () => (
            <div aria-disabled={profileLocked}>
                <StackV gap={6} items={sectionGroupItems} />
            </div>
        ),
        () => (
            <Button
                variant="primary"
                size="lg"
                className="h-12 self-end text-base"
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
        ),
    ]

    return (
        <StackV gap={7} principle="layout-split"
            explain="Major layout split — not block-boundary, because this separates primary page regions rather than adjacent blocks."
            items={[
                () => (
                    <PageHeader
                        breadcrumb={<SettingsBreadcrumb current={t("profileSettings.privacy.title")} />}
                        title={t("profileSettings.privacy.title")}
                        description={t("profileSettings.privacy.description")}
                    />
                ),
                () => <StackV gap={6} items={formItems} />,
            ]} />
    )
}
