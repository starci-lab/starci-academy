import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"
import { Logo } from "@/components/blocks/identity/Logo"

const meta: Meta<typeof Logo> = {
    title: "Core/Identity/Logo",
    component: Logo,
}
export default meta
type Story = StoryObj<typeof Logo>

/** Use `Logo` when you need the bare brand mark and want to set the height yourself — rather than `BrandLogo` (the shared entry point, fixed at `h-9`) or `BrandLockup` (the mark plus the "StarCi Academy" wordmark, for navbar and footer). In the app today only `BrandLogo` calls `Logo` directly; product surfaces should go through those two blocks so the whole app reads one mark from one source. */
export const Sizes: Story = {
    parameters: { usage: "Use `Logo` when you need the bare brand mark and want to set the height yourself — rather than `BrandLogo` (the shared entry point, fixed at `h-9`) or `BrandLockup` (the mark plus the \"StarCi Academy\" wordmark, for navbar and footer). In the app today only `BrandLogo` calls `Logo` directly; product surfaces should go through those two blocks so the whole app reads one mark from one source. There is no `size` prop: pass the height via className, and the width follows automatically." },
    render: () => (
        <div className="flex max-w-2xl flex-col gap-6">
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>h-9 — the BrandLogo default</Label>
                    <Typography type="body-sm" color="muted">
                        The size you get when you call BrandLogo without passing anything. When you need a
                        standalone mark at normal density, use this size — don't pick your own number.
                    </Typography>
                </div>
                <Logo className="h-9" />
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>h-10 — inside BrandLockup</Label>
                    <Typography type="body-sm" color="muted">
                        The lockup size, used so the mark balances the StarCi Academy wordmark beside it. Only
                        correct when there's text alongside; a mark standing alone at this size will overshoot
                        the navbar's rhythm.
                    </Typography>
                </div>
                <Logo className="h-10" />
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>h-14 — splash screen</Label>
                    <Typography type="body-sm" color="muted">
                        The size for a surface where the mark is the only thing on screen: the splash while the
                        app opens. Don't carry this size into a content page — it will compete with the title.
                    </Typography>
                </div>
                <Logo className="h-14" />
            </div>
        </div>
    ),
}

/** Placed on a dark surface to verify the mark still stands out, since the brand pink is a fixed color that doesn't change with the theme. */
export const OnDarkSurface: Story = {
    parameters: { usage: "Placed on a dark surface to verify the mark still stands out, since the brand pink is a fixed color that doesn't change with the theme." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>On a dark surface</Label>
                <Typography type="body-sm" color="muted">
                    Check this story before placing the mark on a custom background. The pink is a constant in
                    the SVG — it doesn't read a token, so it won't flip with the theme; verify contrast on
                    every background yourself, including a light background with a pink tone.
                </Typography>
            </div>
            <div className="flex w-fit items-center rounded-lg bg-neutral-950 p-8">
                <Logo className="h-10" />
            </div>
        </div>
    ),
}
