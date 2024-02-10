import { AbstractControl, ValidationErrors } from "@angular/forms";

export function formRequiredValidator(c: AbstractControl): ValidationErrors | null {
    if (!c.get("title")!.value && 
        !c.get("description")!.value && 
        !c.get("image")!.value &&
        !c.get("longitude")!.value &&
        !c.get("latitude")!.value) {
        return { formRequired: true };
    }

    return null;
}
