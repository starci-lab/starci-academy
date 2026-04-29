import {
    ICQRSHandler,
} from "@modules/cqrs"
import {
    KeycloakTokenService,
} from "@modules/keycloak"
import {
    ConflictException,
    Injectable,
} from "@nestjs/common"
import {
    CommandHandler,
    ICommandHandler,
} from "@nestjs/cqrs"
import {
    OtpChallengeService,
} from "@modules/code"
import {
    EnqueueSendMailJobService,
} from "@modules/bussiness"
import {
    SignUpInitCommand,
} from "./sign-up-init.command"
import type {
    SignUpInitData,
} from "./graphql-types"
import type {
    SignUpActionPayload,
} from "../types"
import {
    isAxiosError,
} from "axios"

@CommandHandler(SignUpInitCommand)
@Injectable()
export class SignUpInitHandler
    extends ICQRSHandler<SignUpInitCommand, SignUpInitData>
    implements ICommandHandler<SignUpInitCommand, SignUpInitData>
{
    constructor(
        private readonly otpChallengeService: OtpChallengeService,
        private readonly enqueueSendMailJobService: EnqueueSendMailJobService,
        private readonly keycloakTokenService: KeycloakTokenService,
    ) {
        super()
    }

    protected override async process(
        command: SignUpInitCommand,
    ): Promise<SignUpInitData> {
        const {
            request: {
                email,
                password,
                username,
                firstName,
                lastName,
            },
        } = command.params

        const keycloakUsername = username ?? email

        let keycloakUserId: string
        try {
            keycloakUserId = await this.keycloakTokenService.registerUserWithPassword(
                {
                    username: keycloakUsername,
                    email,
                    password,
                    firstName,
                    lastName,
                }
            )
        } catch (e) {
            if (isAxiosError(e) && e.response?.status === 409) {
                throw new ConflictException("User already exists")
            }
            throw e
        }

        const challenge = await this.otpChallengeService.createActionChallenge<SignUpActionPayload>(
            {
                email,
                payload: {
                    keycloakUserId,
                    email,
                    password,
                    username,
                    firstName,
                    lastName,
                },
            }
        )

        await this.enqueueSendMailJobService.enqueue(
            {
                to: [
                    {
                        address: email,
                    },
                ],
                subject: "Verify your email to complete sign up",
                template: "sign-up-otp",
                context: {
                    otp: challenge.otp,
                    expiresInMinutes: Math.max(
                        1,
                        Math.ceil(
                            challenge.expiresInSeconds / 60
                        )
                    ),
                },
            }
        )

        return {
            challengeId: challenge.challengeId,
            expiresInSeconds: challenge.expiresInSeconds,
        }
    }
}

