import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";

export const numericIdGuard: CanActivateFn = (route) => {
    const id = +route.params["id"];
    if (isNaN(id) || id < 1) {
        return inject(Router).createUrlTree(["/"]);
    }
    return true;
};
