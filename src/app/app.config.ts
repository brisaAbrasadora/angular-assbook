import { ApplicationConfig } from "@angular/core";
import { provideRouter, withComponentInputBinding } from "@angular/router";

import { routes } from "./app.routes";
import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { baseUrlInterceptor } from "./interceptors/base-url.interceptor";
import { authInterceptor } from "./auth/interceptors/auth.interceptor";
import { provideBingmapsKey } from "./bingmaps/bingmaps.config";

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes, withComponentInputBinding()), 
        provideHttpClient(withInterceptors([baseUrlInterceptor, authInterceptor])),
        provideBingmapsKey("Ak0owWN3FVZNziU2wwWOd9Alvd9rJ3QUCV7TK1M4QcPYrmBz1A4jICj8nNJ29R-Z")],
};
