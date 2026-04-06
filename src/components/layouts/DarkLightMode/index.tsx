import { StarCiSwitch } from "@/components/atomic";
import { Moon, Sun } from "@phosphor-icons/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

/**
 * DarkLightModeSwitch is a toggle component to switch between dark and light mode.
 */
export const DarkLightModeSwitch = () => {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const isDarkMode = theme === "dark";

    return (
        <StarCiSwitch
            isSelected={isDarkMode}
            onValueChange={(isSelected) => setTheme(isSelected ? "dark" : "light")}
            size="lg"
            color="primary"
            startContent={<Moon weight="bold" className="size-4" />}
            endContent={<Sun weight="bold" className="size-4" />}
            classNames={{
                wrapper: "group-data-[selected=true]:bg-primary-500",
            }}
        />
    );
};
