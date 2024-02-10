import { Routes } from "@angular/router";
import { logoutActivateGuard } from "../guards/logout-activate.guard";
import { leavePageGuard } from "../guards/leave-page.guard";

export const authRoutes: Routes = [
    {
        path: "login",
        title: "Login | AssBook",
        canActivate: [logoutActivateGuard],
        loadComponent: () =>
            import("./login/login.component").then((m) => m.LoginComponent),
    },
    {
        path: "register",
        title: "Register | AssBook",
        canActivate: [logoutActivateGuard],
        canDeactivate: [leavePageGuard],
        loadComponent: () =>
            import("./register/register.component").then((m) => m.RegisterComponent),
    }
];
