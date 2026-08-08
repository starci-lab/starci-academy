import type { Meta, StoryObj } from "@storybook/nextjs"
import { ShowFrom } from "@sb-components/frames/ShowFrom/ShowFrom"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `ShowFrom` — shows its body once the nearest `@container` reaches a named step.
 */

const meta: Meta<typeof ShowFrom> = {
    title: "Frames/ShowFrom/ShowFrom",
    component: ShowFrom,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof ShowFrom>

/** Demo body for the visibility switch. */
const Wordmark = () => (
    <Typography size="sm" text="Wordmark (visible from md up)" />
)

/** LEAF prop `at` — hidden below `md`, flex from `md` up (Footer wordmark). */
export const At: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ShowFrom"
                tier="frame"
                leaf="Prop `at`"
                parts={[]}
                reason="FRAME-10: name the container step as a prop. Inverse of HideAbove — Footer wordmark is icon-only below md."
                states={[
                    {
                        name: "at = 'md' · container 375px",
                        why: "Below `@app-md`, the body stays hidden.",
                        code: "<ShowFrom at=\"md\" body={Wordmark} />",
                        render: (
                            <div data-tier="fixture" className="@container" style={{ width: 375 }}>
                                <ShowFrom at="md" body={Wordmark} />
                            </div>
                        ),
                    },
                    {
                        name: "at = 'md' · container 1280px",
                        why: "Past `@app-md`, the body shows as flex.",
                        code: "<ShowFrom at=\"md\" body={Wordmark} />",
                        render: (
                            <div data-tier="fixture" className="@container" style={{ width: 1280 }}>
                                <ShowFrom at="md" body={Wordmark} />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}
