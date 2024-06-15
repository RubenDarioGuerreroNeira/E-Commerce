/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

@ValidatorConstraint({ name: 'MatchPasword', async: false })
export class MatchPasword implements ValidatorConstraintInterface {
    validate(password: string, args: ValidationArguments) {

        if (password !== (args.object as any)[args.constraints[0]]) return false;
        return true;
    }
    defaultMessage(args: ValidationArguments) {
        return 'Password doesn´t Match'
    }
}