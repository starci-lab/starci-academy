import { BotDisplayMode, BotTab } from "@/redux"

export const paths = () => ({
    base: () => "/",
    bots: () => ({
        base: (options: PathBotsBaseOptions = { displayMode: BotDisplayMode.Grid }) => `/bots?displayMode=${options.displayMode}`,
        create: () => "/bots/create",
        bot: (
            id: string, 
            options: PathBotsBotOptions = { tab: BotTab.Overview }
        ) => `/bots/${id}?tab=${options.tab}`,
    }),
})

export interface PathBotsBaseOptions {
    displayMode?: BotDisplayMode
}

export interface PathBotsBotOptions {
    tab?: BotTab
}