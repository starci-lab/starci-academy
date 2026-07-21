import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Switch, Typography } from "@heroui/react"

/**
 * `Switch` (HeroUI) — an instant ON/OFF toggle (unlike Checkbox: flipping applies right
 * away, no submit needed). Compound structure: `Switch.Content > Switch.Control >
 * Switch.Thumb` (add `Switch.Icon` inside Thumb if an icon is needed, like
 * DarkLightModeSwitch). In forms it's usually laid out as a settings ROW: descriptive
 * label on the left, Switch aligned right.
 */
const meta: Meta<typeof Switch> = {
    title: "Primitives/Form/Switch",
    component: Switch,
}
export default meta
type Story = StoryObj<typeof Switch>

/** On/off settings row: label left + Switch right. On = applied, off = disabled. */
export const OnOff: Story = {
    parameters: {
        usage: "Use for an option that applies IMMEDIATELY on toggle (enable notifications, dark mode) — unlike a Checkbox that waits for submit. Lay it out as a row: descriptive label on the left, Switch aligned right (`justify-between`). The label must state clearly what ON means.",
    },
    render: () => (
        <div className="flex w-80 flex-col gap-6">
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>On</Label>
                    <Typography type="body-sm" color="muted">
                        On state — the option is currently applied.
                    </Typography>
                </div>
                <div className="flex items-center justify-between gap-4">
                    <Typography type="body-sm">Receive email notifications</Typography>
                    <Switch defaultSelected aria-label="Receive email notifications">
                        <Switch.Content>
                            <Switch.Control>
                                <Switch.Thumb />
                            </Switch.Control>
                        </Switch.Content>
                    </Switch>
                </div>
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Off</Label>
                    <Typography type="body-sm" color="muted">
                        Off state — the option is not applied.
                    </Typography>
                </div>
                <div className="flex items-center justify-between gap-4">
                    <Typography type="body-sm">Browser push notifications</Typography>
                    <Switch aria-label="Browser push notifications">
                        <Switch.Content>
                            <Switch.Control>
                                <Switch.Thumb />
                            </Switch.Control>
                        </Switch.Content>
                    </Switch>
                </div>
            </div>
        </div>
    ),
}

/** Locked by context: `isDisabled` — cannot toggle until the condition unlocks. */
export const Disabled: Story = {
    parameters: {
        usage: "`isDisabled` when the option can't be toggled yet (depends on plan/permission/another condition) — the switch is dimmed and non-interactive. The label should hint WHY it's locked if not obvious.",
    },
    render: () => (
        <div className="flex w-80 flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Disabled</Label>
                <Typography type="body-sm" color="muted">
                    Cannot toggle — e.g. a feature available only on a paid plan.
                </Typography>
            </div>
            <div className="flex items-center justify-between gap-4">
                <Typography type="body-sm" color="muted">Weekly summary email (Pro plan)</Typography>
                <Switch isDisabled aria-label="Weekly summary email">
                    <Switch.Content>
                        <Switch.Control>
                            <Switch.Thumb />
                        </Switch.Control>
                    </Switch.Content>
                </Switch>
            </div>
        </div>
    ),
}

/**
 * SETTINGS ROW GROUP — the canonical layout for a stack of switch options on a settings
 * page (privacy, preferences). Each row = `label (+ body-xs muted description) ↔ Switch`,
 * `flex items-start justify-between gap-3 **my-2**`; the wrapping column is `flex flex-col
 * gap-3` — the vertical rhythm is gap-3 (container) + my-2 (per row), NOT gap-0 (thầy
 * 2026-07-18 "my-2 nhưng mà vẫn gap-3"). The label is a SIBLING of the Switch (never inside
 * `Switch.Content` — react-aria slot). Real case: `/profile/settings/privacy`. Ref
 * `patterns/form-flow.md`.
 */
export const SettingsRows: Story = {
    parameters: {
        usage:
            "Stack of switch options on a settings page: each row is label + body-xs description ↔ Switch, " +
            "wrapped `flex items-start justify-between gap-3 my-2`; the column is `flex flex-col gap-3`. Vertical " +
            "rhythm = gap-3 (container) + my-2 (per row). Label is a sibling of the Switch, never inside Switch.Content.",
    },
    render: () => (
        <div className="flex w-96 flex-col gap-3">
            {[
                { label: "Dự án", desc: "Dự án cá nhân & capstone bạn ghim — cho nhà tuyển dụng xem sản phẩm thật." },
                { label: "Thử thách", desc: "Bài nộp coding-challenge đã chấm điểm (theo khóa, độ khó, ngôn ngữ)." },
                { label: "Kỹ năng", desc: "Chỉ số coding, phân bố độ khó/chủ đề/ngôn ngữ & lịch sử giải bài." },
                { label: "Hoạt động", desc: "Dòng thời gian đóng góp — bạn học đều đặn tới đâu." },
            ].map((row) => (
                <div key={row.label} className="my-2 flex items-start justify-between gap-3">
                    <div className="flex min-w-0 flex-col gap-0">
                        <Label>{row.label}</Label>
                        <Typography type="body-xs" color="muted">{row.desc}</Typography>
                    </div>
                    <Switch defaultSelected className="shrink-0" aria-label={row.label}>
                        <Switch.Content>
                            <Switch.Control>
                                <Switch.Thumb />
                            </Switch.Control>
                        </Switch.Content>
                    </Switch>
                </div>
            ))}
        </div>
    ),
}
