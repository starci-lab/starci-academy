import {
    Module,
} from "@nestjs/common"
import {
    ConfigurableModuleClass,
} from "./system-challenge-config.module-definition"
import {
    SystemChallengeConfigResolver,
} from "./system-challenge-config.resolver"
import {
    SystemChallengeConfigService,
} from "./system-challenge-config.service"
import {
    SystemChallengeConfigHandler,
} from "./system-challenge-config.handler"

@Module({
    providers: [
        SystemChallengeConfigService,
        SystemChallengeConfigResolver,
        SystemChallengeConfigHandler,
    ],
})
export class SystemChallengeConfigQueryModule
    extends ConfigurableModuleClass {}
