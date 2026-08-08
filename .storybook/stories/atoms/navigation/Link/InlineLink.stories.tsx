import type { Meta, StoryObj } from "@storybook/nextjs"
import { InlineLink } from "@sb-components/atoms/navigation/Link/InlineLink"
import { FaGithub } from "react-icons/fa6"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"
import { StackH } from "@sb-components/frames/Stack/Stack"

/**
 * `InlineLink` — muted text or icon press-link (Footer columns, legal, socials).
 */

const meta: Meta<typeof InlineLink> = {
    title: "Atoms/Navigation/Link/InlineLink",
    component: InlineLink,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof InlineLink>

/** LEAF — labelled text + icon-only shapes Footer needs. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="InlineLink"
                tier="atom"
                leaf="Default"
                parts={[]}
                reason="Muted HeroUI Link wrapper for Footer — size sm/xs text rows and icon-only socials. No className door."
                states={[
                    {
                        name: "label size=sm",
                        why: "Footer column row.",
                        code: "<InlineLink label=\"Courses\" onPress={() => undefined} />",
                        render: <InlineLink label="Courses" onPress={() => undefined} />,
                    },
                    {
                        name: "label size=xs",
                        why: "Footer legal stub.",
                        code: "<InlineLink label=\"Terms\" size=\"xs\" onPress={() => undefined} />",
                        render: <InlineLink label="Terms" size="xs" onPress={() => undefined} />,
                    },
                    {
                        name: "icon + ariaLabel",
                        why: "Footer social glyph.",
                        code: "<InlineLink icon={FaGithub} ariaLabel=\"GitHub\" onPress={() => undefined} />",
                        render: (
                            <StackH
                                gap={3}
                                items={[
                                    () => (
                                        <InlineLink
                                            icon={FaGithub}
                                            ariaLabel="GitHub"
                                            onPress={() => undefined}
                                        />
                                    ),
                                ]}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
