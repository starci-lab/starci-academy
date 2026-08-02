import type { Meta, StoryObj } from "@storybook/nextjs"
import { Footer } from "@sb-components/starci/blocks/navigation/Footer/Footer"
import type { FooterLinkItem, FooterSocialLink } from "@sb-components/starci/blocks/navigation/Footer/Footer"
import { FaFacebook, FaGithub, FaLinkedin } from "react-icons/fa6"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — `Footer`: the marketing site footer. See the component's own file
 * header for the full port/reuse ledger; this story only exercises what a
 * caller actually configures.
 *
 * ONE LEAF — the footer has a single structural shape (brand column, two link
 * columns, bottom bar); nothing about its composition ever drops or gains a
 * whole node. Longer vs. shorter link lists are DATA, so they live as states
 * inside this one leaf rather than separate leaves.
 */
const meta: Meta<typeof Footer> = {
    title: "StarCi/Blocks/Navigation/Footer/Footer",
    component: Footer,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof Footer>

const EXPLORE_LINKS: Array<FooterLinkItem> = [
    { id: "courses", label: "Courses", onPress: () => {} },
    { id: "blog", label: "Blog", onPress: () => {} },
    { id: "talents", label: "Talents", onPress: () => {} },
    { id: "jobs", label: "IT Jobs", onPress: () => {} },
    { id: "community", label: "Community", onPress: () => {} },
]

const SUPPORT_LINKS: Array<FooterLinkItem> = [
    { id: "contact", label: "Contact", onPress: () => {} },
    { id: "email", label: "cuongnvtse160875@gmail.com", onPress: () => {} },
]

const SOCIALS: Array<FooterSocialLink> = [
    { id: "facebook", label: "Facebook", icon: FaFacebook, onPress: () => {} },
    { id: "linkedin", label: "LinkedIn", icon: FaLinkedin, onPress: () => {} },
    { id: "github", label: "GitHub", icon: FaGithub, onPress: () => {} },
]

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "Container": { tier: "frame", role: "the centered, width-capped measure the whole footer sits inside", storyId: "frames-container-container--default" },
    "StackV": { tier: "frame", role: "the root track (top region · bottom bar, `divider` interleaving the rule between them), and each brand/link column's own stack", storyId: "frames-stack-stackv--default" },
    "StackH": { tier: "frame", role: "the top region's split, the socials row, the two-column wrapper, and the bottom bar's own split", storyId: "frames-stack-stackh--default" },
    "Typography": { tier: "atom", role: "the tagline, a link column's title, and the bottom-bar copyright line", storyId: "atoms-text-typography-typography--overview" },
    "Link": { tier: "heroui", role: "every navigable row — a link-column entry, a social icon, or a bottom-bar legal stub" },
    "Divider": { tier: "atom", role: "the rule between the top region and the bottom bar, interleaved by `StackV`'s own `divider` prop", storyId: "atoms-display-divider-divider--default" },
}

/** LEAF — the only shape this block has. States below vary the DATA, not the structure. */
export const Default: Story = {
    render: () => (
        <BlockAnatomy
            name="Footer"
            tier="block"
            leaf="Default"
            annotate={ANNOTATE}
            renderClassName="w-full"
            states={[
                {
                    name: "5 explore rows, 2 support rows, 3 socials",
                    why: "The real footer's own fixture: a full explore column (courses/blog/talents/jobs/community), a short support column (contact + email), and all three founder social icons — the common case a landing-route caller renders.",
                    code: `<Footer
    exploreLinks={exploreLinks}   // 5 rows
    supportLinks={supportLinks}   // 2 rows
    socials={socials}              // Facebook · LinkedIn · GitHub
    onTermsPress={openTerms}
    onPrivacyPress={openPrivacy}
/>`,
                    render: (
                        <Footer
                           

                            exploreLinks={EXPLORE_LINKS}
                            supportLinks={SUPPORT_LINKS}
                            socials={SOCIALS}
                            onTermsPress={() => {}}
                            onPrivacyPress={() => {}}
                        />
                    ),
                },
                {
                    name: "no socials",
                    why: "A caller with no founder social links to show yet — the row simply renders empty instead of reserving space for it, confirming the socials row never becomes a fixed-height placeholder.",
                    code: `<Footer
    exploreLinks={exploreLinks}
    supportLinks={supportLinks}
    socials={[]}
    onTermsPress={openTerms}
    onPrivacyPress={openPrivacy}
/>`,
                    render: (
                        <Footer
                           

                            exploreLinks={EXPLORE_LINKS}
                            supportLinks={SUPPORT_LINKS}
                            socials={[]}
                            onTermsPress={() => {}}
                            onPrivacyPress={() => {}}
                        />
                    ),
                },
            ]}
        />
    ),
}
