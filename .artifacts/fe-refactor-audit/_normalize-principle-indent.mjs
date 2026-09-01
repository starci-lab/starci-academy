#!/usr/bin/env node
import fs from "node:fs"

const files = [
    ".storybook/components/nivo/blocks/agent-os/AgentOsProvisionCard/AgentOsProvisionCard.tsx",
    ".storybook/components/nivo/blocks/dashboard/KpiRow/KpiRow.tsx",
    ".storybook/components/nivo/blocks/expert-site/ExpertSiteLeadsPipeline/ExpertSiteLeadsPipeline.tsx",
    ".storybook/components/nivo/blocks/expert-site/ExpertSiteManager/ExpertSiteManager.tsx",
    ".storybook/components/nivo/blocks/landing/DashboardProof/DashboardProof.tsx",
    ".storybook/components/nivo/blocks/landing/SolutionByIndustry/SolutionByIndustry.tsx",
    ".storybook/components/nivo/blocks/landing/SystemFlow/SystemFlow.tsx",
    ".storybook/components/nivo/blocks/wallet/WalletOverview/WalletOverview.tsx",
    ".storybook/components/nivo/pages/AgentOsConsole/AgentOsConsole.tsx",
    ".storybook/components/nivo/pages/CatalogView/CatalogView.tsx",
    ".storybook/components/nivo/pages/ControlPlaneOverview/ControlPlaneOverview.tsx",
    ".storybook/components/nivo/pages/ExpertSiteOverview/ExpertSiteOverview.tsx",
    ".storybook/components/nivoexpert/overlays/modals/BanMemberModal/BanMemberModal.tsx",
    ".storybook/components/nivoexpert/overlays/modals/SetMemberRoleModal/SetMemberRoleModal.tsx",
    ".storybook/components/nivoexpert/overlays/drawers/MemberDetailDrawer/MemberDetailDrawer.tsx",
    ".storybook/components/nivoexpert/overlays/drawers/PostModerationDrawer/PostModerationDrawer.tsx",
    ".storybook/components/nivoexpert/blocks/classroom/CourseView/CourseView.tsx",
    ".storybook/components/nivoexpert/blocks/studio/LessonEditorPanel/LessonEditorPanel.tsx",
]

let n = 0
for (const f of files) {
    let s = fs.readFileSync(f, "utf8")
    const next = s.replace(
        /^([ \t]*)gap=\{(\d+)\}\r?\n[ \t]*principle=/gm,
        (_, ind, g) => `${ind}gap={${g}}\n${ind}principle=`,
    )
    if (next !== s) {
        fs.writeFileSync(f, next)
        n++
    }
}
console.log("normalized files", n)
