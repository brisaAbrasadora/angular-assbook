import { ApplicationConfig } from "@angular/core";
import { provideRouter, withComponentInputBinding } from "@angular/router";

import { routes } from "./app.routes";
import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { baseUrlInterceptor } from "./interceptors/base-url.interceptor";
import { authInterceptor } from "./auth/interceptors/auth.interceptor";
import { provideBingmapsKey } from "./bingmaps/bingmaps.config";
import { provideGoogleId } from "./auth/google-login/google-login.config";

export const appConfig: ApplicationConfig = {
    providers: [
        provideGoogleId("746820501392-oalflicqch2kuc12s8rclb5rf7b1fist.apps.googleusercontent.com"),
        provideRouter(routes, withComponentInputBinding()), 
        provideHttpClient(withInterceptors([baseUrlInterceptor, authInterceptor])),
        provideBingmapsKey("Ak0owWN3FVZNziU2wwWOd9Alvd9rJ3QUCV7TK1M4QcPYrmBz1A4jICj8nNJ29R-Z")],
};
