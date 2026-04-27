import {
    Module,
} from "@nestjs/common"
import {
    RefreshTokenResolver,
} from "./refresh-token.resolver"
import {
    RefreshTokenService,
} from "./refresh-token.service"
import {
    RefreshTokenHandler,
} from "./refresh-token.handler"

@Module({
    providers: [
        RefreshTokenService,
        RefreshTokenResolver,
        RefreshTokenHandler,
    ],
})
export class RefreshTokenMutationModule {}

