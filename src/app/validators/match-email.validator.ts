import { AbstractControl, ValidationErrors } from "@angular/forms";

export function matchEmailValidator(c: AbstractControl): ValidationErrors | null {
    const email = c.get("email")?.value;
    const emailConfirm = c.get("emailConfirm")?.value;

    if(emailConfirm) {
        return email === emailConfirm ? null : { match: true };
    }

    return null;
}

