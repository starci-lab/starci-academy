import type { Meta, StoryObj } from "@storybook/nextjs"
import { ResponsiveBreadcrumb } from "./ResponsiveBreadcrumb"

const meta: Meta<typeof ResponsiveBreadcrumb> = {
    title: "Primitives/Navigation/ResponsiveBreadcrumb",
    component: ResponsiveBreadcrumb,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof ResponsiveBreadcrumb>

/** Short trail (< 4 crumbs), `sm`+ width: the full `Home › … › Current` path. */
export const FullTrail: Story = {
    render: () => (
        <div className="p-8">
            <ResponsiveBreadcrumb
                items={[
                    { key: "home", label: "Home", onPress: () => {} },
                    { key: "courses", label: "Courses", onPress: () => {} },
                    { key: "current", label: "Fullstack Mastery" },
                ]}
            />
        </div>
    ),
}

/** Long trail (>= 4 crumbs) → reuses BackLink; back target = deepest clickable ancestor. */
export const Collapsed: Story = {
    render: () => (
        <div className="p-8">
            <ResponsiveBreadcrumb
                items={[
                    { key: "home", label: "Home", onPress: () => {} },
                    { key: "courses", label: "Courses", onPress: () => {} },
                    { key: "fullstack", label: "Fullstack Mastery", onPress: () => {} },
                    { key: "current", label: "Lesson 4: API design" },
                ]}
            />
        </div>
    ),
}

/** Root page — no clickable ancestor, so no back affordance renders. */
export const RootPage: Story = {
    render: () => (
        <div className="p-8">
            <ResponsiveBreadcrumb items={[{ key: "current", label: "Home" }]} />
        </div>
    ),
}
