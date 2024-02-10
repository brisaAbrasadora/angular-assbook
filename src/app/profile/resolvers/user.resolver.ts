import { ResolveFn, Router } from "@angular/router";
import { User } from "../../auth/interfaces/user";
import { UserService } from "../services/user.service";
import { inject } from "@angular/core";
import { EMPTY, catchError } from "rxjs";

export const userResolver: ResolveFn<User> = (route) => {
    return inject(UserService).getProfile(+route.params["id"]).pipe(
        catchError(() => {
            inject(Router).navigate(["/posts"]);
            return EMPTY;
        })
    );
};
