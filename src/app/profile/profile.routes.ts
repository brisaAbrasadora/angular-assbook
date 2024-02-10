import { Routes } from "@angular/router";
import { numericIdGuard } from "../guards/numeric-id.guard";
import { loginActivateGuard } from "../guards/login-activate.guard";
import { userResolver } from "./resolvers/user.resolver";
import { leavePageGuard } from "../guards/leave-page.guard";

export const profileRoutes: Routes = [
    {
        path: "",
        title: "My profile | AssBook",
        canActivate: [loginActivateGuard],
        resolve: { user: userResolver },
        canDeactivate: [leavePageGuard],
        loadComponent: () =>
            import("./profile-page/profile-page.component").then(
                (m) => m.ProfilePageComponent
            ),
    },
    {
        path: ":id",
        title: "Other profile | AssBook",
        canActivate: [numericIdGuard, loginActivateGuard],
        resolve: { user: userResolver },
        loadComponent: () =>
            import("./profile-page/profile-page.component").then(
                (m) => m.ProfilePageComponent
            ),
    },
];
