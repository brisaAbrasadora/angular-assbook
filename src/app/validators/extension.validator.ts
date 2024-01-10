import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function extensionValidator(allowedExtensions: string[]): ValidatorFn {
    return (c: AbstractControl): ValidationErrors | null => {
        const fileName: string = c.value.split("\\").pop();
        if (!fileName) {
            return null;
        }

        const extension = fileName.split(".").pop()?.toLowerCase();
        
        if(extension && !allowedExtensions.includes(extension)) {
            return { "extension": true};
        }

        return null;
    };
}