import { useState } from "react"
import { Button, Input, Label, ScrollShadow, Tabs, TextField, Typography } from "@heroui/react"

import { ModalShell } from "@/components/blocks/layout/ModalShell"

export const ControlledModal = ({
    label,
    trigger,
    hint,
    children,
    ...rest
}: {
    /** Story-level Label naming the STATE this demo shows. */
    label: string
    /** Trigger copy — the modal opens on mount, this reopens it after a close. */
    trigger: string
    /** When this state is the right one, per §2b. */
    hint: string
    children: React.ReactNode
} & Omit<React.ComponentProps<typeof ModalShell>, "isOpen" | "onOpenChange" | "children">) => {
    const [isOpen, setIsOpen] = useState(true)
    return (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>{label}</Label>
                <Typography type="body-sm" color="muted">
                    {hint}
                </Typography>
            </div>
            <Button variant="secondary" size="sm" className="self-start" onClick={() => setIsOpen(true)}>
                {trigger}
            </Button>
            <ModalShell isOpen={isOpen} onOpenChange={setIsOpen} {...rest}>
                {children}
            </ModalShell>
        </div>
    )
}

/**
 * Leading tabs: a FIXED tab strip (no scroll), panel below at the same height.
 * Long → ScrollShadow within the fixed frame; short → still fills the frame's height.
 */
export const LeadingTabsDemo = () => {
    const [tab, setTab] = useState<"email" | "push">("email")

    return (
        <>
            <Tabs
                selectedKey={tab}
                onSelectionChange={(key) => setTab(String(key) as "email" | "push")}
            >
                <Tabs.ListContainer>
                    <Tabs.List aria-label="Notification channel">
                        <Tabs.Tab id="email">
                            Email
                            <Tabs.Indicator />
                        </Tabs.Tab>
                        <Tabs.Tab id="push">
                            Push
                            <Tabs.Indicator />
                        </Tabs.Tab>
                    </Tabs.List>
                </Tabs.ListContainer>
            </Tabs>

            {/* Same h for every tab — tabs aren't inside the scroller. Long scrolls, short still holds the frame. */}
            <ScrollShadow
                hideScrollBar
                offset={8}
                className="h-72 overflow-y-auto"
            >
                {tab === "email" ? (
                    <div className="flex min-h-full flex-col gap-3">
                        <Typography type="body-sm" color="muted">
                            Choose the channel for notifications when a new lesson arrives.
                        </Typography>
                        <TextField variant="secondary">
                            <Label htmlFor="notify-email">Notification email</Label>
                            <Input id="notify-email" type="email" placeholder="you@email.com" defaultValue="you@email.com" />
                        </TextField>
                        <TextField variant="secondary">
                            <Label htmlFor="notify-email-cc">Secondary email (CC)</Label>
                            <Input id="notify-email-cc" type="email" placeholder="cc@email.com" defaultValue="cc@email.com" />
                        </TextField>
                        <TextField variant="secondary">
                            <Label htmlFor="notify-email-subject">Subject template</Label>
                            <Input id="notify-email-subject" placeholder="[StarCi] New lesson" defaultValue="[StarCi] New lesson" />
                        </TextField>
                        <TextField variant="secondary">
                            <Label htmlFor="notify-email-reply">Reply-to</Label>
                            <Input id="notify-email-reply" type="email" placeholder="noreply@starci.academy" />
                        </TextField>
                        <TextField variant="secondary">
                            <Label htmlFor="notify-email-footer">Email signature</Label>
                            <Input id="notify-email-footer" placeholder="StarCi Academy" />
                        </TextField>
                        <TextField variant="secondary">
                            <Label htmlFor="notify-email-digest">Weekly digest sent at</Label>
                            <Input id="notify-email-digest" placeholder="08:00 Monday" />
                        </TextField>
                    </div>
                ) : (
                    <div className="flex min-h-full flex-col gap-3">
                        <Typography type="body-sm" color="muted">
                            Push notifications on the browser or registered devices.
                        </Typography>
                        <TextField variant="secondary">
                            <Label htmlFor="notify-device">Device name</Label>
                            <Input id="notify-device" placeholder="Personal laptop" />
                        </TextField>
                        <TextField variant="secondary">
                            <Label htmlFor="notify-push-token">Push token</Label>
                            <Input id="notify-push-token" placeholder="fcm_…" />
                        </TextField>
                    </div>
                )}
            </ScrollShadow>
        </>
    )
}
