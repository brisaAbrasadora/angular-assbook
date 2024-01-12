import { Routes } from "@angular/router";

export const authRoutes: Routes = [
    {
        path: "login",
        title: "Login | AssBook",
        loadComponent: () =>
            import("./login/login.component").then((m) => m.LoginComponent),
    },
];
