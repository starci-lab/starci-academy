import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"
import { FriendRow } from "@sb-components/mia-mia/FriendRow"

const meta: Meta<typeof FriendRow> = {
    title: "MiaMia/FriendRow",
    component: FriendRow,
}
export default meta
type Story = StoryObj<typeof FriendRow>

/** A friend-suggestion row not yet followed, offline — the default resting state a suggestion list shows before the viewer acts. */
export const Default: Story = {
    parameters: { usage: "A friend-suggestion row not yet followed, offline — the default resting state a suggestion list shows before the viewer acts." },
    render: () => (
        <div className="flex max-w-md flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Suggested, offline</Label>
                <Typography type="body-sm" color="muted">
                    Not yet followed, presence dot grey. The name links to the profile; the button reads the follow copy.
                </Typography>
            </div>
            <FriendRow
                username="an.nguyen"
                displayName="An Nguyễn"
                handle="@an.nguyen"
                profileHref="#"
                isOnline={false}
                isFollowing={false}
                followLabel="Kết bạn"
                followingLabel="Đã kết bạn"
                onlineLabel="Đang hoạt động"
                offlineLabel="Ngoại tuyến"
                onToggleFollow={() => {}}
            />
        </div>
    ),
}

/** An online suggestion — used to verify the presence dot turns green while the person is still un-followed. */
export const Online: Story = {
    parameters: { usage: "An online suggestion — used to verify the presence dot turns green while the person is still un-followed." },
    render: () => (
        <div className="flex max-w-md flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Suggested, online</Label>
                <Typography type="body-sm" color="muted">
                    Green presence dot; still offering the follow action.
                </Typography>
            </div>
            <FriendRow
                username="linh.dao"
                displayName="Linh Đào"
                handle="@linh.dao"
                profileHref="#"
                isOnline
                isFollowing={false}
                followLabel="Kết bạn"
                followingLabel="Đã kết bạn"
                onlineLabel="Đang hoạt động"
                offlineLabel="Ngoại tuyến"
                onToggleFollow={() => {}}
            />
        </div>
    ),
}

/** An already-followed person — verifies the action button flips to the outline "following" affordance. */
export const Following: Story = {
    parameters: { usage: "An already-followed person — verifies the action button flips to the outline \"following\" affordance." },
    render: () => (
        <div className="flex max-w-md flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Already following</Label>
                <Typography type="body-sm" color="muted">
                    Button switches to the outline variant and the "following" copy.
                </Typography>
            </div>
            <FriendRow
                username="minh.tran"
                displayName="Minh Trần"
                handle="@minh.tran"
                profileHref="#"
                isOnline
                isFollowing
                followLabel="Kết bạn"
                followingLabel="Đã kết bạn"
                onlineLabel="Đang hoạt động"
                offlineLabel="Ngoại tuyến"
                onToggleFollow={() => {}}
            />
        </div>
    ),
}

/** The mid-toggle state — the follow mutation is in flight, so the button carries an inline spinner and is busy. */
export const Pending: Story = {
    parameters: { usage: "The mid-toggle state — the follow mutation is in flight, so the button carries an inline spinner and is busy." },
    render: () => (
        <div className="flex max-w-md flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Toggle in flight</Label>
                <Typography type="body-sm" color="muted">
                    While the mutation runs the button shows a spinner and reads as busy.
                </Typography>
            </div>
            <FriendRow
                username="phuc.le"
                displayName="Phúc Lê"
                handle="@phuc.le"
                profileHref="#"
                isOnline={false}
                isFollowing={false}
                isPending
                followLabel="Kết bạn"
                followingLabel="Đã kết bạn"
                onlineLabel="Đang hoạt động"
                offlineLabel="Ngoại tuyến"
                onToggleFollow={() => {}}
            />
        </div>
    ),
}
