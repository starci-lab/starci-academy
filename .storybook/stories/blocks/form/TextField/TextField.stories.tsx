import type { Meta, StoryObj } from "@storybook/nextjs"
import { Input, Label, TextArea, TextField, Typography } from "@heroui/react"

/**
 * `TextField` (HeroUI) — a single FIELD wrapper: wraps `Label` + `Input`/`TextArea`
 * (+ error line) into one a11y-linked cluster (Label `htmlFor` ↔ Input `id`). Pick
 * `variant` by SURFACE CONTEXT (same as `Input`, see `Core/Form/Input`): `primary` =
 * field on the PAGE BACKGROUND (its own border/fill), `secondary` = field INSIDE a
 * card/modal (lighter — most forms). The stories below demo `primary` because they render
 * on a bare page-background canvas; inside a card/modal form, switch to `secondary`.
 * Error state: `isInvalid` on TextField + a `Typography slot="errorMessage"` (HeroUI wires
 * it to the field via aria). Fields in a form: the same cluster uses `gap-3`.
 */
const meta: Meta<typeof TextField> = {
    title: "Primitives/Form/TextField",
    component: TextField,
}
export default meta
type Story = StoryObj<typeof TextField>

/** Basic single-line field: Label + Input. Use for most labeled inputs (email, name, title). */
export const Default: Story = {
    parameters: {
        usage: "Basic field — `TextField variant=\"primary\"` (rendered on a bare background) wraps `Label htmlFor` + `Input id` (matching id so clicking the label focuses the field). Inside a card/modal, switch to `secondary`. Use for a labeled single-line input; stack multiple fields in a form with `flex flex-col gap-3`.",
    },
    render: () => (
        <div className="flex w-80 flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Default</Label>
                <Typography type="body-sm" color="muted">
                    The Label links to the Input via htmlFor↔id — clicking the label moves the cursor into the field.
                </Typography>
            </div>
            <TextField variant="primary">
                <Label htmlFor="tf-email">Notification email</Label>
                <Input id="tf-email" type="email" placeholder="you@email.com" />
            </TextField>
        </div>
    ),
}

/** Required field: `isRequired` so the Label marks it as not-empty on submit. */
export const Required: Story = {
    parameters: {
        usage: "`isRequired` on TextField → the Label marks it required and the field enters validation on submit. Use for fields that can't be empty; don't add required to optional fields just to 'force' the user.",
    },
    render: () => (
        <div className="flex w-80 flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Required</Label>
                <Typography type="body-sm" color="muted">
                    isRequired: the field must have a value on submit — use for core fields (login email, course name).
                </Typography>
            </div>
            <TextField variant="primary" isRequired>
                <Label htmlFor="tf-name">Display name</Label>
                <Input id="tf-name" placeholder="Jane Doe" />
            </TextField>
        </div>
    ),
}

/** Error field: `isInvalid` + `Typography slot="errorMessage"` — red border and an error line under the field. */
export const Invalid: Story = {
    parameters: {
        usage: "`isInvalid` turns on the error border; the error line is `Typography slot=\"errorMessage\" type=\"body-xs\"` colored `text-danger-soft-foreground` (HeroUI wires aria automatically). errorMessage says HOW to fix, not just that it's 'wrong' — 'Email format looks off', not 'Error'.",
    },
    render: () => (
        <div className="flex w-80 flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Validation error</Label>
                <Typography type="body-sm" color="muted">
                    Use when the value is invalid — the error line tells how to fix it, not just that it's wrong.
                </Typography>
            </div>
            <TextField variant="primary" isInvalid>
                <Label htmlFor="tf-invalid">Notification email</Label>
                <Input id="tf-invalid" type="email" defaultValue="you@@email" />
                <Typography slot="errorMessage" type="body-xs" className="text-danger-soft-foreground">
                    Email format looks off — check the part after the @.
                </Typography>
            </TextField>
        </div>
    ),
}

/** Locked field: `isDisabled` — dimmed, cannot focus/type. Use when the value is locked by context. */
export const Disabled: Story = {
    parameters: {
        usage: "`isDisabled` → the field is dimmed, cannot focus or type. Use when the value is locked by context (loading, insufficient permission, depends on another field). If it's a temporary lock during processing, consider `isReadOnly` so it stays readable/copyable.",
    },
    render: () => (
        <div className="flex w-80 flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Disabled</Label>
                <Typography type="body-sm" color="muted">
                    Value locked by context — not editable until the condition unlocks.
                </Typography>
            </div>
            <TextField variant="primary" isDisabled>
                <Label htmlFor="tf-disabled">Class code (fixed)</Label>
                <Input id="tf-disabled" defaultValue="FS-2026-K12" />
            </TextField>
        </div>
    ),
}

/** Multi-line: `TextArea` replaces `Input` in the same `TextField` — for longer descriptions/notes. */
export const Multiline: Story = {
    parameters: {
        usage: "For multi-line content → replace `Input` with `TextArea` in the same `TextField` (keeping Label + variant + error). Use for descriptions, notes, feedback — single-line content should use Input to keep the row compact.",
    },
    render: () => (
        <div className="flex w-80 flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Multi-line (TextArea)</Label>
                <Typography type="body-sm" color="muted">
                    Same TextField wrapper but the field is a TextArea — for content spanning multiple lines.
                </Typography>
            </div>
            <TextField variant="primary">
                <Label htmlFor="tf-note">Note for the student</Label>
                <TextArea id="tf-note" placeholder="Enter feedback, one point per line…" rows={4} />
            </TextField>
        </div>
    ),
}
