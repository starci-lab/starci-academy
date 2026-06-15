"use client"

import { useCallback, useMemo, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useTranslations } from "next-intl"
import axios from "axios"
import { useAppDispatch, useAppSelector } from "@/redux"
import { setUser } from "@/redux/slices"
import {
    useMutateGenerateAvatarPresignUrlSwr,
    useMutateUpdateProfileSwr,
    useMutateVerifyAvatarPresignUrlSwr,
} from "@/hooks/swr"
import { runGraphQLWithToast } from "@/modules/toast"

/** Max length of the display name (mirrors the `display_name` column). */
const DISPLAY_NAME_MAX = 100
/** Max length of the bio (mirrors the `bio` column). */
const BIO_MAX = 280

/** Editable profile form values. */
export interface EditProfileFormValues {
    /** Display name (empty string = clear → falls back to username). */
    displayName: string
    /** Short bio / tagline (empty string = clear). */
    bio: string
    /** Lock profile (FB-style): when on, only the owner sees full content. */
    profileLocked: boolean
}

/**
 * react-hook-form for the edit-profile form. Seeds values from the redux user
 * (re-seeds via `values`), owns the picked-avatar file state, and on submit runs
 * the avatar presigned-upload flow (when a new file is chosen) then the
 * `updateProfile` mutation, pushing the fresh user into redux so the header /
 * navbar update instantly. Toasts the result via `runGraphQLWithToast`.
 *
 * @returns the RHF methods + `onSubmit` and the avatar helpers (`fileInputRef`,
 * `onPickAvatar`, `onAvatarChange`, `shownAvatar`).
 */
export const useEditProfileForm = () => {
    const t = useTranslations()
    const dispatch = useAppDispatch()
    const user = useAppSelector((state) => state.user.user)

    const updateProfileSwr = useMutateUpdateProfileSwr()
    // avatar upload is a presigned-URL flow: generate → PUT to MinIO → verify
    const generateAvatarPresignSwr = useMutateGenerateAvatarPresignUrlSwr()
    const verifyAvatarPresignSwr = useMutateVerifyAvatarPresignUrlSwr()

    // hidden <input type=file>, opened by the avatar button
    const fileInputRef = useRef<HTMLInputElement>(null)
    // the freshly picked avatar file (null until the user chooses one) + its preview
    const [file, setFile] = useState<File | null>(null)
    const [preview, setPreview] = useState<string | null>(null)

    const schema = useMemo(
        () => z.object({
            displayName: z.string().trim().max(DISPLAY_NAME_MAX),
            bio: z.string().trim().max(BIO_MAX),
            profileLocked: z.boolean(),
        }),
        [],
    )

    const form = useForm<EditProfileFormValues>({
        resolver: zodResolver(schema),
        // re-seed when the redux user changes (replaces formik enableReinitialize)
        values: {
            displayName: user?.displayName ?? "",
            bio: user?.bio ?? "",
            profileLocked: user?.profileLocked ?? false,
        },
    })

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
        },
        [],
    )

    // the face shown: local preview while a new file is staged, else the saved avatar
    const shownAvatar = preview ?? user?.avatar ?? null

    const onSubmit = form.handleSubmit(async (value) => {
        await runGraphQLWithToast(
            async () => {
                // 1) upload the new avatar first (presigned-URL flow) so the BE has
                // the URL persisted before re-reading the user
                if (file) {
                    // 1a) mint a presigned PUT URL for the picked image's type
                    const presign = await generateAvatarPresignSwr.trigger({
                        request: {
                            contentType: file.type,
                        },
                    })
                    const presignData = presign?.data?.generateAvatarPresignUrl?.data
                    if (!presignData?.url) {
                        throw new Error(t("profileEdit.uploadFailed"))
                    }
                    // 1b) upload the bytes straight to MinIO; Content-Type must match
                    await axios.put(presignData.url, file, {
                        headers: {
                            "Content-Type": file.type,
                        },
                    })
                    // 1c) confirm → BE validates the key owner + persists the avatar URL
                    const verify = await verifyAvatarPresignSwr.trigger({
                        request: {
                            key: presignData.key,
                        },
                    })
                    if (!verify?.data?.verifyAvatarPresignUrl?.data?.uploaded) {
                        throw new Error(t("profileEdit.uploadFailed"))
                    }
                }

                // 2) persist the text fields + lock flag; empty string clears the column
                const result = await updateProfileSwr.trigger({
                    displayName: value.displayName.trim() ? value.displayName.trim() : null,
                    bio: value.bio.trim() ? value.bio.trim() : null,
                    profileLocked: value.profileLocked,
                })
                const env = result?.data?.updateProfile
                if (!env) {
                    throw new Error(t("profileEdit.error"))
                }
                // 3) on success push the fresh user into redux so the header + navbar
                // reflect changes instantly, and clear the staged avatar
                if (env.success && env.data) {
                    dispatch(setUser(env.data))
                    setFile(null)
                    setPreview(null)
                }
                // returned envelope drives the success / error toast
                return env
            },
            {
                showErrorToast: true,
                showSuccessToast: true,
            },
        )
    })

    return {
        ...form,
        onSubmit,
        fileInputRef,
        onPickAvatar,
        onAvatarChange,
        shownAvatar,
    }
}
