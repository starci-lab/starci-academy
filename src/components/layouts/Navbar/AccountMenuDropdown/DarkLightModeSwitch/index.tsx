"use client"
import { MoonIcon, SunIcon } from "@phosphor-icons/react"
import { Switch } from "@heroui/react"
import { useTheme } from "next-themes"
import React from "react"
import { Box } from "@/components/frames/Box"

/**
 * Props for {@link DarkLightModeSwitch}.
 */
export type DarkLightModeSwitchProps = Record<string, never>
/**
 * DarkLightModeSwitch — round HeroUI toggle for dark/light mode, with a sun/moon
 * icon riding inside the thumb. Uses the native Switch sizing (no custom pixel
 * dimensions) so the track + thumb stay perfectly round.
 * @param props - optional root class name (placement only)
 */
export const DarkLightModeSwitch = () => {
    const { theme, setTheme } = useTheme()
    const isDarkMode = theme === "dark"
    return (
        <Box
            as="span"
            identity={{ tier: "layout", component: "DarkLightModeSwitch" }}
            principle="icon-text"
            explain="Theme thumb glyph rides inside the switch — not name-handle, because this is not a person identity pair; not label-field, because neither side is a form label."
        >
            <Switch
                isSelected={isDarkMode}
                onChange={(value) => setTheme(value ? "dark" : "light")}
                aria-label="Toggle dark mode"
            >
                {({ isSelected }) => (
                    <Switch.Content>
                        <Switch.Control>
                            <Switch.Thumb>
                                <Switch.Icon>
                                    {isSelected ? (
                                        <MoonIcon className="size-5 text-inherit" />
                                    ) : (
                                        <SunIcon className="size-5 text-inherit" />
                                    )}
                                </Switch.Icon>
                            </Switch.Thumb>
                        </Switch.Control>
                    </Switch.Content>
                )}
            </Switch>
        </Box>
    )
}
