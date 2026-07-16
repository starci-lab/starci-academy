import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"

import { ArchitectureScene } from "@/components/blocks/marketing/ArchitectureScene"
import { SMALL_DATA } from "./components"

const meta: Meta<typeof ArchitectureScene> = {
    title: "Features/Marketing/ArchitectureScene",
    component: ArchitectureScene,
}

export default meta

type Story = StoryObj<typeof ArchitectureScene>

/** StarCi's default diagram (CQRS/CDC) — uses the JSON data bundled inside the component. */
export const Default: Story = {
    parameters: { usage: "The default 3D architecture diagram (StarCi backend) — used for the landing-page hero." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Default diagram</Label>
                <Typography type="body-sm" color="muted">
                    The default 3D architecture diagram of the StarCi backend (CQRS/CDC) — used for the landing-page hero, with JSON data bundled in.
                </Typography>
            </div>
            <ArchitectureScene caption="Write and read paths decoupled through CDC — the failure it teaches: CDC lag → reading stale data." />
        </div>
    ),
}

/** A custom diagram via the `data` prop — illustrating one node in trouble (tone `danger` + status). */
export const CustomScene: Story = {
    parameters: { usage: "Pass a custom `data` prop — use it when you need to illustrate a different architecture/incident beyond the default diagram." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Custom diagram</Label>
                <Typography type="body-sm" color="muted">
                    Pass the data prop to illustrate a different architecture/incident — for example a danger-tone node with a status reporting an error.
                </Typography>
            </div>
            <ArchitectureScene data={SMALL_DATA} caption="The load balancer is funneling traffic and overloading the API service." />
        </div>
    ),
}
