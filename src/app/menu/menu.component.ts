import { Component, Signal, computed, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
import { AuthService } from "../auth/services/auth.service";

@Component({
    selector: "nav[menu]",
    standalone: true,
    imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
    templateUrl: "./menu.component.html",
    styleUrl: "./menu.component.css",
})
export class MenuComponent {
    #authService = inject(AuthService);
    logged: Signal<boolean> = computed(() => this.#authService.logged());

    logout(): void {
        this.#authService.logout();
    }
}
