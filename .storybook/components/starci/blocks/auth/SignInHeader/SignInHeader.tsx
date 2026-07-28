import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { StackV } from "@sb-components/frames/Stack/Stack"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `SignInHeader`: the IDENTITY region sitting above the sign-in panel.
 * It answers two questions and nothing else: whose site is this, and why am I
 * being asked to sign in at all.
 *
 * WHY IT EXISTS AS A BLOCK. A screen holds a list of functions, never a frame
 * plus loose atoms, so the brand word and the guard sentence cannot sit bare in
 * the login screen. And the guard sentence is WORDING, which §14d.1 puts inside
 * the block: the screen hands over the fact that the edge guard bounced the
 * visitor, and this block decides what that fact says out loud.
 *
 * SIBLING OF `ContentHeader` and `CourseBrief`, NOT A COPY. All three answer
 * "what is this route" at the top of a route, but each carries a different
 * domain: a lesson header carries read state and outcomes, a course brief counts
 * modules and hours, and this one carries a way home plus a redirect reason.
 *
 * CONTRACT — the caller passes DOMAIN DATA, never a sentence. `hasProtectedTarget`
 * is a boolean fact about how the visitor arrived; the block turns it into the
 * line the reader sees. A caller that could pass the sentence itself would own
 * the wording, and the block would have nothing left to own.
 *
 * DECISION — the block takes a BOOLEAN, not the redirect PATH. The sentence is
 * the same whether the guard caught the visitor on lesson 3 or on the billing
 * page, so the path would be a value the block accepts and then throws away.
 * Passing it would also invite a later caller to print a raw route at the reader,
 * which is a URL, not a sentence.
 *
 * DECISION — seam between the two rows is `grouped`, not `flush`. `flush` is the
 * step for a title and its subtitle, one unit of meaning; the guard sentence is
 * not a tagline for the brand, it is a caption on the ROUTE that happens to sit
 * under the brand. Setting them flush would state a relationship that is not
 * there, and the sentence would read as a slogan.
 *
 * DECISION — the brand is a LINK, so the atom refuses `weight` alongside
 * `isLink` and the word gets its emphasis from `size="lg"` plus the accent tone
 * instead of from bold. The block does not fight the atom for that (§4a): a
 * pressable word that looks like a heading is a word nobody presses.
 *
 * DECISION — the track is `align="start"`. A stretched column would give the
 * brand link a hit area as wide as the panel, so the reader would find a hand
 * cursor far away from the only word that is actually pressable.
 *
 * NO `isSkeleton`. Both rows are known before any request is made: the brand is
 * a constant and the redirect fact arrives with the route itself, so there is no
 * moment where this block is waiting for data. Building a resting shape for a
 * wait that never happens would be inventing a case no screen asks for.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Props for {@link SignInHeader}. */
export interface SignInHeaderProps {
    /**
     * Take the visitor back to the public site. Required, because a sign-in page
     * with no way out is a dead end, so there is no valid call without it.
     */
    onPressHome: () => void
    /**
     * `true` when the edge guard sent the visitor here from a route they were
     * not allowed to open yet. Only then does the block grow its second line:
     * somebody who typed the address themselves already knows why they are here,
     * and explaining it to them is noise.
     */
    hasProtectedTarget?: boolean
    /** When on, each composed part emits `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy?: boolean
    /** Anatomy tag: names this block so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
}

/**
 * Identity region above the sign-in panel. See the file header for the contract
 * and for the four decisions this block makes on the reader's behalf.
 *
 * @param props - {@link SignInHeaderProps}
 */
const SignInHeader = ({
    onPressHome,
    hasProtectedTarget = false,
    showAnatomy = false,
    anatPart,
}: SignInHeaderProps) => (
    <div data-anat-part={anatPart}>
        <StackV gap="grouped" align="start" anatPart={showAnatomy ? "StackV" : undefined}>
            <Typography
                size="lg"
                isLink
                onPress={onPressHome}
                text="StarCi Academy"
                anatPart={showAnatomy ? "Typography" : undefined}
            />
            {hasProtectedTarget ? (
                <Typography
                    size="sm"
                    color="muted"
                    text="Bạn cần đăng nhập để đi tiếp tới trang vừa mở."
                    anatPart={showAnatomy ? "Typography" : undefined}
                />
            ) : null}
        </StackV>
    </div>
)

export { SignInHeader }
