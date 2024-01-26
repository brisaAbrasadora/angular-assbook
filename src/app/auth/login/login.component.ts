import { Component, inject } from "@angular/core";
import { FormControl, NonNullableFormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { UserLogin } from "../interfaces/user";
import { CommonModule } from "@angular/common";

@Component({
    selector: "login",
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: "./login.component.html",
    styleUrl: "./login.component.css",
})
export class LoginComponent {
    #formBuilder = inject(NonNullableFormBuilder);
    #router = inject(Router);
    #authService = inject(AuthService);
    email: FormControl<string> = this.#formBuilder.control("", [Validators.required, Validators.email]);
    password: FormControl<string> = this.#formBuilder.control("", [Validators.required]);

    loginForm = this.#formBuilder.group({
        email: this.email,
        password: this.password
    });

    login() {
        const data: UserLogin = {
            ...this.loginForm.getRawValue()
        };
        this.#authService.login(data).subscribe({
            next: () => {
                this.#router.navigate(["/posts"]);
            },
            error: (err) => {
                console.error(err.error.message);
            }
        });
    }

    validClasses(control: FormControl, validClass: string, errorClass: string): { [key: string]: boolean } {
        return {
            [validClass]: control.touched && control.valid && control.value,
            [errorClass]: control.touched && control.invalid
        };
    }
}
