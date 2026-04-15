"use client"
import { Switch, cn } from "@heroui/react"
import { MoonIcon, SunIcon } from "@phosphor-icons/react"
import { useTheme } from "next-themes"
import React from "react"

/**
 * DarkLightModeSwitch is a toggle component to switch between dark and light mode.
 */
export const DarkLightModeSwitch = () => {
    const { theme, setTheme } = useTheme()
    const isDarkMode = theme === "dark"
    return (
        <Switch
            isSelected={isDarkMode}
            onChange={(value) => setTheme(value ? "dark" : "light")}
        >
            {({ isSelected }) => (
                <Switch.Control className="h-[32px] w-[52px]">
                    <Switch.Thumb className={cn(
                        "size-[28px] min-w-[28px] rounded-full flex items-center justify-center", 
                        isSelected ? "ms-[22px]" : "")
                    }>
                        {isSelected ? <MoonIcon className="size-5" /> : <SunIcon className="size-5" />}
                    </Switch.Thumb>
                </Switch.Control>
            )}
        </Switch>
    )
}
