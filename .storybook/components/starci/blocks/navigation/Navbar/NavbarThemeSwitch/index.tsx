import React from "react"
import { Switch as HeroSwitch } from "@heroui/react"
import { MoonIcon, SunIcon } from "@phosphor-icons/react"

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
)
