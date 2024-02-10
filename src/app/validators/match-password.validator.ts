import { AbstractControl, ValidationErrors } from "@angular/forms";

export function matchPasswordValidator(c: AbstractControl): ValidationErrors | null {
    const password = c.get("password")?.value;
    const passwordConfirm = c.get("passwordConfirm")?.value;

    if(passwordConfirm) {
        return password === passwordConfirm ? null : { match: true };
    }

    return null;
}

