import {
    ICommand,
} from "@nestjs/cqrs"

export class SubmitPersonalProjectIdealCommand implements ICommand {
    constructor(
        public readonly params: {
            readonly enrollmentId: string
            readonly ideaText: string
            readonly userId: string
        },
    ) {}
}
