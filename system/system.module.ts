import {
    Module,
} from "@nestjs/common"
import {
    ConfigurableModuleClass,
} from "./system.module-definition"
import {
    SystemChallengeConfigQueryModule,
} from "./config"

@Module({
    imports: [
        SystemChallengeConfigQueryModule.register({
            isGlobal: true,
        }),
    ],
})
export class SystemQueriesModule extends ConfigurableModuleClass {}
