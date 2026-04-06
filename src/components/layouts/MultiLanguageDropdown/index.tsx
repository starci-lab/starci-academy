import {
  StarCiAvatar,
  StarCiDropdown,
  StarCiDropdownItem,
  StarCiDropdownMenu,
  StarCiDropdownSection,
  StarCiDropdownTrigger,
} from "@/components/atomic";
import { usePathname, useRouter } from "@/i18n/navigation";
import { US, VN } from "country-flag-icons/react/3x2";
import { useLocale, useTranslations } from "next-intl";

/**
 * MultiLanguageDropdown is a dropdown component that is used to display the multi language information.
 */
export const MultiLanguageDropdown = () => {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations();

  const languages = [
    {
      code: "en",
      label: t("languages.en"),
      flag: US,
      displayName: "ENG",
    },
    {
      code: "vi",
      label: t("languages.vi"),
      flag: VN,
      displayName: "VIE",
    },
  ];

  const currentLanguage = languages.find((lang) => lang.code === locale);

  return (
    <StarCiDropdown>
      <StarCiDropdownTrigger>
        <StarCiAvatar
          fallback={currentLanguage?.displayName}
          className="cursor-pointer font-bold text-xs"
          color="success"
        />
      </StarCiDropdownTrigger>
      <StarCiDropdownMenu
        aria-label="Language selection"
        disabledKeys={[locale]}
      >
        <StarCiDropdownSection
          title={t("nav.toggleLanguage")}
          classNames={{
            group: "gap-1.5 flex flex-col",
          }}
        >
          {languages.map((lang) => (
            <StarCiDropdownItem
              key={lang.code}
              variant="flat"
              onPress={() =>
                router.replace(pathname, { locale: lang.code as any })
              }
              startContent={<lang.flag className="size-5 rounded-sm" />}
            >
              {lang.label}
            </StarCiDropdownItem>
          ))}
        </StarCiDropdownSection>
      </StarCiDropdownMenu>
    </StarCiDropdown>
  );
};
