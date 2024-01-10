import { Component, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";

@Component({
    selector: "login",
    standalone: true,
    imports: [FormsModule],
    templateUrl: "./login.component.html",
    styleUrl: "./login.component.css",
})
export class LoginComponent {
    #router = inject(Router);
    email = "thisIs@toNotType.here";
    password = "andSaveTime";

    login() {
        this.#router.navigate(["/posts"]);
    }
}
