import { StarCiSwitch } from "@/components/atomic"
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
        <StarCiSwitch
            isSelected={isDarkMode}
            onValueChange={(isSelected) => setTheme(isSelected ? "dark" : "light")}
            size="lg"
            color="primary"
            thumbIcon={isDarkMode ? <MoonIcon weight="fill" className="size-5" /> : <SunIcon weight="fill" className="size-5" />}
            classNames={{
                wrapper: "group-data-[selected=true]:bg-primary-500",
            }}
        />
    )
}
