import React from "react"
import { Switch as HeroSwitch } from "@heroui/react"
import { MoonIcon, SunIcon } from "@phosphor-icons/react"
import { Box } from "@/components/frames/Box"

/** Props for {@link NavbarThemeSwitch}. */
export interface NavbarThemeSwitchProps {
    isDarkMode: boolean
    onThemeToggle: (isDark: boolean) => void
}

/**
 * Dark/light toggle — raw HeroUI `Switch` (see file header: `ChoiceSwitch` has no
 * icon-in-thumb slot). Shared verbatim by the desktop row and the mobile drawer row.
 */
export const NavbarThemeSwitch = ({ isDarkMode, onThemeToggle }: NavbarThemeSwitchProps) => (
    <Box
        as="span"
        identity={{ tier: "block", component: "NavbarThemeSwitch" }}
        principle="icon-text"
        explain="Theme thumb glyph rides inside the switch — not name-handle, because this is not a person identity pair; not label-field, because neither side is a form label."
    >
        <HeroSwitch
            isSelected={isDarkMode}
            onChange={onThemeToggle}
            aria-label="Toggle dark mode"
        >
            {({ isSelected }) => (
                <HeroSwitch.Content>
                    <HeroSwitch.Control>
                        <HeroSwitch.Thumb>
                            <HeroSwitch.Icon>
                                {isSelected ? <MoonIcon className="size-5 text-inherit" /> : <SunIcon className="size-5 text-inherit" />}
                            </HeroSwitch.Icon>
                        </HeroSwitch.Thumb>
                    </HeroSwitch.Control>
                </HeroSwitch.Content>
            )}
        </HeroSwitch>
    </Box>
)
