import {
    ICommand,
} from "@nestjs/cqrs"

export class SubmitPersonalProjectIdealCommand implements ICommand {
    constructor(
        public readonly params: {
            readonly enrollmentMilestoneId: string
            readonly ideaText: string
            readonly userId: string
        },
    ) {}
}
