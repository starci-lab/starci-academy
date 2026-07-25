import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Input } from "@sb-components/atoms/forms/Input/Input"
export const Probe = () => (
    <>
        <Typography size="sm" text="goi tran" />
        <Typography.Base size="sm" text="goi qua Base" />
        <Button label="tran" />
        <Button.Icon icon={() => null} ariaLabel="x" />
        <Input value="" onValueChange={() => {}} />
    </>
)
