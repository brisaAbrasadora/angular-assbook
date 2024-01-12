import { Component, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { UserLogin } from "../interfaces/user";

@Component({
    selector: "login",
    standalone: true,
    imports: [FormsModule],
    templateUrl: "./login.component.html",
    styleUrl: "./login.component.css",
})
export class LoginComponent {
    #router = inject(Router);
    #authService = inject(AuthService);
    email = "";
    password = "";

    login() {
        const data: UserLogin = {
            email: this.email,
            password: this.password,
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
}
