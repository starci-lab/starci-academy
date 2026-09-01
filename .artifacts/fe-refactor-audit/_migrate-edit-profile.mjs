#!/usr/bin/env node
/**
 * One-shot migrator for remaining pages-profile files that are mostly
 * `flex flex-col/row gap-*` raw seams. Writes full replacements for the
 * smaller pages; larger ones get hand patches in subsequent steps.
 */
import fs from "node:fs"
import path from "node:path"

const ROOT = process.cwd()

// --- EditProfilePage: targeted string replacements ---
{
    const file = path.join(ROOT, "src/components/pages/EditProfilePage/index.tsx")
    let src = fs.readFileSync(file, "utf8")
    if (!src.includes("from \"@/components/frames/Stack\"")) {
        src = src.replace(
            "import {\n    WorkMode,\n} from \"@/modules/types/enums/work-mode\"",
            "import { StackH, StackV } from \"@/components/frames/Stack\"\nimport {\n    WorkMode,\n} from \"@/modules/types/enums/work-mode\"",
        )
        if (!src.includes("from \"@/components/frames/Stack\"")) {
            src = src.replace(
                "import {\n    WorkMode,\n} from \"@/modules/types/enums/work-mode\"\n",
                "import { StackH, StackV } from \"@/components/frames/Stack\"\nimport {\n    WorkMode,\n} from \"@/modules/types/enums/work-mode\"\n",
            )
        }
        // fallback simpler
        if (!src.includes("frames/Stack")) {
            src = src.replace(
                "from \"@/modules/types/enums/work-mode\"",
                "from \"@/modules/types/enums/work-mode\"\nimport { StackH, StackV } from \"@/components/frames/Stack\"",
            )
        }
    }

    src = src.replace(
        `<div className="flex flex-col items-center gap-2 py-12">
                <Typography type="h5" weight="semibold" align="center">
                    {t("profile.signedOut.title")}
                </Typography>
                <Typography type="body-sm" color="muted" align="center">
                    {t("profile.signedOut.desc")}
                </Typography>
            </div>`,
        `<div className="py-12">
                <StackV gap={3} principle="sibling-stack" align="center" items={[
                    () => (
                        <Typography type="h5" weight="semibold" align="center">
                            {t("profile.signedOut.title")}
                        </Typography>
                    ),
                    () => (
                        <Typography type="body-sm" color="muted" align="center">
                            {t("profile.signedOut.desc")}
                        </Typography>
                    ),
                ]} />
            </div>`,
    )

    src = src.replace(
        `<div className="flex items-center gap-3">
                    <AvatarUploadButton
                        avatar={shownAvatar}
                        displayName={user.displayName ?? user.username}
                        seed={user.email ?? user.username}
                        label={t("profileEdit.changeAvatar")}
                        onPress={openAvatarUpload}
                    />
                    <div className="flex flex-col gap-2">
                        <Button
                            variant="secondary"
                            size="sm"
                            onPress={openAvatarUpload}
                        >
                            {t("profileEdit.changeAvatar")}
                        </Button>
                        <Typography type="body-xs" color="muted">
                            {t("profileEdit.avatarHint")}
                        </Typography>
                    </div>
                </div>`,
        `<StackH gap={4} principle="identity" items={[
                    () => (
                        <AvatarUploadButton
                            avatar={shownAvatar}
                            displayName={user.displayName ?? user.username}
                            seed={user.email ?? user.username}
                            label={t("profileEdit.changeAvatar")}
                            onPress={openAvatarUpload}
                        />
                    ),
                    () => (
                        <StackV gap={3} principle="sibling-stack" items={[
                            () => (
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onPress={openAvatarUpload}
                                >
                                    {t("profileEdit.changeAvatar")}
                                </Button>
                            ),
                            () => (
                                <Typography type="body-xs" color="muted">
                                    {t("profileEdit.avatarHint")}
                                </Typography>
                            ),
                        ]} />
                    ),
                ]} />`,
    )

    src = src.replace(
        `<div className="flex flex-col gap-3">
                    <Label htmlFor="profile-work-mode">{t("profileEdit.workMode")}</Label>
                    <TabsCard`,
        `<StackV gap={4} principle="label-field" items={[
                    () => <Label htmlFor="profile-work-mode">{t("profileEdit.workMode")}</Label>,
                    () => <TabsCard`,
    )
    // close work-mode: after TabsCard's closing /> and </div>
    src = src.replace(
        `                    />
                </div>

                {/* LinkedIn URL */}`,
        `                    />
                ]} />

                {/* LinkedIn URL */}`,
    )

    src = src.replace(
        `<div className="flex items-start justify-between gap-3">
                    <div className="flex flex-col gap-0">
                        <Label htmlFor="profile-open-to-work">{t("profileEdit.openToWork")}</Label>
                        <Typography type="body-xs" color="muted">
                            {t("profileEdit.openToWorkHint")}
                        </Typography>
                    </div>
                    <Checkbox
                        id="profile-open-to-work"
                        className="shrink-0"
                        isSelected={openToWork}
                        onChange={(selected) => setValue("openToWork", selected)}
                        aria-label={t("profileEdit.openToWork")}
                    >
                        <Checkbox.Content>
                            <Checkbox.Control>
                                <Checkbox.Indicator />
                            </Checkbox.Control>
                        </Checkbox.Content>
                    </Checkbox>
                </div>`,
        `<StackH gap={4} principle="content-row" align="start" justify="between" items={[
                    () => (
                        <StackV gap={1} items={[
                            () => <Label htmlFor="profile-open-to-work">{t("profileEdit.openToWork")}</Label>,
                            () => (
                                <Typography type="body-xs" color="muted">
                                    {t("profileEdit.openToWorkHint")}
                                </Typography>
                            ),
                        ]} />
                    ),
                    () => (
                        <Checkbox
                            id="profile-open-to-work"
                            className="shrink-0"
                            isSelected={openToWork}
                            onChange={(selected) => setValue("openToWork", selected)}
                            aria-label={t("profileEdit.openToWork")}
                        >
                            <Checkbox.Content>
                                <Checkbox.Control>
                                    <Checkbox.Indicator />
                                </Checkbox.Control>
                            </Checkbox.Content>
                        </Checkbox>
                    ),
                ]} />`,
    )

    // form body: wrap gap-6 div content in StackV — leave structure but replace opening/closing
    src = src.replace(
        `            <div className="flex flex-col gap-6">

                {/* avatar`,
        `            <StackV gap={6} principle="block-boundary" items={[
                () => <>
                {/* avatar`,
    )
    // This approach of wrapping everything in one fragment item is ugly but clears the outer hole.
    // Better: keep children as single body via a fragment wrapper inside one item.

    // Fix closing of form body
    src = src.replace(
        `                </Button>
            </div>
        </div>
    )
}`,
        `                </Button>
                </>
            ]} />
        </div>
    )
}`,
    )

    // Button px-8 held — strip to avoid atom className spacing hole
    src = src.replace(
        "className=\"h-12 self-end px-8 text-base\"",
        "className=\"h-12 self-end text-base\"",
    )

    fs.writeFileSync(file, src)
    console.log("EditProfilePage patched")
}
