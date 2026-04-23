import { Link, cn } from "@heroui/react"
import { PaintBrushIcon, TranslateIcon } from "@phosphor-icons/react"
import { useTranslations } from "next-intl"
import router from "next/router"
import { DarkLightModeSwitch } from "../AccountMenuDropdown/DarkLightMode"

export interface mobileNavbarProps {
  navItems: any[];
  isMenuOpen: boolean;
  setIsMenuOpen: (value: boolean) => void;
  locale: string;
}

export const MobileNavbar = ({
    navItems,
    isMenuOpen,
    setIsMenuOpen,
    locale
}: mobileNavbarProps) => {
    const t = useTranslations()
    return (
        <nav
            className="backdrop-blur-xl bg-background/80 flex flex-col h-[calc(100vh-64px)] pb-10"
            aria-label={t("nav.mobileMenu")}
        >
            <div className="flex flex-col gap-2 mt-4 flex-grow">
                {navItems.map((item, index) => (
                    <div key={`${item.path}-${index}`} className="w-full">
                        <Link
                            className={cn(
                                "w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300",
                                item.isActive
                                    ? "bg-primary/10 text-primary shadow-sm"
                                    : "hover:bg-default-100",
                            )}
                            onPress={() => {
                                router.push(item.path)
                                setIsMenuOpen(false)
                            }}
                        >
                            <item.icon
                                weight={item.isActive ? "fill" : "regular"}
                                className="size-6"
                            />
                            <span className="font-bold tracking-tight">{item.label}</span>
                        </Link>
                    </div>
                ))}
            </div>

            <div className="mt-auto flex flex-col gap-5 pt-6 border-t ">
                <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-default-100 flex items-center justify-center">
                            <PaintBrushIcon className="size-5" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-bold">{t("nav.appearance")}</span>
                            <span className="text-[10px] text-foreground-400 uppercase tracking-widest font-medium">
                System theme
                            </span>
                        </div>
                    </div>
                    <DarkLightModeSwitch />
                </div>
                <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-default-100 flex items-center justify-center">
                            <TranslateIcon className="size-5" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-bold">
                                {t("nav.toggleLanguage")}
                            </span>
                            <span className="text-[10px] text-foreground-400 uppercase tracking-widest font-medium">
                                {locale === "en" ? "English" : "Tiếng Việt"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    )
}
