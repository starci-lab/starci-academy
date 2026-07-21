"use client"

import React, {
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react"
import {
    Button,
    ColorArea,
    ColorPicker,
    ColorSlider,
    ColorSwatch,
    ColorSwatchPicker,
    Label,
    cn,
    parseColor,
} from "@heroui/react"
import type {
    Color,
} from "@heroui/react"
import {
    useTranslations,
} from "next-intl"
import {
    PageHeader,
} from "@/components/blocks/layout/PageHeader"
import {
    LabeledCard,
} from "@/components/blocks/cards/LabeledCard"
import {
    SettingsBreadcrumb,
} from "../Settings/SettingsBreadcrumb"
import {
    useAppDispatch,
    useAppSelector,
} from "@/redux/hooks"
import {
    setUser,
} from "@/redux/slices/user"
import {
    useMutateUpdateProfileSwr,
} from "@/hooks/swr/api/graphql/mutations/useMutateUpdateProfileSwr"
import {
    BackgroundEffect,
} from "@/modules/types/enums/background-effect"
import {
    AmbientBackground,
} from "@/components/blocks/layout/AmbientBackground"

/** Fallback accent (matches the default brand `--accent` token) when the user has never set one. */
const DEFAULT_ACCENT_HEX = "#e84393"

/** 10 named preset accents (hex, curated to stay legible with the default white `--accent-foreground`). */
const ACCENT_PRESETS: ReadonlyArray<{ hex: string, labelKey: string }> = [
    { hex: "#e84393", labelKey: "pink" },
    { hex: "#7c5cfc", labelKey: "purple" },
    { hex: "#2f86eb", labelKey: "blue" },
    { hex: "#16b5c4", labelKey: "teal" },
    { hex: "#25b56a", labelKey: "emerald" },
    { hex: "#84cc16", labelKey: "lime" },
    { hex: "#f39c12", labelKey: "amber" },
    { hex: "#e74c3c", labelKey: "red" },
    { hex: "#d946ef", labelKey: "fuchsia" },
    { hex: "#64748b", labelKey: "slate" },
]

/** The 10 selectable ambient background effects (including "off"). */
const EFFECT_OPTIONS: ReadonlyArray<BackgroundEffect> = [
    BackgroundEffect.None,
    BackgroundEffect.Ember,
    BackgroundEffect.Wave,
    BackgroundEffect.Snow,
    BackgroundEffect.Rain,
    BackgroundEffect.Bubbles,
    BackgroundEffect.Fireflies,
    BackgroundEffect.Stars,
    BackgroundEffect.Aurora,
    BackgroundEffect.Circuit,
]

/** How long to wait after the last color change before persisting (avoids spamming the mutation while dragging). */
const ACCENT_PERSIST_DEBOUNCE_MS = 500

/**
 * Settings → "Giao diện": pick an accent color (10 presets or a free-form
 * `ColorPicker`) and an ambient background effect (10 options, tinted by the
 * chosen accent) — independent of light/dark mode, which stays on the navbar
 * toggle. Both persist to `UserEntity` via `updateProfile` (server is the
 * source of truth; `useAccentOverride` / `useBackgroundEffect` mirror them
 * app-wide + into localStorage for the no-flash fast path).
 */
export const Appearance = () => {
    const t = useTranslations()
    const dispatch = useAppDispatch()
    const user = useAppSelector((state) => state.user.user)
    const updateProfileSwr = useMutateUpdateProfileSwr()

    const [color, setColor] = useState<Color>(
        () => parseColor(user?.accentColor ?? DEFAULT_ACCENT_HEX),
    )
    const persistTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

    // instant preview while dragging — independent of the debounced persistence below
    useEffect(() => {
        document.documentElement.style.setProperty("--accent", color.toString("hex"))
    }, [
        color,
    ])

    const persistAccent = useCallback((hex: string | null) => {
        if (persistTimeoutRef.current) {
            clearTimeout(persistTimeoutRef.current)
        }
        persistTimeoutRef.current = setTimeout(() => {
            void updateProfileSwr.trigger({ accentColor: hex }).then((result) => {
                const updated = result?.data?.updateProfile?.data
                if (updated) {
                    dispatch(setUser(updated))
                }
            })
        }, ACCENT_PERSIST_DEBOUNCE_MS)
    }, [
        updateProfileSwr,
        dispatch,
    ])

    const onColorChange = useCallback((next: Color) => {
        setColor(next)
        persistAccent(next.toString("hex"))
    }, [
        persistAccent,
    ])

    const onResetAccent = useCallback(() => {
        setColor(parseColor(DEFAULT_ACCENT_HEX))
        document.documentElement.style.removeProperty("--accent")
        document.documentElement.style.removeProperty("--accent-foreground")
        persistAccent(null)
    }, [
        persistAccent,
    ])

    const effect = user?.backgroundEffect ?? BackgroundEffect.None

    const onSelectEffect = useCallback((next: BackgroundEffect) => {
        if (!user || next === effect) {
            return
        }
        // optimistic — the real confirmation comes back from the mutation below
        dispatch(setUser({ ...user, backgroundEffect: next }))
        void updateProfileSwr.trigger({ backgroundEffect: next }).then((result) => {
            const updated = result?.data?.updateProfile?.data
            if (updated) {
                dispatch(setUser(updated))
            }
        })
    }, [
        user,
        effect,
        dispatch,
        updateProfileSwr,
    ])

    return (
        <div className="flex flex-col gap-10">
            <PageHeader
                breadcrumb={<SettingsBreadcrumb current={t("appearance.title")} />}
                title={t("appearance.title")}
                description={t("appearance.description")}
            />
            <div className="flex flex-col gap-6">
                <LabeledCard label={t("appearance.accentLabel")}>
                    <div className="flex flex-col gap-3">
                        <ColorSwatchPicker value={color} onChange={onColorChange} size="lg">
                            {ACCENT_PRESETS.map((preset) => (
                                <ColorSwatchPicker.Item key={preset.hex} color={preset.hex}>
                                    <ColorSwatchPicker.Swatch />
                                    <ColorSwatchPicker.Indicator />
                                </ColorSwatchPicker.Item>
                            ))}
                        </ColorSwatchPicker>
                        <div className="flex flex-wrap items-center gap-3">
                            <ColorPicker value={color} onChange={onColorChange}>
                                <ColorPicker.Trigger>
                                    <ColorSwatch size="lg" />
                                    <Label>{t("appearance.customColor")}</Label>
                                </ColorPicker.Trigger>
                                <ColorPicker.Popover className="gap-2">
                                    <ColorArea
                                        aria-label={t("appearance.customColor")}
                                        className="max-w-full"
                                        colorSpace="hsb"
                                        xChannel="saturation"
                                        yChannel="brightness"
                                    >
                                        <ColorArea.Thumb />
                                    </ColorArea>
                                    <ColorSlider channel="hue" className="gap-1 px-1" colorSpace="hsb">
                                        <ColorSlider.Track>
                                            <ColorSlider.Thumb />
                                        </ColorSlider.Track>
                                    </ColorSlider>
                                </ColorPicker.Popover>
                            </ColorPicker>
                            <Button variant="tertiary" size="sm" onPress={onResetAccent}>
                                {t("appearance.resetAccent")}
                            </Button>
                        </div>
                    </div>
                </LabeledCard>

                <LabeledCard label={t("appearance.effectLabel")}>
                    <div className="grid grid-cols-2 gap-3 @app-sm:grid-cols-3 @app-md:grid-cols-5">
                        {EFFECT_OPTIONS.map((option) => (
                            <button
                                key={option}
                                type="button"
                                onClick={() => onSelectEffect(option)}
                                className={cn(
                                    "relative flex h-24 flex-col justify-end overflow-hidden rounded-2xl border p-2 text-left transition-colors",
                                    effect === option
                                        ? "border-accent ring-2 ring-accent"
                                        : "border-default hover:bg-default",
                                )}
                            >
                                <AmbientBackground effect={option} className="absolute inset-0 -z-0" />
                                <span className="relative z-10 text-xs font-medium text-foreground">
                                    {t(`appearance.effects.${option}`)}
                                </span>
                            </button>
                        ))}
                    </div>
                </LabeledCard>
            </div>
        </div>
    )
}
