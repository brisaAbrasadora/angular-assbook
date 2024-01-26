import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../auth/services/auth.service";
import { inject } from "@angular/core";
import { map } from "rxjs";

export const loginActivateGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);
    
    return authService.isLogged().pipe(
        map((resp) => {
            if(resp) {
                console.log("isLogged");
                return true;
            } else {
                console.log("isNotLogged");
                return router.createUrlTree(["/auth/login"]);
            }
        })
    );
};
