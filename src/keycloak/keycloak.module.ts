import {
    Module,
} from "@nestjs/common"
import {
    ConfigurableModuleClass,
} from "./keycloak.module-definition"
import {
    ExchangeCodeForTokenMutationModule,
} from "./exchangeCodeForToken"
import {
    RefreshTokenMutationModule,
} from "./refresh"

@Module({
    imports: [
        ExchangeCodeForTokenMutationModule,
        RefreshTokenMutationModule,
    ],
})
export class KeycloakMutationsModule extends ConfigurableModuleClass {}

