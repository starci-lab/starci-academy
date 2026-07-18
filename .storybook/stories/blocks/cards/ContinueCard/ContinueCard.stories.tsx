import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"
import { ClockCounterClockwiseIcon } from "@phosphor-icons/react"
import { ContinueCard } from "@/components/blocks/cards/ContinueCard"

const meta: Meta<typeof ContinueCard> = {
    title: "Features/Learn/ContinueCard",
    component: ContinueCard,
}
export default meta
type Story = StoryObj<typeof ContinueCard>

/** Use when the card is ONE of N things worth continuing, arranged in a grid — instead of variant="hero" (only when it is the single unfinished thing on the surface). The CTA is a real SeeMoreLink ("Continue →"): hover and click are on the link only, not the whole card — the same formula as LabeledCard "See more". No accent border, because if N cards share an accent then no card stands out. */
export const Item: Story = {
    parameters: { usage: "Use when the card is ONE of N things worth continuing, arranged in a grid — instead of variant=\"hero\" (only when it is the single unfinished thing on the surface). The CTA is a real SeeMoreLink (\"Continue →\"): hover and click are on the link only, not the whole card — the same formula as LabeledCard \"See more\". No accent border, because if N cards share an accent then no card stands out. No value is passed so there is no progress bar — correct for something never started." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Default</Label>
                <Typography type="body-sm" color="muted">
                    The subtitle carries the content type (reading, challenge) to distinguish cards standing next to each other in the same grid. Navigate via href on the CTA when the card only points to an existing address.
                </Typography>
            </div>
            <div className="grid w-[42rem] gap-3 sm:grid-cols-2">
                <ContinueCard
                    variant="item"
                    title="Building a RESTful API with NestJS"
                    subtitle="Reading"
                    ctaLabel="Continue"
                    href="/courses/nestjs-api/lessons/5"
                />
                <ContinueCard
                    variant="item"
                    title="System design: Distributed rate limiter"
                    subtitle="Challenge"
                    ctaLabel="Continue"
                    href="/courses/system-design/challenges/rate-limiter"
                />
            </div>
        </div>
    ),
}

/** Use when the card is the ONLY unfinished thing on the surface, and needs to pull the learner back — instead of variant="item" (when there are N things to choose from). The CTA becomes a chip button on its own line for enough weight, the icon sinks into the background, and it's wrapped in a `HighlightCard` sweeping-light accent (`card.md` §3j) because it's the thing being emphasized. */
export const Hero: Story = {
    parameters: { usage: "Use when the card is the ONLY unfinished thing on the surface, and needs to pull the learner back — instead of variant=\"item\" (when there are N things to choose from). The CTA becomes a chip button on its own line for enough weight, the icon sinks into the background as a watermark, wrapped in a HighlightCard sweeping-light accent (card.md §3j) because it's the thing being emphasized." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Not urgent</Label>
                <Typography type="body-sm" color="muted">
                    The hero's baseline state: the subtitle keeps a muted tone because it only states a position within the session, with no deadline to warn about. Use onPress when the CTA reopens the session in place rather than going to a fixed address.
                </Typography>
            </div>
            <div className="w-96">
                <ContinueCard
                    variant="hero"
                    icon={<ClockCounterClockwiseIcon weight="fill" />}
                    title="Review due cards"
                    subtitle="Card 3 / 20"
                    ctaLabel="Review now"
                    onPress={() => {}}
                />
            </div>
        </div>
    ),
}

/** Use when the unfinished session has a REAL deadline imposed by the server and measurable progress: pass value to show the progress bar (leave it out if there is no real data, don't pass 0 just to fill the prop), enable urgent to shift the subtitle to a warning tone. Don't use urgent for a made-up countdown. */
export const HeroUrgent: Story = {
    parameters: { usage: "Use when the unfinished session has a REAL deadline imposed by the server and measurable progress: pass value to show the progress bar (leave it out if there is no real data, don't pass 0 just to fill the prop), enable urgent to shift the subtitle to a warning tone. Don't use urgent for a made-up countdown." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Urgent, with progress</Label>
                <Typography type="body-sm" color="muted">
                    Enable urgent when the subtitle contains a real deadline imposed by the server, and the subtitle shifts to a warning tone. Pass value with max when there is measurable progress to show the bar; leave it out if there is no real data yet.
                </Typography>
            </div>
            <div className="w-96">
                <ContinueCard
                    variant="hero"
                    title="Mock interview: Design a rate limiter"
                    subtitle="Question 5 / 8 · Middle · 12 minutes left"
                    urgent
                    value={5}
                    max={8}
                    ctaLabel="Continue"
                    onPress={() => {}}
                />
            </div>
        </div>
    ),
}
