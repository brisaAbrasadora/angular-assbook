import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { FormControl, NonNullableFormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { extensionValidator } from "../../validators/extension.validator";
import { User } from "../interfaces/user";
import { AuthService } from "../services/auth.service";
import { Router } from "@angular/router";
import { matchEmailValidator } from "../../validators/match-email.validator";



@Component({
    selector: "register",
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: "./register.component.html",
    styleUrl: "./register.component.css",
})
export class RegisterComponent {
    #formBuilder = inject(NonNullableFormBuilder);
    #authService = inject(AuthService);
    #router = inject(Router);

    name: FormControl<string> = this.#formBuilder.control("", [Validators.required]);
    email: FormControl<string> = this.#formBuilder.control("", [Validators.required, Validators.email,]);
    emailConfirm: FormControl<string> = this.#formBuilder.control("", [Validators.required, Validators.email,]);
    password: FormControl<string> = this.#formBuilder.control("", [Validators.required, Validators.minLength(4)]);
    avatar: FormControl = this.#formBuilder.control("", [Validators.required, extensionValidator(["png", "jpg", "jpeg"]), ]);

    emailGroup = this.#formBuilder.group({
        email: this.email,
        emailConfirm: this.emailConfirm
    }, { validators: matchEmailValidator});

    registerForm = this.#formBuilder.group({
        name: this.name,
        emailGroup: this.emailGroup,
        password: this.password,
        avatar: this.avatar,
    }, );

    avatarBase64: string = "";

    constructor() {
        this.resetForm();
    }

    resetForm(): void {
        this.registerForm.reset();
    }

    register(): void {
        if (this.registerForm.valid) {
            const user: User = {
                name: this.name.getRawValue(),
                email: this.email.getRawValue(),
                password: this.password.getRawValue(),
                avatar: this.avatarBase64,
                lat: 0,
                lng: 0,
            };

            this.#authService.register(user).subscribe({
                next: () => {
                    this.#router.navigate(["/login"]);
                },
                error: (error) => {
                    console.error(error);
                }
            });
        }
    }

    changeImage(event: Event): void {
        const fileInput = event.target as HTMLInputElement;

        if (!fileInput.files || fileInput.files.length === 0) {
            return;
        }

        const reader: FileReader = new FileReader();
        reader.readAsDataURL(fileInput.files[0]);
        reader.addEventListener("loadend", () => {
            this.avatarBase64 = reader.result as string;
        });

        if (this.avatar.invalid) {
            this.avatarBase64 = "";
        }
    }

    resetImage(): void {
        this.avatar.reset();
        this.avatarBase64 = "";
    }

    validClasses(control: FormControl, validClass: string, errorClass: string): { [key: string]: boolean } {
        return {
            [validClass]: control.touched && control.valid && control.value,
            [errorClass]: control.touched && control.invalid
        };
    }
}
