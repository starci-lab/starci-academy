import React from "react"
import { Dropdown, Label } from "@heroui/react"
import { TranslateIcon } from "@phosphor-icons/react"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import type { NavbarLanguageOption } from "../types"

/** Props for {@link NavbarLanguageMenu}. */
export interface NavbarLanguageMenuProps {
    languages: Array<NavbarLanguageOption>
    activeLocale: string
    onLocaleChange: (code: string) => void
}

/**
 * Locale picker — raw HeroUI `Dropdown` (see file header: no atom here supports a
 * single-select CHECK indicator). Shared verbatim by the desktop icon row and the
 * mobile drawer row so the two never drift.
 */
export const NavbarLanguageMenu = ({ languages, activeLocale, onLocaleChange }: NavbarLanguageMenuProps) => (
    <Dropdown>
        <Button
            isIconOnly
            variant="ghost"
            prefixIcon={TranslateIcon}
            ariaLabel="Language"

        />
        <Dropdown.Popover>
            <Dropdown.Menu
                aria-label="Language"
                selectionMode="single"
                selectedKeys={new Set([activeLocale])}
                onSelectionChange={(keys) => {
                    if (keys === "all") return
                    const next = [...keys][0]
                    if (next != null) onLocaleChange(String(next))
                }}

            >
                <Dropdown.Section>
                    {languages.map((language) => (
                        <Dropdown.Item
                            key={language.code}
                            id={language.code}
                            textValue={language.label}

                        >
                            <Dropdown.ItemIndicator />
                            <Label>{language.label}</Label>
                        </Dropdown.Item>
                    ))}
                </Dropdown.Section>
            </Dropdown.Menu>
        </Dropdown.Popover>
    </Dropdown>
)
