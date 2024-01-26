import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../auth/services/auth.service";
import { map } from "rxjs";

export const logoutActivateGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    return authService.isLogged().pipe(
        map((resp) => {
            if(resp) {
                console.log("isLogged");
                return router.createUrlTree(["/posts"]);
            } else {
                console.log("isNotLogged");
                return true;
            }
        })
    );
};
