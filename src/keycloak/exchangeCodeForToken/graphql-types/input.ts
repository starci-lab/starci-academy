import {
    Field,
    InputType,
} from "@nestjs/graphql"
import {
    IsString,
    MinLength,
} from "class-validator"
import {
    KeycloakIdentityProvider,
} from "@modules/keycloak"

@InputType({
    description: "Request for exchanging OIDC authorization code for tokens.",
})
export class ExchangeCodeForTokenRequest {
    @Field(() => String,
        {
            description: "OIDC authorization code returned by Keycloak broker callback.",
        })
    @IsString()
    @MinLength(1)
        code: string

    @Field(() => KeycloakIdentityProvider,
        {
            description: "Identity provider used for the callback redirect URI resolution.",
        })
        provider: KeycloakIdentityProvider
}

