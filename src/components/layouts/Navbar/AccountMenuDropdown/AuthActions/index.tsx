"use client"

import React from "react"
import {
    Button,
} from "@heroui/react"
import type {
    AccountActionItem,
} from "../types"

/** Props for {@link AuthActions}. */
export interface AuthActionsProps {
    /** Auth call-to-action buttons (sign in / sign up). */
    items: Array<AccountActionItem>
    /** Fired with the chosen action when a button is pressed. */
    onSelectAction: (item: AccountActionItem) => void
}

/**
 * Row of authentication call-to-action buttons shown to signed-out users.
 *
 * Presentational: maps {@link AccountActionItem}s to buttons and forwards the
 * chosen action upward. No business logic.
 * @param props - action items and the select callback
 */
export const AuthActions = ({
    items,
    onSelectAction,
}: AuthActionsProps) => {
    return (
        <div className="flex items-center gap-2">
            {items.map((item) => (
                <Button
                    key={item.key}
                    variant={item.variant}
                    onPress={() => onSelectAction(item)}
                >
                    {item.label}
                </Button>
            ))}
        </div>
    )
}
