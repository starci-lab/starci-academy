import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"
import {
    BookOpenIcon,
    CheckCircleIcon,
    RocketLaunchIcon,
    WarningIcon,
} from "@phosphor-icons/react"
import { IconTile } from "@/components/blocks/identity/IconTile"

const meta: Meta<typeof IconTile> = {
    title: "Blocks/Identity/IconTile",
    component: IconTile,
}
export default meta
type Story = StoryObj<typeof IconTile>

/**
 * Use only when the leading of a row/card represents ONE OBJECT with an identity — a lesson, a course,
 * a project: something the user can name and open by clicking. In that slot use IconTile, NOT a small
 * bare SVG icon — a bare icon reads as a SECONDARY MARKER (a status, difficulty, or content-type cue), not
 * enough mass to act as an avatar; placing it in the leading demotes the object to a caption. Conversely:
 * a cue paired with text should stay a bare icon, don't wrap it in a tile. If the IMAGE itself is the
 * content — a 16:9 cover in a course card — use CoverImage, not a square tile.
 */
export const Default: Story = {
    parameters: { usage: "Use only when the leading of a row/card represents ONE OBJECT with an identity — a lesson, a course, "
        + "a project: something the user can name and open by clicking. In that slot use `IconTile`, NOT a small bare SVG "
        + "icon — a bare icon reads as a SECONDARY MARKER (a status, difficulty, or content-type cue), not enough mass to act as an "
        + "avatar; placing it in the leading demotes the object to a caption. Conversely: a cue paired with text should stay a bare "
        + "icon, don't wrap it in a tile (the tile would compete with the row's real object). If the IMAGE itself is the content — a 16:9 "
        + "cover in a course card — use `CoverImage`, not a square tile." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Default</Label>
                <Typography type="body-sm" color="muted">
                    Icon only, no cover image: the most common form, since most lessons and challenges have
                    no asset of their own.
                </Typography>
            </div>
            <IconTile icon={<BookOpenIcon />} />
        </div>
    ),
}

/** Pick the tone by the STATUS of what the tile represents, not by which color looks nice. */
export const Tones: Story = {
    parameters: { usage: "Pick the tone by the STATUS of what the tile represents, not by which color looks nice." },
    render: () => (
        <div className="flex max-w-2xl flex-col gap-6">
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Accent</Label>
                    <Typography type="body-sm" color="muted">
                        The thing being pushed forward: the item in progress, the thing just unlocked. At most
                        one accent tile per eyeful — several accents at once and none of them stands out.
                    </Typography>
                </div>
                <IconTile icon={<RocketLaunchIcon />} tone="accent" />
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Success</Label>
                    <Typography type="body-sm" color="muted">
                        The object is fully done and needs nothing more: a completed lesson, a passed challenge.
                    </Typography>
                </div>
                <IconTile icon={<CheckCircleIcon />} tone="success" />
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Warning</Label>
                    <Typography type="body-sm" color="muted">
                        There is work left and a real deadline: due soon, awaiting resubmission. Don't use it
                        for something that simply hasn't started yet.
                    </Typography>
                </div>
                <IconTile icon={<WarningIcon />} tone="warning" />
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Danger</Label>
                    <Typography type="body-sm" color="muted">
                        Broken or failed, needing the user to act: a failed submission, an expired session that
                        can't be recovered.
                    </Typography>
                </div>
                <IconTile icon={<WarningIcon />} tone="danger" />
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Neutral</Label>
                    <Typography type="body-sm" color="muted">
                        The default when the object carries no status: an item in a list to browse. When in
                        doubt, pick this — don't add color for its own sake.
                    </Typography>
                </div>
                <IconTile icon={<BookOpenIcon />} tone="neutral" />
            </div>
        </div>
    ),
}

/** Pick the size by the density of the area the tile sits in, not by the importance of the object. */
export const Sizes: Story = {
    parameters: { usage: "Pick the size by the density of the area the tile sits in, not by the importance of the object." },
    render: () => (
        <div className="flex max-w-2xl flex-col gap-6">
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Small (sm)</Label>
                    <Typography type="body-sm" color="muted">
                        The size for the leading of a row in a dense list — the default choice when a tile
                        heads a row.
                    </Typography>
                </div>
                <IconTile icon={<BookOpenIcon />} size="sm" />
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Medium (md)</Label>
                    <Typography type="body-sm" color="muted">
                        The size for a standalone card, where each object has its own frame rather than sitting
                        packed against the next.
                    </Typography>
                </div>
                <IconTile icon={<BookOpenIcon />} size="md" />
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Large (lg)</Label>
                    <Typography type="body-sm" color="muted">
                        The size for a hero block at the top of a page, where the object is the lead of the
                        whole surface. Don't use it in a list — it will overpower the row's own title.
                    </Typography>
                </div>
                <IconTile icon={<BookOpenIcon />} size="lg" />
            </div>
        </div>
    ),
}

/** The two cover-image states — a real asset and a broken URL — and the reason `icon` must always be passed. */
export const CoverImage: Story = {
    parameters: { usage: "The two cover-image states — a real asset and a broken URL — and the reason `icon` must always be passed. Always pass `icon` even when `src` is set: the image fills the tile, but if the URL is broken or not yet synced, the tile falls back to the icon instead of showing a broken-image glyph." },
    render: () => (
        <div className="flex max-w-2xl flex-col gap-6">
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Has a cover image</Label>
                    <Typography type="body-sm" color="muted">
                        Pass src when the course or project has a real asset; the image fills the tile and
                        replaces the icon.
                    </Typography>
                </div>
                <IconTile
                    icon={<BookOpenIcon />}
                    src="https://picsum.photos/seed/starci-course/128/128"
                    alt="Fullstack Mastery track"
                    size="lg"
                />
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Broken image, falls back to icon</Label>
                    <Typography type="body-sm" color="muted">
                        Not a choice but what happens when the URL is broken or the CDN hasn't synced. This is
                        why you always pass icon alongside src: drop the icon and this becomes a broken-image cell.
                    </Typography>
                </div>
                <IconTile
                    icon={<BookOpenIcon />}
                    src="https://invalid.starci.example/not-found.jpg"
                    alt="Cover image failed to load"
                    size="lg"
                    tone="neutral"
                />
            </div>
        </div>
    ),
}
