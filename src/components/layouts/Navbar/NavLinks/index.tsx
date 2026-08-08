"use client"

import React from "react"
import { Typography } from "@/components/atoms/text/Typography"
import { ButtonRadioGroup } from "@/components/composites/buttons/ButtonRadioGroup"
import { ShowFrom } from "@/components/frames/ShowFrom"
import { StackH } from "@/components/frames/Stack"
import { useRouter } from "@/i18n/navigation"
import { useNavbarItems } from "../useNavbarItems"

/**
 * Props for {@link NavLinks}.
 */
export type NavLinksProps = Record<string, never>

/**
 * Desktop navbar link group (hidden on small screens).
 *
 * Container: derives its entries + active-route state from the router/locale
 * itself and self-navigates on press. `"use client"` for the hooks + press
 * handlers. `ShowFrom` owns the md visibility switch; `ButtonRadioGroup` owns
 * the pill row (same vocabulary as the starci `Navbar` / `NavLinks` block).
 */
export const NavLinks = () => {
    const router = useRouter()
    const items = useNavbarItems()
    const activePath = items.find((item) => item.isActive)?.path ?? ""

    return (
        <StackH
            identity={{ tier: "layout", component: "NavLinks" }}
            principle="flex-action"
            explain="Groups action controls on one horizontal peer row so they share a single hit baseline."
            items={[
                () => (
                    <ShowFrom
                        at="md"
                        body={() => (
                            <ButtonRadioGroup
                                items={items.map((item) => ({
                                    value: item.path,
                                    content: <Typography size="sm" text={item.label} />,
                                }))}
                                value={activePath}
                                onChange={(path) => router.push(path)}
                                ariaLabel="Main navigation"
                            />
                        )}
                    />
                ),
            ]}
        />
    )
}
