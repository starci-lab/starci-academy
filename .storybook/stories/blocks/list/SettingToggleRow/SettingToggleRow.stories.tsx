import React, { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { SettingToggleRow } from "./SettingToggleRow"

const meta: Meta<typeof SettingToggleRow> = {
    title: "Primitives/List/SettingToggleRow",
    component: SettingToggleRow,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof SettingToggleRow>

/** Default: label + description, unchecked. */
export const Default: Story = {
    render: function Render() {
        const [checked, setChecked] = useState(false)
        return (
            <div className="p-8">
                <SettingToggleRow
                    label="Hiển thị dự án"
                    description="Cho phép khách xem tab Dự án trên hồ sơ công khai của bạn"
                    checked={checked}
                    onCheckedChange={setChecked}
                />
            </div>
        )
    },
}

/** Selected: the switch is on. */
export const Selected: Story = {
    render: function Render() {
        const [checked, setChecked] = useState(true)
        return (
            <div className="p-8">
                <SettingToggleRow
                    label="Hiển thị dự án"
                    description="Cho phép khách xem tab Dự án trên hồ sơ công khai của bạn"
                    checked={checked}
                    onCheckedChange={setChecked}
                />
            </div>
        )
    },
}

/** NoDescription: `description` is optional — the row still aligns without the second line. */
export const NoDescription: Story = {
    render: function Render() {
        const [checked, setChecked] = useState(true)
        return (
            <div className="p-8">
                <SettingToggleRow label="Chế độ tối" checked={checked} onCheckedChange={setChecked} />
            </div>
        )
    },
}

/**
 * Disabled: grounded in the hand-roll's "Khoá hồ sơ" override — when the
 * profile lock is on, every per-section visibility row dims + stops
 * accepting input.
 */
export const Disabled: Story = {
    render: () => (
        <div className="p-8">
            <SettingToggleRow
                label="Hiển thị dự án"
                description="Đang bị khoá bởi chế độ khoá hồ sơ"
                checked={false}
                onCheckedChange={() => {}}
                isDisabled
            />
        </div>
    ),
}

/** Skeleton: `isSkeleton` mirrors label + description bars and the switch pill, so the row never jumps when data arrives. */
export const Loading: Story = {
    render: () => (
        <div className="p-8">
            <SettingToggleRow
                label="Hiển thị dự án"
                description="Cho phép khách xem tab Dự án trên hồ sơ công khai của bạn"
                checked={false}
                onCheckedChange={() => {}}
                isSkeleton
            />
        </div>
    ),
}

/** List: several rows stacked, matching how the hand-roll groups per-section visibility toggles. */
export const List: Story = {
    render: function Render() {
        const [values, setValues] = useState({
            projects: true,
            challenges: true,
            skills: false,
            activity: true,
        })
        return (
            <div className="flex w-full max-w-md flex-col gap-6 p-8">
                <SettingToggleRow
                    label="Dự án"
                    description="Hiển thị tab Dự án trên hồ sơ công khai"
                    checked={values.projects}
                    onCheckedChange={(checked) => setValues((prev) => ({ ...prev, projects: checked }))}
                />
                <SettingToggleRow
                    label="Thử thách"
                    description="Hiển thị tab Thử thách trên hồ sơ công khai"
                    checked={values.challenges}
                    onCheckedChange={(checked) => setValues((prev) => ({ ...prev, challenges: checked }))}
                />
                <SettingToggleRow
                    label="Kỹ năng"
                    description="Hiển thị tab Kỹ năng trên hồ sơ công khai"
                    checked={values.skills}
                    onCheckedChange={(checked) => setValues((prev) => ({ ...prev, skills: checked }))}
                />
                <SettingToggleRow
                    label="Hoạt động"
                    description="Hiển thị tab Hoạt động trên hồ sơ công khai"
                    checked={values.activity}
                    onCheckedChange={(checked) => setValues((prev) => ({ ...prev, activity: checked }))}
                />
            </div>
        )
    },
}
