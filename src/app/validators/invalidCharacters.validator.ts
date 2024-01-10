import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function invalidCharactersValidator(pattern: string): ValidatorFn {
    return (c: AbstractControl): ValidationErrors | null => {
        if (c.value && pattern && !c.value.match(pattern)) {
            return { invalidCharacters: true };
        }

        return null;
    };
}